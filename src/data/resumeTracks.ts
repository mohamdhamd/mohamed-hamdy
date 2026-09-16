// مسارات وتخصصات السيرة الذاتية المستقلة (Accounting, Data Analysis, Full-Stack, Master)
export type ResumeTrackId = 'all' | 'accountant' | 'data_analyst' | 'fullstack';

export interface ResumeTrackConfig {
  id: ResumeTrackId;
  label_ar: string;
  label_en: string;
  tabLabel_ar: string;
  tabLabel_en: string;
  iconName: 'Sparkles' | 'Scale' | 'BarChart3' | 'Code2';
  badge_ar: string;
  badge_en: string;
  title_ar: string;
  title_en: string;
  summary_ar: string;
  summary_en: string;
  stats: { label_ar: string; label_en: string; value: string }[];
  accentColor: string;
  accentBorder: string;
  accentBg: string;
  highlightedCertIndices: number[];
  priorityCategory: 'all' | 'data' | 'accounting' | 'code';
  // الحقول الخاصة بربط وتنسيب الشهادات بالمسار المختار
  certSectionTitle_ar: string;
  certSectionTitle_en: string;
  certSectionDesc_ar: string;
  certSectionDesc_en: string;
  certBadgeText_ar: string;
  certBadgeText_en: string;
  trackCertIndices: number[];
}

export const resumeTracks: Record<ResumeTrackId, ResumeTrackConfig> = {
  all: {
    id: 'all',
    label_ar: 'النسخة الأساسية (الشاملة)',
    label_en: 'Master Profile (All Disciplines)',
    tabLabel_ar: 'النسخة الأساسية (الشاملة)',
    tabLabel_en: 'Master Profile',
    iconName: 'Sparkles',
    badge_ar: 'خريج كلية التجارة - قسم المحاسبة (تقدير 86%)',
    badge_en: 'Faculty of Commerce Accounting Graduate (Grade: 86%)',
    title_ar: 'خريج محاسبة (86%) · متخصص تحليل بيانات ونمذجة مالية ومطور برمجيات',
    title_en: 'Accounting Graduate (86%) · Financial Analyst & Web Developer',
    summary_ar:
      'خريج كلية التجارة شعبة اللغة الإنجليزية قسم المحاسبة (تقدير جيد جداً بنسبة 86%)، متخصص في التحليل المالي، تحليل البيانات، وتطوير تطبيقات الويب. متمرس عملياً في النمذجة البيانية وحلول ذكاء الأعمال باستخدام Power BI و Excel المتقدم ونظام Odoo ERP. أسعى لشغل دور يدمج الدقة المحاسبية الصارمة مع الحلول البرمجية الحديثة لخلق قيمة ملموسة.',
    summary_en:
      'Accounting graduate – English Section (Very Good - 86%) specializing in financial analysis, data analytics, and web development. Equipped with practical skills in data modeling and business intelligence using Power BI. Seeking a challenging role in a data-driven environment to bridge the gap between finance and technology, utilizing analytical skills and English language proficiency.',
    stats: [
      { label_ar: 'التقدير التراكمي', label_en: 'Cumulative Grade', value: '86%' },
      { label_ar: 'ساعات تدريب Odoo ERP', label_en: 'Odoo Training Hours', value: '84+ hrs' },
      { label_ar: 'شهادات تخصصية معتمدة', label_en: 'Certified Specializations', value: '10+' },
      { label_ar: 'خبرات قيادية وتقنية', label_en: 'Leadership Positions', value: '4 roles' },
    ],
    accentColor: '#C9A227',
    accentBorder: 'border-brass/40',
    accentBg: 'bg-brass/10',
    highlightedCertIndices: [0, 1, 2, 5, 7],
    priorityCategory: 'all',
    certSectionTitle_ar: 'كافة الشهادات والاعتمادات المهنية المعتمدة (10 اعتمادات)',
    certSectionTitle_en: 'All Professional Certifications & Training (10 Verified)',
    certSectionDesc_ar:
      'السجل الكامل لجميع الشهادات والدبلومات المعتمدة في مجالات المحاسبة المالية، ذكاء الأعمال، وهندسة البرمجيات.',
    certSectionDesc_en:
      'Comprehensive record of all accredited certificates and diplomas across Accounting, Data Analytics, and Software Engineering.',
    certBadgeText_ar: 'شهادة معتمدة وموثقة',
    certBadgeText_en: 'Verified Professional Credential',
    trackCertIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },

  accountant: {
    id: 'accountant',
    label_ar: 'نسخة المحاسب المالي & أخصائي ERP',
    label_en: 'Financial Accountant & ERP Specialist',
    tabLabel_ar: 'محاسب مالي & ERP',
    tabLabel_en: 'Accountant & ERP',
    iconName: 'Scale',
    badge_ar: 'مسار المحاسبة المالية وإدارة تخطيط الموارد (Accounting & ERP Track)',
    badge_en: 'Financial Accounting & ERP Track Specialist',
    title_ar: 'محاسب مالي معتمد & أخصائي تطبيق أنظمة Odoo ERP والنمذجة المالية',
    title_en: 'Certified Financial Accountant & Odoo ERP Implementation Specialist',
    summary_ar:
      'خريج كلية التجارة شعبة اللغة الإنجليزية قسم المحاسبة (تقدير جيد جداً 86%)، متمرس عملياً في تطبيق وإعداد أنظمة Odoo ERP (أكثر من 84 ساعة تدريبية معتمدة من هيئة ITIDA). متخصص في بناء شجرة الحسابات (Chart of Accounts)، إدارة قيود اليومية، إعداد موازين المراجعة، والقوائم المالية وفق معايير GAAP و IFRS. حاصل على دبلومة المحاسب المالي المحترف (PFA) وخبير في توظيف Excel المتقدم والبرمجيات لأتمتة العمليات المالية وتقليل الأخطاء الدفترية.',
    summary_en:
      'Faculty of Commerce Accounting Graduate – English Section (Very Good - 86%), hands-on experienced in Odoo ERP implementation (84+ accredited hours by ITIDA). Specialized in Chart of Accounts configuration, journal entries, trial balance generation, and financial statements preparation under GAAP & IFRS standards. PFA Diploma holder, utilizing advanced Excel and financial modeling to automate reporting cycles and enhance internal accounting controls.',
    stats: [
      { label_ar: 'التقدير الأكاديمي (تجارة إنجليزي)', label_en: 'Degree Grade (English Sec)', value: '86%' },
      { label_ar: 'ساعات تطبيق Odoo ERP معتمدة', label_en: 'Odoo ERP Certified Hours', value: '84+ hrs' },
      { label_ar: 'ساعات دبلومة PFA المحاسبية', label_en: 'PFA Accounting Diploma', value: '60+ hrs' },
      { label_ar: 'مطابقة المعايير والقوائم', label_en: 'GAAP / IFRS Compliance', value: '100%' },
    ],
    accentColor: '#10B981', // Emerald green
    accentBorder: 'border-emerald-500/40',
    accentBg: 'bg-emerald-500/10',
    highlightedCertIndices: [0, 5, 3, 8], // Odoo, PFA, Excel, Career Dev
    priorityCategory: 'accounting',
    certSectionTitle_ar: 'الشهادات والاعتمادات المهنية في المحاسبة المالية و Odoo ERP',
    certSectionTitle_en: 'Financial Accounting & Odoo ERP Accredited Certifications',
    certSectionDesc_ar:
      'حزمة الاعتمادات المعتمدة الخاصة بمسار المحاسبة المالية: تطبيق وتخصيص أنظمة Odoo ERP (84+ ساعة ITIDA)، دبلومة المحاسب المالي المحترف PFA، والنمذجة المالية عبر Excel المتقدم.',
    certSectionDesc_en:
      'Accredited credentials in financial accounting systems, Odoo ERP implementation (84+ hrs ITIDA), PFA Accounting Diploma, and financial Excel modeling.',
    certBadgeText_ar: 'اعتماد مسار المحاسبة & ERP',
    certBadgeText_en: 'Accounting & ERP Track Credential',
    trackCertIndices: [0, 5, 3, 8],
  },

  data_analyst: {
    id: 'data_analyst',
    label_ar: 'نسخة محلل البيانات & ذكاء الأعمال (BI)',
    label_en: 'Data & Business Intelligence Analyst',
    tabLabel_ar: 'محلل بيانات & BI',
    tabLabel_en: 'Data & BI Analyst',
    iconName: 'BarChart3',
    badge_ar: 'مسار تحليل البيانات وذكاء الأعمال (Data & BI Analytics Track)',
    badge_en: 'Data Analytics & Business Intelligence Track',
    title_ar: 'محلل بيانات وذكاء أعمال (BI) · متخصص Power BI (ETL & DAX) و Excel المتقدم',
    title_en: 'Data & Business Intelligence Analyst · Power BI (ETL & DAX) & Advanced Modeling',
    summary_ar:
      'محلل بيانات وذكاء أعمال معتمد من Microsoft و Google، متخصص في بناء خطوط معالجة وتدفق البيانات (ETL Pipelines) عبر Power Query، وتصميم نماذج البيانات الدلالية المتقدمة (Semantic Models) وكتابة صيغ DAX المعقدة. متمرس في بناء لوحات القيادة التفاعلية في Power BI و Excel المتقدم، مع خلفية محاسبية ومالية قوية تمكنني من فهم مؤشرات الأداء الحيوية (KPIs) وتحويل البيانات المعقدة إلى قرارات استراتيجية ذات قيمة تجارية ملموسة.',
    summary_en:
      'Microsoft & Google certified Data and Business Intelligence Analyst specializing in building robust ETL pipelines with Power Query, complex DAX formulas, and semantic data models (Star Schema). Proven ability to design interactive enterprise dashboards in Power BI and Advanced Excel. Leveraging a strong accounting foundation to bridge technical data analytics with core business KPIs and executive decision-making.',
    stats: [
      { label_ar: 'شهادات Power BI من Microsoft', label_en: 'Microsoft Power BI Certs', value: '2+' },
      { label_ar: 'معدل التحصيل والتحليل', label_en: 'Academic & Analytical GPA', value: '86%' },
      { label_ar: 'تدفقات ونماذج بيانات (ETL)', label_en: 'ETL Pipelines & Models', value: '100+' },
      { label_ar: 'لوحات قيادة ومقاييس DAX', label_en: 'Dashboards & DAX KPIs', value: '15+' },
    ],
    accentColor: '#38BDF8', // Cyan / Electric sky
    accentBorder: 'border-sky-500/40',
    accentBg: 'bg-sky-500/10',
    highlightedCertIndices: [1, 2, 3, 7, 4], // Power BI ETL, Power BI DAX, Excel, Python, Prompt Eng
    priorityCategory: 'data',
    certSectionTitle_ar: 'الشهادات والاعتمادات في تحليل البيانات وذكاء الأعمال (BI)',
    certSectionTitle_en: 'Data Analytics & Business Intelligence (BI) Certifications',
    certSectionDesc_ar:
      'الاعتمادات الموثقة من Microsoft و Google في بناء خطوط تدفق ومعالجة البيانات (Power Query ETL)، نماذج البيانات الدلالية ومقاييس DAX المتقدمة، وتحليلات بايثون.',
    certSectionDesc_en:
      'Verified credentials from Microsoft & Google in Power BI ETL pipelines, advanced DAX semantic modeling, Excel data preparation, and Python data automation.',
    certBadgeText_ar: 'اعتماد مسار تحليل البيانات & BI',
    certBadgeText_en: 'Data Analytics & BI Credential',
    trackCertIndices: [1, 2, 3, 7, 4],
  },

  fullstack: {
    id: 'fullstack',
    label_ar: 'نسخة مطور الويب والبرمجيات (Full-Stack)',
    label_en: 'Full-Stack Software Engineer',
    tabLabel_ar: 'مطور برمجيات & Full-Stack',
    tabLabel_en: 'Full-Stack Developer',
    iconName: 'Code2',
    badge_ar: 'مسار هندسة البرمجيات وتطوير الويب (Full-Stack Web Track)',
    badge_en: 'Full-Stack Web Engineering Track',
    title_ar: 'مطور Full-Stack & مهندس نظم برمجية (MERN Stack & Modern Web)',
    title_en: 'Full-Stack Web Developer & Software Engineer (MERN Stack & Cloud)',
    summary_ar:
      'مطور Full-Stack متمرس في بناء وتطوير تطبيقات الويب المتكاملة باستخدام MERN Stack (React, Node.js, Express, MongoDB) والتقنيات الحديثة مثل TypeScript و Tailwind CSS. شغوف بهندسة الواجهات الأمامية التفاعلية وبناء خوادم الـ RESTful APIs السريعة والآمنة. شغلت دور رئيس لجنة البرمجة وتكنولوجيا المعلومات في فريق DO IT ومدرب برمجة وخوارزميات في مجتمع ICPC للبرمجة التنافسية.',
    summary_en:
      'Full-Stack Developer experienced in architecting scalable modern web applications using the MERN stack (React, Node.js, Express, MongoDB) alongside TypeScript and Tailwind CSS. Passionate about interactive, high-performance user interfaces and resilient RESTful APIs. Served as Head of Programming & IT Committee at DO IT Team and algorithms instructor at the ICPC competitive programming community.',
    stats: [
      { label_ar: 'بنية برمجية متكاملة (MERN)', label_en: 'MERN Stack Architecture', value: 'Full' },
      { label_ar: 'تدريب خوارزميات وبرمجة ICPC', label_en: 'ICPC Instructor & Mentor', value: 'Active' },
      { label_ar: 'رئيس لجنة البرمجة والتطوير', label_en: 'Head of IT & Programming', value: 'DO IT' },
      { label_ar: 'أداء وتجاوب النظم البرمجية', label_en: 'App Performance & UX', value: '100%' },
    ],
    accentColor: '#A855F7', // Purple / Violet
    accentBorder: 'border-purple-500/40',
    accentBg: 'bg-purple-500/10',
    highlightedCertIndices: [6, 7, 4, 9], // Web Bootcamp, Python, Prompt Eng, Digital Marketing
    priorityCategory: 'code',
    certSectionTitle_ar: 'الشهادات والاعتمادات في تطوير الويب وهندسة البرمجيات',
    certSectionTitle_en: 'Full-Stack Software Engineering & Web Development Certifications',
    certSectionDesc_ar:
      'الشهادات والاعتمادات المعتمدة في تطوير تطبيقات الويب المتكاملة (Full-Stack)، البرمجة ببايثون، حلول الذكاء الاصطناعي، واستراتيجيات الويب و SEO.',
    certSectionDesc_en:
      'Accredited certifications in full-stack web development, Python programming, generative AI workflows, and digital web optimization & SEO.',
    certBadgeText_ar: 'اعتماد مسار هندسة البرمجيات',
    certBadgeText_en: 'Software Engineering Credential',
    trackCertIndices: [6, 7, 4, 9],
  },
};
