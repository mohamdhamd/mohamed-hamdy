// وسيط التحقق من هوية الأدمن وحماية المسارات باستخدام JWT
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isMongoDBConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'غير مصرح: يرجى تسجيل الدخول أولاً' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'super_secret_astronomical_key_mohamed_hamdy_2026_cma';

    const decoded = jwt.verify(token, secret);

    if (isMongoDBConnected()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'مستخدم غير موجود أو انتهت صلاحية الجلسة' });
      }
      req.user = user;
    } else {
      // وضع الذاكرة التلقائي
      req.user = {
        _id: decoded.id,
        username: memoryStore.adminUser.username,
        email: memoryStore.adminUser.email,
        role: 'admin',
      };
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'رمز الدخول غير صالح أو منتهي الصلاحية' });
  }
};
