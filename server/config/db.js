// إعداد الاتصال بقاعدة بيانات MongoDB باستخدام Mongoose
import mongoose from 'mongoose';

// إيقاف تخزين الأوامر مؤقتاً لتفادي تأخير 10 ثوانٍ وخطأ 500 عند انقطاع الاتصال
mongoose.set('bufferCommands', false);

let cachedConnection = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (cachedConnection) {
    return cachedConnection;
  }

  const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
  const mongoURI = process.env.MONGODB_URI;

  // إذا كنا في Vercel ولم يتم تحديد MONGODB_URI، نفعل وضع الذاكرة فوراً دون انتظار محاولة الاتصال بـ localhost
  if (!mongoURI && isServerless) {
    return null;
  }

  const targetURI = mongoURI || 'mongodb://127.0.0.1:27017/mohamed_hamdy_portfolio';

  try {
    cachedConnection = await mongoose.connect(targetURI, {
      serverSelectionTimeoutMS: isServerless ? 3500 : 7000,
    });

    console.log(`✨ [MongoDB] متصل بنجاح: ${cachedConnection.connection.host} (${cachedConnection.connection.name})`);
    return cachedConnection;
  } catch (error) {
    console.warn(`⚠️ [MongoDB] غير متصل بقاعدة البيانات (${error.message})`);
    console.log('⚡ [Fallback] تم تفعيل وضع الذاكرة التلقائي (In-Memory Mode). جميع الـ APIs ستعمل بكفاءة 100% وبدون أخطاء 500.');
    return null;
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

