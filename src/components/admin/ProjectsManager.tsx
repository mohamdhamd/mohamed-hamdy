// لوحة إدارة المشاريع الشاملة (Projects Manager) مع إضافة وتعديل وحذف ورفع صور
import React, { useState } from 'react';
import { Project } from '../../types';
import { projectsApi, uploadApi } from '../../services/api';
import { soundFX } from '../../utils/audio';
import { getFullStackData } from '../../utils/projectDomains';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Star,
  Search,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Loader2,
  AlertCircle,
  Layers,
  Monitor,
  Server,
  Database,
  Cpu,
} from 'lucide-react';

interface ProjectsManagerProps {
  projects: Project[];
  onRefresh: () => Promise<void>;
  isAddModalOpenInitially?: boolean;
  onCloseAddModalInitially?: () => void;
}

const emptyProject: Partial<Project> = {
  title_ar: '',
  title_en: '',
  summary_ar: '',
  summary_en: '',
  body_ar: '',
  body_en: '',
  cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  gallery: [],
  tech: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB'],
  category: 'fullstack',
  category_label_ar: 'مواقع و Full-Stack',
  category_label_en: 'Full-Stack Apps',
  live_url: '',
  repo_url: '',
  featured: false,
  order: 1,
  status: 'published',
  code_snippet: '',
  fullstack_data: {
    architecture: {
      frontend: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite'],
      backend: ['Node.js', 'Express REST API', 'JWT Middleware'],
      database: ['MongoDB Atlas', 'Mongoose ORM'],
      devops: ['Vercel / Cloud', 'Docker', 'CI/CD Pipelines'],
    },
  },
};

type TierKey = 'frontend' | 'backend' | 'database' | 'devops';

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  onRefresh,
  isAddModalOpenInitially = false,
  onCloseAddModalInitially,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(
    isAddModalOpenInitially ? { ...emptyProject, order: projects.length + 1 } : null
  );
  const [isNew, setIsNew] = useState(isAddModalOpenInitially);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [techInput, setTechInput] = useState('');
  const [tierInputs, setTierInputs] = useState<Record<TierKey, string>>({
    frontend: '',
    backend: '',
    database: '',
    devops: '',
  });
  const [error, setError] = useState<string | null>(null);

  // تصفيات المشاريع
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title_ar.toLowerCase().includes(search.toLowerCase()) ||
      p.title_en.toLowerCase().includes(search.toLowerCase()) ||
      p.tech.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    soundFX.playClick();
    setIsNew(true);
    setEditingProject({
      ...emptyProject,
      order: projects.length + 1,
      fullstack_data: {
        architecture: {
          frontend: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite'],
          backend: ['Node.js', 'Express REST API', 'JWT Middleware'],
          database: ['MongoDB Atlas', 'Mongoose ORM'],
          devops: ['Vercel / Cloud', 'Docker', 'CI/CD Pipelines'],
        },
      },
    });
    setTierInputs({ frontend: '', backend: '', database: '', devops: '' });
    setError(null);
  };

  const handleOpenEdit = (project: Project) => {
    soundFX.playClick();
    setIsNew(false);
    const defaultMeta = getFullStackData(project);
    const existingFullstack = project.fullstack_data || defaultMeta;
    setEditingProject({
      ...project,
      fullstack_data: {
        ...existingFullstack,
        architecture: {
          frontend: existingFullstack.architecture?.frontend || ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite'],
          backend: existingFullstack.architecture?.backend || ['Node.js', 'Express REST API', 'JWT Middleware'],
          database: existingFullstack.architecture?.database || ['MongoDB Atlas', 'Mongoose ORM'],
          devops: existingFullstack.architecture?.devops || ['Vercel / Cloud', 'Docker', 'CI/CD Pipelines'],
        },
      },
    });
    setTierInputs({ frontend: '', backend: '', database: '', devops: '' });
    setError(null);
  };

  const handleAddTierItem = (tier: TierKey) => {
    const val = tierInputs[tier]?.trim().replace(',', '');
    if (!val || !editingProject) return;

    const currentMeta = editingProject.fullstack_data || { architecture: {} };
    const currentArch = currentMeta.architecture || {};
    const currentList = currentArch[tier] || [];

    if (!currentList.includes(val)) {
      setEditingProject({
        ...editingProject,
        fullstack_data: {
          ...currentMeta,
          architecture: {
            ...currentArch,
            [tier]: [...currentList, val],
          },
        },
      });
      soundFX.playClick();
    }
    setTierInputs((prev) => ({ ...prev, [tier]: '' }));
  };

  const handleRemoveTierItem = (tier: TierKey, indexToRemove: number) => {
    if (!editingProject) return;
    const currentMeta = editingProject.fullstack_data || { architecture: {} };
    const currentArch = currentMeta.architecture || {};
    const currentList = currentArch[tier] || [];

    setEditingProject({
      ...editingProject,
      fullstack_data: {
        ...currentMeta,
        architecture: {
          ...currentArch,
          [tier]: currentList.filter((_, idx) => idx !== indexToRemove),
        },
      },
    });
    soundFX.playClick();
  };

  const handleKeyDownTier = (e: React.KeyboardEvent, tier: TierKey) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTierItem(tier);
    }
  };

  const handleCloseModal = () => {
    soundFX.playClick();
    setEditingProject(null);
    if (onCloseAddModalInitially) onCloseAddModalInitially();
  };

  // رفع صورة الغلاف
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    soundFX.playClick();
    try {
      const url = await uploadApi.uploadImage(file);
      setEditingProject((prev) => (prev ? { ...prev, cover: url } : null));
      soundFX.playChime();
    } catch (err: any) {
      alert('فشل رفع الصورة: ' + (err.message || 'خطأ غير معروف'));
    } finally {
      setIsUploading(false);
    }
  };

  // إضافة تاج تقنية
  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = techInput.trim().replace(',', '');
      if (val && editingProject) {
        const currentTech = editingProject.tech || [];
        if (!currentTech.includes(val)) {
          setEditingProject({ ...editingProject, tech: [...currentTech, val] });
        }
        setTechInput('');
      }
    }
  };

  const handleRemoveTech = (tag: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      tech: (editingProject.tech || []).filter((t) => t !== tag),
    });
  };

  // حفظ المشروع (إضافة أو تعديل)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.title_ar?.trim() || !editingProject.title_en?.trim()) {
      setError('يرجى إدخال عنوان المشروع باللغتين العربية والإنجليزية');
      return;
    }

    setIsSaving(true);
    setError(null);
    soundFX.playClick();

    try {
      if (isNew) {
        await projectsApi.create(editingProject);
      } else if (editingProject.id) {
        await projectsApi.update(editingProject.id, editingProject);
      }
      soundFX.playChime();
      await onRefresh();
      setEditingProject(null);
    } catch (err: any) {
      setError(err.message || 'تعذر حفظ المشروع في قاعدة البيانات');
    } finally {
      setIsSaving(false);
    }
  };

  // حذف مشروع
  const handleDelete = async (id: string) => {
    soundFX.playClick();
    try {
      await projectsApi.delete(id);
      soundFX.playChime();
      setDeleteConfirmId(null);
      await onRefresh();
    } catch (err: any) {
      alert('تعذر حذف المشروع: ' + err.message);
    }
  };

  // تبديل حالة النشر
  const handleTogglePublish = async (project: Project) => {
    const newStatus = project.status === 'draft' ? 'published' : 'draft';
    soundFX.playClick();
    try {
      await projectsApi.update(project.id, { status: newStatus });
      await onRefresh();
    } catch (err: any) {
      alert('تعذر تغيير حالة النشر: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* شريط الإجراءات والبحث */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* حقل البحث */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في المشاريع أو التقنيات..."
            className="w-full bg-deep/80 border border-ink focus:border-brass rounded-xl ps-10 pe-4 py-2.5 text-xs text-moonlight placeholder:text-dust/50 outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-dust/60 absolute start-3.5 top-3 pointer-events-none" />
        </div>

        {/* فلاتر التصنيف وزر الإضافة */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-deep/80 border border-ink focus:border-brass rounded-xl px-3 py-2.5 text-xs text-moonlight outline-none"
          >
            <option value="all">كل التصنيفات</option>
            <option value="fullstack">مواقع و Full-Stack (fullstack)</option>
            <option value="data_analysis">تحليل بيانات و BI (data_analysis)</option>
            <option value="accounting">محاسبة وأنظمة مالية CMA (accounting)</option>
            <option value="web">تطبيقات ويب (web)</option>
            <option value="tools">أدوات تفاعلية (tools)</option>
            <option value="systems">أنظمة ولوحات تحكم (systems)</option>
          </select>

          <button
            onClick={handleOpenAdd}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-brass text-void font-bold text-xs flex items-center gap-1.5 hover:bg-brass/90 active:scale-95 transition-all shadow-[0_0_15px_rgba(201,162,39,0.2)]"
          >
            <Plus className="w-4 h-4" />
            <span>مشروع جديد</span>
          </button>
        </div>
      </div>

      {/* قائمة المشاريع */}
      <div className="bg-deep/50 border border-ink rounded-2xl overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 text-dust/60 text-xs font-mono">
            لا توجد مشاريع تطابق البحث والتصنيف المحدد.
          </div>
        ) : (
          <div className="divide-y divide-ink">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-deep/80 transition-colors"
              >
                {/* معلومات المشروع والصورة */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-void border border-ink flex-shrink-0 relative">
                    <img
                      src={project.cover}
                      alt={project.title_ar}
                      className="w-full h-full object-cover"
                    />
                    {project.featured && (
                      <div className="absolute top-1 start-1 bg-brass text-void p-0.5 rounded shadow">
                        <Star className="w-3 h-3 fill-void" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-moonlight text-sm truncate">
                        {project.title_ar}
                      </span>
                      <span className="text-xs font-mono text-dust/60">
                        ({project.title_en})
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-void border border-ink text-dust">
                        #{project.order}
                      </span>
                      {project.status === 'draft' ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300">
                          مسودة (Draft)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300">
                          منشور (Live)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-dust line-clamp-1">{project.summary_ar}</p>

                    {/* التقنيات */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-void/80 border border-ink/80 text-dust/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* أزرار التحكم والإجراءات */}
                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  {/* تبديل حالة النشر */}
                  <button
                    onClick={() => handleTogglePublish(project)}
                    title={project.status === 'draft' ? 'نشر المشروع للعامة' : 'تحويل لمسودة خاصة'}
                    className="p-2 rounded-lg bg-void border border-ink hover:border-brass text-dust hover:text-brass transition-colors"
                  >
                    {project.status === 'draft' ? (
                      <EyeOff className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>

                  {/* تعديل */}
                  <button
                    onClick={() => handleOpenEdit(project)}
                    title="تعديل المشروع"
                    className="p-2 rounded-lg bg-void border border-ink hover:border-brass text-dust hover:text-brass transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* حذف */}
                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    title="حذف المشروع"
                    className="p-2 rounded-lg bg-void border border-ink hover:border-red-500 text-dust hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* نافذة تأكيد الحذف */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-void/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-deep border border-red-900/60 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-moonlight text-sm">تأكيد حذف المشروع</h3>
            <p className="text-xs text-dust">
              هل أنت متأكد من رغبتك في حذف هذا المشروع نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg bg-void border border-ink text-xs text-dust hover:text-moonlight"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة الإضافة والتعديل المنبثقة (Modal Drawer) */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-void/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-deep border border-ink rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl relative">
            {/* الترويسة */}
            <div className="p-5 border-b border-ink flex items-center justify-between bg-void/50">
              <h2 className="font-bold font-display text-moonlight text-base sm:text-lg flex items-center gap-2">
                <span>{isNew ? 'إضافة مشروع فلكي جديد' : `تعديل مشروع: ${editingProject.title_ar}`}</span>
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg bg-void border border-ink text-dust hover:text-moonlight transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* النموذج */}
            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {error && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* العناوين باللغتين جنباً إلى جنب */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    عنوان المشروع (عربي) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title_ar || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title_ar: e.target.value })}
                    placeholder="منصة تحليلات مالية وتوقعات ذكية"
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    عنوان المشروع (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title_en || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title_en: e.target.value })}
                    placeholder="Apex — Financial Analytics Dashboard"
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>
              </div>

              {/* الملخص القصير (سطرين للكارت) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    الوصف المختصر للكارت (عربي) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editingProject.summary_ar || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, summary_ar: e.target.value })}
                    placeholder="لوحة تحكم تفاعلية متقدمة لمعالجة البيانات..."
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    الوصف المختصر للكارت (English) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editingProject.summary_en || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, summary_en: e.target.value })}
                    placeholder="Real-time analytics dashboard with dynamic charts..."
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>
              </div>

              {/* الوصف الكامل للـ Modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    التفاصيل والشرح الكامل (عربي)
                  </label>
                  <textarea
                    rows={4}
                    value={editingProject.body_ar || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, body_ar: e.target.value })}
                    placeholder="شرح متعمق لهندسة المشروع والمميزات التقنية..."
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    التفاصيل والشرح الكامل (English)
                  </label>
                  <textarea
                    rows={4}
                    value={editingProject.body_en || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, body_en: e.target.value })}
                    placeholder="Full in-depth engineering explanation..."
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>
              </div>

              {/* صورة الغلاف مع خيار الرفع أو الرابط */}
              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">
                  صورة الغلاف (Cover Image)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <input
                    type="text"
                    value={editingProject.cover || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, cover: e.target.value })}
                    placeholder="رابط الصورة https://..."
                    className="flex-1 bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none w-full"
                  />

                  {/* زر الرفع من الجهاز */}
                  <label className="cursor-pointer px-3.5 py-2 rounded-lg bg-void border border-ink hover:border-brass text-dust hover:text-brass text-xs flex items-center gap-1.5 transition-colors flex-shrink-0">
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-brass" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{isUploading ? 'جاري الرفع...' : 'رفع من الجهاز'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {/* معاينة فورية للصورة */}
                {editingProject.cover && (
                  <div className="mt-2.5 w-32 h-20 rounded-lg overflow-hidden border border-ink bg-void">
                    <img
                      src={editingProject.cover}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* التصنيف والترتيب */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    التصنيف (Category)
                  </label>
                  <select
                    value={editingProject.category || 'web'}
                    onChange={(e) => {
                      const val = e.target.value;
                      let labelAr = 'مواقع و Full-Stack';
                      let labelEn = 'Full-Stack Apps';
                      if (val === 'data_analysis') {
                        labelAr = 'تحليل بيانات و BI';
                        labelEn = 'Data Analysis & BI';
                      } else if (val === 'accounting') {
                        labelAr = 'محاسبة وأنظمة مالية CMA';
                        labelEn = 'Accounting & CMA';
                      } else if (val === 'tools') {
                        labelAr = 'أدوات تفاعلية';
                        labelEn = 'Interactive Tools';
                      } else if (val === 'systems') {
                        labelAr = 'أنظمة ولوحات تحكم';
                        labelEn = 'Systems & Dashboards';
                      }
                      setEditingProject({
                        ...editingProject,
                        category: val,
                        category_label_ar: labelAr,
                        category_label_en: labelEn,
                      });
                    }}
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  >
                    <option value="fullstack">تطوير مواقع و Full-Stack (استوديو الويب المتجاوب)</option>
                    <option value="data_analysis">تحليل بيانات و BI (استوديو الرسوم والجداول)</option>
                    <option value="accounting">محاسبة وأنظمة مالية CMA (حاسبة CVP والقوائم)</option>
                    <option value="web">تطبيقات ويب (Web Apps)</option>
                    <option value="tools">أدوات تفاعلية (Interactive Tools)</option>
                    <option value="systems">أنظمة ولوحات تحكم (Systems & Dashboards)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    الترتيب (Order)
                  </label>
                  <input
                    type="number"
                    value={editingProject.order || 1}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    حالة النشر (Status)
                  </label>
                  <select
                    value={editingProject.status || 'published'}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        status: e.target.value as 'published' | 'draft',
                      })
                    }
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  >
                    <option value="published">منشور للعامة (Published)</option>
                    <option value="draft">مسودة خاصة (Draft)</option>
                  </select>
                </div>
              </div>

              {/* الروابط */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    رابط المعاينة الحية (Live URL)
                  </label>
                  <input
                    type="url"
                    value={editingProject.live_url || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, live_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    رابط كود المشروع (GitHub Repo)
                  </label>
                  <input
                    type="url"
                    value={editingProject.repo_url || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, repo_url: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>
              </div>

              {/* التقنيات المستخدمة (Tags) */}
              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">
                  التقنيات المستخدمة (اضغط Enter للإضافة)
                </label>
                <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-void border border-ink min-h-[44px] items-center">
                  {(editingProject.tech || []).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-deep border border-brass/30 text-moonlight"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tag)}
                        className="text-dust hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddTech}
                    placeholder="اكتب تقنية واضغط Enter..."
                    className="bg-transparent text-xs text-moonlight outline-none flex-1 min-w-[140px] px-1"
                  />
                </div>
              </div>

              {/* مقتطف الكود (Code Snippet) */}
              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">
                  مقتطف الكود البرمجي المميز (Code Snippet)
                </label>
                <textarea
                  rows={3}
                  value={editingProject.code_snippet || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, code_snippet: e.target.value })
                  }
                  placeholder="// اكتب دالة أو كود برمجي يعرض دقة هندسة المشروع..."
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg p-3 text-xs font-mono text-moonlight outline-none"
                />
              </div>

              {/* معمارية النظام والطبقات البرمجية (Full-Stack Architecture Tiers) */}
              <div className="p-5 rounded-2xl bg-deep/80 border border-ink space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink/80 pb-3">
                  <div className="flex items-center gap-2 text-brass">
                    <Layers className="w-4 h-4" />
                    <span className="font-bold text-xs sm:text-sm font-display">
                      معمارية النظام والطبقات البرمجية (Full-Stack Architecture Tiers)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-dust/70">
                    N-Tier Decoupled Architecture
                  </span>
                </div>

                <p className="text-xs text-dust">
                  تحكم في التقنيات والأدوات المعروضة داخل كل طبقة من طبقات النظام الأربعة في نافذة تفاصيل المشروع:
                </p>

                {/* شبكة الطبقات الأربعة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. الواجهة (Frontend Tier) */}
                  <div className="p-3.5 rounded-xl bg-void/70 border border-ink/80 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono text-brass">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Monitor className="w-3.5 h-3.5" />
                        <span>1. الواجهة (Client / Frontend)</span>
                      </div>
                      <span className="text-[10px] text-dust">UI & State</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center p-1.5 bg-deep/50 rounded-lg border border-ink/60">
                      {(editingProject.fullstack_data?.architecture?.frontend || []).map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-void border border-brass/25 text-[11px] font-mono text-moonlight"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTierItem('frontend', idx)}
                            className="text-dust hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tierInputs.frontend}
                        onChange={(e) => setTierInputs({ ...tierInputs, frontend: e.target.value })}
                        onKeyDown={(e) => handleKeyDownTier(e, 'frontend')}
                        placeholder="أضف تقنية واضغط Enter..."
                        className="flex-1 bg-void border border-ink focus:border-brass rounded-lg px-2.5 py-1.5 text-xs text-moonlight outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTierItem('frontend')}
                        className="px-2.5 py-1.5 rounded-lg bg-deep border border-ink hover:border-brass text-dust hover:text-brass text-xs font-mono shrink-0"
                      >
                        + إضافة
                      </button>
                    </div>
                  </div>

                  {/* 2. الخادم (Backend Tier) */}
                  <div className="p-3.5 rounded-xl bg-void/70 border border-ink/80 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono text-sky-400">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Server className="w-3.5 h-3.5" />
                        <span>2. الخادم (REST API / Backend)</span>
                      </div>
                      <span className="text-[10px] text-dust">Server & Auth</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center p-1.5 bg-deep/50 rounded-lg border border-ink/60">
                      {(editingProject.fullstack_data?.architecture?.backend || []).map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-void border border-sky-500/25 text-[11px] font-mono text-moonlight"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTierItem('backend', idx)}
                            className="text-dust hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tierInputs.backend}
                        onChange={(e) => setTierInputs({ ...tierInputs, backend: e.target.value })}
                        onKeyDown={(e) => handleKeyDownTier(e, 'backend')}
                        placeholder="أضف تقنية واضغط Enter..."
                        className="flex-1 bg-void border border-ink focus:border-brass rounded-lg px-2.5 py-1.5 text-xs text-moonlight outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTierItem('backend')}
                        className="px-2.5 py-1.5 rounded-lg bg-deep border border-ink hover:border-brass text-dust hover:text-brass text-xs font-mono shrink-0"
                      >
                        + إضافة
                      </button>
                    </div>
                  </div>

                  {/* 3. قاعدة البيانات (Database Tier) */}
                  <div className="p-3.5 rounded-xl bg-void/70 border border-ink/80 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Database className="w-3.5 h-3.5" />
                        <span>3. قاعدة البيانات (Database)</span>
                      </div>
                      <span className="text-[10px] text-dust">Data & ORM</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center p-1.5 bg-deep/50 rounded-lg border border-ink/60">
                      {(editingProject.fullstack_data?.architecture?.database || []).map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-void border border-emerald-500/25 text-[11px] font-mono text-moonlight"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTierItem('database', idx)}
                            className="text-dust hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tierInputs.database}
                        onChange={(e) => setTierInputs({ ...tierInputs, database: e.target.value })}
                        onKeyDown={(e) => handleKeyDownTier(e, 'database')}
                        placeholder="أضف قاعدة واضغط Enter..."
                        className="flex-1 bg-void border border-ink focus:border-brass rounded-lg px-2.5 py-1.5 text-xs text-moonlight outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTierItem('database')}
                        className="px-2.5 py-1.5 rounded-lg bg-deep border border-ink hover:border-brass text-dust hover:text-brass text-xs font-mono shrink-0"
                      >
                        + إضافة
                      </button>
                    </div>
                  </div>

                  {/* 4. السحابة والنشر (DevOps Tier) */}
                  <div className="p-3.5 rounded-xl bg-void/70 border border-ink/80 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono text-purple-400">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>4. السحابة والنشر (DevOps & Cloud)</span>
                      </div>
                      <span className="text-[10px] text-dust">CI/CD & Cloud</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center p-1.5 bg-deep/50 rounded-lg border border-ink/60">
                      {(editingProject.fullstack_data?.architecture?.devops || []).map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-void border border-purple-500/25 text-[11px] font-mono text-moonlight"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTierItem('devops', idx)}
                            className="text-dust hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tierInputs.devops}
                        onChange={(e) => setTierInputs({ ...tierInputs, devops: e.target.value })}
                        onKeyDown={(e) => handleKeyDownTier(e, 'devops')}
                        placeholder="أضف أداة سحابية واضغط Enter..."
                        className="flex-1 bg-void border border-ink focus:border-brass rounded-lg px-2.5 py-1.5 text-xs text-moonlight outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTierItem('devops')}
                        className="px-2.5 py-1.5 rounded-lg bg-deep border border-ink hover:border-brass text-dust hover:text-brass text-xs font-mono shrink-0"
                      >
                        + إضافة
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* خيار المشروع المميز (Featured) */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-void/60 border border-ink">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={editingProject.featured || false}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, featured: e.target.checked })
                  }
                  className="w-4 h-4 accent-brass rounded cursor-pointer"
                />
                <label htmlFor="featured-check" className="text-xs text-moonlight cursor-pointer select-none">
                  تمييز كمشروع رئيسي (Featured) — يأخذ كارت عريض بنجمة ذهبية في أول الشبكة
                </label>
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg bg-void border border-ink text-xs text-dust hover:text-moonlight"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-brass text-void font-bold text-xs flex items-center gap-2 hover:bg-brass/90 disabled:opacity-50 shadow-[0_0_15px_rgba(201,162,39,0.2)]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الحفظ في MongoDB...</span>
                    </>
                  ) : (
                    <span>{isNew ? 'إضافة المشروع' : 'حفظ التعديلات'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
