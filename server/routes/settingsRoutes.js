// مسارات إعدادات ومحتوى نصوص الموقع مع الدعم التلقائي المزدوج (MongoDB + Memory Fallback)
import express from 'express';
import { SiteSettings } from '../models/SiteSettings.js';
import { requireAuth } from '../middleware/auth.js';
import { isMongoDBConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

const router = express.Router();

// استرجاع الإعدادات الحالية للموقع
router.get('/', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        let settings = await SiteSettings.findOne();
        if (settings) return res.json({ success: true, data: settings });
      } catch (dbErr) {
        console.warn('MongoDB settings fetch failed, fallback:', dbErr.message);
      }
    }

    return res.json({ success: true, data: memoryStore.settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'تعذر جلب إعدادات الموقع' });
  }
});

// تعديل إعدادات الموقع (للأدمن)
router.put('/', requireAuth, async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
          settings = await SiteSettings.create(req.body);
        } else {
          Object.assign(settings, req.body);
          await settings.save();
        }
        memoryStore.settings = { ...memoryStore.settings, ...req.body };
        return res.json({
          success: true,
          message: 'تم حفظ وتحديث إعدادات الموقع بنجاح',
          data: settings,
        });
      } catch (dbErr) {
        console.warn('DB save settings failed, fallback:', dbErr.message);
      }
    }

    memoryStore.settings = { ...memoryStore.settings, ...req.body };
    return res.json({
      success: true,
      message: 'تم حفظ وتحديث إعدادات الموقع بنجاح (وضع الذاكرة)',
      data: memoryStore.settings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ success: false, message: 'تعذر حفظ إعدادات الموقع' });
  }
});

export default router;
