// مسار رفع الصور والملفات
import express from 'express';
import { upload } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// رفع صورة واحدة (للأدمن)
router.post('/', requireAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'لم يتم إرسال أي صورة' });
    }

    // إرجاع الرابط النسبي للصورة
    const fileUrl = `/uploads/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      message: 'تم رفع الصورة بنجاح',
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'تعذر رفع الصورة' });
  }
});

export default router;
