// لوحة استعراض المشاريع الشاملة (Projects Board Modal & Kanban Explorer)
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Project } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { soundFX } from '../utils/audio';
import { getProjectDomain } from '../utils/projectDomains';
import {
  LayoutGrid,
  Columns3,
  Search,
  X,
  Star,
  Monitor,
  BarChart3,
  Scale,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

interface ProjectsBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  allProjects: Project[];
}

export const ProjectsBoardModal: React.FC<ProjectsBoardModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  allProjects,
}) => {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'grid'>('kanban');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // منع تمرير الصفحة الخلفية عند فتح المودال
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSearchQuery('');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // إغلاق بمفتاح Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // تصفية المشاريع بحسب البحث والفئة
  const filteredProjects = useMemo(() => {
    return allProjects
      .filter((p) => (p.status || 'published') === 'published')
      .filter((p) => {
        const title = (lang === 'ar' ? p.title_ar : p.title_en).toLowerCase();
        const summary = (lang === 'ar' ? p.summary_ar : p.summary_en).toLowerCase();
        const techStr = (p.tech || []).join(' ').toLowerCase();
        const q = searchQuery.toLowerCase().trim();

        const matchesQuery = !q || title.includes(q) || summary.includes(q) || techStr.includes(q);
        if (!matchesQuery) return false;

        if (selectedCategory === 'all') return true;
        const domain = getProjectDomain(p);
        return domain === selectedCategory;
      })
      .sort((a, b) => a.order - b.order);
  }, [allProjects, searchQuery, selectedCategory, lang]);

  // تقسيم المشاريع إلى أعمدة اللوحة (Kanban Columns)
  const columns = useMemo(() => {
    const published = allProjects.filter((p) => (p.status || 'published') === 'published');
    const filterBySearch = (list: Project[]) => {
      if (!searchQuery.trim()) return list;
      const q = searchQuery.toLowerCase().trim();
      return list.filter((p) => {
        const title = (lang === 'ar' ? p.title_ar : p.title_en).toLowerCase();
        const summary = (lang === 'ar' ? p.summary_ar : p.summary_en).toLowerCase();
        const techStr = (p.tech || []).join(' ').toLowerCase();
        return title.includes(q) || summary.includes(q) || techStr.includes(q);
      });
    };

    return [
      {
        id: 'fullstack',
        titleAr: 'مواقع و Full-Stack',
        titleEn: 'Full-Stack & Web Apps',
        icon: Monitor,
        color: 'text-purple-400',
        borderColor: 'border-purple-500/30',
        badgeBg: 'bg-purple-500/15 text-purple-300',
        projects: filterBySearch(published.filter((p) => getProjectDomain(p) === 'fullstack')),
      },
      {
        id: 'data_analysis',
        titleAr: 'تحليل بيانات و BI',
        titleEn: 'Data Analysis & BI',
        icon: BarChart3,
        color: 'text-sky-400',
        borderColor: 'border-sky-500/30',
        badgeBg: 'bg-sky-500/15 text-sky-300',
        projects: filterBySearch(published.filter((p) => getProjectDomain(p) === 'data_analysis')),
      },
      {
        id: 'accounting',
        titleAr: 'محاسبة وأنظمة مالية CMA',
        titleEn: 'Accounting & Finance',
        icon: Scale,
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/15 text-emerald-300',
        projects: filterBySearch(published.filter((p) => getProjectDomain(p) === 'accounting')),
      },
    ];
  }, [allProjects, searchQuery, lang]);

  if (!isOpen) return null;

  const publishedTotal = allProjects.filter((p) => (p.status || 'published') === 'published').length;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-void/90 backdrop-blur-md transition-opacity duration-300"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div
        className="w-full max-w-7xl h-[94vh] sm:h-[92vh] max-h-[950px] rounded-2xl sm:rounded-3xl bg-deep/98 border border-brass/30 shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden relative transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* شريط الرأس والتحكم العلوي في اللوحة */}
        <header className="p-3.5 sm:p-5 md:p-6 border-b border-ink/80 bg-deep/95 flex flex-col gap-3 sm:gap-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* أيقونة اللوحة والعنوان والشارة */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-brass/10 border border-brass/30 text-brass flex-shrink-0 shadow-sm">
                <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm sm:text-xl md:text-2xl font-bold font-display text-moonlight truncate">
                    {t('لوحة استعراض كافة المشاريع', 'Projects Matrix & Board')}
                  </h2>
                  <span className="text-[11px] sm:text-xs font-mono px-2.5 py-0.5 rounded-full bg-brass/20 text-brass border border-brass/30 font-bold whitespace-nowrap flex-shrink-0">
                    {publishedTotal} {t('مشروع', 'Projects')}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs font-sans text-dust truncate sm:overflow-visible mt-0.5 hidden xs:block sm:block">
                  {t(
                    'استعرض كافة المشاريع عبر الأعمدة التخصصية أو الشبكة مع فحص الكود والمعاينة الحية',
                    'Explore domain columns, filter by tech stack, and launch live interactive studios'
                  )}
                </p>
              </div>
            </div>

            {/* عناصر التحكم العلوية: تبديل العرض + زر الإغلاق */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* تبديل وضع العرض (Kanban vs Grid) */}
              <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-void border border-ink text-xs font-mono">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setViewMode('kanban');
                  }}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all text-[11px] sm:text-xs ${
                    viewMode === 'kanban' ? 'bg-brass text-void font-bold shadow-astral' : 'text-dust hover:text-white'
                  }`}
                  title={t('لوحة الأعمدة', 'Kanban View')}
                >
                  <Columns3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('لوحة الأعمدة', 'Kanban')}</span>
                </button>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setViewMode('grid');
                  }}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all text-[11px] sm:text-xs ${
                    viewMode === 'grid' ? 'bg-brass text-void font-bold shadow-astral' : 'text-dust hover:text-white'
                  }`}
                  title={t('شبكة المشاريع', 'Grid View')}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('الشبكة', 'Grid')}</span>
                </button>
              </div>

              {/* زر الإغلاق */}
              <button
                onClick={() => {
                  soundFX.playClick();
                  onClose();
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-void border border-ink text-dust hover:text-brass hover:border-brass/40 transition-colors active:scale-95 flex-shrink-0"
                title={t('إغلاق (Esc)', 'Close (Esc)')}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* شريط البحث وتصفية الفئات */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
            {/* حقل البحث اللحظي */}
            <div className="relative flex-1 w-full min-w-0">
              <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dust" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(
                  'ابحث في المشاريع بالاسم أو التقنية (مثل React, Power BI, Odoo, DAX)...',
                  'Search projects by title or tech (e.g. React, Power BI, Odoo, DAX)...'
                )}
                className="w-full ps-10 pe-9 py-2 sm:py-2.5 rounded-xl bg-void/80 border border-ink focus:border-brass/50 text-xs sm:text-sm font-sans text-moonlight placeholder:text-dust/50 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-dust hover:text-white p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* أزرار الفلترة في وضع الشبكة */}
            {viewMode === 'grid' && (
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-void border border-ink text-xs font-mono overflow-x-auto w-full sm:w-auto no-scrollbar">
                {[
                  { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                  { id: 'fullstack', labelAr: 'Full-Stack', labelEn: 'Full-Stack' },
                  { id: 'data_analysis', labelAr: 'تحليل بيانات', labelEn: 'Data' },
                  { id: 'accounting', labelAr: 'محاسبة', labelEn: 'Accounting' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all text-xs ${
                      selectedCategory === cat.id
                        ? 'bg-brass text-void font-bold shadow-astral'
                        : 'text-dust hover:text-white'
                    }`}
                  >
                    {t(cat.labelAr, cat.labelEn)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* جسم اللوحة التفاعلي القابل للتمرير بسلاسة */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 custom-scrollbar overscroll-contain">
          {viewMode === 'kanban' ? (
            /* 1. عرض لوحة الأعمدة التخصصية (Kanban Board Columns) */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:h-full items-start md:items-stretch">
              {columns.map((col) => {
                const Icon = col.icon;
                return (
                  <div
                    key={col.id}
                    className="rounded-2xl bg-void/60 border border-ink/80 flex flex-col md:overflow-hidden md:h-full shadow-sm"
                  >
                    {/* رأس العمود */}
                    <div className="p-3 sm:p-4 border-b border-ink/80 bg-deep/60 flex items-center justify-between flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${col.color}`} />
                        <h3 className="text-sm font-bold font-display text-moonlight">
                          {lang === 'ar' ? col.titleAr : col.titleEn}
                        </h3>
                      </div>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${col.badgeBg} font-bold`}>
                        {col.projects.length}
                      </span>
                    </div>

                    {/* كروت المشاريع في العمود */}
                    <div className="p-3 sm:p-4 space-y-3 md:overflow-y-auto md:flex-1 custom-scrollbar overscroll-contain">
                      {col.projects.length === 0 ? (
                        <div className="py-8 sm:py-12 text-center text-xs font-mono text-dust/60 space-y-2">
                          <Filter className="w-5 h-5 mx-auto opacity-40" />
                          <p>{t('لا توجد مشاريع مطابقة للبحث في هذا العمود', 'No matching projects in this column')}</p>
                        </div>
                      ) : (
                        col.projects.map((project) => (
                          <div
                            key={project.id}
                            onClick={() => {
                              soundFX.playChime();
                              onSelectProject(project);
                            }}
                            className="p-3.5 sm:p-4 rounded-xl bg-deep/90 border border-ink/70 hover:border-brass/40 transition-all duration-200 group cursor-pointer space-y-3 hover:-translate-y-0.5 shadow-md relative overflow-hidden"
                          >
                            {/* شارة المشروع المميز */}
                            {project.featured && (
                              <div className="absolute top-2 end-2 p-1 rounded-full bg-brass/20 text-brass">
                                <Star className="w-3 h-3 fill-brass" />
                              </div>
                            )}

                            {/* صورة مصغرة */}
                            <div className="h-28 w-full rounded-lg overflow-hidden relative">
                              <img
                                src={project.cover}
                                alt={lang === 'ar' ? project.title_ar : project.title_en}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-transparent" />
                            </div>

                            {/* العناوين والوصف */}
                            <div className="space-y-1.5">
                              <h4 className="text-sm font-bold font-display text-moonlight group-hover:text-brass transition-colors line-clamp-1">
                                {lang === 'ar' ? project.title_ar : project.title_en}
                              </h4>
                              <p className="text-xs text-dust font-sans line-clamp-2 leading-relaxed">
                                {lang === 'ar' ? project.summary_ar : project.summary_en}
                              </p>
                            </div>

                            {/* التقنيات ورابط الاستعراض */}
                            <div className="pt-2 border-t border-ink/60 flex items-center justify-between text-xs">
                              <div className="flex flex-wrap gap-1 max-w-[70%] overflow-hidden h-5">
                                {(project.tech || []).slice(0, 3).map((tech) => (
                                  <span
                                    key={tech}
                                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-void border border-ink text-dust"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>

                              <span className="text-brass group-hover:underline text-[11px] font-mono flex items-center gap-1">
                                <span>{t('فحص', 'Inspect')}</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 2. عرض الشبكة المفتوحة (Grid Matrix View) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full py-20 text-center text-dust space-y-3 font-mono text-sm">
                  <Search className="w-8 h-8 mx-auto text-dust/40" />
                  <p>{t('لم يتم العثور على أي مشاريع مطابقة لبحثك', 'No projects found matching your query')}</p>
                </div>
              ) : (
                filteredProjects.map((project) => {
                  const domain = getProjectDomain(project);
                  return (
                    <div
                      key={project.id}
                      onClick={() => {
                        soundFX.playChime();
                        onSelectProject(project);
                      }}
                      className="rounded-2xl bg-deep/80 border border-ink hover:border-brass/40 overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col justify-between hover:-translate-y-1 shadow-lg"
                    >
                      <div className="h-40 sm:h-44 w-full overflow-hidden relative">
                        <img
                          src={project.cover}
                          alt={lang === 'ar' ? project.title_ar : project.title_en}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent" />
                        {project.featured && (
                          <div className="absolute top-3 start-3 px-2.5 py-0.5 rounded-full bg-brass text-void text-[10px] font-mono font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-void" />
                            <span>{t('مميز', 'Featured')}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-mono text-brass">
                            {domain === 'fullstack' && <Monitor className="w-3 h-3" />}
                            {domain === 'data_analysis' && <BarChart3 className="w-3 h-3" />}
                            {domain === 'accounting' && <Scale className="w-3 h-3" />}
                            <span>{lang === 'ar' ? project.category_label_ar : project.category_label_en}</span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold font-display text-moonlight group-hover:text-brass transition-colors">
                            {lang === 'ar' ? project.title_ar : project.title_en}
                          </h4>
                          <p className="text-xs text-dust font-sans line-clamp-2 leading-relaxed">
                            {lang === 'ar' ? project.summary_ar : project.summary_en}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-ink/60 space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {(project.tech || []).slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-void border border-ink text-dust"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-xs text-brass pt-1">
                            <span>{t('عرض التفاصيل والكود المصدري', 'View details & code')}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
