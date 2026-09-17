// قسم الـ Hero الحديث مع حركة كتابة الاسم الحرفية، الهلال الحي، وتوقيت القاهرة
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { calculateMoonData, toArabicNumerals } from '../utils/astronomy';
import { soundFX } from '../utils/audio';
import { ArrowDown, Github, Linkedin, Youtube, Facebook, Send, RotateCcw, SlidersHorizontal, Clock, FileText } from 'lucide-react';

interface HeroProps {
  onOpenCV?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCV }) => {
  const { lang, t } = useLanguage();
  const { settings } = useData();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [isScrubberOpen, setIsScrubberOpen] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  // حالة حركة كتابة الاسم (Typewriter Effect)
  const targetName =
    lang === 'ar'
      ? settings.hero_name_ar || 'محمد حمدي'
      : settings.hero_name_en || 'Mohamed Hamdy';
  const [displayedName, setDisplayedName] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // حساب التوقيت المحلي للقاهرة
  const [cairoTime, setCairoTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Africa/Cairo',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(new Date());
        setCairoTime(timeStr);
      } catch {
        setCairoTime('01:15 AM');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // حركة كتابة اسم محمد حمدي حرفاً بحرف مع نبض دائم لا يتوقف
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayedName(targetName);
      setShowCursor(true);
      return;
    }

    setDisplayedName('');
    setShowCursor(true);
    let index = 0;
    let timer: number;

    const typeNextChar = () => {
      if (index < targetName.length) {
        index++;
        setDisplayedName(targetName.slice(0, index));
        const delay = 70 + (Math.random() * 20 - 10);
        timer = window.setTimeout(typeNextChar, delay);
      } else {
        // المؤشر الذهبي الفلكي يستمر في النبض دائماً دون انقطاع
        setShowCursor(true);
      }
    };

    const initialDelay = window.setTimeout(typeNextChar, 250);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timer);
    };
  }, [targetName]);

  // حساب طور القمر الحقيقي لليوم مع مراعاة الإزاحة التجريبية إن وجدت
  const simulatedDate = new Date(Date.now() + dayOffset * 86400000);
  const moonData = calculateMoonData(simulatedDate);

  const handleSliderRelease = () => {
    if (dayOffset !== 0) {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        setDayOffset(0);
      }, 1500);
    }
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const formattedIllum = lang === 'ar'
    ? `${toArabicNumerals(moonData.illumination)}٪`
    : `${moonData.illumination}%`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (id: string) => {
    soundFX.playClick();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const renderCrescentPath = () => {
    const cx = 110;
    const cy = 110;
    const r = 95;
    const { phase } = moonData;

    if (phase < 0.02 || phase > 0.98) {
      return null;
    }

    if (phase >= 0.48 && phase <= 0.52) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="url(#crescent-glow-gradient)"
          filter="url(#crescent-bloom)"
        />
      );
    }

    const angle = 2 * Math.PI * phase;
    const rx = Math.max(0.1, r * Math.abs(Math.cos(angle)));

    let pathData = '';

    if (phase < 0.25) {
      pathData = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 0 ${cx} ${cy - r} Z`;
    } else if (phase < 0.5) {
      pathData = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 1 ${cx} ${cy - r} Z`;
    } else if (phase < 0.75) {
      pathData = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${rx} ${r} 0 0 0 ${cx} ${cy - r} Z`;
    } else {
      pathData = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${rx} ${r} 0 0 1 ${cx} ${cy - r} Z`;
    }

    return (
      <path
        d={pathData}
        fill="url(#crescent-glow-gradient)"
        filter="url(#crescent-bloom)"
      />
    );
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-4 pt-28 pb-16 overflow-hidden select-none"
    >
      {/* الهلال الفلكي الحقيقي في عمق الخلفية */}
      <div
        className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 transition-transform duration-700 ease-out"
        style={{
          transform: `translate(calc(-50% + ${-mousePos.x * 0.7}px), calc(-50% + ${-mousePos.y * 0.7}px))`,
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[700px] md:w-[850px] h-[480px] sm:h-[700px] md:h-[850px] rounded-full blur-[110px] pointer-events-none transition-opacity duration-1000"
          style={{
            background: moonData.isWaxing
              ? 'radial-gradient(circle at 65% 50%, rgba(255, 255, 255, 0.22) 0%, rgba(201, 162, 39, 0.15) 35%, transparent 70%)'
              : 'radial-gradient(circle at 35% 50%, rgba(255, 255, 255, 0.22) 0%, rgba(201, 162, 39, 0.15) 35%, transparent 70%)',
            opacity: Math.max(0.35, (moonData.illumination / 100) * 0.85),
          }}
        />

        <div className="relative w-[340px] sm:w-[520px] md:w-[680px] lg:w-[760px] h-[340px] sm:h-[520px] md:h-[680px] lg:h-[760px]">
          <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="crescent-glow-gradient" x1="100%" y1="10%" x2="0%" y2="90%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#FAF6ED" />
                <stop offset="70%" stopColor="#E6E2D3" />
                <stop offset="100%" stopColor="#DFB83B" />
              </linearGradient>

              <filter id="crescent-bloom" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="glow1" />
                <feGaussianBlur stdDeviation="8" result="glow2" />
                <feMerge>
                  <feMergeNode in="glow2" />
                  <feMergeNode in="glow1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <clipPath id="hero-moon-disk">
                <circle cx="110" cy="110" r="95" />
              </clipPath>
            </defs>

            <circle
              cx="110"
              cy="110"
              r="95"
              fill="#080C1E"
              stroke="#16203F"
              strokeWidth="1.2"
              opacity="0.88"
            />

            <g clipPath="url(#hero-moon-disk)" opacity="0.25">
              <ellipse cx="75" cy="70" rx="22" ry="18" fill="#05070F" />
              <ellipse cx="140" cy="135" rx="26" ry="20" fill="#05070F" />
              <ellipse cx="85" cy="145" rx="16" ry="12" fill="#05070F" />
              <ellipse cx="125" cy="65" rx="14" ry="10" fill="#05070F" />
              <circle cx="60" cy="110" r="8" fill="#05070F" />
              <circle cx="115" cy="105" r="10" fill="#05070F" />
            </g>

            {renderCrescentPath()}
          </svg>
        </div>
      </div>

      {/* طبقة حماية التباين */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background: 'radial-gradient(ellipse 750px 520px at center, rgba(5, 7, 15, 0.82) 0%, rgba(5, 7, 15, 0.55) 55%, transparent 95%)',
        }}
      />

      {/* المحتوى الرئيسي للـ Hero */}
      <div
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
        }}
      >
        {/* شارات الحالة وتوقيت القاهرة والطور الفلكي (مع حذف اسم الطور فقط) */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* شارة طور الليلة مع الاحتفاظ بالأيقونة والنسبة والتاريخ والمحاكي وحذف النص فقط */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brass/40 bg-void/90 backdrop-blur-md shadow-astral text-xs font-mono text-moonlight whitespace-nowrap select-none">
              <span className="w-2 h-2 rounded-full bg-brass animate-pulse shrink-0" />
              <span className="text-brass font-bold text-sm shrink-0">
                🌙
              </span>
              <span className="text-moonlight font-medium shrink-0">{formattedIllum}</span>
              <span className="text-dust shrink-0">·</span>
              <span className="text-dust/90 shrink-0">
                {lang === 'ar' ? moonData.hijriDateAr : moonData.hijriDateEn}
              </span>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setIsScrubberOpen(!isScrubberOpen);
                }}
                title={t('محاكاة أطوار القمر', 'Scrub lunar cycle')}
                className="p-1 rounded hover:bg-ink/60 text-brass ms-1 transition-colors shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* شارة توقيت القاهرة والجاهزية */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-ink bg-void/80 backdrop-blur-md text-xs font-mono text-moonlight/90">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Clock className="w-3 text-dust" />
              <span>Cairo {cairoTime}</span>
              <span className="text-dust">·</span>
              <span className="text-emerald-400 font-medium">{t('متاح للعمل', 'Available')}</span>
            </div>
          </div>

          {/* مسطرة محاكاة الأطوار */}
          {isScrubberOpen && (
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-deep/95 border border-brass/30 shadow-2xl backdrop-blur-lg animate-in fade-in zoom-in-95 duration-200">
              <span className="text-[11px] font-mono text-dust">
                {t('محاكاة الشهر:', 'Cycle Scrub:')}
              </span>
              <input
                type="range"
                min="-14"
                max="15"
                value={dayOffset}
                onChange={(e) => {
                  setDayOffset(Number(e.target.value));
                }}
                onMouseUp={handleSliderRelease}
                onTouchEnd={handleSliderRelease}
                className="w-36 sm:w-48 h-1.5 bg-ink rounded-lg appearance-none cursor-pointer accent-brass focus:outline-none"
              />
              {dayOffset !== 0 && (
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setDayOffset(0);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-brass hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('الليلة', 'Tonight')}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* الحاوية النصية مع حركة كتابة الاسم والوميض الفلكي الدائم */}
        <div className="space-y-4 max-w-3xl">
          {/* حجز مساحة ثابتة لمنع أي Layout Shift */}
          <div className="min-h-[3.5rem] sm:min-h-[5.5rem] md:min-h-[7rem] flex items-center justify-center">
            <h1
              aria-label={targetName}
              onClick={() => {
                soundFX.playBlip(750, 0.05);
                setDisplayedName('');
                let idx = 0;
                const retype = () => {
                  if (idx < targetName.length) {
                    idx++;
                    setDisplayedName(targetName.slice(0, idx));
                    setTimeout(retype, 65);
                  }
                };
                setTimeout(retype, 80);
              }}
              className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] leading-tight select-none cursor-pointer group"
              title={t('انقر لإعادة كتابة الاسم', 'Click to replay typing')}
            >
              <span
                aria-hidden="true"
                className="bg-gradient-to-r from-moonlight via-brass-light via-moonlight to-brass bg-[length:200%_auto] animate-shimmer-text bg-clip-text text-transparent group-hover:drop-shadow-[0_0_35px_rgba(201,162,39,0.5)] transition-all"
              >
                {displayedName || '\u00A0'}
              </span>
              {showCursor && (
                <span
                  aria-hidden="true"
                  className="inline-block w-[3.5px] sm:w-[5.5px] h-[0.8em] bg-brass ms-2.5 align-middle animate-pulse shadow-astral rounded-sm"
                  style={{ animationDuration: '650ms' }}
                />
              )}
            </h1>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-brass" />
            <h2 className="font-display text-lg sm:text-2xl md:text-3xl font-semibold text-brass tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {t(
                settings.hero_title_ar || 'مطور Full-Stack & مهندس نظم برمجية ومالية',
                settings.hero_title_en || 'Full-Stack Developer & Financial Tech Engineer'
              )}
            </h2>
            <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-brass" />
          </div>

          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-dust font-sans leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {t(
              settings.hero_subtitle_ar ||
                'أدمج بين دقة المنطق المالي والمحاسبي وقوة تطوير الويب الشامل، لأبني تطبيقات سريعة وأنظمة برمجية تفهم لغة الأرقام وتخدم أهداف الأعمال بكفاءة.',
              settings.hero_subtitle_en ||
                'Bridging financial and accounting precision with end-to-end full-stack engineering — architecting fast, resilient software systems that understand the language of numbers and scale business goals.'
            )}
          </p>
        </div>

        {/* الأزرار التفاعلية */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => scrollToSection('projects')}
            className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brass hover:bg-brass-light text-void font-bold text-sm sm:text-base transition-all duration-300 shadow-astral hover:shadow-astral-lg hover:-translate-y-0.5"
          >
            <span>{t('استعرض أعمالي ومشاريعي', 'Explore My Work')}</span>
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
          </button>

          {onOpenCV && (
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenCV();
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-brass/50 bg-brass/10 hover:bg-brass/20 text-brass font-bold text-sm sm:text-base backdrop-blur-md transition-all hover:-translate-y-0.5 shadow-astral group"
            >
              <FileText className="w-4 h-4 text-brass group-hover:scale-110 transition-transform" />
              <span>{t('السيرة الذاتية (CV)', 'Interactive Resume')}</span>
            </button>
          )}

          <button
            onClick={() => scrollToSection('contact')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-ink bg-void/90 hover:bg-deep hover:border-brass/50 text-moonlight font-medium text-sm sm:text-base backdrop-blur-md transition-all hover:-translate-y-0.5 shadow-lg"
          >
            <span>{t('تواصل معي', 'Get In Touch')}</span>
            <Send className="w-4 h-4 text-brass" />
          </button>

          <div className="flex items-center gap-2 ms-2">
            <a
              href={settings.linkedin_url || 'https://www.linkedin.com/in/mohamed-hamdey/'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.playClick()}
              className="p-3 rounded-xl border border-ink bg-void/90 hover:border-brass/40 text-dust hover:text-brass transition-all hover:-translate-y-0.5 shadow-lg"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={settings.youtube_url || 'https://www.youtube.com/@coding-keys'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.playClick()}
              className="p-3 rounded-xl border border-ink bg-void/90 hover:border-red-500/40 text-dust hover:text-red-400 transition-all hover:-translate-y-0.5 shadow-lg"
              title="YouTube (@coding-keys)"
              aria-label="YouTube Channel"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={settings.facebook_url || 'https://www.facebook.com/m0hamedhamdy1/?locale=ar_AR'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.playClick()}
              className="p-3 rounded-xl border border-ink bg-void/90 hover:border-blue-500/40 text-dust hover:text-blue-400 transition-all hover:-translate-y-0.5 shadow-lg"
              title="Facebook Profile"
              aria-label="Facebook Profile"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={settings.github_url || 'https://github.com/mohamdhamd'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.playClick()}
              className="p-3 rounded-xl border border-ink bg-void/90 hover:border-brass/40 text-dust hover:text-moonlight transition-all hover:-translate-y-0.5 shadow-lg"
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* سهم التمرير */}
        <div className="mt-14 animate-bounce">
          <button
            onClick={() => scrollToSection('about')}
            aria-label="Scroll to about"
            className="p-2 text-dust/60 hover:text-brass transition-colors"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
