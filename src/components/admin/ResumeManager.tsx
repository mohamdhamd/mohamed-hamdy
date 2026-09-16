// لوحة إدارة وتعديل كامل بيانات السيرة الذاتية (CV Manager)
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { ResumeData, ResumeExperienceItem, ResumeSkillCategoryItem } from '../../types';
import { soundFX } from '../../utils/audio';
import {
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Layers,
  Sparkles,
  User,
  Plus,
  Trash2,
  Check,
  Scale,
  BarChart3,
  Code2,
} from 'lucide-react';

export const ResumeManager: React.FC = () => {
  const { resumeData, updateResumeData } = useData();
  const [formData, setFormData] = useState<ResumeData>({ ...resumeData });
  const [activeSubTab, setActiveSubTab] = useState<'personal' | 'education' | 'tracks' | 'experience' | 'skills'>('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // تحديث النموذج عند استلام بيانات جديدة
  useEffect(() => {
    if (resumeData && resumeData.personal) {
      setFormData({ ...resumeData });
    }
  }, [resumeData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setError(null);
    soundFX.playClick();

    try {
      await updateResumeData(formData);
      soundFX.playChime();
      setSuccessMessage('تم حفظ وتحديث السيرة الذاتية بنجاح في قاعدة البيانات MongoDB Atlas!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'تعذر حفظ بيانات السيرة الذاتية');
    } finally {
      setIsSaving(false);
    }
  };

  // دوال إدارة الخبرات القيادية
  const handleAddExperience = () => {
    soundFX.playClick();
    const newExp: ResumeExperienceItem = {
      role_ar: 'دور أو منصب جديد',
      role_en: 'New Position / Role',
      organization_ar: 'اسم المؤسسة / الجهة',
      organization_en: 'Organization Name',
      period: '2025 – Present',
      points_ar: ['وصف المسؤوليات والإنجازات باللغة العربية.'],
      points_en: ['Description of key responsibilities and accomplishments in English.'],
    };
    setFormData({
      ...formData,
      leadership: [newExp, ...(formData.leadership || [])],
    });
  };

  const handleRemoveExperience = (index: number) => {
    if (!window.confirm('هل تريد حذف هذه الخبرة من السيرة الذاتية؟')) return;
    soundFX.playClick();
    const updated = [...(formData.leadership || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, leadership: updated });
  };

  const handleUpdateExperience = (index: number, field: keyof ResumeExperienceItem, value: any) => {
    const updated = [...(formData.leadership || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, leadership: updated });
  };

  const handleAddExperienceBullet = (expIndex: number) => {
    soundFX.playClick();
    const updated = [...(formData.leadership || [])];
    updated[expIndex].points_ar.push('نقطة إنجاز جديدة');
    updated[expIndex].points_en.push('New accomplishment bullet point');
    setFormData({ ...formData, leadership: updated });
  };

  const handleRemoveExperienceBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...(formData.leadership || [])];
    updated[expIndex].points_ar.splice(bulletIndex, 1);
    updated[expIndex].points_en.splice(bulletIndex, 1);
    setFormData({ ...formData, leadership: updated });
  };

  // دوال إدارة المهارات
  const handleSkillLevelChange = (catIndex: number, skillIndex: number, newLevel: number) => {
    const updatedCats = [...(formData.skills || [])];
    updatedCats[catIndex].skills[skillIndex].level = newLevel;
    setFormData({ ...formData, skills: updatedCats });
  };

  const handleAddSkill = (catIndex: number) => {
    soundFX.playClick();
    const updatedCats = [...(formData.skills || [])];
    updatedCats[catIndex].skills.push({
      name: 'مهارة جديدة',
      level: 85,
      highlight: false,
    });
    setFormData({ ...formData, skills: updatedCats });
  };

  const handleRemoveSkill = (catIndex: number, skillIndex: number) => {
    const updatedCats = [...(formData.skills || [])];
    updatedCats[catIndex].skills.splice(skillIndex, 1);
    setFormData({ ...formData, skills: updatedCats });
  };

  const subTabs = [
    { id: 'personal', label: 'البيانات الشخصية', icon: User },
    { id: 'education', label: 'المؤهل الأكاديمي', icon: GraduationCap },
    { id: 'tracks', label: 'المسارات والنبذات التخصصية', icon: Layers },
    { id: 'experience', label: 'الخبرات والمحطات', icon: Briefcase },
    { id: 'skills', label: 'المهارات ومستويات الإتقان', icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      {/* ترويسة إدارة السيرة الذاتية */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-moonlight flex items-center gap-2">
            <FileText className="w-5 h-5 text-brass" />
            <span>إدارة وتعديل السيرة الذاتية (CV Manager)</span>
          </h2>
          <p className="text-xs text-dust">
            جميع التعديلات المحفوظة هنا تنعكس فورياً في صفحة السيرة الذاتية التفاعلية وفي ملف الـ PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/?cv=true"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl text-xs font-mono bg-void border border-ink hover:border-brass/40 text-dust hover:text-brass flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>معاينة صفحة الـ CV الحية ↗</span>
          </a>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-brass hover:bg-brass-light text-void font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(201,162,39,0.3)] disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>حفظ السيرة الذاتية</span>
          </button>
        </div>
      </div>

      {/* تنبيهات النجاح والخطأ */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ألسنة التبويب الداخلية */}
      <div className="flex items-center gap-2 border-b border-ink pb-2 overflow-x-auto">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playClick();
                setActiveSubTab(tab.id as any);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-brass text-void font-bold shadow-[0_0_12px_rgba(201,162,39,0.3)]'
                  : 'bg-void border border-ink text-dust hover:text-moonlight'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* محتوى النماذج حسب التبويب المختار */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. البيانات الشخصية ومعلومات الاتصال */}
        {activeSubTab === 'personal' && (
          <div className="bg-deep/50 border border-ink rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-mono text-brass uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>المعلومات الشخصية والاتصال</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">الاسم الكامل (عربي)</label>
                <input
                  type="text"
                  value={formData.personal.name_ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, name_ar: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">الاسم الكامل (English)</label>
                <input
                  type="text"
                  value={formData.personal.name_en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, name_en: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">المسمى المهني (عربي)</label>
                <input
                  type="text"
                  value={formData.personal.title_ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, title_ar: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">المسمى المهني (English)</label>
                <input
                  type="text"
                  value={formData.personal.title_en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, title_en: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">رقم الهاتف</label>
                <input
                  type="text"
                  value={formData.personal.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, phone: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">البريد الإلكتروني الرسمي</label>
                <input
                  type="email"
                  value={formData.personal.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, email: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">الموقع الجغرافي (عربي)</label>
                <input
                  type="text"
                  value={formData.personal.location_ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, location_ar: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">رابط حساب LinkedIn</label>
                <input
                  type="url"
                  value={formData.personal.linkedin_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, linkedin_url: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">مسار ملف الـ PDF لتحميل السيرة</label>
                <input
                  type="text"
                  value={formData.personal.pdf_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, pdf_url: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. المؤهل الأكاديمي والتعليم */}
        {activeSubTab === 'education' && (
          <div className="bg-deep/50 border border-ink rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-mono text-brass uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>المؤهل الأكاديمي والجامعي المعتمد</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">الدرجة والتخصص (عربي)</label>
                <input
                  type="text"
                  value={formData.education.degree_ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      education: { ...formData.education, degree_ar: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">Degree & Major (English)</label>
                <input
                  type="text"
                  value={formData.education.degree_en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      education: { ...formData.education, degree_en: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">الجامعة (عربي)</label>
                <input
                  type="text"
                  value={formData.education.institution_ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      education: { ...formData.education, institution_ar: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">التقدير المعتمد (عربي)</label>
                <input
                  type="text"
                  value={formData.education.grade_ar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      education: { ...formData.education, grade_ar: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none font-bold text-brass"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">سنوات الدراسة</label>
                <input
                  type="text"
                  value={formData.education.period}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      education: { ...formData.education, period: e.target.value },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. المسارات التخصصية والنبذات */}
        {activeSubTab === 'tracks' && (
          <div className="space-y-6">
            {/* نبذة المسار الشامل (All) */}
            <div className="bg-deep/50 border border-ink rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-mono text-brass uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>النسخة الشاملة (Master Profile - All)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">شارة التخصص (عربي)</label>
                  <input
                    type="text"
                    value={formData.tracks?.all?.badge_ar || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracks: {
                          ...formData.tracks,
                          all: { ...formData.tracks?.all, badge_ar: e.target.value } as any,
                        },
                      })
                    }
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">المسمى للنسخة (عربي)</label>
                  <input
                    type="text"
                    value={formData.tracks?.all?.title_ar || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracks: {
                          ...formData.tracks,
                          all: { ...formData.tracks?.all, title_ar: e.target.value } as any,
                        },
                      })
                    }
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">النبذة التعريفية للنسخة الشاملة (عربي)</label>
                <textarea
                  rows={3}
                  value={formData.tracks?.all?.summary_ar || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tracks: {
                        ...formData.tracks,
                        all: { ...formData.tracks?.all, summary_ar: e.target.value } as any,
                      },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* مسار المحاسب المالي & ERP */}
            <div className="bg-deep/50 border border-emerald-800/40 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <span>مسار المحاسب المالي & Odoo ERP Specialist</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">شارة التخصص (عربي)</label>
                  <input
                    type="text"
                    value={formData.tracks?.accountant?.badge_ar || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracks: {
                          ...formData.tracks,
                          accountant: { ...formData.tracks?.accountant, badge_ar: e.target.value } as any,
                        },
                      })
                    }
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">المسمى المهني للمسار (عربي)</label>
                  <input
                    type="text"
                    value={formData.tracks?.accountant?.title_ar || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracks: {
                          ...formData.tracks,
                          accountant: { ...formData.tracks?.accountant, title_ar: e.target.value } as any,
                        },
                      })
                    }
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">نبذة مسار المحاسبة و Odoo ERP (عربي)</label>
                <textarea
                  rows={3}
                  value={formData.tracks?.accountant?.summary_ar || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tracks: {
                        ...formData.tracks,
                        accountant: { ...formData.tracks?.accountant, summary_ar: e.target.value } as any,
                      },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* مسار تحليل البيانات و Power BI */}
            <div className="bg-deep/50 border border-cyan-800/40 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>مسار تحليل البيانات وذكاء الأعمال (Power BI & DAX)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">شارة التخصص (عربي)</label>
                  <input
                    type="text"
                    value={formData.tracks?.data_analyst?.badge_ar || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracks: {
                          ...formData.tracks,
                          data_analyst: { ...formData.tracks?.data_analyst, badge_ar: e.target.value } as any,
                        },
                      })
                    }
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">المسمى المهني للمسار (عربي)</label>
                  <input
                    type="text"
                    value={formData.tracks?.data_analyst?.title_ar || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracks: {
                          ...formData.tracks,
                          data_analyst: { ...formData.tracks?.data_analyst, title_ar: e.target.value } as any,
                        },
                      })
                    }
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">نبذة مسار تحليل البيانات و Power BI (عربي)</label>
                <textarea
                  rows={3}
                  value={formData.tracks?.data_analyst?.summary_ar || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tracks: {
                        ...formData.tracks,
                        data_analyst: { ...formData.tracks?.data_analyst, summary_ar: e.target.value } as any,
                      },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* مسار تطوير الويب والـ Full-Stack */}
            <div className="bg-deep/50 border border-purple-800/40 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-mono text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                <span>مسار تطوير الويب والأنظمة السحابية (Full-Stack MERN)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">شارة التخصص (عربي)</label>
                  <input
                    type="text"
                    value={formData.tracks?.fullstack?.badge_ar || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracks: {
                          ...formData.tracks,
                          fullstack: { ...formData.tracks?.fullstack, badge_ar: e.target.value } as any,
                        },
                      })
                    }
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">المسمى المهني للمسار (عربي)</label>
                  <input
                    type="text"
                    value={formData.tracks?.fullstack?.title_ar || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracks: {
                          ...formData.tracks,
                          fullstack: { ...formData.tracks?.fullstack, title_ar: e.target.value } as any,
                        },
                      })
                    }
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">نبذة مسار الـ Full-Stack (عربي)</label>
                <textarea
                  rows={3}
                  value={formData.tracks?.fullstack?.summary_ar || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tracks: {
                        ...formData.tracks,
                        fullstack: { ...formData.tracks?.fullstack, summary_ar: e.target.value } as any,
                      },
                    })
                  }
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. الخبرات والمحطات القيادية */}
        {activeSubTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono text-brass uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>الخبرات والمحطات القيادية والمهنية ({formData.leadership?.length || 0})</span>
              </h3>

              <button
                type="button"
                onClick={handleAddExperience}
                className="px-3 py-1.5 rounded-lg bg-brass text-void text-xs font-mono font-bold flex items-center gap-1 hover:bg-brass-light transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة منصب / خبرة</span>
              </button>
            </div>

            <div className="space-y-4">
              {(formData.leadership || []).map((exp, expIdx) => (
                <div key={expIdx} className="bg-deep/50 border border-ink rounded-xl p-5 space-y-4 relative">
                  <div className="flex items-center justify-between pb-3 border-b border-ink">
                    <span className="text-xs font-mono text-brass font-bold">المحطة #{expIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(expIdx)}
                      className="p-1.5 rounded-lg bg-void border border-ink hover:border-red-500 text-dust hover:text-red-400 transition-colors"
                      title="حذف هذه المحطة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-dust mb-1">المسمى / المنصب (عربي)</label>
                      <input
                        type="text"
                        value={exp.role_ar}
                        onChange={(e) => handleUpdateExperience(expIdx, 'role_ar', e.target.value)}
                        className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-1.5 text-xs text-moonlight outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-dust mb-1">Role / Position (English)</label>
                      <input
                        type="text"
                        value={exp.role_en}
                        onChange={(e) => handleUpdateExperience(expIdx, 'role_en', e.target.value)}
                        className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-1.5 text-xs text-moonlight outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-dust mb-1">اسم المؤسسة (عربي)</label>
                      <input
                        type="text"
                        value={exp.organization_ar}
                        onChange={(e) => handleUpdateExperience(expIdx, 'organization_ar', e.target.value)}
                        className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-1.5 text-xs text-moonlight outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-dust mb-1">الفترة الزمنية</label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => handleUpdateExperience(expIdx, 'period', e.target.value)}
                        className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-1.5 text-xs text-moonlight outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* نقاط الإنجازات (Bullet Points) */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-dust">
                      <span>نقاط المهام والإنجازات (Bullets)</span>
                      <button
                        type="button"
                        onClick={() => handleAddExperienceBullet(expIdx)}
                        className="text-brass hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>إضافة نقطة</span>
                      </button>
                    </div>

                    {exp.points_ar.map((point, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const updated = [...(formData.leadership || [])];
                            updated[expIdx].points_ar[bIdx] = e.target.value;
                            setFormData({ ...formData, leadership: updated });
                          }}
                          className="flex-1 bg-void border border-ink focus:border-brass rounded-lg px-3 py-1 text-xs text-moonlight outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExperienceBullet(expIdx, bIdx)}
                          className="p-1.5 text-dust hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. المهارات ومستويات الإتقان */}
        {activeSubTab === 'skills' && (
          <div className="space-y-6">
            <h3 className="text-sm font-mono text-brass uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>المهارات ومستويات الإتقان (بالنسبة المئوية)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(formData.skills || []).map((cat, catIdx) => (
                <div key={catIdx} className="bg-deep/50 border border-ink rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-ink">
                    <span className="font-bold text-xs text-moonlight">{cat.category_ar}</span>
                    <button
                      type="button"
                      onClick={() => handleAddSkill(catIdx)}
                      className="text-[11px] font-mono text-brass hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>إضافة مهارة</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cat.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="space-y-1 bg-void/50 p-2.5 rounded-lg border border-ink/60">
                        <div className="flex items-center justify-between text-xs">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const updated = [...(formData.skills || [])];
                              updated[catIdx].skills[sIdx].name = e.target.value;
                              setFormData({ ...formData, skills: updated });
                            }}
                            className="bg-transparent border-b border-transparent focus:border-brass text-moonlight text-xs outline-none flex-1 me-2"
                          />
                          <span className="font-mono text-brass text-[11px] font-bold">{skill.level}%</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(catIdx, sIdx)}
                            className="ms-2 text-dust/60 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="50"
                            max="100"
                            value={skill.level}
                            onChange={(e) => handleSkillLevelChange(catIdx, sIdx, parseInt(e.target.value, 10))}
                            className="w-full accent-brass cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* زر الحفظ السفلي */}
        <div className="flex justify-end pt-4 border-t border-ink">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-xl bg-brass text-void font-bold text-xs font-mono flex items-center gap-2 hover:bg-brass-light active:scale-95 transition-all shadow-[0_0_20px_rgba(201,162,39,0.3)] disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>حفظ كل بيانات السيرة الذاتية في قاعدة البيانات</span>
          </button>
        </div>
      </form>
    </div>
  );
};
