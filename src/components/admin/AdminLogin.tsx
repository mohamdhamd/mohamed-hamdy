// شاشة تسجيل دخول الأدمن بالتصميم الفلكي الكوني
import React, { useState } from 'react';
import { authApi } from '../../services/api';
import { AuthUser } from '../../types';
import { soundFX } from '../../utils/audio';
import { Lock, Mail, KeyRound, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: AuthUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('يرجى إدخال اسم المستخدم أو البريد وكلمة المرور');
      return;
    }

    setLoading(true);
    setError(null);
    soundFX.playClick();

    try {
      const res = await authApi.login(identifier, password);
      soundFX.playChime();
      onLoginSuccess(res.user);
    } catch (err: any) {
      soundFX.playClick();
      setError(err.message || 'بيانات الدخول غير صحيحة، أو تعذر الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void text-moonlight flex items-center justify-center p-4 relative overflow-hidden">
      {/* هالة فلكية خلفية */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brass/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* زر العودة للموقع الرئيسي */}
        <button
          onClick={onBackToSite}
          className="mb-6 inline-flex items-center gap-2 text-xs font-mono text-dust hover:text-brass transition-colors"
        >
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          <span>العودة للموقع الرئيسي (Public Site)</span>
        </button>

        {/* بطاقة تسجيل الدخول */}
        <div className="bg-deep/90 border border-ink/80 rounded-2xl p-8 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brass to-transparent opacity-80" />

          {/* أيقونة القفل الفلكي */}
          <div className="w-14 h-14 rounded-2xl bg-void border border-brass/40 flex items-center justify-center mx-auto mb-6 text-brass shadow-[0_0_20px_rgba(201,162,39,0.25)]">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl font-bold font-display text-moonlight tracking-tight flex items-center justify-center gap-2">
              <span>بوابة الإدارة الفلكية</span>
              <Sparkles className="w-4 h-4 text-brass" />
            </h1>
            <p className="text-xs text-dust">
              لوحة التحكم الشاملة لإدارة محتوى البورتفوليو والمشاريع
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-dust mb-1.5">
                البريد الإلكتروني أو اسم المستخدم
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  autoComplete="username"
                  className="w-full bg-void/80 border border-ink focus:border-brass rounded-lg px-3.5 py-2.5 text-sm text-moonlight placeholder:text-dust/40 outline-none transition-colors pe-10"
                />
                <Mail className="w-4 h-4 text-dust/60 absolute end-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-dust mb-1.5">
                كلمة المرور (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-void/80 border border-ink focus:border-brass rounded-lg px-3.5 py-2.5 text-sm text-moonlight placeholder:text-dust/40 outline-none transition-colors pe-10"
                />
                <KeyRound className="w-4 h-4 text-dust/60 absolute end-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* زر الدخول */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-lg bg-brass text-void font-bold text-sm flex items-center justify-center gap-2 hover:bg-brass/90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(201,162,39,0.3)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التحقق...</span>
                </>
              ) : (
                <span>دخول لوحة التحكم</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
