// شاشة التحميل الافتتاحية الروحانية الفلكية (صلِ على الحبيب قلبك يطيب ﷺ) - متناسقة ومنتصفة بالكامل على جميع الشاشات
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { soundFX } from '../utils/audio';
import { Sparkles, Heart } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
  minDuration?: number; // المدة الأدنى بالمللي ثانية
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDuration = 2600,
}) => {
  const { lang, t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [salawatCount, setSalawatCount] = useState(1);
  const [hasBlessed, setHasBlessed] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    let animId: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / minDuration) * 100));
      setProgress(pct);

      if (pct < 100) {
        animId = requestAnimationFrame(updateProgress);
      } else {
        // اكتمال التحميل: بدء التلاشي السلس
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 650);
      }
    };

    animId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animId);
  }, [minDuration, onComplete]);

  const handleBlessingClick = () => {
    soundFX.playChime();
    setSalawatCount((prev) => prev + 1);
    setHasBlessed(true);
  };

  // نص الحالة المتغير بحسب نسبة التحميل
  const getStatusText = () => {
    if (progress < 30) return t('تجهيز الفضاء الرقمي...', 'Initializing Cosmic Canvas...');
    if (progress < 65) return t('تحميل النظم والبيانات...', 'Loading Systems & Portfolios...');
    if (progress < 90) return t('معايرة التناسق البصري...', 'Calibrating Celestial Assets...');
    return t('أهلاً بك في فضاء محمد حمدي...', 'Welcome to Mohamed Hamdy Space...');
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] w-full h-[100dvh] flex flex-col items-center justify-center bg-void text-moonlight transition-all duration-700 select-none overflow-hidden px-4 py-6 sm:p-8 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* توهجات فلكية روحانية في الخلفية */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-brass/15 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* زر التخطي السريع بالأعلى لمن يرغب */}
      <div className="absolute top-4 end-4 sm:top-6 sm:end-6 z-20">
        <button
          onClick={() => {
            soundFX.playClick();
            setIsFadingOut(true);
            setTimeout(onComplete, 300);
          }}
          className="text-xs font-mono text-dust/60 hover:text-brass px-3 py-1.5 rounded-full border border-ink/60 bg-deep/50 backdrop-blur-md transition-all hover:border-brass/40 active:scale-95"
        >
          {t('تخطي', 'Skip')}
        </button>
      </div>

      {/* الحاوية المركزية للشاشة، متمركزة رأسياً وأفقياً بدقة my-auto */}
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center my-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* 1. الأيقونة الفلكية الروحانية الدوارة */}
        <div className="relative flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 shrink-0">
          {/* حلقة خارجية دوارة باتجاه عقارب الساعة */}
          <div
            className="absolute inset-0 rounded-full border border-dashed border-brass/40 animate-spin"
            style={{ animationDuration: '18s' }}
          />
          {/* حلقة داخلية دوارة عكس عقارب الساعة */}
          <div
            className="absolute inset-1.5 sm:inset-2 rounded-full border border-brass/25 animate-spin"
            style={{ animationDuration: '12s', animationDirection: 'reverse' }}
          />

          {/* هالة دائرية نابضة */}
          <div className="absolute inset-3 sm:inset-4 rounded-full bg-gradient-to-tr from-brass/20 via-brass/5 to-transparent blur-sm animate-pulse" />

          {/* النجمة الثمانية / الأيقونة المركزية */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-deep/90 border border-brass/50 flex items-center justify-center shadow-[0_0_35px_rgba(201,162,39,0.35)] transform rotate-45 group">
            <div className="transform -rotate-45 flex flex-col items-center justify-center">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-brass animate-float-gentle" />
            </div>
          </div>
        </div>

        {/* 2. العبارة المركزية المعظمة: صلِّ على الحبيب ﷺ قلبك يطيب */}
        <div className="space-y-2 sm:space-y-3 px-2">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-brass/10 border border-brass/30 text-brass text-[11px] sm:text-xs font-mono">
            <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 fill-emerald-400/30 animate-pulse" />
            <span>{t('عطّر لسانك بذكر النبي', 'Send Blessings upon the Prophet')}</span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold font-display text-moonlight tracking-wide leading-tight glow-text drop-shadow-[0_4px_25px_rgba(201,162,39,0.3)]">
            {t('صَلِّ عَلَى الحَبِيبِ ﷺ قَلْبُكَ يَطِيب', 'Blessings Upon the Beloved Prophet ﷺ')}
          </h1>

          <p className="text-[11px] sm:text-xs md:text-sm font-sans text-dust/90 leading-relaxed max-w-sm sm:max-w-md mx-auto">
            {t(
              'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِين',
              'O Allah, send peace, blessings, and grace upon our master Muhammad and his family and companions.'
            )}
          </p>
        </div>

        {/* 3. زر تفاعلي لتسجيل الصلاة على النبي ﷺ */}
        <button
          onClick={handleBlessingClick}
          className="group relative inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-deep/80 border border-brass/30 hover:border-brass text-xs sm:text-sm font-mono text-moonlight hover:text-brass transition-all duration-300 shadow-astral hover:scale-105 active:scale-95"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 ${hasBlessed ? 'fill-emerald-400 scale-125' : ''} transition-all`} />
          <span>
            {t('صليتُ على الحبيب ﷺ', 'Blessed the Prophet ﷺ')}
          </span>
          <span className="ms-1 px-2 py-0.5 rounded-full bg-brass/20 text-brass text-[10px] sm:text-xs font-bold font-mono">
            +{salawatCount}
          </span>
        </button>

        {/* 4. شريط تقدم التحميل الفلكي الذهبي */}
        <div className="w-full max-w-xs sm:max-w-sm space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-dust">
            <span className="truncate">{getStatusText()}</span>
            <span className="text-brass font-bold">{progress}%</span>
          </div>

          <div className="w-full h-1.5 bg-ink/80 rounded-full overflow-hidden border border-ink relative">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-brass via-brass-light to-moonlight rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(201,162,39,0.6)] relative overflow-hidden"
            >
              {/* وميض أبيض متحرك */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
