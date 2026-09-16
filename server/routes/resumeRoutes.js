// مسارات استرجاع وتحديث بيانات السيرة الذاتية (CV API)
import express from 'express';
import { Resume } from '../models/Resume.js';
import { requireAuth } from '../middleware/auth.js';
import { isMongoDBConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

const router = express.Router();

// استرجاع بيانات السيرة الذاتية (متاح للجميع لصفحة السيرة الذاتية)
router.get('/', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        let resume = await Resume.findOne().lean();
        if (resume) {
          return res.json({ success: true, data: resume });
        }
      } catch (dbErr) {
        console.warn('DB fetch resume failed, fallback:', dbErr.message);
      }
    }

    return res.json({ success: true, data: memoryStore.resume || {} });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'تعذر جلب بيانات السيرة الذاتية' });
  }
});

// تحديث بيانات السيرة الذاتية (للأدمن فقط)
router.put('/', requireAuth, async (req, res) => {
  try {
    const updateData = req.body;

    if (isMongoDBConnected()) {
      try {
        let resume = await Resume.findOne();
        if (resume) {
          Object.assign(resume, updateData);
          await resume.save();
        } else {
          resume = await Resume.create(updateData);
        }

        memoryStore.resume = resume.toObject();
        return res.json({ success: true, message: 'تم حفظ وتحديث السيرة الذاتية بنجاح في قاعدة البيانات', data: resume });
      } catch (dbErr) {
        console.warn('DB update resume failed, fallback:', dbErr.message);
      }
    }

    memoryStore.resume = { ...memoryStore.resume, ...updateData };
    return res.json({ success: true, message: 'تم حفظ وتحديث السيرة الذاتية بنجاح', data: memoryStore.resume });
  } catch (error) {
    console.error('Update resume error:', error);
    return res.status(500).json({ success: false, message: 'تعذر تحديث السيرة الذاتية' });
  }
});

export default router;
