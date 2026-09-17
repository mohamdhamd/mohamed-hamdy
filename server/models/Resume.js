// نموذج السيرة الذاتية الرسمية القابلة للتخصيص من لوحة التحكم
import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    personal: {
      name_ar: { type: String, default: 'محمد حمدي فوزي' },
      name_en: { type: String, default: 'Mohamed Hamdy Fawzy' },
      title_ar: { type: String, default: 'خريج محاسبة (86%) · متخصص تحليل بيانات ونمذجة مالية ومطور برمجيات' },
      title_en: { type: String, default: 'Accounting Graduate (86%) · Financial Analyst & Web Developer' },
      location_ar: { type: String, default: 'الزقازيق، الشرقية، مصر' },
      location_en: { type: String, default: 'Zagazig, Al Sharqia, Egypt' },
      phone: { type: String, default: '+201152999615' },
      email: { type: String, default: 'mohamed.hamdy.fawzy0@gmail.com' },
      linkedin: { type: String, default: 'linkedin.com/in/mohamed-hamdey' },
      linkedin_url: { type: String, default: 'https://www.linkedin.com/in/mohamed-hamdey/' },
      youtube_url: { type: String, default: 'https://www.youtube.com/@coding-keys' },
      facebook_url: { type: String, default: 'https://www.facebook.com/m0hamedhamdy1/?locale=ar_AR' },
      military_status_ar: { type: String, default: 'مؤجل' },
      military_status_en: { type: String, default: 'Postponed' },
      pdf_filename: { type: String, default: 'Mohamed_Hamdy_CV.pdf' },
      pdf_url: { type: String, default: '/Mohamed_Hamdy_CV.pdf' },
    },
    summary: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    education: {
      degree_ar: { type: String, default: 'بكالوريوس التجارة - شعبة اللغة الإنجليزية (قسم المحاسبة)' },
      degree_en: { type: String, default: "Bachelor's degree of Accounting – Faculty of Commerce (English Section)" },
      institution_ar: { type: String, default: 'جامعة الزقازيق' },
      institution_en: { type: String, default: 'Zagazig University' },
      period: { type: String, default: '2022 – 2026' },
      grade_ar: { type: String, default: 'تقدير جيد جداً بنسبة 86%' },
      grade_en: { type: String, default: 'Very Good (86%)' },
    },
    stats: [
      {
        label_ar: String,
        label_en: String,
        value: String,
      },
    ],
    leadership: [
      {
        role_ar: String,
        role_en: String,
        organization_ar: String,
        organization_en: String,
        period: String,
        points_ar: [String],
        points_en: [String],
      },
    ],
    skills: [
      {
        category_ar: String,
        category_en: String,
        iconName: String,
        skills: [
          {
            name: String,
            level: Number,
            highlight: Boolean,
          },
        ],
      },
    ],
    tracks: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model('Resume', resumeSchema);
