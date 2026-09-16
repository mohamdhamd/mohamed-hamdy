// مسارات المصادقة وتوثيق الأدمن
import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { isMongoDBConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

const router = express.Router();

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'super_secret_astronomical_key_mohamed_hamdy_2026_cma';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

// تسجيل الدخول للأدمن
router.post('/login', async (req, res) => {
  try {
    const { identifier, email, username, password } = req.body;
    const loginTarget = identifier || email || username;

    if (!loginTarget || !password) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال اسم المستخدم/البريد الإلكتروني وكلمة المرور',
      });
    }

    const cleanId = String(loginTarget).trim().toLowerCase();

    // 1. إذا كانت MongoDB متصلة، ابحث في قاعدة البيانات
    if (isMongoDBConnected()) {
      try {
        const user = await User.findOne({
          $or: [{ email: cleanId }, { username: cleanId }],
        });

        if (user) {
          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            const token = generateToken(user._id);
            return res.json({
              success: true,
              token,
              user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
              },
            });
          }
        }
      } catch (dbErr) {
        console.warn('DB search failed, falling back to memory store:', dbErr.message);
      }
    }

    // 2. Fallback: فحص بيانات الأدمن الافتراضية
    const adminList = memoryStore.adminUsers || (memoryStore.adminUser ? [memoryStore.adminUser] : []);
    const matchedAdmin = adminList.find(
      (a) =>
        (cleanId === a.email?.toLowerCase() || cleanId === a.username?.toLowerCase()) &&
        password === a.password
    );

    if (matchedAdmin) {
      const token = generateToken(matchedAdmin._id);
      return res.json({
        success: true,
        token,
        user: {
          id: matchedAdmin._id,
          username: matchedAdmin.username,
          email: matchedAdmin.email,
          role: matchedAdmin.role,
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'بيانات الدخول غير صحيحة',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'خطأ في الخادم أثناء تسجيل الدخول' });
  }
});

// التحقق من الجلسة الحالية
router.get('/me', requireAuth, async (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

export default router;
