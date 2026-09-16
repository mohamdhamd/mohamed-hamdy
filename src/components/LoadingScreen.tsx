// شاشة التحميل الافتتاحية الروحانية الفلكية (صلِ على الحبيب قلبك يطيب ﷺ)
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { soundFX } from '../utils/audio';
import { Sparkles, Heart, Check } from 'lucide-react';

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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-void text-moonlight transition-all duration-700 select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* توهجات فلكية روحانية في الخلفية */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brass/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* زر التخطي السريع بالأعلى لمن يرغب */}
      <div className="absolute top-6 end-6 z-20">
        <button
          onClick={() => {
            soundFX.playClick();
            setIsFadingOut(true);
            setTimeout(onComplete, 300);
          }}
          className="text-xs font-mono text-dust/60 hover:text-brass px-3 py-1.5 rounded-full border border-ink/60 bg-deep/50 backdrop-blur-md transition-all hover:border-brass/40"
        >
          {t('تخطي', 'Skip')}
        </button>
      </div>

      <div className="relative z-10 max-w-lg w-full px-6 flex flex-col items-center text-center space-y-8">
        {/* 1. الأيقونة الفلكية الروحانية الدوارة */}
        <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32">
          {/* حلقة خارجية دوارة باتجاه عقارب الساعة */}
          <div
            className="absolute inset-0 rounded-full border border-dashed border-brass/40 animate-spin"
            style={{ animationDuration: '18s' }}
          />
          {/* حلقة داخلية دوارة عكس عقارب الساعة */}
          <div
            className="absolute inset-2 rounded-full border border-brass/25 animate-spin"
            style={{ animationDuration: '12s', animationDirection: 'reverse' }}
          />

          {/* هالة دائرية نابضة */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-brass/20 via-brass/5 to-transparent blur-sm animate-pulse" />

          {/* النجمة الثمانية / الأيقونة المركزية */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-deep/90 border border-brass/50 flex items-center justify-center shadow-[0_0_35px_rgba(201,162,39,0.35)] transform rotate-45 group">
            <div className="transform -rotate-45 flex flex-col items-center justify-center">
              <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 text-brass animate-float-gentle" />
            </div>
          </div>
        </div>

        {/* 2. العبارة المركزية المعظمة: صلِّ على الحبيب ﷺ قلبك يطيب */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brass/10 border border-brass/30 text-brass text-xs font-mono">
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/30 animate-pulse" />
            <span>{t('عطّر لسانك بذكر النبي', 'Send Blessings upon the Prophet')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display text-moonlight tracking-wide leading-tight glow-text drop-shadow-[0_4px_25px_rgba(201,162,39,0.3)]">
            {t('صَلِّ عَلَى الحَبِيبِ ﷺ قَلْبُكَ يَطِيب', 'Blessings Upon the Beloved Prophet ﷺ')}
          </h1>

          <p className="text-xs sm:text-sm font-sans text-dust/90 leading-relaxed max-w-md mx-auto">
            {t(
              'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِين',
              'O Allah, send peace, blessings, and grace upon our master Muhammad and his family and companions.'
            )}
          </p>
        </div>

        {/* 3. زر تفاعلي لتسجيل الصلاة على النبي ﷺ */}
        <button
          onClick={handleBlessingClick}
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-deep/80 border border-brass/30 hover:border-brass text-xs sm:text-sm font-mono text-moonlight hover:text-brass transition-all duration-300 shadow-astral hover:scale-105 active:scale-95"
        >
          <Heart className={`w-4 h-4 text-emerald-400 ${hasBlessed ? 'fill-emerald-400 scale-125' : ''} transition-all`} />
          <span>
            {t('صليتُ على الحبيب ﷺ', 'Blessed the Prophet ﷺ')}
          </span>
          <span className="ms-1 px-2 py-0.5 rounded-full bg-brass/20 text-brass text-xs font-bold font-mono">
            +{salawatCount}
          </span>
        </button>

        {/* 4. شريط تقدم التحميل الفلكي الذهبي */}
        <div className="w-full max-w-sm space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-dust">
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
