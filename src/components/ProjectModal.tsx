// نافذة تفاصيل المشروع التفاعلية مع الاستوديو المخصص لكل مجال (Full-Stack · Data Analysis · Accounting)
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Project } from '../types';
import { getProjectDomain } from '../utils/projectDomains';
import { useLanguage } from '../context/LanguageContext';
import { soundFX } from '../utils/audio';
import { FullStackProjectView } from './project-views/FullStackProjectView';
import { DataAnalysisProjectView } from './project-views/DataAnalysisProjectView';
import { AccountingProjectView } from './project-views/AccountingProjectView';
import {
  X,
  ExternalLink,
  Github,
  Layers,
  Code2,
  Eye,
  Copy,
  Check,
  Sparkles,
  Monitor,
  BarChart3,
  Scale,
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'studio' | 'overview' | 'code'>('studio');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      setActiveTab('studio');
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const domain = getProjectDomain(project);

  const handleCopyCode = () => {
    if (project.code_snippet) {
      navigator.clipboard.writeText(project.code_snippet);
      soundFX.playClick();
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // تسمية التبويب التفاعلي وفقاً لمجال المشروع
  const getStudioTabInfo = () => {
    switch (domain) {
      case 'data_analysis':
        return {
          icon: BarChart3,
          labelAr: 'استوديو البيانات والـ BI',
          labelEn: 'Data & BI Studio',
          tagAr: 'تحليل بيانات وذكاء أعمال',
          tagEn: 'Data Analysis & BI',
        };
      case 'accounting':
        return {
          icon: Scale,
          labelAr: 'منظومة المحاسبة و CVP',
          labelEn: 'CMA Accounting & CVP',
          tagAr: 'هندسة مالية ومحاسبة CMA',
          tagEn: 'CMA Financial Engineering',
        };
      default:
        return {
          icon: Monitor,
          labelAr: 'معاينة الموقع والـ Full-Stack',
          labelEn: 'Full-Stack & App Studio',
          tagAr: 'تطبيق ويب و Full-Stack',
          tagEn: 'Full-Stack Application',
        };
    }
  };

  const studioInfo = getStudioTabInfo();
  const StudioIcon = studioInfo.icon;

  return createPortal(
    <div
      className="fixed inset-0 z-[10050] flex items-center justify-center p-3 sm:p-6 bg-void/85 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-deep/95 border border-brass/40 p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-6 text-moonlight scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* زر الإغلاق الدائري */}
        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          aria-label={t('إغلاق النافذة', 'Close modal')}
          className="absolute top-4 end-4 p-2 rounded-full bg-ink/50 hover:bg-brass/20 text-dust hover:text-brass transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ترويسة تفاصيل المشروع مع الوسام التخصصي */}
        <div className="flex flex-wrap items-center justify-between gap-2 pe-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-brass/15 text-brass border border-brass/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(201,162,39,0.2)]">
              <StudioIcon className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? studioInfo.tagAr : studioInfo.tagEn}</span>
            </span>
            {project.featured && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-bold">
                {t('مشروع مميز ★', 'Featured ★')}
              </span>
            )}
          </div>
        </div>

        {/* عنوان المشروع ووصفه المختصر */}
        <div className="space-y-1">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-moonlight">
            {lang === 'ar' ? project.title_ar : project.title_en}
          </h2>
          <p className="text-xs sm:text-sm text-dust font-sans">
            {lang === 'ar' ? project.summary_ar : project.summary_en}
          </p>
        </div>

        {/* شريط التبويبات الثلاثة: الاستوديو التفاعلي · النظرة العامة · الكود المصدري */}
        <div className="flex items-center gap-2 border-b border-ink/80 pb-3 overflow-x-auto no-scrollbar">
          {/* تبويب الاستوديو التفاعلي (المجال) */}
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('studio');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-sans font-medium whitespace-nowrap transition-all ${
              activeTab === 'studio'
                ? 'bg-brass text-void font-bold shadow-astral'
                : 'text-dust hover:text-moonlight hover:bg-ink/50'
            }`}
          >
            <StudioIcon className="w-4 h-4" />
            <span>{lang === 'ar' ? studioInfo.labelAr : studioInfo.labelEn}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-void animate-pulse hidden sm:inline-block" />
          </button>

          {/* تبويب النظرة العامة والوصف */}
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('overview');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-sans font-medium whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-brass text-void font-bold shadow-astral'
                : 'text-dust hover:text-moonlight hover:bg-ink/50'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{t('نظرة عامة والوصف الكامل', 'Overview & Story')}</span>
          </button>

          {/* تبويب الكود والمعمارية */}
          {project.code_snippet && (
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('code');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-sans font-medium whitespace-nowrap transition-all ${
                activeTab === 'code'
                  ? 'bg-brass text-void font-bold shadow-astral'
                  : 'text-dust hover:text-moonlight hover:bg-ink/50'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>{t('الكود والمعمارية', 'Code & Architecture')}</span>
            </button>
          )}
        </div>

        {/* 1. محتوى الاستوديو التفاعلي المخصص لكل مجال */}
        {activeTab === 'studio' && (
          <div className="pt-1">
            {domain === 'fullstack' && <FullStackProjectView project={project} />}
            {domain === 'data_analysis' && <DataAnalysisProjectView project={project} />}
            {domain === 'accounting' && <AccountingProjectView project={project} />}
          </div>
        )}

        {/* 2. محتوى تبويب النظرة العامة والقصة */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* صورة الغلاف */}
            <div className="w-full h-56 sm:h-72 rounded-xl overflow-hidden relative border border-ink shadow-inner">
              <img
                src={project.cover}
                alt={lang === 'ar' ? project.title_ar : project.title_en}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-3 start-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-void/90 border border-brass/40 text-brass">
                  {lang === 'ar' ? project.category_label_ar : project.category_label_en}
                </span>
              </div>
            </div>

            {/* الوصف المعمق للمشروع */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-dust uppercase tracking-wider">
                {t('عن المشروع ودوافعه الهندسية:', 'Project Background & Purpose:')}
              </h4>
              <p className="text-sm sm:text-base text-moonlight/90 leading-relaxed font-sans">
                {lang === 'ar' ? project.body_ar : project.body_en}
              </p>
            </div>

            {/* التقنيات والمكتبات المستخدمة */}
            <div className="space-y-2 pt-3 border-t border-ink">
              <div className="flex items-center gap-2 text-xs font-mono text-dust">
                <Layers className="w-4 h-4 text-brass" />
                <span>{t('التقنيات والمكتبات المستخدمة:', 'Technologies & Libraries:')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-ink/40 text-moonlight border border-ink hover:border-brass/40 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. محتوى تبويب الكود والمعمارية */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-dust">
                {t('مقتطف معماري من دالة المعالجة الأساسية:', 'Core Architectural Snippet:')}
              </span>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink/60 hover:bg-ink text-xs font-mono text-brass transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? t('تم النسخ!', 'Copied!') : t('نسخ الكود', 'Copy Code')}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-void border border-ink overflow-x-auto font-mono text-xs sm:text-sm text-emerald-300 leading-relaxed shadow-inner max-h-[380px] scrollbar-thin">
              <pre>{project.code_snippet}</pre>
            </div>
          </div>
        )}

        {/* أزرار الروابط السفلية والإغلاق */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-ink/80">
          <div className="flex items-center gap-2">
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink/60 hover:bg-ink text-moonlight hover:text-brass text-xs font-mono transition-all border border-ink"
              >
                <Github className="w-4 h-4" />
                <span>{t('المستودع البرمجي', 'Source Code')}</span>
              </a>
            )}

            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brass text-void font-bold text-xs font-mono hover:bg-brass-light transition-all shadow-astral"
              >
                <span>{t('زيارة المشروع المباشر', 'Visit Live Project')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl border border-ink text-dust hover:text-moonlight text-xs font-mono transition-colors ms-auto"
          >
            {t('إغلاق', 'Close')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
