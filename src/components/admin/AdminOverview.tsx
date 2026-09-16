// النظرة العامة للوحة التحكم (Admin Overview)
import React, { useEffect } from 'react';
import { Project, Certificate, SiteSettings } from '../../types';
import { useData } from '../../context/DataContext';
import {
  FolderGit2,
  GraduationCap,
  Mail,
  Database,
  Server,
  Sparkles,
  ArrowUpRight,
  Plus,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface AdminOverviewProps {
  projects: Project[];
  certificates: Certificate[];
  settings: SiteSettings;
  backendStatus: { online: boolean; dbConnected: boolean };
  onNavigate: (tab: 'projects' | 'certificates' | 'resume' | 'messages' | 'settings') => void;
  onOpenNewProject: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  projects,
  certificates,
  backendStatus,
  onNavigate,
  onOpenNewProject,
}) => {
  const { messages, unreadCount, refreshMessages } = useData();

  useEffect(() => {
    refreshMessages();
  }, [refreshMessages]);

  const publishedCount = projects.filter((p) => (p.status || 'published') === 'published').length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;

  return (
    <div className="space-y-8">
      {/* بطاقة الترحيب وحالة السيرفر */}
      <div className="bg-deep/80 border border-ink rounded-2xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 end-0 w-80 h-80 bg-brass/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-brass text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>لوحة التحكم الرئيسية · MERN STACK CMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-moonlight mb-2">
              أهلاً بك، محمد حمدي
            </h1>
            <p className="text-sm text-dust max-w-xl">
              من هنا يمكنك إضافة وإدارة مشاريعك، شهاداتك، الرسائل الواردة، وتعديل كل نصوص وإعدادات البورتفوليو فورياً.
            </p>
          </div>

          {/* حالة الاتصال بالخادم وقاعدة البيانات */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-void/70 border border-ink p-3 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Server className="w-4 h-4 text-dust" />
              <span>الخادم (Express):</span>
              {backendStatus.online ? (
                <span className="text-emerald-400 inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> متصل
                </span>
              ) : (
                <span className="text-amber-400 inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> وضع Offline (Fallback)
                </span>
              )}
            </div>

            <div className="hidden sm:block w-px h-4 bg-ink" />

            <div className="flex items-center gap-2 text-xs font-mono">
              <Database className="w-4 h-4 text-dust" />
              <span>MongoDB:</span>
              {backendStatus.dbConnected ? (
                <span className="text-emerald-400 inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> متصلة
                </span>
              ) : (
                <span className="text-amber-400 inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> غير متصلة
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* كروت الإحصائيات السريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* كارت المشاريع */}
        <div
          onClick={() => onNavigate('projects')}
          className="bg-deep/60 border border-ink hover:border-brass/50 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-void border border-ink group-hover:border-brass/30 flex items-center justify-center text-brass transition-colors">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-dust flex items-center gap-1 group-hover:text-brass transition-colors">
              <span>إدارة</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-3xl font-bold font-display text-moonlight mb-1">
            {projects.length}
          </div>
          <div className="text-xs text-dust">
            المشاريع ({publishedCount} منشورة · {draftCount} مسودة)
          </div>
        </div>

        {/* كارت الشهادات والمسار المهني */}
        <div
          onClick={() => onNavigate('certificates')}
          className="bg-deep/60 border border-ink hover:border-brass/50 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-void border border-ink group-hover:border-brass/30 flex items-center justify-center text-brass transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-dust flex items-center gap-1 group-hover:text-brass transition-colors">
              <span>إدارة</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-3xl font-bold font-display text-moonlight mb-1">
            {certificates.length}
          </div>
          <div className="text-xs text-dust">الشهادات والمحطات المهنية</div>
        </div>

        {/* كارت صندوق الرسائل الواردة */}
        <div
          onClick={() => onNavigate('messages')}
          className="bg-deep/60 border border-ink hover:border-brass/50 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-void border border-ink group-hover:border-brass/30 flex items-center justify-center text-brass transition-colors relative">
              <Mail className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-brass animate-ping" />
              )}
            </div>
            <span className="text-xs font-mono text-dust flex items-center gap-1 group-hover:text-brass transition-colors">
              <span>عرض الرسائل</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold font-display text-moonlight">
              {messages.length}
            </span>
            {unreadCount > 0 ? (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-brass/15 border border-brass/40 text-brass font-bold animate-pulse">
                {unreadCount} جديدة
              </span>
            ) : (
              <span className="text-[11px] font-mono text-emerald-400">
                (مقروءة بالكامل)
              </span>
            )}
          </div>
          <div className="text-xs text-dust">
            صندوق الرسائل الواردة من زوار الموقع
          </div>
        </div>

        {/* كارت إعدادات الموقع */}
        <div
          onClick={() => onNavigate('settings')}
          className="bg-deep/60 border border-ink hover:border-brass/50 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-void border border-ink group-hover:border-brass/30 flex items-center justify-center text-brass transition-colors">
              <Sliders className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-dust flex items-center gap-1 group-hover:text-brass transition-colors">
              <span>تعديل</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-lg font-bold font-display text-moonlight mb-1">
            إعدادات المحتوى
          </div>
          <div className="text-xs text-dust">تخصيص الاسم، الروابط، ونصوص الـ Hero</div>
        </div>
      </div>

      {/* إجراءات سريعة وآخر الرسائل */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* إجراءات سريعة */}
        <div className="lg:col-span-1 bg-deep/50 border border-ink rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-dust uppercase tracking-wider flex items-center gap-2">
            <span>إجراءات سريعة</span>
          </h2>

          <div className="space-y-2.5">
            <button
              onClick={onOpenNewProject}
              className="w-full p-3 rounded-lg bg-brass text-void font-bold text-xs flex items-center justify-center gap-2 hover:bg-brass/90 active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(201,162,39,0.2)]"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مشروع جديد الآن</span>
            </button>

            <button
              onClick={() => onNavigate('resume')}
              className="w-full p-3 rounded-lg bg-void border border-ink hover:border-brass/40 text-moonlight text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-brass" />
              <span>تعديل السيرة الذاتية (CV) ومساراتها</span>
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className="w-full p-3 rounded-lg bg-void border border-ink hover:border-brass/40 text-moonlight text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Sliders className="w-4 h-4 text-brass" />
              <span>تعديل نصوص الصفحة الرئيسية</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="w-full p-3 rounded-lg bg-void border border-ink hover:border-brass/40 text-dust hover:text-moonlight text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4 text-brass" />
              <span>معاينة الموقع العام في تبويب جديد</span>
            </a>
          </div>
        </div>

        {/* أحدث رسائل التواصل */}
        <div className="lg:col-span-2 bg-deep/50 border border-ink rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono text-dust uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-brass" />
              <span>أحدث رسائل الزوار</span>
            </h2>
            <button
              onClick={() => onNavigate('messages')}
              className="text-xs font-mono text-brass hover:underline"
            >
              عرض كل الرسائل ←
            </button>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-8 text-dust/60 text-xs font-mono">
              لا توجد رسائل واردة حتى الآن.
            </div>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 3).map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => onNavigate('messages')}
                  className={`p-3.5 rounded-lg border transition-colors cursor-pointer ${
                    msg.read
                      ? 'bg-void/40 border-ink/60 text-dust'
                      : 'bg-void border-brass/40 text-moonlight shadow-[0_0_10px_rgba(201,162,39,0.05)]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-moonlight">{msg.name}</span>
                    <span className="font-mono text-dust/70 text-[11px]">
                      {new Date(msg.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <p className="text-xs line-clamp-1 text-dust">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
