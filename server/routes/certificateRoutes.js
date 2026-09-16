// مسارات الشهادات والمسار المهني مع الدعم التلقائي المزدوج (MongoDB + Memory Fallback)
import express from 'express';
import { Certificate } from '../models/Certificate.js';
import { requireAuth } from '../middleware/auth.js';
import { isMongoDBConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

const router = express.Router();

// استرجاع جميع الشهادات
router.get('/', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        const certs = await Certificate.find().sort({ order: 1, createdAt: -1 });
        return res.json({ success: true, count: certs.length, data: certs });
      } catch (dbErr) {
        console.warn('MongoDB certs fetch failed, fallback to memory:', dbErr.message);
      }
    }

    const certs = [...memoryStore.certificates].sort((a, b) => a.order - b.order);
    return res.json({ success: true, count: certs.length, data: certs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'تعذر جلب الشهادات' });
  }
});

// إضافة شهادة جديدة
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.id) {
      data.id = `cert-${Date.now().toString(36)}`;
    }

    if (data.order === undefined || data.order === null) {
      data.order = memoryStore.certificates.length + 1;
    }

    if (isMongoDBConnected()) {
      try {
        const newCert = await Certificate.create(data);
        memoryStore.certificates.push(newCert.toObject());
        return res.status(201).json({ success: true, message: 'تم إضافة الشهادة بنجاح', data: newCert });
      } catch (dbErr) {
        console.warn('DB create cert failed, saving to memory:', dbErr.message);
      }
    }

    memoryStore.certificates.push(data);
    return res.status(201).json({
      success: true,
      message: 'تم إضافة الشهادة بنجاح (وضع الذاكرة)',
      data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'تعذر إضافة الشهادة' });
  }
});

// تعديل شهادة
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected()) {
      try {
        const updated = await Certificate.findOneAndUpdate({ id }, req.body, {
          new: true,
          runValidators: true,
        });
        if (updated) {
          const idx = memoryStore.certificates.findIndex((c) => c.id === id);
          if (idx !== -1) memoryStore.certificates[idx] = updated.toObject();
          return res.json({ success: true, message: 'تم تعديل الشهادة بنجاح', data: updated });
        }
      } catch (dbErr) {
        console.warn('DB update cert failed, fallback:', dbErr.message);
      }
    }

    const idx = memoryStore.certificates.findIndex((c) => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'الشهادة غير موجودة' });
    }

    memoryStore.certificates[idx] = { ...memoryStore.certificates[idx], ...req.body };
    return res.json({ success: true, message: 'تم تعديل الشهادة بنجاح', data: memoryStore.certificates[idx] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'تعذر تعديل الشهادة' });
  }
});

// حذف شهادة
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected()) {
      try {
        await Certificate.findOneAndDelete({ id });
      } catch (dbErr) {
        console.warn('DB delete cert failed, fallback:', dbErr.message);
      }
    }

    memoryStore.certificates = memoryStore.certificates.filter((c) => c.id !== id);
    return res.json({ success: true, message: 'تم حذف الشهادة بنجاح' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'تعذر حذف الشهادة' });
  }
});

export default router;
