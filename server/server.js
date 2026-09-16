// السيرفر الرئيسي للباك إند — Mohamed Hamdy Portfolio REST API
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';

// استيراد المسارات
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

// تحميل المتغيرات البيئية
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// الاتصال بقاعدة البيانات
connectDB();

// الوسائط العامة (Middlewares)
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// تقديم ملفات الصور المرفوعة
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// التأكد من جاهزية اتصال قاعدة البيانات قبل معالجة الطلبات (ضروري لبيئات Serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {
    // Continue even if DB fails, fallback mode will handle it
  }
  next();
});

// الصفحة الرئيسية لخادم الباك إند
app.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'online',
    service: 'Mohamed Hamdy Portfolio REST API',
    message: 'خادم الباك إند يعمل بنجاح على Vercel Serverless',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// فحص صحة السيرفر وقاعدة البيانات
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'ok',
    message: 'سيرفر محفظة محمد حمدي يعمل بكفاءة',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// تسجيل المسارات
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/resume', resumeRoutes);

// معالجة المسارات غير المعرفة
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'المسار المطلوب غير موجود في الـ API' });
});

// معالج الأخطاء العام
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'حدث خطأ غير متوقع في الخادم',
  });
});

// تشغيل الخادم محلياً (يتم تخطيه في بيئة Vercel Serverless)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`
🚀 [Server] خادم البورتفوليو يعمل الآن بنجاح!
📡 العنوان: http://localhost:${PORT}
🩺 فحص الصحة: http://localhost:${PORT}/api/health
🗄️ قاعدة البيانات: ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mohamed_hamdy_portfolio'}
    `);
  });
}

export default app;
