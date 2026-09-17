// صفحة السيرة الذاتية التفاعلية الفلكية المستقلة والمزودة بنسخ تخصصية متعددة وأنيميشن استثنائي
import React, { useState, useEffect, useRef } from 'react';
import { resumeData, ResumeCertification, ResumeSkillCategory, ResumeExperience } from '../../data/resumeData';
import { resumeTracks, ResumeTrackId } from '../../data/resumeTracks';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { soundFX } from '../../utils/audio';
import { triggerCelestialConfetti } from './CelestialConfetti';
import { CvConstellationCanvas } from './CvConstellationCanvas';
import {
  Download,
  Printer,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Youtube,
  Facebook,
  GraduationCap,
  Award,
  Briefcase,
  Layers,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Eye,
  Star,
  ShieldCheck,
  Globe,
  Code2,
  BarChart3,
  Scale,
  X,
  Zap,
  CheckCircle2,
  Scan,
  Share2,
} from 'lucide-react';

interface ResumePageProps {
  onBackToSite: () => void;
}

// 1. مكوّن عداد الأرقام التفاعلي المتحرك (Animated Count-Up)
const AnimatedCounter: React.FC<{ value: string; duration?: number }> = ({ value, duration = 1300 }) => {
  const match = value.match(/^(\d+)(.*)$/);
  const targetNum = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : value;

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (targetNum === null) return;
    let startTimestamp: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * targetNum));

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setCount(targetNum);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [targetNum, duration, value]);

  if (targetNum === null) return <span>{value}</span>;

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

// 2. كارت الإمالة ثلاثي الأبعاد مع توهج المؤشر اللحظي (3D Interactive Tilt Card)
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  onClick,
  glowColor = 'rgba(201, 162, 39, 0.16)',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
  });
  const [spotlight, setSpotlight] = useState<{ x: number; y: number; opacity: number }>({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`,
      transition: 'transform 0.08s ease-out',
    });

    setSpotlight({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
    });
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
      className={`relative overflow-hidden ${className}`}
    >
      {/* هالة الضوء الموضعية التفاعلية */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-inherit"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(400px circle at ${spotlight.x}px ${spotlight.y}px, ${glowColor}, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
};

// 3. شريط تقدم المهارة المتحرك مع وميض الإضاءة (Animated Skill Progress Bar)
const AnimatedSkillBar: React.FC<{ name: string; level: number; highlight?: boolean }> = ({
  name,
  level,
  highlight,
}) => {
  const [currentWidth, setCurrentWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentWidth(level);
    }, 180);
    return () => clearTimeout(timer);
  }, [level]);

  return (
    <div className="space-y-1.5 group/skill">
      <div className="flex justify-between text-xs font-mono">
        <span className={`${highlight ? 'text-moonlight font-bold flex items-center gap-1.5' : 'text-dust'}`}>
          {highlight && <Sparkles className="w-3 h-3 text-brass animate-pulse" />}
          {name}
        </span>
        <span className="text-brass/90 font-bold text-[11px] group-hover/skill:scale-110 transition-transform">
          {level}%
        </span>
      </div>

      <div className="w-full h-2 bg-void/90 rounded-full overflow-hidden border border-ink/80 relative">
        <div
          style={{ width: `${currentWidth}%` }}
          className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
            highlight
              ? 'bg-gradient-to-r from-brass/90 via-brass to-brass-light shadow-[0_0_12px_rgba(201,162,39,0.5)]'
              : 'bg-gradient-to-r from-dust/40 via-dust/70 to-dust/90'
          }`}
        >
          {/* شعاع وميض متكرر */}
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

export const ResumePage: React.FC<ResumePageProps> = ({ onBackToSite }) => {
  const { lang, toggleLang, t } = useLanguage();
  const { resumeData: liveResumeData } = useData();
  const cvData = liveResumeData || resumeData;

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedTrackLink, setCopiedTrackLink] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedCert, setSelectedCert] = useState<(ResumeCertification & { originalIndex: number }) | null>(null);
  const [activeNav, setActiveNav] = useState('profile');

  // استرجاع المسار المحدد من الرابط (الافتراضي هو النسخة الأساسية all كما طلب المستخدم)
  const [activeTrack, setActiveTrack] = useState<ResumeTrackId>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const trackParam = urlParams.get('track')?.toLowerCase();
      if (trackParam && trackParam in resumeTracks) {
        return trackParam as ResumeTrackId;
      }
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('track=')) {
        const match = hash.match(/track=([a-z_]+)/);
        if (match && match[1] in resumeTracks) return match[1] as ResumeTrackId;
      }
      if (hash.includes('accountant')) return 'accountant';
      if (hash.includes('data')) return 'data_analyst';
      if (hash.includes('fullstack')) return 'fullstack';
    } catch {}
    return 'all'; // النسخة الأساسية الافتراضية
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'data' | 'accounting' | 'code'>('all');
  // نطاق عرض الشهادات: هل يقتصر على شهادات المسار المختار فقط أم كافة الشهادات؟
  const [certViewScope, setCertViewScope] = useState<'track_only' | 'all'>('track_only');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // تحديث المسار النشط مع تحديث الرابط دون إعادة تحميل وتنسيب الشهادات تلقائياً
  const handleSwitchTrack = (trackId: ResumeTrackId) => {
    soundFX.playClick();
    setActiveTrack(trackId);
    setCertViewScope('track_only'); // إعادة تفعيل حصر الشهادات للمسار المختار مباشرة

    // إذا تم اختيار مسار محدد، نضبط الفلتر تلقائياً بما يلائمه أو نتركه للكل
    if (trackId === 'accountant') setActiveFilter('accounting');
    else if (trackId === 'data_analyst') setActiveFilter('data');
    else if (trackId === 'fullstack') setActiveFilter('code');
    else setActiveFilter('all');

    try {
      const url = new URL(window.location.href);
      if (trackId === 'all') {
        url.searchParams.delete('track');
      } else {
        url.searchParams.set('track', trackId);
      }
      window.history.replaceState({}, '', url.toString());
    } catch {}
  };

  const handleCopyTrackLink = () => {
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      if (activeTrack !== 'all') {
        url.searchParams.set('track', activeTrack);
      }
      navigator.clipboard.writeText(url.toString());
      soundFX.playClick();
      setCopiedTrackLink(true);
      setTimeout(() => setCopiedTrackLink(false), 2200);
    } catch {}
  };

  const handleCopy = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    soundFX.playClick();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (e?: React.MouseEvent) => {
    soundFX.playChime();
    setDownloading(true);

    const clickX = e ? e.clientX : window.innerWidth / 2;
    const clickY = e ? e.clientY : window.innerHeight / 2;
    triggerCelestialConfetti(clickX, clickY);

    const link = document.createElement('a');
    link.href = cvData.personal.pdf_url;
    link.download = cvData.personal.pdf_filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloading(false), 2200);
  };

  const handlePrint = () => {
    soundFX.playClick();
    window.print();
  };

  const scrollToAnchor = (id: string) => {
    soundFX.playClick();
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // دمج التعديلات والمسارات من قاعدة البيانات مع الإعدادات الفلكية
  const mergedTracks = React.useMemo(() => {
    const result = { ...resumeTracks };
    if (liveResumeData?.tracks) {
      (Object.keys(resumeTracks) as ResumeTrackId[]).forEach((tId) => {
        const customTrack = liveResumeData.tracks?.[tId];
        if (customTrack) {
          result[tId] = {
            ...result[tId],
            title_ar: customTrack.title_ar || result[tId].title_ar,
            title_en: customTrack.title_en || result[tId].title_en,
            badge_ar: customTrack.badge_ar || result[tId].badge_ar,
            badge_en: customTrack.badge_en || result[tId].badge_en,
            summary_ar: customTrack.summary_ar || result[tId].summary_ar,
            summary_en: customTrack.summary_en || result[tId].summary_en,
            stats: (customTrack.stats && customTrack.stats.length > 0) ? customTrack.stats : result[tId].stats,
          };
        }
      });
    }
    if (liveResumeData?.summary?.ar) {
      result.all = { ...result.all, summary_ar: liveResumeData.summary.ar };
    }
    if (liveResumeData?.summary?.en) {
      result.all = { ...result.all, summary_en: liveResumeData.summary.en };
    }
    return result;
  }, [liveResumeData]);

  // بيانات المسار النشط حالياً
  const currentTrack = mergedTracks[activeTrack] || resumeTracks[activeTrack];

  // فلترة وترتيب الشهادات التخصصية المنتسبة للمسار المختار
  const certsSource = ((cvData.certifications || resumeData.certifications) as unknown) as ResumeCertification[];
  const displayedCerts: (ResumeCertification & { originalIndex: number })[] = certsSource
    .map((cert: ResumeCertification, originalIndex: number) => ({ ...cert, originalIndex }))
    .filter((cert: ResumeCertification & { originalIndex: number }) => {
      // إذا كان المسار تخصصياً والمستخدم في وضع عرض شهادات التخصص فقط
      if (activeTrack !== 'all' && certViewScope === 'track_only') {
        return currentTrack.trackCertIndices.includes(cert.originalIndex);
      }

      // إذا كان في المسار الشامل (all) أو اختار المستخدم كشف كافة الشهادات الـ 10
      if (activeFilter === 'all') return true;
      const str = `${cert.title_en} ${cert.issuer_en} ${(cert.skills || []).join(' ')}`.toLowerCase();
      if (activeFilter === 'data') return str.includes('power bi') || str.includes('excel') || str.includes('data');
      if (activeFilter === 'accounting') return str.includes('odoo') || str.includes('accounting') || str.includes('pfa');
      if (activeFilter === 'code') return str.includes('web') || str.includes('python') || str.includes('prompt');
      return true;
    })
    .sort((a: ResumeCertification & { originalIndex: number }, b: ResumeCertification & { originalIndex: number }) => {
      // إعطاء أولوية في الترتيب للشهادات المرتبطة بالمسار النشط
      const aIsTrack = currentTrack.trackCertIndices.includes(a.originalIndex);
      const bIsTrack = currentTrack.trackCertIndices.includes(b.originalIndex);
      if (aIsTrack && !bIsTrack) return -1;
      if (!aIsTrack && bIsTrack) return 1;
      return 0;
    });

  // ترتيب مصفوفة المهارات حسب المسار النشط
  const displayedSkills: ResumeSkillCategory[] = [...(cvData.skills || resumeData.skills)].sort((a, b) => {
    if (activeTrack === 'accountant') {
      if (a.category_en.includes('Accounting')) return -1;
      if (b.category_en.includes('Accounting')) return 1;
    } else if (activeTrack === 'data_analyst') {
      if (a.category_en.includes('Data')) return -1;
      if (b.category_en.includes('Data')) return 1;
    } else if (activeTrack === 'fullstack') {
      if (a.category_en.includes('Web')) return -1;
      if (b.category_en.includes('Web')) return 1;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-void text-moonlight font-sans relative overflow-x-hidden selection:bg-brass selection:text-void pb-28">
      {/* 1. كانفاس الأبراج والشهب الفلكي المتحرك في الخلفية */}
      <CvConstellationCanvas />

      {/* توهجات فلكية خلفية هادئة */}
      <div className="fixed top-0 start-1/4 w-[600px] h-[600px] bg-brass/10 rounded-full blur-[160px] pointer-events-none animate-pulse-slow" />
      <div className="fixed bottom-10 end-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* 2. الشريط العلوي الثابت مع أزرار الإجراءات السريعة (Sticky Floating Nav) */}
      <header className="sticky top-0 z-50 bg-deep/90 backdrop-blur-xl border-b border-ink/80 px-4 py-3 sm:px-8 shadow-2xl transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* زر الرجوع للبورتفوليو الرئيسي */}
          <button
            onClick={() => {
              soundFX.playClick();
              onBackToSite();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-void/80 border border-ink text-xs font-mono text-dust hover:text-brass hover:border-brass/40 transition-all active:scale-95 group shadow-sm"
          >
            {lang === 'ar' ? (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            )}
            <span>{t('العودة للموقع الرئيسي', 'Back to Portfolio')}</span>
          </button>

          {/* أزرار التحميل والطباعة ومعاينة الـ PDF وتبديل اللغة */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* تبديل معاينة ملف الـ PDF الأصلي */}
            <button
              onClick={() => {
                soundFX.playClick();
                setShowPdfViewer(!showPdfViewer);
              }}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono border transition-all ${
                showPdfViewer
                  ? 'bg-brass text-void font-bold shadow-astral border-brass'
                  : 'bg-void/80 border-ink text-dust hover:text-moonlight hover:border-brass/40'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPdfViewer ? t('إخفاء الـ PDF', 'Hide PDF') : t('معاينة الـ PDF الأصلي', 'Preview PDF')}</span>
            </button>

            {/* زر الطباعة */}
            <button
              onClick={handlePrint}
              title={t('طباعة السيرة الذاتية', 'Print CV')}
              className="p-2 rounded-xl bg-void/80 border border-ink text-dust hover:text-moonlight hover:border-brass/40 transition-colors hidden sm:inline-flex"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* زر تبديل اللغة */}
            <button
              onClick={() => {
                soundFX.playClick();
                toggleLang();
              }}
              className="px-3 py-2 rounded-xl bg-void/80 border border-ink text-xs font-mono text-brass hover:bg-ink/50 transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase font-bold">{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* زر تحميل السيرة الذاتية الرسمي المتوهج مع الاحتفال النجمي */}
            <button
              onClick={(e) => handleDownload(e)}
              disabled={downloading}
              className="relative group overflow-hidden flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-brass text-void font-bold text-xs sm:text-sm font-mono hover:bg-brass-light active:scale-95 transition-all shadow-[0_0_25px_rgba(201,162,39,0.4)] disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : 'group-hover:-translate-y-0.5 transition-transform'}`} />
              <span>{downloading ? t('جاري التحميل...', 'Downloading...') : t('تحميل الـ CV الرسمي', 'Download CV')}</span>
              <div className="absolute inset-0 w-1/3 h-full bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. معاينة الـ PDF التفاعلية مع شعاع المسح الضوئي (Scanner Beam Effect) */}
      {showPdfViewer && (
        <div className="bg-deep/95 border-b border-ink p-4 sm:p-6 animate-in slide-in-from-top-4 duration-300 relative z-20">
          <div className="max-w-5xl mx-auto space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-dust">
              <span className="flex items-center gap-2 text-moonlight font-bold">
                <FileText className="w-4 h-4 text-brass animate-pulse" />
                <span>{cvData.personal.pdf_filename} (Official Verified Document)</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                  Verified PDF
                </span>
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={cvData.personal.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brass hover:underline"
                >
                  <span>{t('فتح في نافذة كاملة', 'Open in new tab')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setShowPdfViewer(false)}
                  className="p-1 rounded text-dust hover:text-white"
                  title={t('إغلاق', 'Close')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* حاوية الـ iframe مع شريط المسح الضوئي التكنولوجي */}
            <div className="w-full h-[620px] rounded-2xl border border-ink overflow-hidden bg-void shadow-2xl relative">
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] pointer-events-none z-10 animate-scan-beam" />
              <iframe
                src={`${cvData.personal.pdf_url}#toolbar=1`}
                title="Mohamed Hamdy CV"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. المحتوى الرئيسي للسيرة الذاتية التفاعلية */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 relative z-10">
        {/* شريط اختيار وتبديل نسخة السيرة الذاتية التخصصية (Track / Persona Switcher) */}
        <section className="space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-deep/90 border border-ink/80 p-3 sm:p-4 rounded-3xl backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-dust">
              <Sparkles className="w-4 h-4 text-brass" />
              <span className="text-moonlight font-bold">
                {t('اختر نسخة السيرة الذاتية حسب التخصص:', 'Select Tailored CV Version:')}
              </span>
            </div>

            {/* أزرار المسارات التخصصية */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 p-1 rounded-2xl bg-void/80 border border-ink">
              {(Object.keys(resumeTracks) as ResumeTrackId[]).map((trackKey) => {
                const track = resumeTracks[trackKey];
                const isActive = activeTrack === trackKey;
                return (
                  <button
                    key={trackKey}
                    onClick={() => handleSwitchTrack(trackKey)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all duration-200 ${
                      isActive
                        ? 'bg-brass text-void font-bold shadow-astral'
                        : 'text-dust hover:text-moonlight hover:bg-deep/60'
                    }`}
                  >
                    {track.iconName === 'Sparkles' && <Sparkles className="w-3.5 h-3.5" />}
                    {track.iconName === 'Scale' && <Scale className="w-3.5 h-3.5 text-emerald-400" />}
                    {track.iconName === 'BarChart3' && <BarChart3 className="w-3.5 h-3.5 text-sky-400" />}
                    {track.iconName === 'Code2' && <Code2 className="w-3.5 h-3.5 text-purple-400" />}
                    <span>{lang === 'ar' ? track.tabLabel_ar : track.tabLabel_en}</span>
                  </button>
                );
              })}
            </div>

            {/* زر مشاركة ونسخ رابط هذه النسخة التخصصية */}
            <button
              onClick={handleCopyTrackLink}
              title={t('نسخ رابط هذه النسخة للمشاركة مع مسؤولي التوظيف', 'Copy shareable link for this tailored version')}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-void border border-ink hover:border-brass/40 text-xs font-mono text-dust hover:text-brass transition-all self-stretch lg:self-auto shadow-sm"
            >
              {copiedTrackLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">{t('تم نسخ رابط النسخة!', 'Link Copied!')}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-brass" />
                  <span>{t('نسخ رابط هذه النسخة', 'Copy Track Link')}</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* بطاقة الرأس والبيانات الشخصية (Personal Header Card) مع تأثير 3D Tilt */}
        <section id="profile">
          <TiltCard className="rounded-3xl bg-deep/90 border border-ink/80 p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6">
            {/* هالة ذهبية علوية */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-brass to-transparent opacity-90 animate-shimmer" />

            {/* شارة التميز الأكاديمي والمسار المحدد */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${currentTrack.accentBg} border ${currentTrack.accentBorder} text-xs font-mono font-bold shadow-sm animate-float-gentle`}
              >
                {currentTrack.iconName === 'Sparkles' && <Sparkles className="w-3.5 h-3.5 text-brass animate-pulse" />}
                {currentTrack.iconName === 'Scale' && <Scale className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />}
                {currentTrack.iconName === 'BarChart3' && <BarChart3 className="w-3.5 h-3.5 text-sky-400 animate-pulse" />}
                {currentTrack.iconName === 'Code2' && <Code2 className="w-3.5 h-3.5 text-purple-400 animate-pulse" />}
                <span>{lang === 'ar' ? currentTrack.badge_ar : currentTrack.badge_en}</span>
              </div>
              <span className="text-xs font-mono text-dust/70 bg-void/60 px-3 py-1 rounded-full border border-ink">
                {t('الحالة العسكرية: مؤجل', 'Military Status: Postponed')}
              </span>
            </div>

            {/* الاسم والمسمى الوظيفي المخصص للمسار */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-moonlight tracking-tight glow-text">
                {lang === 'ar' ? cvData.personal.name_ar : cvData.personal.name_en}
              </h1>
              <p className="text-sm sm:text-xl text-brass font-sans font-medium flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-brass animate-ping" />
                <span>{lang === 'ar' ? currentTrack.title_ar : currentTrack.title_en}</span>
              </p>
            </div>

            {/* بيانات الاتصال المباشرة */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 border-t border-ink/70">
              <a
                href={`mailto:${cvData.personal.email}`}
                onClick={() => soundFX.playClick()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-void/80 border border-ink text-xs font-mono text-dust hover:text-brass hover:border-brass/40 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <Mail className="w-3.5 h-3.5 text-brass" />
                <span>{cvData.personal.email}</span>
              </a>

              <a
                href={`tel:${cvData.personal.phone}`}
                onClick={() => soundFX.playClick()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-void/80 border border-ink text-xs font-mono text-dust hover:text-brass hover:border-brass/40 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-brass" />
                <span dir="ltr">{cvData.personal.phone}</span>
              </a>

              {cvData.personal.linkedin_url && (
                <a
                  href={cvData.personal.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX.playClick()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-void/80 border border-ink text-xs font-mono text-dust hover:text-brass hover:border-brass/40 transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  <Linkedin className="w-3.5 h-3.5 text-brass" />
                  <span>{cvData.personal.linkedin || 'LinkedIn'}</span>
                </a>
              )}

              {cvData.personal.youtube_url && (
                <a
                  href={cvData.personal.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX.playClick()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-void/80 border border-ink text-xs font-mono text-dust hover:text-red-400 hover:border-red-400/40 transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-400" />
                  <span>YouTube</span>
                </a>
              )}

              {cvData.personal.facebook_url && (
                <a
                  href={cvData.personal.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX.playClick()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-void/80 border border-ink text-xs font-mono text-dust hover:text-sky-400 hover:border-sky-400/40 transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  <Facebook className="w-3.5 h-3.5 text-sky-400" />
                  <span>Facebook</span>
                </a>
              )}

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-void/80 border border-ink text-xs font-mono text-dust">
                <MapPin className="w-3.5 h-3.5 text-dust/60" />
                <span>{lang === 'ar' ? cvData.personal.location_ar : cvData.personal.location_en}</span>
              </div>
            </div>

            {/* شريط الإحصائيات الأربعة المخصص للمسار مع عدادات رقمية */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              {currentTrack.stats.map((stat, sIdx) => (
                <div
                  key={sIdx}
                  className="p-4 rounded-2xl bg-void/80 border border-ink/80 hover:border-brass/40 transition-all text-center space-y-1 group hover:-translate-y-1 shadow-md"
                >
                  <span className="text-2xl sm:text-3xl font-bold font-display text-brass block group-hover:scale-110 transition-transform">
                    <AnimatedCounter value={stat.value} />
                  </span>
                  <span className="text-[11px] font-mono text-dust block truncate">
                    {lang === 'ar' ? stat.label_ar : stat.label_en}
                  </span>
                </div>
              ))}
            </div>
          </TiltCard>
        </section>

        {/* 5. الملخص المهني المخصص للمسار (Professional Summary) */}
        <section id="summary" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-brass uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <h3 className="font-bold">{t('الملخص المهني (Professional Summary)', 'Professional Summary')}</h3>
            </div>
            {activeTrack !== 'all' && (
              <span className="text-[11px] font-mono text-dust/70 bg-void px-2.5 py-0.5 rounded border border-ink">
                {lang === 'ar' ? `موجّه لـ: ${currentTrack.tabLabel_ar}` : `Focused on: ${currentTrack.tabLabel_en}`}
              </span>
            )}
          </div>
          <TiltCard className="p-6 sm:p-8 rounded-3xl bg-deep/80 border border-ink/80 text-sm sm:text-base text-moonlight/90 leading-relaxed font-sans relative backdrop-blur-md">
            <div className="w-1.5 h-full bg-gradient-to-b from-brass via-brass-light to-transparent rounded-full absolute start-0 top-0" />
            <p>{lang === 'ar' ? currentTrack.summary_ar : currentTrack.summary_en}</p>
          </TiltCard>
        </section>

        {/* 6. المؤهل التعليمي (Education) */}
        <section id="education" className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-brass uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <h3 className="font-bold">{t('التعليم الأكاديمي (Education)', 'Education')}</h3>
          </div>
          <TiltCard className="p-6 sm:p-8 rounded-3xl bg-deep/80 border border-ink/80 space-y-4 relative overflow-hidden backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink/60 pb-3">
              <div>
                <h4 className="text-lg sm:text-xl font-bold font-display text-moonlight">
                  {lang === 'ar' ? cvData.education.degree_ar : cvData.education.degree_en}
                </h4>
                <p className="text-xs sm:text-sm text-dust font-sans">
                  {lang === 'ar' ? cvData.education.institution_ar : cvData.education.institution_en}
                </p>
              </div>
              <span className="text-xs font-mono px-3.5 py-1 rounded-full bg-void border border-ink text-dust self-start sm:self-auto">
                {cvData.education.period}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20 inline-flex">
              <Award className="w-4 h-4" />
              <span>{lang === 'ar' ? cvData.education.grade_ar : cvData.education.grade_en}</span>
            </div>
          </TiltCard>
        </section>

        {/* 7. الشهادات والاعتمادات الرسمية الـ 10 (Certifications & Training) */}
        <section id="certifications" className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-brass uppercase tracking-wider">
                  <Award className="w-4 h-4 text-brass animate-pulse" />
                  <h3 className="font-bold text-sm sm:text-base text-moonlight">
                    {lang === 'ar' ? currentTrack.certSectionTitle_ar : currentTrack.certSectionTitle_en}
                  </h3>
                </div>
                <p className="text-xs text-dust/80 font-sans max-w-2xl leading-relaxed">
                  {lang === 'ar' ? currentTrack.certSectionDesc_ar : currentTrack.certSectionDesc_en}
                </p>
              </div>

              {/* أزرار التبديل والفلاتر المرتبطة بنسخة السيرة الذاتية */}
              {activeTrack !== 'all' ? (
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-deep border border-ink text-xs font-mono self-start sm:self-auto shadow-sm">
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setCertViewScope('track_only');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      certViewScope === 'track_only'
                        ? 'bg-brass text-void font-bold shadow-astral'
                        : 'text-dust hover:text-moonlight'
                    }`}
                  >
                    {currentTrack.iconName === 'Scale' && <Scale className="w-3.5 h-3.5 text-emerald-400" />}
                    {currentTrack.iconName === 'BarChart3' && <BarChart3 className="w-3.5 h-3.5 text-sky-400" />}
                    {currentTrack.iconName === 'Code2' && <Code2 className="w-3.5 h-3.5 text-purple-400" />}
                    <span>
                      {lang === 'ar'
                        ? `شهادات المسار (${currentTrack.trackCertIndices.length})`
                        : `${currentTrack.tabLabel_en} (${currentTrack.trackCertIndices.length})`}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setCertViewScope('all');
                      setActiveFilter('all');
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      certViewScope === 'all'
                        ? 'bg-brass text-void font-bold shadow-astral'
                        : 'text-dust hover:text-moonlight'
                    }`}
                  >
                    <span>{t('عرض كافة الشهادات (10)', 'View All 10 Certs')}</span>
                  </button>
                </div>
              ) : (
                /* فلاتر تخصصات الشهادات في النسخة الأساسية (Master Profile) */
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-deep border border-ink text-xs font-mono overflow-x-auto max-w-full">
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setActiveFilter('all');
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeFilter === 'all' ? 'bg-brass text-void font-bold shadow-astral' : 'text-dust hover:text-moonlight'
                    }`}
                  >
                    {t('الكل (10)', 'All (10)')}
                  </button>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setActiveFilter('data');
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeFilter === 'data' ? 'bg-brass text-void font-bold shadow-astral' : 'text-dust hover:text-moonlight'
                    }`}
                  >
                    Power BI & Data
                  </button>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setActiveFilter('accounting');
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeFilter === 'accounting' ? 'bg-brass text-void font-bold shadow-astral' : 'text-dust hover:text-moonlight'
                    }`}
                  >
                    Odoo & Accounting
                  </button>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setActiveFilter('code');
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeFilter === 'code' ? 'bg-brass text-void font-bold shadow-astral' : 'text-dust hover:text-moonlight'
                    }`}
                  >
                    Code & AI
                  </button>
                </div>
              )}
            </div>

            {/* شريط الإشعار التفاعلي المنتسب للمسار */}
            {activeTrack !== 'all' && (
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl ${currentTrack.accentBg} border ${currentTrack.accentBorder} text-xs font-mono animate-in fade-in duration-300`}
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-void/80 border border-ink">
                    {currentTrack.iconName === 'Scale' && <Scale className="w-4 h-4 text-emerald-400" />}
                    {currentTrack.iconName === 'BarChart3' && <BarChart3 className="w-4 h-4 text-sky-400" />}
                    {currentTrack.iconName === 'Code2' && <Code2 className="w-4 h-4 text-purple-400" />}
                  </span>
                  <span className="text-moonlight leading-snug">
                    {certViewScope === 'track_only' ? (
                      lang === 'ar' ? (
                        <>
                          تم ربط وتصفية الشهادات تلقائياً لعرض{' '}
                          <strong className="text-brass font-bold">{currentTrack.trackCertIndices.length} شهادات معتمدة</strong>{' '}
                          منتسبة مباشرة لمسار {currentTrack.tabLabel_ar}.
                        </>
                      ) : (
                        <>
                          Showing{' '}
                          <strong className="text-brass font-bold">{currentTrack.trackCertIndices.length} verified credentials</strong>{' '}
                          directly affiliated with {currentTrack.tabLabel_en}.
                        </>
                      )
                    ) : (
                      lang === 'ar' ? (
                        <>
                          يتم عرض كافة الشهادات الـ 10 مع إبراز الاعتمادات التابعة لمسار {currentTrack.tabLabel_ar}.
                        </>
                      ) : (
                        <>
                          Viewing all 10 credentials with credentials affiliated with {currentTrack.tabLabel_en} highlighted.
                        </>
                      )
                    )}
                  </span>
                </div>

                {certViewScope === 'all' && (
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setCertViewScope('track_only');
                    }}
                    className="text-[11px] text-brass hover:underline flex items-center gap-1 self-end sm:self-auto font-bold"
                  >
                    <span>{t('العودة لشهادات المسار فقط', 'Back to track certs only')}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* شبكة كروت الشهادات مع تأثير 3D Tilt وإمكانية الفحص التفصيلي */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedCerts.map((cert) => {
              const isTrackAffiliated = currentTrack.trackCertIndices.includes(cert.originalIndex);
              return (
                <TiltCard
                  key={cert.originalIndex}
                  onClick={() => {
                    soundFX.playChime();
                    setSelectedCert(cert);
                  }}
                  className={`p-5 rounded-2xl bg-deep/70 border transition-all flex flex-col justify-between space-y-4 group cursor-pointer ${
                    isTrackAffiliated
                      ? `${currentTrack.accentBorder} shadow-[0_0_20px_rgba(201,162,39,0.12)]`
                      : 'border-ink/80 opacity-75 hover:opacity-100 hover:border-brass/40'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1.5">
                        <h4 className="text-sm sm:text-base font-bold font-display text-moonlight group-hover:text-brass transition-colors flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>{lang === 'ar' ? cert.title_ar : cert.title_en}</span>
                        </h4>

                        {/* شارة الانتساب التخصصي للشهادة */}
                        {isTrackAffiliated ? (
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${currentTrack.accentBg} ${currentTrack.accentBorder} border text-moonlight`}
                          >
                            {currentTrack.iconName === 'Scale' && <Scale className="w-3 h-3 text-emerald-400" />}
                            {currentTrack.iconName === 'BarChart3' && <BarChart3 className="w-3 h-3 text-sky-400" />}
                            {currentTrack.iconName === 'Code2' && <Code2 className="w-3 h-3 text-purple-400" />}
                            {currentTrack.iconName === 'Sparkles' && <Sparkles className="w-3 h-3 text-brass" />}
                            <span>{lang === 'ar' ? currentTrack.certBadgeText_ar : currentTrack.certBadgeText_en}</span>
                          </span>
                        ) : (
                          <span className="inline-block text-[10px] font-mono text-dust bg-void px-2 py-0.5 rounded-full border border-ink">
                            {t('اعتماد إضافي شامل', 'Supplementary Profile Credential')}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-void border border-ink text-dust flex-shrink-0">
                        {cert.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-dust">
                      <span>{lang === 'ar' ? cert.issuer_ar : cert.issuer_en}</span>
                      {cert.hours && (
                        <span className="px-2 py-0.5 rounded-full bg-brass/15 text-brass border border-brass/30 text-[10px] font-bold">
                          {cert.hours}
                        </span>
                      )}
                    </div>

                    <ul className="text-xs text-dust/90 space-y-1 pt-1 list-disc list-inside">
                      {(lang === 'ar' ? cert.points_ar : cert.points_en).slice(0, 2).map((pt, pIdx) => (
                        <li key={pIdx} className="leading-relaxed line-clamp-2">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* المهارات ورقم التوثيق (Credential ID) */}
                  <div className="pt-3 border-t border-ink/60 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skills.slice(0, 4).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-void border border-ink text-dust"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-dust/70 pt-1">
                      {cert.credentialId ? (
                        <>
                          <span className="truncate">
                            ID: <code className="text-moonlight font-bold">{cert.credentialId}</code>
                          </span>
                          <button
                            onClick={(e) => handleCopy(cert.credentialId!, `cert_${cert.originalIndex}`, e)}
                            className="inline-flex items-center gap-1 text-brass hover:text-brass-light transition-colors text-[10px] flex-shrink-0 ms-2"
                          >
                            {copiedId === `cert_${cert.originalIndex}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">{t('تم النسخ', 'Copied')}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>{t('نسخ المعرف', 'Copy ID')}</span>
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-dust/50 flex items-center gap-1">
                          <Scan className="w-3 h-3 text-brass" />
                          <span>{t('انقر للمعاينة الكاملة', 'Click for details')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </section>

        {/* 8. الخبرات القيادية والأنشطة (Leadership & Extracurricular) */}
        <section id="leadership" className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-brass uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-brass" />
            <h3 className="font-bold">
              {t('الخبرات القيادية والأنشطة (Leadership & Extracurricular)', 'Leadership & Extracurricular Experience')}
            </h3>
          </div>

          <div className="space-y-4">
            {(cvData.leadership || resumeData.leadership).map((item, lIdx) => (
              <TiltCard
                key={lIdx}
                className="p-6 rounded-3xl bg-deep/80 border border-ink/80 space-y-3 relative overflow-hidden backdrop-blur-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-ink/60 pb-3">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold font-display text-moonlight flex items-center gap-2">
                      <Zap className="w-4 h-4 text-brass" />
                      <span>{lang === 'ar' ? item.role_ar : item.role_en}</span>
                    </h4>
                    <p className="text-xs font-mono text-brass">
                      {lang === 'ar' ? item.organization_ar : item.organization_en}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-dust bg-void px-3 py-1 rounded-full border border-ink self-start sm:self-auto">
                    {item.period}
                  </span>
                </div>

                <ul className="text-xs sm:text-sm text-dust/90 space-y-2 list-disc list-inside">
                  {(lang === 'ar' ? item.points_ar : item.points_en).map((pt, pIdx) => (
                    <li key={pIdx} className="leading-relaxed">
                      {pt}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* 9. مصفوفة المهارات الاحترافية مع أشرطة التقدم المتحركة */}
        <section id="skills" className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-brass uppercase tracking-wider">
            <Layers className="w-4 h-4 text-brass" />
            <h3 className="font-bold">
              {t('المهارات التقنية والمهنية (Skills Matrix)', 'Technical & Professional Skills Matrix')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayedSkills.map((cat, catIdx) => (
              <TiltCard
                key={catIdx}
                className="p-6 rounded-3xl bg-deep/80 border border-ink/80 space-y-4 backdrop-blur-md"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-moonlight font-bold border-b border-ink/60 pb-3">
                  {cat.iconName === 'BarChart3' && <BarChart3 className="w-4 h-4 text-emerald-400" />}
                  {cat.iconName === 'Scale' && <Scale className="w-4 h-4 text-amber-400" />}
                  {cat.iconName === 'Code2' && <Code2 className="w-4 h-4 text-sky-400" />}
                  {cat.iconName === 'Sparkles' && <Sparkles className="w-4 h-4 text-brass" />}
                  <span>{lang === 'ar' ? cat.category_ar : cat.category_en}</span>
                </div>

                <div className="space-y-3.5">
                  {cat.skills.map((sk) => (
                    <AnimatedSkillBar
                      key={sk.name}
                      name={sk.name}
                      level={sk.level}
                      highlight={sk.highlight}
                    />
                  ))}
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* 10. بطاقة الدعوة للعمل والتحميل النهائي مع تأثير النجوم */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-deep via-void to-deep border border-brass/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-brass/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 max-w-xl mx-auto relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-moonlight glow-text">
              {t('هل ترغب في نسخة PDF الرسمية المطبوعة؟', 'Need the Verified Official PDF Resume?')}
            </h3>
            <p className="text-xs sm:text-sm text-dust font-sans leading-relaxed">
              {t(
                'يمكنك تحميل الملف الأصلي المعتمد بضغطة زر واحدة أو مشاركته مع مسؤولي التوظيف والشركاء.',
                'Download the official single-source PDF resume directly or share it with recruiters and technical leads.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 relative z-10">
            <button
              onClick={(e) => handleDownload(e)}
              disabled={downloading}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brass text-void font-bold text-sm font-mono hover:bg-brass-light active:scale-95 transition-all shadow-[0_0_30px_rgba(201,162,39,0.5)] disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? t('جاري التنزيل...', 'Downloading...') : t('تحميل السيرة الذاتية (PDF)', 'Download Official Resume')}</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                onBackToSite();
              }}
              className="px-6 py-3.5 rounded-xl bg-void/80 border border-ink text-xs font-mono text-dust hover:text-moonlight hover:border-brass/40 transition-colors"
            >
              {t('العودة لمعرض الأعمال والموقع', 'Back to Projects & Portfolio')}
            </button>
          </div>
        </div>
      </main>

      {/* 11. المودال الهولوجرافي لفحص تفاصيل الشهادة المعتمدة (Holographic Inspector Modal) */}
      {selectedCert && (
        <div
          onClick={() => setSelectedCert(null)}
          className="fixed inset-0 z-50 bg-void/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-3xl bg-deep border border-brass/40 p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(201,162,39,0.25)] relative animate-in zoom-in-95 duration-200"
          >
            {/* شريط الإغلاق */}
            <div className="flex items-start justify-between gap-3 border-b border-ink/60 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-brass flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? selectedCert.issuer_ar : selectedCert.issuer_en}</span>
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-display text-moonlight">
                  {lang === 'ar' ? selectedCert.title_ar : selectedCert.title_en}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-xl bg-void border border-ink text-dust hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* تفاصيل الشهادة والنقاط */}
            <div className="space-y-3 text-xs sm:text-sm text-dust/90">
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-void border border-ink text-dust">
                  {selectedCert.date}
                </span>
                {selectedCert.hours && (
                  <span className="px-2.5 py-1 rounded bg-brass/15 text-brass border border-brass/30 font-bold">
                    {selectedCert.hours}
                  </span>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono text-brass block font-bold">
                  {t('المخرجات والكفاءات المكتسبة:', 'Key Competencies & Outcomes:')}
                </span>
                <ul className="space-y-2">
                  {(lang === 'ar' ? selectedCert.points_ar : selectedCert.points_en).map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* المهارات التابعة */}
              <div className="pt-2">
                <span className="text-xs font-mono text-dust/80 block mb-2">{t('المهارات:', 'Skills:')}</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCert.skills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-void border border-ink text-moonlight"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* المسارات التخصصية المنتسبة إليها الشهادة */}
              <div className="pt-2 space-y-1.5 border-t border-ink/50">
                <span className="text-xs font-mono text-brass block font-bold">
                  {t('المسارات التخصصية المعتمدة لهذه الشهادة:', 'Accredited CV Tracks for this Credential:')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {resumeTracks.accountant.trackCertIndices.includes(selectedCert.originalIndex) && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                      <Scale className="w-3.5 h-3.5" />
                      <span>{t('مسار المحاسبة & ERP', 'Accountant & ERP Track')}</span>
                    </span>
                  )}
                  {resumeTracks.data_analyst.trackCertIndices.includes(selectedCert.originalIndex) && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold">
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>{t('مسار تحليل البيانات & BI', 'Data & BI Analyst Track')}</span>
                    </span>
                  )}
                  {resumeTracks.fullstack.trackCertIndices.includes(selectedCert.originalIndex) && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{t('مسار هندسة البرمجيات Full-Stack', 'Full-Stack Software Track')}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brass/10 border border-brass/30 text-brass text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('النسخة الأساسية الشاملة', 'Master Profile')}</span>
                  </span>
                </div>
              </div>

              {/* كود التوثيق الرسمي إن وجد */}
              {selectedCert.credentialId && (
                <div className="pt-4 border-t border-ink/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-dust/70 block uppercase tracking-wider">
                      {t('معرف الاعتماد الرسمي (Credential ID)', 'Official Credential ID')}
                    </span>
                    <code className="text-sm font-mono text-brass font-bold">{selectedCert.credentialId}</code>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedCert.credentialId!, 'modal_id')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brass/15 border border-brass/40 text-brass text-xs font-mono hover:bg-brass/25 transition-all"
                  >
                    {copiedId === 'modal_id' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{t('تم النسخ', 'Copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t('نسخ المعرف', 'Copy ID')}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 12. شريط التنقل السفلي العائم السريع (Floating Quick-Nav Dock) */}
      <nav className="fixed bottom-5 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-deep/95 border border-brass/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <button
            onClick={() => scrollToAnchor('profile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              activeNav === 'profile' ? 'bg-brass text-void font-bold shadow-astral' : 'text-dust hover:text-moonlight'
            }`}
          >
            {t('البيانات', 'Bio')}
          </button>
          <button
            onClick={() => scrollToAnchor('education')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              activeNav === 'education' ? 'bg-brass text-void font-bold shadow-astral' : 'text-dust hover:text-moonlight'
            }`}
          >
            {t('التعليم', 'Education')}
          </button>
          <button
            onClick={() => scrollToAnchor('certifications')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              activeNav === 'certifications' ? 'bg-brass text-void font-bold shadow-astral' : 'text-dust hover:text-moonlight'
            }`}
          >
            {t('الشهادات', 'Certs')}
          </button>
          <button
            onClick={() => scrollToAnchor('skills')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              activeNav === 'skills' ? 'bg-brass text-void font-bold shadow-astral' : 'text-dust hover:text-moonlight'
            }`}
          >
            {t('المهارات', 'Skills')}
          </button>
          <span className="w-px h-4 bg-ink mx-1 hidden sm:block" />
          <button
            onClick={(e) => handleDownload(e)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brass/20 text-brass hover:bg-brass hover:text-void border border-brass/40 text-xs font-mono font-bold transition-all shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('تحميل PDF', 'Download')}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
