// لوحة الأوامر الفلكية السريعة (Command Palette - Ctrl + K)
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { soundFX } from '../utils/audio';
import {
  Search,
  FolderGit2,
  User,
  GraduationCap,
  Mail,
  Globe,
  Github,
  Linkedin,
  Youtube,
  Facebook,
  Volume2,
  VolumeX,
  X,
  ExternalLink,
  ArrowRight,
  Lock,
  FileText,
  Heart,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
  onOpenAdmin?: () => void;
  onOpenCV?: () => void;
  onReplayLoading?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onOpenAdmin,
  onOpenCV,
  onReplayLoading,
}) => {
  const { lang, toggleLang, t } = useLanguage();
  const { projects, settings } = useData();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      soundFX.playChime();
      setQuery('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // قائمة الأوامر المتاحة
  const navigationItems = [
    { id: 'nav-about', titleAr: 'عني والترسانة التقنية', titleEn: 'About & Tech Stack', section: 'about', icon: User },
    { id: 'nav-projects', titleAr: 'استعراض المشاريع', titleEn: 'Explore Projects', section: 'projects', icon: FolderGit2 },
    { id: 'nav-certificates', titleAr: 'المسار المهني والشهادات', titleEn: 'Credentials & Track', section: 'certificates', icon: GraduationCap },
    { id: 'nav-contact', titleAr: 'تواصل معي', titleEn: 'Get in Touch', section: 'contact', icon: Mail },
  ];

  const actionItems = [
    {
      id: 'act-loading',
      titleAr: 'صَلِّ عَلَى الحَبِيبِ ﷺ قَلْبُكَ يَطِيب (عرض شاشة البداية)',
      titleEn: 'Blessings Upon the Prophet ﷺ (Replay Loading Screen)',
      icon: Heart,
      action: () => {
        onClose();
        if (onReplayLoading) onReplayLoading();
      },
    },
    {
      id: 'act-cv',
      titleAr: 'عرض وتحميل السيرة الذاتية التفاعلية الرسمية (CV / Resume)',
      titleEn: 'View & Download Official Interactive CV / Resume',
      icon: FileText,
      action: () => {
        onClose();
        if (onOpenCV) onOpenCV();
      },
    },
    {
      id: 'act-admin',
      titleAr: 'فتح لوحة التحكم والإدارة (Admin Dashboard)',
      titleEn: 'Open Admin Dashboard',
      icon: Lock,
      action: () => {
        onClose();
        if (onOpenAdmin) onOpenAdmin();
      },
    },
    {
      id: 'act-lang',
      titleAr: lang === 'ar' ? 'التحويل إلى الإنجليزية (Switch to English)' : 'التحويل إلى العربية (Switch to Arabic)',
      titleEn: 'Toggle Language',
      icon: Globe,
      action: () => toggleLang(),
    },
    {
      id: 'act-copy-email',
      titleAr: 'نسخ عنوان البريد الإلكتروني',
      titleEn: 'Copy Email Address',
      icon: Mail,
      action: () => {
        navigator.clipboard.writeText(settings.email || 'mohamed.hamdy.fawzy0@gmail.com');
        soundFX.playClick();
      },
    },
    {
      id: 'act-github',
      titleAr: 'زيارة حساب GitHub',
      titleEn: 'Open GitHub Profile',
      icon: Github,
      action: () => window.open(settings.github_url || 'https://github.com/mohamdhamd', '_blank'),
    },
    {
      id: 'act-linkedin',
      titleAr: 'زيارة حساب LinkedIn',
      titleEn: 'Open LinkedIn Profile',
      icon: Linkedin,
      action: () => window.open(settings.linkedin_url || 'https://www.linkedin.com/in/mohamed-hamdey/', '_blank'),
    },
    {
      id: 'act-youtube',
      titleAr: 'زيارة قناة YouTube (@coding-keys)',
      titleEn: 'Open YouTube Channel (@coding-keys)',
      icon: Youtube,
      action: () => window.open(settings.youtube_url || 'https://www.youtube.com/@coding-keys', '_blank'),
    },
    {
      id: 'act-facebook',
      titleAr: 'زيارة حساب Facebook',
      titleEn: 'Open Facebook Profile',
      icon: Facebook,
      action: () => window.open(settings.facebook_url || 'https://www.facebook.com/m0hamedhamdy1/?locale=ar_AR', '_blank'),
    },
  ];

  // تصفية العناصر بناءً على البحث
  const filteredProjects = projects.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.title_ar.toLowerCase().includes(q) ||
      p.title_en.toLowerCase().includes(q) ||
      p.tech.some((t) => t.toLowerCase().includes(q))
    );
  });

  const filteredNavigation = navigationItems.filter((item) => {
    const q = query.toLowerCase();
    return item.titleAr.toLowerCase().includes(q) || item.titleEn.toLowerCase().includes(q);
  });

  const filteredActions = actionItems.filter((item) => {
    const q = query.toLowerCase();
    return item.titleAr.toLowerCase().includes(q) || item.titleEn.toLowerCase().includes(q);
  });

  // تجميع كافة النتائج لضبط التنقل بالأسهم
  interface CombinedItem {
    type: 'nav' | 'project' | 'action';
    id: string;
    title: string;
    subtitle?: string;
    icon: React.ElementType;
    onExecute: () => void;
  }

  const allItems: CombinedItem[] = [
    ...filteredNavigation.map((n) => ({
      type: 'nav' as const,
      id: n.id,
      title: lang === 'ar' ? n.titleAr : n.titleEn,
      icon: n.icon,
      onExecute: () => {
        onClose();
        document.getElementById(n.section)?.scrollIntoView({ behavior: 'smooth' });
      },
    })),
    ...filteredProjects.map((p) => ({
      type: 'project' as const,
      id: p.id,
      title: lang === 'ar' ? p.title_ar : p.title_en,
      subtitle: p.tech.join(' · '),
      icon: FolderGit2,
      onExecute: () => {
        onClose();
        if (onSelectProject) {
          onSelectProject(p.id);
        } else {
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        }
      },
    })),
    ...filteredActions.map((a) => ({
      type: 'action' as const,
      id: a.id,
      title: lang === 'ar' ? a.titleAr : a.titleEn,
      icon: a.icon,
      onExecute: () => {
        a.action();
        onClose();
      },
    })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allItems.length));
      soundFX.playClick();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % Math.max(1, allItems.length));
      soundFX.playClick();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].onExecute();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-void/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-deep/95 border border-brass/40 shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* شريط الإدخال والبحث */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-ink">
          <Search className="w-5 h-5 text-brass shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t(
              'اكتب أمراً، ابحث في المشاريع، أو تنقل...',
              'Type a command, search projects, or navigate...'
            )}
            className="w-full bg-transparent text-moonlight placeholder-dust font-sans text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-dust hover:text-moonlight hover:bg-ink/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* قائمة النتائج */}
        <div className="overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="p-8 text-center text-dust text-sm font-sans">
              {t('لا توجد نتائج مطابقة لبحثك.', 'No matching results found.')}
            </div>
          ) : (
            allItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={item.onExecute}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-brass/15 text-moonlight border border-brass/30'
                      : 'text-dust hover:bg-ink/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-brass text-void' : 'bg-ink/50 text-brass'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p
                        className={`text-sm font-sans font-medium truncate ${
                          isSelected ? 'text-moonlight' : 'text-moonlight/90'
                        }`}
                      >
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-[11px] font-mono text-dust truncate">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-dust/70 px-1.5 py-0.5 rounded bg-ink/40">
                    {item.type === 'nav'
                      ? t('انتقال', 'Jump')
                      : item.type === 'project'
                      ? t('مشروع', 'Project')
                      : t('إجراء', 'Action')}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* الفوتر الإرشادي للوحة */}
        <div className="px-4 py-2.5 bg-void/60 border-t border-ink flex items-center justify-between text-[11px] font-mono text-dust">
          <div className="flex items-center gap-3">
            <span>↑↓ {t('للتنقل', 'to navigate')}</span>
            <span>↵ {t('للتنفيذ', 'to select')}</span>
            <span>ESC {t('للإغلاق', 'to close')}</span>
          </div>
          <span className="text-brass/80">Mohamed Hamdy Console</span>
        </div>
      </div>
    </div>
  );
};
