// شريط التنقل العلوي مع شريط تقدم التمرير، زر لوحة الأوامر (Ctrl+K)، وزر الصوت
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { soundFX } from '../utils/audio';
import { Menu, X, Code2, Globe, Command, Volume2, VolumeX, FileText } from 'lucide-react';

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onOpenCV?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette, onOpenCV }) => {
  const { lang, toggleLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMuted, setIsMuted] = useState(soundFX.getIsMuted());

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 30);

      // حساب نسبة تقدم التمرير
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress((scrollY / docHeight) * 100);
      }

      const sections = ['about', 'projects', 'certificates', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'about', labelAr: 'عني', labelEn: 'About' },
    { id: 'projects', labelAr: 'المشاريع', labelEn: 'Projects' },
    { id: 'certificates', labelAr: 'المسار المهني', labelEn: 'Credentials' },
    { id: 'contact', labelAr: 'تواصل', labelEn: 'Contact' },
  ];

  const scrollToSection = (id: string) => {
    soundFX.playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleMute = () => {
    const newMuted = soundFX.toggleMute();
    setIsMuted(newMuted);
  };

  const handleLangSwitch = () => {
    soundFX.playBlip(700, 0.08);
    toggleLang();
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-void/85 backdrop-blur-lg border-b border-ink/80 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      {/* شريط تقدم التمرير الفلكي أعلى الشاشة */}
      <div
        className="absolute top-0 start-0 h-[2px] bg-gradient-to-r from-brass via-moonlight to-brass transition-all duration-150 z-50 shadow-astral"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 flex items-center justify-between">
        {/* الشعار والاسم */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            soundFX.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border border-brass/30 flex items-center justify-center bg-deep/80 group-hover:border-brass transition-colors shadow-sm">
            <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brass transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col text-start">
            <span className="font-display text-base sm:text-xl font-bold tracking-tight text-moonlight group-hover:text-brass transition-colors">
              {t('محمد حمدي', 'Mohamed Hamdy')}
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-dust tracking-wider uppercase -mt-0.5">
              {t('مطور برمجيات', 'Web Developer')}
            </span>
          </div>
        </a>

        {/* روابط الديسكتوب */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-sans font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-brass bg-brass/10 border border-brass/30'
                    : 'text-dust hover:text-moonlight hover:bg-deep/50'
                }`}
              >
                {t(link.labelAr, link.labelEn)}
              </button>
            );
          })}

          {onOpenCV && (
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenCV();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-sans font-medium text-brass bg-brass/10 hover:bg-brass/20 border border-brass/30 hover:border-brass/50 transition-all shadow-sm group ms-1"
              title={t('عرض السيرة الذاتية التفاعلية', 'View Interactive CV / Resume')}
            >
              <FileText className="w-3.5 h-3.5 text-brass group-hover:scale-110 transition-transform" />
              <span>{t('السيرة الذاتية (CV)', 'CV / Resume')}</span>
            </button>
          )}
        </nav>

        {/* أدوات التحكم: لوحة الأوامر + الصوت + تبديل اللغة + الموبايل */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* زر لوحة الأوامر (Ctrl + K) */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenCommandPalette();
            }}
            title={t('لوحة الأوامر السريعة (Ctrl + K)', 'Command Palette (Ctrl + K)')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-ink hover:border-brass/40 bg-deep/60 text-xs font-mono text-dust hover:text-moonlight transition-all backdrop-blur-md"
          >
            <Command className="w-3.5 h-3.5 text-brass" />
            <span className="text-[11px] text-dust/80">Ctrl K</span>
          </button>

          {/* زر المؤثرات الصوتية */}
          <button
            onClick={handleToggleMute}
            aria-label={isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
            title={isMuted ? t('تفعيل المؤثرات الصوتية', 'Unmute audio') : t('كتم الصوت', 'Mute audio')}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-ink hover:border-brass/40 bg-deep/60 text-dust hover:text-moonlight transition-all backdrop-blur-md"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-dust/60" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brass" />
            )}
          </button>

          {/* زر تبديل اللغة */}
          <button
            onClick={handleLangSwitch}
            aria-label="تبديل اللغة / Switch Language"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-ink hover:border-brass/40 bg-deep/60 text-xs sm:text-sm font-mono text-moonlight hover:text-brass transition-all backdrop-blur-md"
          >
            <Globe className="w-3.5 h-3.5 text-brass" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* زر قائمة الموبايل */}
          <button
            onClick={() => {
              soundFX.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-dust hover:text-moonlight hover:bg-deep/60 transition-colors"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* قائمة الموبايل المنسدلة */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-deep/95 backdrop-blur-xl border-b border-ink px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCommandPalette();
            }}
            className="flex items-center justify-between w-full text-start px-4 py-3 rounded-xl text-sm font-mono text-brass bg-brass/10 border border-brass/20"
          >
            <span>{t('فتح لوحة الأوامر السريعة', 'Open Command Palette')}</span>
            <span className="text-xs bg-ink px-2 py-0.5 rounded">Ctrl+K</span>
          </button>

          {onOpenCV && (
            <button
              onClick={() => {
                soundFX.playClick();
                setMobileMenuOpen(false);
                onOpenCV();
              }}
              className="flex items-center justify-between w-full text-start px-4 py-3 rounded-xl text-sm font-medium text-brass bg-brass/15 border border-brass/30 hover:bg-brass/25 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brass" />
                <span>{t('السيرة الذاتية التفاعلية (CV)', 'Interactive CV / Resume')}</span>
              </span>
              <span className="text-[10px] font-mono bg-brass/20 text-brass px-2 py-0.5 rounded">PDF + Web</span>
            </button>
          )}

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="block w-full text-start px-4 py-3 rounded-xl text-base font-medium text-moonlight hover:bg-ink/50 hover:text-brass transition-colors"
            >
              {t(link.labelAr, link.labelEn)}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
