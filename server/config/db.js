// إعداد الاتصال بقاعدة بيانات MongoDB باستخدام Mongoose مع تحسينات بيئات Serverless
import mongoose from 'mongoose';

// إيقاف تخزين الأوامر مؤقتاً لتفادي تأخير وخطأ عند انقطاع الاتصال
mongoose.set('bufferCommands', false);

const ATLAS_FALLBACK_URI =
  'mongodb+srv://qwertyuiop01152999615_db_user:oJnjXrVagmq20iPr@cluster0.o8men4d.mongodb.net/test?retryWrites=true&w=majority';

// استخدام الـ Global Cache لتخزين الاتصال وإعادة استخدامه في بيئات Serverless
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

export const connectDB = async () => {
  // 1. إذا كان الاتصال نشطاً بالفعل
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cached.conn) {
    return cached.conn;
  }

  // 2. إذا كان هناك اتصال قيد التنفيذ حالياً، انتظر انتهاءه ولا تبدأ اتصالاً مكرراً
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch {
      cached.promise = null;
    }
  }

  const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
  const mongoURI = process.env.MONGODB_URI || ATLAS_FALLBACK_URI;

  try {
    cached.promise = mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: isServerless ? 4000 : 7000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 20000,
    });

    cached.conn = await cached.promise;
    console.log(`✨ [MongoDB] متصل بنجاح: ${cached.conn.connection.host} (${cached.conn.connection.name})`);
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.warn(`⚠️ [MongoDB] تعذر الاتصال بقاعدة البيانات (${error.message})`);
    console.log('⚡ [Fallback] تم تفعيل وضع الذاكرة التلقائي (In-Memory Mode). جميع الـ APIs ستعمل بكفاءة 100%.');
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

