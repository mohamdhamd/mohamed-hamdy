// الفوتر النهائي العصري مع زر الوصول للوحة التحكم وحسابات التواصل والريسبونسف الكامل
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Code2, Lock, Linkedin, Youtube, Facebook, Github } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenCV?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenCV }) => {
  const { t, lang } = useLanguage();
  const { settings } = useData();
  const currentYear = new Date().getFullYear();
  const displayedName =
    lang === 'ar' ? settings.hero_name_ar || 'محمد حمدي' : settings.hero_name_en || 'Mohamed Hamdy';

  return (
    <footer className="py-8 sm:py-12 border-t border-ink/80 bg-void/95 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 text-xs sm:text-sm font-sans text-dust text-center md:text-start">
        {/* العبارة التقديرية البرمجية */}
        <div className="flex items-center justify-center gap-2 font-mono text-xs text-dust/90 order-1 md:order-none">
          <Code2 className="w-4 h-4 text-brass shrink-0" />
          <span>
            {t('تم التصميم والبرمجة بدقة وشغف', 'Designed & Engineered with Passion')}
          </span>
        </div>

        {/* أيقونات التواصل الاجتماعي */}
        <div className="flex items-center justify-center gap-2 order-2 md:order-none">
          <a
            href={settings.linkedin_url || 'https://www.linkedin.com/in/mohamed-hamdey/'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dust hover:text-brass transition-all p-2 rounded-xl bg-deep/40 hover:bg-deep border border-ink/60 hover:border-brass/30 hover:scale-105 active:scale-95"
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={settings.youtube_url || 'https://www.youtube.com/@coding-keys'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dust hover:text-red-400 transition-all p-2 rounded-xl bg-deep/40 hover:bg-deep border border-ink/60 hover:border-red-400/30 hover:scale-105 active:scale-95"
            title="YouTube"
            aria-label="YouTube"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href={settings.facebook_url || 'https://www.facebook.com/m0hamedhamdy1/?locale=ar_AR'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dust hover:text-sky-400 transition-all p-2 rounded-xl bg-deep/40 hover:bg-deep border border-ink/60 hover:border-sky-400/30 hover:scale-105 active:scale-95"
            title="Facebook"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href={settings.github_url || 'https://github.com/mohamdhamd'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dust hover:text-moonlight transition-all p-2 rounded-xl bg-deep/40 hover:bg-deep border border-ink/60 hover:border-moonlight/30 hover:scale-105 active:scale-95"
            title="GitHub"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

        {/* حقوق النشر والروابط السريعة */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-dust/80 order-3 md:order-none">
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span>© {currentYear}</span>
            <span className="text-moonlight font-bold font-display text-xs sm:text-sm">
              {displayedName}
            </span>
            <span className="text-dust/40">·</span>
            <span>{t('جميع الحقوق محفوظة', 'All rights reserved')}</span>
          </div>

          {(onOpenCV || onOpenAdmin) && (
            <div className="flex items-center gap-2 justify-center">
              <span className="hidden sm:inline text-dust/40">·</span>

              {onOpenCV && (
                <button
                  onClick={onOpenCV}
                  className="text-brass hover:underline underline-offset-4 transition-colors font-medium px-2 py-0.5 rounded-lg hover:bg-brass/10"
                >
                  {t('السيرة الذاتية (CV)', 'Resume (CV)')}
                </button>
              )}

              {onOpenCV && onOpenAdmin && (
                <span className="text-dust/40">·</span>
              )}

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="text-dust/40 hover:text-brass transition-colors p-1.5 rounded-lg hover:bg-deep border border-transparent hover:border-ink/60"
                  title={t('لوحة الإدارة', 'Admin Dashboard')}
                  aria-label="Admin Dashboard"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
