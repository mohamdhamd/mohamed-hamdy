// استوديو المعاينة التفاعلية لمشاريع الـ Full-Stack وتطبيقات الويب
import React, { useState } from 'react';
import { Project } from '../../types';
import { getFullStackData } from '../../utils/projectDomains';
import { useLanguage } from '../../context/LanguageContext';
import { soundFX } from '../../utils/audio';
import {
  Monitor,
  Smartphone,
  RotateCw,
  Lock,
  ExternalLink,
  Layers,
  Server,
  Database,
  Cpu,
  Send,
  CheckCircle2,
  Zap,
  Gauge,
  ArrowRight,
  Code2,
} from 'lucide-react';

interface FullStackProjectViewProps {
  project: Project;
}

export const FullStackProjectView: React.FC<FullStackProjectViewProps> = ({ project }) => {
  const { lang, t } = useLanguage();
  const meta = getFullStackData(project);

  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedTier, setSelectedTier] = useState<'frontend' | 'backend' | 'database' | 'devops'>('frontend');
  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);
  const [apiSending, setApiSending] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(
    meta.apiEndpoints?.[0]?.mockResponse || { status: 'healthy', latency: '22ms' }
  );

  const activeEndpoint = meta.apiEndpoints?.[activeEndpointIndex] || meta.apiEndpoints?.[0];

  const handleSendApi = () => {
    soundFX.playClick();
    setApiSending(true);
    setTimeout(() => {
      soundFX.playChime();
      setApiSending(false);
      setApiResponse(activeEndpoint?.mockResponse || { status: 'ok', timestamp: new Date().toISOString() });
    }, 450);
  };

  const projectUrl = project.live_url || `https://${project.id}.app.cloud`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. رأس استوديو الـ Full-Stack وأدوات التحكم في المتصفح */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-ink/40 border border-ink/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brass/15 text-brass">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold font-display text-moonlight">
              {t('استوديو المعاينة الحية والمعمارية السحابية', 'Cloud App & Architecture Viewport')}
            </h4>
            <p className="text-[11px] text-dust">
              {t('محاكاة بيئة الإنتاج الحقيقية وتجاوب الأجهزة', 'Live production shell & multi-device simulation')}
            </p>
          </div>
        </div>

        {/* أزرار التبديل بين الديسكتوب والموبايل */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-void/80 border border-ink">
          <button
            onClick={() => {
              soundFX.playClick();
              setDeviceMode('desktop');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              deviceMode === 'desktop'
                ? 'bg-brass text-void font-bold shadow-astral'
                : 'text-dust hover:text-moonlight'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>{t('شاشة كمبيوتر', 'Desktop')}</span>
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setDeviceMode('mobile');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              deviceMode === 'mobile'
                ? 'bg-brass text-void font-bold shadow-astral'
                : 'text-dust hover:text-moonlight'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t('هاتف ذكي', 'Mobile')}</span>
          </button>
        </div>
      </div>

      {/* 2. شل نافذة المتصفح التفاعلي (Interactive Browser Shell) */}
      <div className="rounded-2xl border border-ink bg-void overflow-hidden shadow-2xl transition-all">
        {/* شريط أدوات المتصفح (Browser Titlebar & Address Bar) */}
        <div className="px-4 py-2.5 bg-deep border-b border-ink/80 flex items-center justify-between gap-3">
          {/* أزرار macOS للتحكم في النافذة */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          {/* شريط العنوان الآمن */}
          <div className="flex-1 max-w-lg mx-auto flex items-center gap-2 px-3 py-1 rounded-lg bg-void/90 border border-ink text-xs font-mono text-dust">
            <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span className="truncate text-moonlight select-all">{projectUrl}</span>
            <span className="ms-auto text-[10px] text-emerald-400 font-bold uppercase tracking-wider hidden sm:inline">
              HTTPS / TLS 1.3
            </span>
          </div>

          {/* أزرار التحديث والفتح المباشر */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => soundFX.playClick()}
              title={t('إعادة تحميل المعاينة', 'Reload Preview')}
              className="p-1.5 rounded-md text-dust hover:text-brass hover:bg-ink/50 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                title={t('فتح الرابط المباشر في علامة تبويب جديدة', 'Open Live URL')}
                className="p-1.5 rounded-md text-dust hover:text-brass hover:bg-ink/50 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* جسم المعاينة (Viewport Container) */}
        <div className="p-4 sm:p-6 bg-void/60 flex items-center justify-center min-h-[300px] overflow-hidden">
          {deviceMode === 'desktop' ? (
            /* محاكاة الديسكتوب */
            <div className="w-full rounded-xl overflow-hidden border border-ink/80 shadow-2xl relative group">
              <img
                src={project.cover}
                alt={project.title_en}
                className="w-full max-h-[360px] object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/30 to-transparent p-6 flex flex-col justify-end">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-brass text-void inline-block">
                    {lang === 'ar' ? project.title_ar : project.title_en}
                  </span>
                  <p className="text-xs text-moonlight line-clamp-2">
                    {lang === 'ar' ? project.summary_ar : project.summary_en}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* محاكاة الهاتف الذكي iPhone Frame */
            <div className="w-[280px] h-[460px] rounded-[36px] border-[5px] border-ink bg-deep p-2 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden">
              {/* Dynamic Island / Notch */}
              <div className="w-20 h-4 bg-void rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-brass/40" />
              </div>
              <div className="flex-1 rounded-[24px] overflow-hidden relative border border-ink">
                <img
                  src={project.cover}
                  alt={project.title_en}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-transparent to-transparent p-3 flex flex-col justify-end">
                  <span className="text-[10px] font-mono text-brass font-bold">
                    {lang === 'ar' ? 'تصميم متجاوب 100%' : '100% Mobile Ready'}
                  </span>
                  <span className="text-[11px] font-bold text-moonlight truncate">
                    {lang === 'ar' ? project.title_ar : project.title_en}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. مستكشف معمارية الطبقات الأربعة (System Architecture Inspector) */}
      <div className="rounded-2xl border border-ink bg-deep/70 p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-brass">
            <Layers className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">
              {t('معمارية النظام والطبقات البرمجية (Full-Stack Tiers):', 'System Architecture Tiers:')}
            </span>
          </div>
          <span className="text-[11px] font-mono text-dust/70">N-Tier Decoupled Architecture</span>
        </div>

        {/* أزرار الطبقات الأربعة */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'frontend', labelAr: 'الواجهة (Client)', labelEn: 'Frontend Tier', icon: Monitor },
            { id: 'backend', labelAr: 'الخادم (REST API)', labelEn: 'Backend Tier', icon: Server },
            { id: 'database', labelAr: 'قاعدة البيانات', labelEn: 'Database Tier', icon: Database },
            { id: 'devops', labelAr: 'السحابة والنشر', labelEn: 'DevOps & Cloud', icon: Cpu },
          ].map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedTier === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedTier(tier.id as any);
                }}
                className={`p-3 rounded-xl border text-start transition-all flex flex-col gap-2 ${
                  isSelected
                    ? 'border-brass bg-brass/10 text-brass shadow-[0_0_15px_rgba(201,162,39,0.2)]'
                    : 'border-ink bg-void/60 text-dust hover:text-moonlight hover:border-ink/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-4 h-4" />
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-brass animate-ping" />}
                </div>
                <div>
                  <span className="block text-xs font-bold font-display">
                    {lang === 'ar' ? tier.labelAr : tier.labelEn}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* محتويات وتفاصيل الطبقة المحددة */}
        <div className="p-4 rounded-xl bg-void/80 border border-ink font-mono text-xs text-dust space-y-2">
          <div className="flex items-center gap-2 text-moonlight font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {selectedTier === 'frontend' && t('تقنيات ومكتبات واجهة المستخدم التفاعلية:', 'Frontend Stack & UI State:')}
              {selectedTier === 'backend' && t('هندسة الخادم والمسارات وحماية الجلسات:', 'Backend Engineering & Routing:')}
              {selectedTier === 'database' && t('نماذج التخزين والمعاملات المتزامنة:', 'Database Modeling & Indexing:')}
              {selectedTier === 'devops' && t('أدوات النشر والأمان والمراقبة السحابية:', 'DevOps, Containers & Security:')}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {(meta.architecture?.[selectedTier] || []).map((tName) => (
              <span
                key={tName}
                className="px-2.5 py-1 rounded-md bg-deep border border-ink text-moonlight text-xs font-mono"
              >
                {tName}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
