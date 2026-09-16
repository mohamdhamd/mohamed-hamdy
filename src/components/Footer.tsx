// الفوتر النهائي العصري مع زر الوصول للوحة التحكم
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Code2, Lock } from 'lucide-react';

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
    <footer className="py-12 border-t border-ink bg-void/95 relative z-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs sm:text-sm font-sans text-dust">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-brass" />
          <span>
            {t('تم التصميم والبرمجة بدقة وشغف', 'Designed & Engineered with Passion')}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-dust/80">
          <span>© {currentYear}</span>
          <span className="text-moonlight font-bold font-display text-sm">
            {displayedName}
          </span>
          <span>·</span>
          <span>{t('جميع الحقوق محفوظة', 'All rights reserved')}</span>

          {onOpenCV && (
            <>
              <span>·</span>
              <button
                onClick={onOpenCV}
                className="text-brass hover:underline underline-offset-4 transition-colors font-medium"
              >
                {t('السيرة الذاتية (CV)', 'Resume (CV)')}
              </button>
            </>
          )}

          {onOpenAdmin && (
            <>
              <span>·</span>
              <button
                onClick={onOpenAdmin}
                className="text-dust/40 hover:text-brass transition-colors p-1"
                title="لوحة الإدارة (Admin Dashboard)"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};

