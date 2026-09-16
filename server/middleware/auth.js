// وسيط التحقق من هوية الأدمن وحماية المسارات باستخدام JWT
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
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

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (jwtErr) {
      return res.status(401).json({ success: false, message: 'رمز الدخول غير صالح أو منتهي الصلاحية' });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: 'رمز الدخول غير صالح' });
    }

    // 1. إذا كانت MongoDB متصلة والمعرف هو ObjectId صالح
    if (isMongoDBConnected() && mongoose.Types.ObjectId.isValid(decoded.id)) {
      try {
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
          return next();
        }
      } catch (dbErr) {
        console.warn('DB user lookup failed, falling back to memory check:', dbErr.message);
      }
    }

    // 2. فحص قائمة مسؤولي وضع الذاكرة (Memory Store fallback)
    const adminList = memoryStore.adminUsers || (memoryStore.adminUser ? [memoryStore.adminUser] : []);
    const matched =
      adminList.find(
        (a) => a._id === decoded.id || a.username === decoded.id || a.email === decoded.id
      ) || memoryStore.adminUser;

    if (matched) {
      req.user = {
        _id: matched._id,
        username: matched.username,
        email: matched.email,
        role: 'admin',
      };
      return next();
    }

    // 3. إذا كان التوكن سليماً وموقعاً بالمفتاح السري
    if (decoded.id) {
      req.user = {
        _id: decoded.id,
        username: 'admin',
        role: 'admin',
      };
      return next();
    }

    return res.status(401).json({ success: false, message: 'مستخدم غير موجود أو انتهت صلاحية الجلسة' });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'رمز الدخول غير صالح أو منتهي الصلاحية' });
  }
};

