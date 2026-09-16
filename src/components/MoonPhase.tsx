// مكون رسم طور القمر الفلكي بـ SVG دقيق ومزامنة مع التاريخ وسلايدر تفاعلي
import React, { useState, useEffect, useRef } from 'react';
import { calculateMoonData, toArabicNumerals } from '../utils/astronomy';
import { useLanguage } from '../context/LanguageContext';
import { RotateCcw } from 'lucide-react';

export const MoonPhase: React.FC = () => {
  const { lang, t } = useLanguage();
  
  // إزاحة الأيام من اليوم الحالي (0 = اليوم)
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const resetTimerRef = useRef<number | null>(null);

  // حساب بيانات القمر بناءً على الإزاحة
  const currentDate = new Date();
  const simulatedDate = new Date(currentDate.getTime() + dayOffset * 86400000);
  const moonData = calculateMoonData(simulatedDate);

  // عند ترك السلايدر، العودة بالتدريج لليوم الحالي بعد ثانية
  const handleSliderRelease = () => {
    setIsScrubbing(false);
    if (dayOffset !== 0) {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        setDayOffset(0);
      }, 1400);
    }
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  // حساب مسار الـ SVG لجزء القمر المضيء
  const renderMoonPath = () => {
    const cx = 110;
    const cy = 110;
    const r = 90;
    const { phase } = moonData;

    // حالة المحاق (أقل من 2% إضاءة)
    if (phase < 0.02 || phase > 0.98) {
      return null;
    }

    // حالة البدر التام (بين 0.48 و 0.52)
    if (phase >= 0.48 && phase <= 0.52) {
      return <circle cx={cx} cy={cy} r={r} fill="#E6E2D3" filter="url(#moon-glow)" />;
    }

    // حساب نصف المحور الأصغر للقطع الناقص (Terminator)
    const angle = 2 * Math.PI * phase;
    const rx = Math.max(0.1, r * Math.abs(Math.cos(angle)));

    let pathData = '';

    if (phase < 0.25) {
      // هلال متزايد (اليمين مضيء، الهلال نحيف)
      pathData = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 0 ${cx} ${cy - r} Z`;
    } else if (phase < 0.5) {
      // أحدب متزايد (اليمين مضيء، الجزء المضيء عريض)
      pathData = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 1 ${cx} ${cy - r} Z`;
    } else if (phase < 0.75) {
      // أحدب متناقص (الشمال مضيء، الجزء المضيء عريض)
      pathData = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${rx} ${r} 0 0 0 ${cx} ${cy - r} Z`;
    } else {
      // هلال متناقص (الشمال مضيء، الهلال نحيف)
      pathData = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${rx} ${r} 0 0 1 ${cx} ${cy - r} Z`;
    }

    return <path d={pathData} fill="#E6E2D3" filter="url(#moon-glow)" />;
  };

  const formattedIllum = lang === 'ar'
    ? `${toArabicNumerals(moonData.illumination)}٪`
    : `${moonData.illumination}%`;

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-deep/50 border border-ink relative overflow-hidden group shadow-2xl">
      {/* هالة فلكية خلف القمر متناسبة مع الإضاءة */}
      <div
        className="absolute w-56 h-56 rounded-full pointer-events-none transition-opacity duration-700 blur-2xl -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(230, 226, 211, 0.3) 0%, rgba(201, 162, 39, 0.1) 40%, transparent 70%)',
          opacity: Math.max(0.15, (moonData.illumination / 100) * 0.7),
        }}
      />

      {/* رسم القمر SVG */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56">
        <svg
          viewBox="0 0 220 220"
          className="w-full h-full drop-shadow-moon transition-transform duration-500 hover:scale-105"
        >
          <defs>
            {/* فلتر توهج القمر الناعم */}
            <filter id="moon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* قناع القرص القمري للفوهات */}
            <clipPath id="moon-disk">
              <circle cx="110" cy="110" r="90" />
            </clipPath>
          </defs>

          {/* خلفية القرص المظلم (سماء الليل العميقة) */}
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="#0C1226"
            stroke="#16203F"
            strokeWidth="1.5"
          />

          {/* فوهات القمر الخافتة على الجزء المظلم */}
          <g clipPath="url(#moon-disk)" opacity="0.25">
            <circle cx="85" cy="80" r="14" fill="#05070F" />
            <circle cx="140" cy="125" r="18" fill="#05070F" />
            <circle cx="95" cy="140" r="10" fill="#05070F" />
            <circle cx="130" cy="75" r="9" fill="#05070F" />
            <circle cx="110" cy="110" r="12" fill="#05070F" />
          </g>

          {/* الجزء المضيء فلكياً */}
          {renderMoonPath()}

          {/* فوهات خافتة فوق الجزء المضيء لإعطاء واقعية الملمس الرخامي */}
          <g clipPath="url(#moon-disk)" opacity="0.12">
            <circle cx="85" cy="80" r="14" fill="#8A94AD" />
            <circle cx="140" cy="125" r="18" fill="#8A94AD" />
            <circle cx="95" cy="140" r="10" fill="#8A94AD" />
            <circle cx="130" cy="75" r="9" fill="#8A94AD" />
          </g>

          {/* إطار نحاسي فلكي خارجي رقيق كحافة الإسطرلاب */}
          <circle
            cx="110"
            cy="110"
            r="93"
            fill="none"
            stroke="#C9A227"
            strokeWidth="0.75"
            strokeDasharray="3 6"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* بيانات التاريخ الهجري والطور */}
      <div className="mt-5 text-center space-y-1">
        <p className="font-mono text-sm sm:text-base font-semibold text-moonlight">
          {lang === 'ar' ? moonData.hijriDateAr : moonData.hijriDateEn}
        </p>
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-dust font-sans">
          <span className="text-brass font-medium">
            {lang === 'ar' ? moonData.phaseNameAr : moonData.phaseNameEn}
          </span>
          <span>·</span>
          <span className="font-mono text-moonlight/90">{formattedIllum} {t('إضاءة', 'Illumination')}</span>
        </div>
      </div>

      {/* سلايدر تفاعلي لاستعراض أيام الشهر القمري */}
      <div className="mt-5 w-full max-w-xs space-y-2">
        <div className="flex items-center justify-between text-[11px] text-dust/80 font-mono">
          <span>{t('محاكاة منازل الشهر', 'Scrub Lunar Cycle')}</span>
          {dayOffset !== 0 && (
            <button
              onClick={() => setDayOffset(0)}
              className="inline-flex items-center gap-1 text-brass hover:underline"
              title={t('العودة لليوم الحالي', 'Reset to today')}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('النهاردة', 'Today')}</span>
            </button>
          )}
        </div>
        <input
          type="range"
          min="-14"
          max="15"
          value={dayOffset}
          onChange={(e) => {
            setIsScrubbing(true);
            setDayOffset(Number(e.target.value));
          }}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          aria-label={t('محاكي أطوار القمر بالأيام', 'Lunar cycle day offset slider')}
          className="w-full h-1.5 bg-ink rounded-lg appearance-none cursor-pointer accent-brass focus:outline-none"
        />
        {isScrubbing && (
          <p className="text-[10px] text-center font-mono text-brass/80">
            {dayOffset === 0
              ? t('طور اليوم الحقيقي', 'Real-time today')
              : `${dayOffset > 0 ? '+' : ''}${lang === 'ar' ? toArabicNumerals(dayOffset) : dayOffset} ${t('يوم', 'days')}`}
          </p>
        )}
      </div>
    </div>
  );
};
