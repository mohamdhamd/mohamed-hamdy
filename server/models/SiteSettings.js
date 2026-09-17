// نموذج إعدادات ونصوص الموقع القابلة للتخصيص من لوحة التحكم
import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    hero_name_ar: {
      type: String,
      default: 'محمد حمدي',
    },
    hero_name_en: {
      type: String,
      default: 'Mohamed Hamdy Fawzy',
    },
    hero_title_ar: {
      type: String,
      default: 'خريج محاسبة (86%) · متخصص تحليل بيانات ونمذجة مالية ومطور Full-Stack',
    },
    hero_title_en: {
      type: String,
      default: 'Accounting Graduate (86%) · Financial Analyst, Data Analyst & Full-Stack Developer',
    },
    hero_subtitle_ar: {
      type: String,
      default:
        'خريج كلية التجارة شعبة اللغة الإنجليزية قسم المحاسبة (تقدير جيد جداً بنسبة 86%)، متخصص في تطبيق وتخصيص أنظمة Odoo ERP وحلول ذكاء الأعمال في Power BI ونمذجة Excel المتقدم، إلى جانب بناء وتطوير تطبيقات الويب المتكاملة بنظام MERN Stack.',
    },
    hero_subtitle_en: {
      type: String,
      default:
        'Faculty of Commerce Accounting Graduate – English Section (Very Good - 86%), specialized in Odoo ERP implementation, Microsoft Power BI intelligence, and financial Excel modeling alongside full-stack MERN engineering.',
    },
    email: {
      type: String,
      default: 'mohamed.hamdy.fawzy0@gmail.com',
    },
    github_url: {
      type: String,
      default: 'https://github.com/mohamdhamd',
    },
    linkedin_url: {
      type: String,
      default: 'https://www.linkedin.com/in/mohamed-hamdey/',
    },
    youtube_url: {
      type: String,
      default: 'https://www.youtube.com/@coding-keys',
    },
    facebook_url: {
      type: String,
      default: 'https://www.facebook.com/m0hamedhamdy1/?locale=ar_AR',
    },
    cma_status_ar: {
      type: String,
      default: 'خريج كلية التجارة (86%) · محاسب مالي & Odoo ERP',
    },
    cma_status_en: {
      type: String,
      default: 'Commerce English Graduate (86%) · Financial Accountant & Odoo ERP',
    },
    location_ar: {
      type: String,
      default: 'الشرقية / القاهرة، مصر (توقيت مصر GMT+3)',
    },
    location_en: {
      type: String,
      default: 'Sharkia / Cairo, Egypt (Africa/Cairo GMT+3)',
    },
    stats: {
      projects_count: { type: Number, default: 6 },
      years_exp: { type: Number, default: 3 },
      satisfaction_rate: { type: String, default: '100%' },
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
