// لوحة إدارة نصوص وإعدادات الموقع (Site Settings Manager)
import React, { useState } from 'react';
import { SiteSettings } from '../../types';
import { settingsApi } from '../../services/api';
import { soundFX } from '../../utils/audio';
import { Sliders, Save, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface SiteSettingsManagerProps {
  settings: SiteSettings;
  onRefresh: () => Promise<void>;
}

export const SiteSettingsManager: React.FC<SiteSettingsManagerProps> = ({
  settings,
  onRefresh,
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setError(null);
    soundFX.playClick();

    try {
      await settingsApi.update(formData);
      soundFX.playChime();
      setSuccessMessage('تم حفظ وتحديث إعدادات الموقع بنجاح في MongoDB!');
      await onRefresh();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'تعذر حفظ إعدادات الموقع');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold font-display text-moonlight flex items-center gap-2">
          <Sliders className="w-5 h-5 text-brass" />
          <span>تخصيص نصوص ومعلومات الموقع (CMS)</span>
        </h2>
        <p className="text-xs text-dust">
          أي تعديل تقوم بحفظه هنا سينعكس فورياً على الواجهة الأمامية للموقع.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* قسم الهيرو (Hero Section) */}
        <div className="bg-deep/50 border border-ink rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-mono text-brass uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>بيانات قسم البداية (Hero Section)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-dust mb-1.5">
                الاسم المعروض (عربي)
              </label>
              <input
                type="text"
                value={formData.hero_name_ar}
                onChange={(e) => setFormData({ ...formData, hero_name_ar: e.target.value })}
                className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-dust mb-1.5">
                الاسم المعروض (English)
              </label>
              <input
                type="text"
                value={formData.hero_name_en}
                onChange={(e) => setFormData({ ...formData, hero_name_en: e.target.value })}
                className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-dust mb-1.5">
                المسمى الرئيسي (عربي)
              </label>
              <input
                type="text"
                value={formData.hero_title_ar}
                onChange={(e) => setFormData({ ...formData, hero_title_ar: e.target.value })}
                className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-dust mb-1.5">
                المسمى الرئيسي (English)
              </label>
              <input
                type="text"
                value={formData.hero_title_en}
                onChange={(e) => setFormData({ ...formData, hero_title_en: e.target.value })}
                className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-dust mb-1.5">
                النبذة التوضيحية (عربي)
              </label>
              <textarea
                rows={3}
                value={formData.hero_subtitle_ar}
                onChange={(e) => setFormData({ ...formData, hero_subtitle_ar: e.target.value })}
                className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-dust mb-1.5">
                النبذة التوضيحية (English)
              </label>
              <textarea
                rows={3}
                value={formData.hero_subtitle_en}
                onChange={(e) => setFormData({ ...formData, hero_subtitle_en: e.target.value })}
                className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
              />
            </div>
          </div>
        </div>

        {/* روابط التواصل والبريد والشبكات الاجتماعية */}
        <div className="bg-deep/50 border border-ink rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-mono text-brass uppercase tracking-wider">
            روابط التواصل والمراسلة والشبكات الاجتماعية
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-dust mb-1.5">
                البريد الإلكتروني الرسمي
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-dust mb-1.5">
                رابط حساب LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedin_url || ''}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                placeholder="https://www.linkedin.com/in/..."
                className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-dust mb-1.5">
                رابط حساب GitHub
              </label>
              <input
                type="url"
                value={formData.github_url || ''}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-dust mb-1.5 text-red-400">
                رابط قناة YouTube
              </label>
              <input
                type="url"
                value={formData.youtube_url || ''}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="https://www.youtube.com/@..."
                className="w-full bg-void border border-ink focus:border-red-500 rounded-lg px-3 py-2 text-xs text-moonlight outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-dust mb-1.5 text-blue-400">
                رابط حساب Facebook
              </label>
              <input
                type="url"
                value={formData.facebook_url || ''}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                placeholder="https://www.facebook.com/..."
                className="w-full bg-void border border-ink focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-moonlight outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* الاعتماد والموقع الجغرافي */}
        <div className="bg-deep/50 border border-ink rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-mono text-brass uppercase tracking-wider">
            شارة الاعتماد والتوقيت
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-dust mb-1.5">
                شارة مسار CMA والمحاسبة (عربي)
              </label>
              <input
                type="text"
                value={formData.cma_status_ar}
                onChange={(e) => setFormData({ ...formData, cma_status_ar: e.target.value })}
                className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-dust mb-1.5">
                شارة CMA (English)
              </label>
              <input
                type="text"
                value={formData.cma_status_en}
                onChange={(e) => setFormData({ ...formData, cma_status_en: e.target.value })}
                className="w-full bg-void border border-ink focus:border-brass rounded-lg px-3 py-2 text-xs text-moonlight outline-none"
              />
            </div>
          </div>
        </div>

        {/* زر الحفظ */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-brass text-void font-bold text-xs flex items-center gap-2 hover:bg-brass/90 active:scale-95 transition-all shadow-[0_0_20px_rgba(201,162,39,0.3)] disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>حفظ كل الإعدادات في قاعدة البيانات</span>
          </button>
        </div>
      </form>
    </div>
  );
};
