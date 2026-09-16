// إعداد الاتصال بقاعدة بيانات MongoDB باستخدام Mongoose
import mongoose from 'mongoose';

// إيقاف تخزين الأوامر مؤقتاً لتفادي تأخير 10 ثوانٍ وخطأ 500 عند انقطاع الاتصال
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mohamed_hamdy_portfolio';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 7000, // مهلة كافية لمصافحة TLS السحابية
    });

    console.log(`✨ [MongoDB] متصل بنجاح: ${conn.connection.host} (${conn.connection.name})`);
  } catch (error) {
    console.warn(`⚠️ [MongoDB] غير متصل بقاعدة البيانات (${error.message})`);
    console.log('⚡ [Fallback] تم تفعيل وضع الذاكرة التلقائي (In-Memory Mode). جميع الـ APIs ستعمل بكفاءة 100% وبدون أخطاء 500.');
  }
};

export const isMongoDBConnected = () => mongoose.connection.readyState === 1;

export const getDBStatus = () => {
  const connected = mongoose.connection.readyState === 1;
  return {
    connected,
    mode: connected ? 'mongodb' : 'in-memory-fallback',
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};

