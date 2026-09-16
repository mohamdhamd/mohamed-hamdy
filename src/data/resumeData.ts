// بيانات السيرة الذاتية الرسمية لمحمد حمدي فوزي المستخرجة من ملف PDF الرسمي
export interface ResumeCertification {
  title_ar: string;
  title_en: string;
  issuer_ar: string;
  issuer_en: string;
  date: string;
  credentialId?: string;
  hours?: string;
  skills: string[];
  points_ar: string[];
  points_en: string[];
}

export interface ResumeExperience {
  role_ar: string;
  role_en: string;
  organization_ar: string;
  organization_en: string;
  period: string;
  points_ar: string[];
  points_en: string[];
}

export interface ResumeSkillCategory {
  category_ar: string;
  category_en: string;
  iconName: string;
  skills: { name: string; level: number; highlight?: boolean }[];
}

export const resumeData = {
  personal: {
    name_ar: 'محمد حمدي فوزي',
    name_en: 'Mohamed Hamdy Fawzy',
    title_ar: 'خريج محاسبة (86%) · متخصص تحليل بيانات ونمذجة مالية ومطور برمجيات',
    title_en: 'Accounting Graduate (86%) · Financial Analyst & Web Developer',
    location_ar: 'الزقازيق، الشرقية، مصر',
    location_en: 'Zagazig, Al Sharqia, Egypt',
    phone: '+201559148106',
    email: 'mohamedhamdyfawzy2000@gmail.com',
    linkedin: 'linkedin.com/in/mohamed-hamdey',
    linkedin_url: 'https://linkedin.com/in/mohamed-hamdey',
    military_status_ar: 'مؤجل',
    military_status_en: 'Postponed',
    pdf_filename: 'Mohamed_Hamdy_CV.pdf',
    pdf_url: '/Mohamed_Hamdy_CV.pdf',
  },

  summary: {
    ar: 'خريج كلية التجارة شعبة اللغة الإنجليزية قسم المحاسبة (تقدير جيد جداً بنسبة 86%)، متخصص في التحليل المالي، تحليل البيانات، وتطوير تطبيقات الويب. متمرس عملياً في النمذجة البيانية وحلول ذكاء الأعمال باستخدام Power BI و Excel المتقدم ونظام Odoo ERP. أسعى لشغل دور يدمج الدقة المحاسبية الصارمة مع الحلول البرمجية الحديثة لخلق قيمة ملموسة.',
    en: 'Accounting graduate – English Section (Very Good - 86%) specializing in financial analysis, data analytics, and web development. Equipped with practical skills in data modeling and business intelligence using Power BI. Seeking a challenging role in a data-driven environment to bridge the gap between finance and technology, utilizing analytical skills and English language proficiency.',
  },

  education: {
    degree_ar: 'بكالوريوس التجارة - شعبة اللغة الإنجليزية (قسم المحاسبة)',
    degree_en: "Bachelor's degree of Accounting – Faculty of Commerce (English Section)",
    institution_ar: 'جامعة الزقازيق',
    institution_en: 'Zagazig University',
    period: '2022 – 2026',
    grade_ar: 'تقدير جيد جداً بنسبة 86%',
    grade_en: 'Very Good (86%)',
  },

  stats: [
    { label_ar: 'التقدير التراكمي', label_en: 'Cumulative Grade', value: '86%' },
    { label_ar: 'ساعات تدريب Odoo ERP', label_en: 'Odoo Training Hours', value: '84+ hrs' },
    { label_ar: 'شهادات تخصصية معتمدة', label_en: 'Certified Specializations', value: '10+' },
    { label_ar: 'خبرات قيادية وتقنية', label_en: 'Leadership Positions', value: '4 roles' },
  ],

  certifications: [
    {
      title_ar: 'تطبيق وتخصيص أنظمة Odoo ERP',
      title_en: 'Odoo ERP Implementer',
      issuer_ar: 'هيئة تنمية صناعة تكنولوجيا المعلومات (ITIDA)',
      issuer_en: 'ITIDA',
      date: '2025',
      hours: '84+ hrs',
      skills: ['Odoo Accounting', 'Chart of Accounts', 'Inventory', 'Sales & CRM', 'HR'],
      points_ar: [
        'تحليل متطلبات الأعمال وتوزيعها على وحدات أودو: المحاسبة، المخازن، المبيعات، المشتريات، وإدارة العملاء (84+ ساعة).',
        'خبرة عملية في إعداد شجرة الحسابات (Chart of Accounts)، قيود اليومية، والتقارير المالية المؤتمتة.',
      ],
      points_en: [
        'Analyzed business requirements and mapped them to Odoo Accounting, Inventory, Sales, Purchase, CRM, and HR modules (84+ hours).',
        'Acquired hands-on expertise in chart of accounts configuration, journal entries, and automated financial reporting.',
      ],
    },
    {
      title_ar: 'استخراج وتحويل وتحميل البيانات في Power BI (ETL)',
      title_en: 'Extract, Transform and Load Data in Power BI',
      issuer_ar: 'Microsoft عبر Coursera',
      issuer_en: 'Microsoft via Coursera',
      date: 'April 2026',
      credentialId: 'BE7F5GGM8SF7',
      skills: ['Power BI', 'Power Query', 'ETL Pipelines', 'Data Cleansing', 'Data Integrity'],
      points_ar: [
        'الربط بمصادر بيانات متعددة وتنفيذ عمليات تنظيف ودمج وتشكيل متقدمة باستخدام Power Query.',
        'تحسين أداء تحميل البيانات للحفاظ على سلامة النماذج الصارمة.',
      ],
      points_en: [
        'Connected to multi-source data streams and executed advanced cleaning, merging, appending, and reshaping via Power Query.',
        'Optimized data loading performance to maintain strict data model integrity.',
      ],
    },
    {
      title_ar: 'استثمار قوة البيانات باستخدام Power BI و DAX',
      title_en: 'Harnessing the Power of Data with Power BI',
      issuer_ar: 'Microsoft عبر Coursera',
      issuer_en: 'Microsoft via Coursera',
      date: 'April 2026',
      credentialId: 'BQW9KUG80EHZ',
      skills: ['DAX Formulas', 'Data Modeling', 'Interactive Dashboards', 'Star Schema'],
      points_ar: [
        'بناء لوحات تحكم تفاعلية لاستخراج الرؤى التجارية وكتابة مقاييس وأعمدة محسوبة معقدة بلغة DAX.',
        'تطوير نماذج بيانات دلالية (Semantic Models) وتطبيق معايير التصميم البياني العالمية.',
      ],
      points_en: [
        'Built dynamic dashboards for business insights and leveraged DAX to write complex calculated columns and measures.',
        'Developed semantic data models, established table relationships, and applied industry-standard visualization design.',
      ],
    },
    {
      title_ar: 'تجهيز وتحليل البيانات باستخدام Microsoft Excel المتقدم',
      title_en: 'Preparing Data for Analysis with Microsoft Excel',
      issuer_ar: 'Microsoft عبر Coursera',
      issuer_en: 'Microsoft via Coursera',
      date: 'March 2026',
      credentialId: 'U25JP9BYK5YA',
      skills: ['Advanced Excel', 'Pivot Tables', 'VLOOKUP / XLOOKUP', 'Conditional Logic'],
      points_ar: [
        'تنظيف وتنسيق مجموعات بيانات ضخمة باستخدام دوال البحث المتقدمة والصيغ المنطقية والشرطية.',
        'تلخيص المؤشرات المعقدة واستخلاص الاتجاهات الاستراتيجية عبر الجداول المحورية (Pivot Tables).',
      ],
      points_en: [
        'Cleaned, formatted, and structured large-scale datasets using advanced lookups, logical functions, and conditional formulas.',
        'Summarized complex metrics and extracted strategic business trends using dynamic Pivot Tables.',
      ],
    },
    {
      title_ar: 'هندسة الأوامر والنماذج اللغوية باحترافية (Prompt Engineering)',
      title_en: 'Start Writing Prompts like a Pro',
      issuer_ar: 'Google عبر Coursera',
      issuer_en: 'Google via Coursera',
      date: 'December 2025',
      credentialId: 'CQASM1AG30K1',
      skills: ['Prompt Engineering', 'Generative AI', 'LLM Constraints', 'Workflow Automation'],
      points_ar: [
        'تطبيق أطر هندسة الأوامر لرفع دقة النماذج اللغوية الكبيرة وأتمتة مهام الأعمال.',
      ],
      points_en: [
        'Applied prompt engineering frameworks to maximize LLM accuracy and automated business tasks via structured role constraints.',
      ],
    },
    {
      title_ar: 'دبلومة المحاسب المالي المحترف (PFA Diploma)',
      title_en: 'PFA Diploma (Professional Financial Accountant)',
      issuer_ar: 'Hafez Academy',
      issuer_en: 'Hafez Academy',
      date: '2025',
      hours: '60+ hrs',
      skills: ['Financial Accounting', 'Trial Balance', 'Excel Financials', 'Closing Entries'],
      points_ar: [
        'إتقان المهارات المحاسبية الأساسية وبناء موازين المراجعة المتقدمة على Excel وإدارة شجرة الحسابات (60+ ساعة).',
      ],
      points_en: [
        'Gained solid foundational accounting skills, constructed comprehensive Excel trial balances, and managed charts of accounts (60+ hours).',
      ],
    },
    {
      title_ar: 'تدريب تطوير تطبيقات الويب واللغات البرمجية',
      title_en: 'Web Application Development Training & Languages',
      issuer_ar: 'Bravo Academy',
      issuer_en: 'Bravo Academy',
      date: '2023',
      skills: ['Full-Stack', 'HTML5/CSS3', 'JavaScript', 'PHP', 'MySQL'],
      points_ar: [
        'هندسة تطبيقات ويب كاملة، بناء واجهات متجاوبة، وربط قواعد البيانات العلائقية (HTML5, CSS3, JS, PHP, MySQL).',
      ],
      points_en: [
        'Architected full-stack web applications, built responsive layouts, and connected relational databases (HTML5, CSS3, JS, PHP, MySQL).',
      ],
    },
    {
      title_ar: 'أساسيات بايثون والأتمتة للمبتدئين',
      title_en: 'Python For Beginners',
      issuer_ar: 'Udemy',
      issuer_en: 'Udemy',
      date: '2025',
      credentialId: 'UC-7e740765-3bc8-4a07-bc03-f8c0ff62bb8a',
      skills: ['Python', 'Automation Scripts', 'OOP', 'Data Structures'],
      points_ar: [
        'إتقان المفاهيم البرمجية الأساسية، معالجة الأخطاء وتتبعها، وبناء سكريبتات أتمتة مخصصة.',
      ],
      points_en: [
        'Mastered core programming paradigms, handled script debugging, and designed custom automation scripts.',
      ],
    },
    {
      title_ar: 'دبلومة التطوير المهني وإدارة الأعمال',
      title_en: 'Career Development Diploma',
      issuer_ar: 'Creativa / ITIDA / TIEC',
      issuer_en: 'Creativa / ITIDA / TIEC',
      date: '2025',
      hours: '28 hrs',
      skills: ['Business Communication', 'Strategic Planning', 'Problem Solving'],
      points_ar: [
        'إتمام 28 ساعة مكثفة في مهارات التواصل في بيئات الأعمال والتخطيط المؤسسي وحل المشكلات.',
      ],
      points_en: [
        'Completed 28 intensive hours on business communication and planning.',
      ],
    },
    {
      title_ar: 'أساسيات التسويق الرقمي واستراتيجيات المحتوى',
      title_en: 'Fundamentals of Digital Marketing',
      issuer_ar: 'Google',
      issuer_en: 'Google',
      date: '2025',
      skills: ['SEO', 'Content Strategy', 'Web Traffic Analytics'],
      points_ar: [
        'اكتساب معرفة عملية في تحسين محركات البحث (SEO)، واستراتيجية المحتوى، وتحليل حركة الزوار.',
      ],
      points_en: [
        'Gained practical knowledge in SEO, content strategy, and web traffic analysis.',
      ],
    },
  ] as ResumeCertification[],

  leadership: [
    {
      role_ar: 'رئيس قسم البرمجة (Head of Programming)',
      role_en: 'Head of Programming',
      organization_ar: 'مبادرة DO IT',
      organization_en: 'DO IT Initiative',
      period: '2024 – 2025',
      points_ar: [
        'توجيه قادة الفرق التقنية، الإشراف على مراجعات الكود (Code Reviews)، تفويض المهام البرمجية، وتقييم المناهج التدريبية لتطوير البرمجيات.',
      ],
      points_en: [
        'Directed technical team leaders, oversaw code reviews, delegated tasks, and evaluated curriculum for software development programs.',
      ],
    },
    {
      role_ar: 'قائد فريق التسويق (Team Leader of Marketing)',
      role_en: 'Team Leader of Marketing',
      organization_ar: 'مؤسسة تأهيل للتدريب والتطوير (الموسم الثامن)',
      organization_en: 'Taheal for Training & Development (Season 8)',
      period: '2023 – 2024',
      points_ar: [
        'تنسيق جهود فريق التسويق لتنفيذ الحملات الترويجية، إعداد خطط المحتوى الزمنية، ووضع خطط تسويقية مبنية على البيانات وتحليل SWOT.',
      ],
      points_en: [
        'Coordinated a marketing team to execute campaigns, designed content calendars, and developed data-driven plans using SWOT analysis.',
      ],
    },
    {
      role_ar: 'عضو مجتمع البرمجة التنافسية ICPC',
      role_en: 'Member | ICPC Zagazig University Community',
      organization_ar: 'جامعة الزقازيق',
      organization_en: 'Zagazig University',
      period: '2023 – 2024',
      points_ar: [
        'إتمام تدريب مكثف في التفكير الخوارزمي، والمنطق الرياضي، والبرمجة التنافسية تحت ضغط زمني دقيق.',
      ],
      points_en: [
        'Completed intensive training focused on algorithmic thinking, mathematical logic, and competitive programming under strict time constraints.',
      ],
    },
    {
      role_ar: 'عضو لجنة التسويق وصناعة المحتوى',
      role_en: 'Marketing Committee Member',
      organization_ar: 'نشاط الطلاب الإيجابيين (Positive Students)',
      organization_en: 'Positive Students Student Activity',
      period: '2023',
      points_ar: [
        'التعاون ضمن فريق منظم لإطلاق الحملات الترويجية داخل الحرم الجامعي وصناعة محتوى رقمي لمنصات Instagram و Facebook.',
      ],
      points_en: [
        'Collaborated within a structured team to brainstorm and execute campus promotion, creating digital content for Instagram and Facebook.',
      ],
    },
  ] as ResumeExperience[],

  skills: [
    {
      category_ar: 'تحليل البيانات وذكاء الأعمال (Data & BI)',
      category_en: 'Data Analytics & Business Intelligence',
      iconName: 'BarChart3',
      skills: [
        { name: 'Power BI (ETL & Modeling)', level: 95, highlight: true },
        { name: 'DAX Measures & Calculations', level: 90, highlight: true },
        { name: 'Power Query Data M-Language', level: 92, highlight: true },
        { name: 'Advanced Excel (Pivot, Lookups)', level: 95, highlight: true },
        { name: 'Data Cleansing & Preprocessing', level: 90 },
      ],
    },
    {
      category_ar: 'المحاسبة والأنظمة المالية (Accounting & ERP)',
      category_en: 'Accounting & Financial Systems',
      iconName: 'Scale',
      skills: [
        { name: 'Financial Analysis & Ratios', level: 92, highlight: true },
        { name: 'Odoo ERP (Finance, CRM, Inventory)', level: 88, highlight: true },
        { name: 'Trial Balance & Worksheets', level: 94 },
        { name: 'Bank Reconciliation & Auditing', level: 90 },
        { name: 'Inventory Valuation (FIFO, WAC)', level: 88 },
      ],
    },
    {
      category_ar: 'تطوير الويب والبرمجة (Full-Stack & Coding)',
      category_en: 'Web Development & Coding',
      iconName: 'Code2',
      skills: [
        { name: 'React 18 & TypeScript', level: 92, highlight: true },
        { name: 'Python (Scripting & Automation)', level: 88, highlight: true },
        { name: 'JavaScript (ES6+) & Vite', level: 90 },
        { name: 'Tailwind CSS & Responsive UI', level: 95 },
        { name: 'PHP & MySQL Relational DB', level: 85 },
        { name: 'Git, GitHub & Code Reviews', level: 90 },
      ],
    },
    {
      category_ar: 'الذكاء الاصطناعي والإنتاجية (AI & Soft Skills)',
      category_en: 'AI, Leadership & Productivity',
      iconName: 'Sparkles',
      skills: [
        { name: 'Prompt Engineering & LLMs', level: 92, highlight: true },
        { name: 'Technical Leadership & Mentorship', level: 90 },
        { name: 'Analytical Problem Solving', level: 94 },
        { name: 'Technical Report Writing', level: 90 },
        { name: 'English Proficiency (B1 Intermediate)', level: 85 },
      ],
    },
  ] as ResumeSkillCategory[],
};
