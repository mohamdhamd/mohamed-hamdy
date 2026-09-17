// لوحة إدارة الشهادات والمسار المهني (Certificates Manager)
import React, { useState } from 'react';
import { Certificate } from '../../types';
import { certificatesApi } from '../../services/api';
import { soundFX } from '../../utils/audio';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from 'lucide-react';

interface CertificatesManagerProps {
  certificates: Certificate[];
  onRefresh: () => Promise<void>;
}

const emptyCert: Partial<Certificate> = {
  title_ar: '',
  title_en: '',
  issuer: '',
  issuer_en: '',
  issue_date: '٢٠٢٤',
  issue_date_en: '2024',
  credential_url: '',
  status_ar: 'معتمد وموثق',
  status_en: 'Verified',
  order: 1,
};

export const CertificatesManager: React.FC<CertificatesManagerProps> = ({
  certificates,
  onRefresh,
}) => {
  const [editingCert, setEditingCert] = useState<Partial<Certificate> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ترتيب الشهادات تصاعدياً بحسب رقم الترتيب
  const sortedCertificates = [...certificates].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleOpenAdd = () => {
    soundFX.playClick();
    setIsNew(true);
    setEditingCert({
      ...emptyCert,
      order: certificates.length + 1,
    });
    setError(null);
  };

  const handleOpenEdit = (cert: Certificate) => {
    soundFX.playClick();
    setIsNew(false);
    setEditingCert({ ...cert });
    setError(null);
  };

  // تقديم أو تأخير ترتيب الشهادة بضغطة زر وتحديث الباك إند فوراً
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedCertificates.length) return;

    soundFX.playClick();
    const newItems = [...sortedCertificates];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    const itemsToUpdate = newItems.map((item, idx) => ({
      id: item.id,
      order: idx + 1,
    }));

    setIsSaving(true);
    try {
      await certificatesApi.reorder(itemsToUpdate);
      soundFX.playChime();
      await onRefresh();
    } catch (err: any) {
      alert('تعذر تحديث ترتيب الشهادات: ' + (err.message || 'خطأ في الاتصال'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    if (!editingCert.title_ar?.trim() || !editingCert.issuer?.trim()) {
      setError('يرجى إدخال عنوان الشهادة وجهة الاعتماد');
      return;
    }

    setIsSaving(true);
    setError(null);
    soundFX.playClick();

    try {
      if (isNew) {
        await certificatesApi.create(editingCert);
      } else if (editingCert.id) {
        await certificatesApi.update(editingCert.id, editingCert);
      }
      soundFX.playChime();
      await onRefresh();
      setEditingCert(null);
    } catch (err: any) {
      setError(err.message || 'تعذر حفظ الشهادة');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    soundFX.playClick();
    try {
      await certificatesApi.delete(id);
      soundFX.playChime();
      setDeleteConfirmId(null);
      await onRefresh();
    } catch (err: any) {
      alert('تعذر حذف الشهادة: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* شريط الإجراءات */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-moonlight flex items-center gap-2">
            <span>إدارة الشهادات والمسار المهني</span>
            {isSaving && <Loader2 className="w-4 h-4 text-brass animate-spin" />}
          </h2>
          <p className="text-xs text-dust">
            المحطات التعليمية والاعتمادات المعروضة في خط الأبراج الفلكية الزمني
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-brass text-void font-bold text-xs flex items-center gap-1.5 hover:bg-brass/90 active:scale-95 transition-all shadow-[0_0_15px_rgba(201,162,39,0.2)] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة اعتماد جديد</span>
        </button>
      </div>

      {/* تنبيه إرشادي لطريقة عمل الترتيب وعرض أول 3 */}
      <div className="p-3.5 rounded-xl bg-brass/10 border border-brass/20 text-xs text-dust flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-brass flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-moonlight font-bold">
            نظام العرض الذكي: أول 3 شهادات فقط تظهر مباشرة في الصفحة الرئيسية!
          </p>
          <p className="text-[11px] text-dust">
            الشهادات التي تحمل الترتيب <span className="text-brass font-mono font-bold">#1 و #2 و #3</span> تظهر أولاً، وباقي الشهادات تظهر للزائر عند الضغط على زر <span className="text-brass font-bold">"عرض المزيد"</span>. يمكنك استخدام أزرار الأسهم (▲ / ▼) لتغيير الترتيب فوراً.
          </p>
        </div>
      </div>

      {/* قائمة الشهادات المرتبة */}
      <div className="bg-deep/50 border border-ink rounded-2xl overflow-hidden divide-y divide-ink">
        {sortedCertificates.map((cert, index) => {
          const isTopThree = index < 3;
          return (
            <div
              key={cert.id}
              className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                isTopThree ? 'bg-void/40 hover:bg-deep/80' : 'hover:bg-deep/80 opacity-90'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* أزرار إعادة الترتيب للأعلى وللأسفل */}
                <div className="flex flex-col gap-1 items-center justify-center pt-0.5">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0 || isSaving}
                    title="تحريك للأعلى (تقديم الترتيب)"
                    className="p-1 rounded bg-void border border-ink hover:border-brass text-dust hover:text-brass disabled:opacity-20 disabled:hover:border-ink disabled:hover:text-dust transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-dust font-bold">
                    #{cert.order || index + 1}
                  </span>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === sortedCertificates.length - 1 || isSaving}
                    title="تحريك للأسفل (تأخير الترتيب)"
                    className="p-1 rounded bg-void border border-ink hover:border-brass text-dust hover:text-brass disabled:opacity-20 disabled:hover:border-ink disabled:hover:text-dust transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-11 h-11 rounded-xl bg-void border border-brass/30 flex items-center justify-center text-brass flex-shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-moonlight text-sm">{cert.title_ar}</h3>
                    <span className="text-xs text-dust/60 font-mono">({cert.title_en})</span>

                    {/* وسم الظهور في أول 3 أو تحت المزيد */}
                    {isTopThree ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brass/20 text-brass border border-brass/40 font-bold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>الواجهة الافتراضية (#{index + 1})</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-void border border-ink text-dust">
                        تحت زر المزيد (#{index + 1})
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-dust">
                    {cert.issuer} · <span className="font-mono text-moonlight">{cert.issue_date}</span>
                  </p>

                  <div className="flex items-center gap-3 text-[11px] pt-1">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{cert.status_ar}</span>
                    </span>

                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brass hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>الرابط الموثق</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleOpenEdit(cert)}
                  title="تعديل الشهادة"
                  className="p-2 rounded-lg bg-void border border-ink hover:border-brass text-dust hover:text-brass transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(cert.id)}
                  title="حذف الشهادة"
                  className="p-2 rounded-lg bg-void border border-ink hover:border-red-500 text-dust hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* نافذة تأكيد الحذف */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-void/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-deep border border-red-900/60 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-moonlight text-sm">تأكيد حذف الاعتماد</h3>
            <p className="text-xs text-dust">هل تريد بالتأكيد حذف هذه الشهادة من الخط الزمني؟</p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg bg-void border border-ink text-xs text-dust"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة الإضافة والتعديل */}
      {editingCert && (
        <div className="fixed inset-0 z-50 bg-void/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-deep border border-ink rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-ink flex items-center justify-between bg-void/50">
              <h2 className="font-bold font-display text-moonlight text-sm sm:text-base flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brass" />
                <span>{isNew ? 'إضافة اعتماد / شهادة جديدة' : 'تعديل الاعتماد'}</span>
              </h2>
              <button
                onClick={() => setEditingCert(null)}
                className="p-1.5 rounded-lg bg-void border border-ink text-dust hover:text-moonlight"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    عنوان الشهادة (عربي) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.title_ar || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, title_ar: e.target.value })}
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    عنوان الشهادة (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.title_en || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, title_en: e.target.value })}
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    جهة الإصدار / التخصص (عربي)
                  </label>
                  <input
                    type="text"
                    value={editingCert.issuer || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">
                    جهة الإصدار (English)
                  </label>
                  <input
                    type="text"
                    value={editingCert.issuer_en || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer_en: e.target.value })}
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">سنة الإصدار (عربي)</label>
                  <input
                    type="text"
                    value={editingCert.issue_date || '٢٠٢٤'}
                    onChange={(e) => setEditingCert({ ...editingCert, issue_date: e.target.value })}
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">سنة الإصدار (EN)</label>
                  <input
                    type="text"
                    value={editingCert.issue_date_en || '2024'}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, issue_date_en: e.target.value })
                    }
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-dust mb-1.5">الترتيب</label>
                  <input
                    type="number"
                    value={editingCert.order || 1}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">
                  رابط إثبات الشهادة (Credential URL)
                </label>
                <input
                  type="url"
                  value={editingCert.credential_url || ''}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, credential_url: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 rounded-lg bg-void border border-ink text-xs text-dust hover:text-moonlight"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-brass text-void font-bold text-xs flex items-center gap-2 hover:bg-brass/90 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{isNew ? 'إضافة' : 'حفظ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
