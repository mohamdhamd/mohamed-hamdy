// قسم المشاريع الحديث مع إمالة ثلاثية الأبعاد تفاعلية (3D Tilt) وانعكاس زجاجي سائل
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Project } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ProjectModal } from './ProjectModal';
import { ProjectsBoardModal } from './ProjectsBoardModal';
import { soundFX } from '../utils/audio';
import { getProjectDomain } from '../utils/projectDomains';
import { FolderGit2, Star, ArrowUpRight, Monitor, BarChart3, Scale, Layers, LayoutGrid, ArrowRight, Sparkles } from 'lucide-react';

export const Projects: React.FC = () => {
  const { lang, t } = useLanguage();
  const { projects } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeCategory, projects]);

  const categories = useMemo(() => {
    return [
      { id: 'all', labelAr: 'كل المشاريع', labelEn: 'All Projects', icon: Layers },
      { id: 'fullstack', labelAr: 'مواقع و Full-Stack', labelEn: 'Full-Stack & Web', icon: Monitor },
      { id: 'data_analysis', labelAr: 'تحليل بيانات و BI', labelEn: 'Data Analysis & BI', icon: BarChart3 },
      { id: 'accounting', labelAr: 'محاسبة وأنظمة مالية CMA', labelEn: 'Accounting & Finance', icon: Scale },
    ];
  }, []);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => (p.status || 'published') === 'published')
      .filter((p) => {
        if (activeCategory === 'all') return true;
        const domain = getProjectDomain(p);
        if (activeCategory === 'fullstack') {
          return domain === 'fullstack' || p.category === 'web' || p.category === 'tools';
        }
        if (activeCategory === 'data_analysis') {
          return domain === 'data_analysis' || p.category === 'data_analysis' || p.category === 'analytics';
        }
        if (activeCategory === 'accounting') {
          return domain === 'accounting' || p.category === 'accounting' || p.category === 'finance';
        }
        return p.category === activeCategory;
      })
      .sort((a, b) => a.order - b.order);
  }, [projects, activeCategory]);

  // إظهار 6 مشاريع فقط كحد أقصى في الواجهة الرئيسية
  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, 6);
  }, [filteredProjects]);

  // فيزياء الإمالة ثلاثية الأبعاد مع حركة الماوس (3D Tilt Effect)
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transition = 'transform 0.06s ease-out, border-color 0.3s, box-shadow 0.3s';
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.3s';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <section id="projects" ref={sectionRef} className="py-24 sm:py-32 px-4 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* عنوان القسم مع أنيميشن النصوص المتناسق */}
        <div className="reveal-on-scroll text-reveal flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="text-reveal-badge inline-flex items-center gap-2 text-brass text-xs font-mono tracking-wider">
              <FolderGit2 className="w-4 h-4" />
              <span>{t('معرض الأعمال المختارة', 'FEATURED WORK & APPS')}</span>
            </div>
            <h2 className="text-reveal-heading font-display text-3xl sm:text-4xl md:text-5xl font-bold text-moonlight">
              {t('مشاريع تم بناؤها بعناية', 'Crafted Digital Solutions')}
            </h2>
          </div>

          {/* فلاتر التصنيف */}
          <div className="text-reveal-sub flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-sans font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-brass text-void font-bold shadow-astral'
                      : 'glass-card text-dust hover:text-moonlight hover:border-brass/30'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t(cat.labelAr, cat.labelEn)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* شبكة الكروت التفاعلية ثلاثية الأبعاد مع أنيميشن انسيابي ومريح للعين (الـ 6 مشاريع الأولى) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedProjects.map((project, index) => {
            const isFeatured = project.featured;
            const domain = getProjectDomain(project);
            return (
              <div
                key={project.id}
                style={{ '--reveal-delay': `${(index % 3) * 110}ms` } as React.CSSProperties}
                className="reveal-on-scroll card-reveal col-span-1"
              >
                <div
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  onClick={() => {
                    soundFX.playChime();
                    setSelectedProject(project);
                  }}
                  style={{ transition: 'border-color 0.3s, box-shadow 0.3s' }}
                  className="h-full glass-card card-spotlight card-sheen group cursor-pointer rounded-3xl overflow-hidden flex flex-col justify-between border border-ink/80 hover:border-brass/40 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {/* الغلاف الإبداعي بارتفاع موحد لجميع الكروت */}
                  <div className="relative overflow-hidden w-full bg-deep h-52 sm:h-60">
                    <img
                      src={project.cover}
                      alt={lang === 'ar' ? project.title_ar : project.title_en}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* تدرج هادئ وناعم لا يحجب واجهة المستخدم */}
                    <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-transparent pointer-events-none" />

                    {/* شارة التميز */}
                    {isFeatured && (
                      <div className="absolute top-4 start-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-brass/95 text-void shadow-astral backdrop-blur-md z-10">
                        <Star className="w-3.5 h-3.5 fill-void" />
                        <span>{t('مشروع مميز', 'Featured Project')}</span>
                      </div>
                    )}

                    {/* مؤشر تفاعلي يظهر عند التحويم */}
                    <div className="absolute top-4 end-4 p-2.5 rounded-full bg-void/80 backdrop-blur-md text-moonlight opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 border border-brass/40 shadow-lg z-10">
                      <ArrowUpRight className="w-4 h-4 text-brass" />
                    </div>
                  </div>

                  {/* المحتوى النصي الأنيق */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      {/* التصنيف ككبسولة أنيقة */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brass/10 border border-brass/25 text-xs font-mono text-brass font-medium w-fit">
                        {domain === 'fullstack' && <Monitor className="w-3.5 h-3.5" />}
                        {domain === 'data_analysis' && <BarChart3 className="w-3.5 h-3.5" />}
                        {domain === 'accounting' && <Scale className="w-3.5 h-3.5" />}
                        <span>{lang === 'ar' ? project.category_label_ar : project.category_label_en}</span>
                      </div>

                      {/* عنوان المشروع */}
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-moonlight group-hover:text-brass transition-colors tracking-tight">
                        {lang === 'ar' ? project.title_ar : project.title_en}
                      </h3>

                      {/* وصف المشروع */}
                      <p className="text-sm text-dust/90 font-sans line-clamp-2 leading-relaxed">
                        {lang === 'ar' ? project.summary_ar : project.summary_en}
                      </p>
                    </div>

                    {/* شريط التقنيات والروابط */}
                    <div className="space-y-4 pt-4 border-t border-ink/80">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {project.tech.map((tItem) => (
                          <span
                            key={tItem}
                            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-void/80 text-dust/90 border border-ink/80 group-hover:border-brass/20 transition-colors shadow-sm"
                          >
                            {tItem}
                          </span>
                        ))}
                      </div>

                      {/* زر الاستكشاف مع السهم بجانبه مباشرة */}
                      <div className="flex items-center justify-between text-xs sm:text-sm font-sans text-brass pt-1">
                        <div className="inline-flex items-center gap-2 font-medium group-hover:text-brass-light transition-all">
                          <span>{t('عرض التفاصيل والكود المصدري', 'View details & code')}</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 rtl:group-hover:-translate-x-1" />
                        </div>
                        <span className="text-[11px] font-mono text-dust/50 group-hover:text-brass/70 transition-colors flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{t('استكشاف', 'Explore')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* زر فتح لوحة استعراض المشاريع (المزيد من المشاريع) */}
        {(filteredProjects.length > 6 || projects.length > 6) && (
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <button
              onClick={() => {
                soundFX.playChime();
                setIsBoardOpen(true);
              }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-deep/90 border border-brass/40 hover:border-brass text-moonlight hover:text-brass font-display font-bold text-sm sm:text-base backdrop-blur-xl transition-all duration-300 shadow-astral hover:shadow-astral-lg hover:-translate-y-1 active:scale-95"
            >
              <LayoutGrid className="w-5 h-5 text-brass group-hover:rotate-12 transition-transform" />
              <span>
                {filteredProjects.length > 6
                  ? t(`المزيد من المشاريع في لوحة العمل (+${filteredProjects.length - 6})`, `Explore More Projects in Board (+${filteredProjects.length - 6})`)
                  : t(`استعراض لوحة المشاريع الشاملة (${projects.length})`, `Explore Full Projects Board (${projects.length})`)}
              </span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* مودال فحص المشروع الفردي بتفاصيله المخصصة */}
      <ProjectModal
        project={selectedProject}
        onClose={() => {
          soundFX.playClick();
          setSelectedProject(null);
        }}
      />

      {/* لوحة استعراض كافة المشاريع (مكون اللوحة التفاعلي) */}
      <ProjectsBoardModal
        isOpen={isBoardOpen}
        onClose={() => {
          soundFX.playClick();
          setIsBoardOpen(false);
        }}
        onSelectProject={(project) => {
          setSelectedProject(project);
        }}
        allProjects={projects}
      />
    </section>
  );
};
