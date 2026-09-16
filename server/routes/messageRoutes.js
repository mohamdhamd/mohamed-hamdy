// مسارات رسائل واستفسارات التواصل مع الدعم التلقائي المزدوج (MongoDB + Memory Fallback)
import express from 'express';
import mongoose from 'mongoose';
import { Message } from '../models/Message.js';
import { requireAuth } from '../middleware/auth.js';
import { isMongoDBConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

const router = express.Router();

// استقبال رسالة جديدة من نموذج التواصل (متاح للجميع)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'يرجى ملء جميع الحقول المطلوبة (الاسم، البريد، الرسالة)',
      });
    }

    const newMsgObj = {
      _id: `msg_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    if (isMongoDBConnected()) {
      try {
        const saved = await Message.create({
          name: newMsgObj.name,
          email: newMsgObj.email,
          message: newMsgObj.message,
        });
        memoryStore.messages.unshift(saved.toObject());
        return res.status(201).json({
          success: true,
          message: 'تم استلام رسالتك بنجاح وسنقوم بالرد في أقرب وقت',
          data: { id: saved._id, createdAt: saved.createdAt },
        });
      } catch (dbErr) {
        console.warn('DB save message failed, saving to memory:', dbErr.message);
      }
    }

    memoryStore.messages.unshift(newMsgObj);
    return res.status(201).json({
      success: true,
      message: 'تم استلام رسالتك بنجاح وسنقوم بالرد في أقرب وقت',
      data: { id: newMsgObj._id, createdAt: newMsgObj.createdAt },
    });
  } catch (error) {
    console.error('Submit message error:', error);
    return res.status(500).json({ success: false, message: 'تعذر إرسال الرسالة، يرجى المحاولة لاحقاً' });
  }
});

// استرجاع كل الرسائل (للأدمن فقط)
router.get('/', requireAuth, async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        const messages = await Message.find().sort({ createdAt: -1 });
        const unreadCount = await Message.countDocuments({ read: false });
        return res.json({ success: true, count: messages.length, unreadCount, data: messages });
      } catch (dbErr) {
        console.warn('DB fetch messages failed, fallback:', dbErr.message);
      }
    }

    const unreadCount = memoryStore.messages.filter((m) => !m.read).length;
    return res.json({
      success: true,
      count: memoryStore.messages.length,
      unreadCount,
      data: memoryStore.messages,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'تعذر جلب الرسائل' });
  }
});

// تحديد كل الرسائل كمقروءة دفعة واحدة
router.patch('/read-all', requireAuth, async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        await Message.updateMany({ read: false }, { $set: { read: true } });
        memoryStore.messages.forEach((m) => (m.read = true));
        return res.json({ success: true, message: 'تم تحديد جميع الرسائل كمقروءة' });
      } catch (dbErr) {
        console.warn('DB update all messages failed, fallback:', dbErr.message);
      }
    }

    memoryStore.messages.forEach((m) => (m.read = true));
    return res.json({ success: true, message: 'تم تحديد جميع الرسائل كمقروءة' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'تعذر تحديث الرسائل' });
  }
});

// تحديد الرسالة كمقروءة/غير مقروءة
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const message = await Message.findById(id);
        if (message) {
          message.read = req.body.read !== undefined ? req.body.read : !message.read;
          await message.save();
          return res.json({ success: true, data: message });
        }
      } catch (dbErr) {
        console.warn('DB update message failed, fallback:', dbErr.message);
      }
    }

    const msg = memoryStore.messages.find((m) => m._id === id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'الرسالة غير موجودة' });
    }
    msg.read = req.body.read !== undefined ? req.body.read : !msg.read;
    return res.json({ success: true, data: msg });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'تعذر تحديث حالة الرسالة' });
  }
});

// حذف رسالة
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        await Message.findByIdAndDelete(id);
      } catch (dbErr) {
        console.warn('DB delete message failed, fallback:', dbErr.message);
      }
    }

    memoryStore.messages = memoryStore.messages.filter((m) => m._id !== id);
    return res.json({ success: true, message: 'تم حذف الرسالة بنجاح' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'تعذر حذف الرسالة' });
  }
});

export default router;
