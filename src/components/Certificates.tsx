// قسم المسار المهني والشهادات بتصميم خط الأبراج الفلكية (Constellation Timeline)
import React, { useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { soundFX } from '../utils/audio';
import { CheckCircle2, ExternalLink, GraduationCap, Sparkles } from 'lucide-react';

export const Certificates: React.FC = () => {
  const { lang, t } = useLanguage();
  const { certificates } = useData();
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
      { threshold: 0.15 }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="certificates" ref={sectionRef} className="py-24 sm:py-32 px-4 relative">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* عنوان القسم مع أنيميشن النصوص المتناسق */}
        <div className="reveal-on-scroll text-reveal flex flex-col items-start gap-2">
          <div className="text-reveal-badge inline-flex items-center gap-2 text-brass text-xs font-mono tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>{t('الاعتمادات والمسار المهني', 'CAREER ROADMAP & CREDENTIALS')}</span>
          </div>
          <h2 className="text-reveal-heading font-display text-3xl sm:text-4xl md:text-5xl font-bold text-moonlight">
            {t('المسار المهني والتطوير المستمر', 'Professional Track & Milestones')}
          </h2>
        </div>

        {/* خط الأبراج الفلكية الزمني (Constellation Timeline) */}
        <div className="relative ps-6 sm:ps-10 space-y-10">
          {/* الخط المضيء العمودي الواصل بين النجوم */}
          <div className="absolute top-4 bottom-4 start-2 sm:start-3.5 w-0.5 bg-gradient-to-b from-brass via-moonlight/40 to-ink pointer-events-none" />

          {certificates.map((cert, index) => (
            <div
              key={cert.id}
              style={{ '--reveal-delay': `${index * 130}ms` } as React.CSSProperties}
              className="reveal-on-scroll card-reveal relative group"
            >
              {/* عقدة النجمة المضيئة على الخط الزمني */}
              <div className="absolute -start-[26px] sm:-start-[39px] top-6 w-6 h-6 rounded-full bg-void border-2 border-brass flex items-center justify-center shadow-[0_0_12px_rgba(201,162,39,0.8)] group-hover:scale-125 transition-transform duration-300">
                <span className="w-2 h-2 rounded-full bg-moonlight animate-ping" />
              </div>

              {/* كارت المحطة الزمني الزجاجي */}
              <div className="glass-card card-sheen p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-ink group-hover:border-brass/40 transition-all">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-ink/60 text-brass border border-brass/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? cert.status_ar : cert.status_en}</span>
                    </span>
                    <span className="text-xs font-mono text-dust">
                      {lang === 'ar' ? cert.issue_date : cert.issue_date_en}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-moonlight group-hover:text-brass transition-colors">
                    {lang === 'ar' ? cert.title_ar : cert.title_en}
                  </h3>

                  <p className="text-sm text-dust font-sans leading-relaxed">
                    {lang === 'ar' ? cert.issuer : cert.issuer_en}
                  </p>
                </div>

                {cert.credential_url && (
                  <div className="shrink-0">
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundFX.playClick()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-ink hover:border-brass/50 bg-ink/40 text-xs font-sans text-moonlight hover:text-brass transition-colors"
                    >
                      <span>{t('توثيق المصدر', 'View Credential')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
