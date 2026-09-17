// مخزن البيانات المؤقت بالذاكرة (In-Memory Fallback Store)
// يعمل تلقائياً عندما تكون قاعدة بيانات MongoDB غير متصلة لمنع أي خطأ 500

export const memoryStore = {
  projects: [
    {
      id: 'fintech-analytics-engine',
      title_ar: 'منصة تحليلات مالية وتوقعات ذكية',
      title_en: 'Apex — Financial Analytics & Forecasting Dashboard',
      summary_ar: 'لوحة تحكم تفاعلية متقدمة لمعالجة البيانات المالية وعرض الرسوم البيانية اللحظية وتحليل مؤشرات الأداء.',
      summary_en: 'Real-time analytics dashboard with dynamic charts, scenario forecasting, and financial KPI tracking.',
      body_ar: 'منصة ويب متكاملة مصممة لمعالجة وتصور البيانات المالية المعقدة. تتضمن المنصة محاكي سيناريوهات للأرباح والتدفقات النقدية، ورسوماً بيانية تفاعلية تدعم التكبير والتصفية المتقدمة، مع تجربة مستخدم سريعة وخفيفة على المتصفح.',
      body_en: 'An enterprise-grade web application built to ingest and visualize complex data streams. Features real-time sensitivity modeling, customizable financial KPI widgets, and sub-millisecond chart interactions.',
      cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      tech: ['React 18', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'Vite'],
      category: 'data_analysis',
      category_label_ar: 'تحليل بيانات و BI',
      category_label_en: 'Data Analysis & BI',
      live_url: 'https://github.com/mohamedhamdy',
      repo_url: 'https://github.com/mohamedhamdy',
      featured: true,
      order: 1,
      status: 'published',
      code_snippet: `// Real-time statistical forecast & KPI aggregation
export function calculateForecast(series: DataSeries[]): ForecastResult {
  const mean = series.reduce((acc, cur) => acc + cur.value, 0) / series.length;
  const variance = series.reduce((acc, cur) => acc + Math.pow(cur.value - mean, 2), 0) / series.length;
  const stdDev = Math.sqrt(variance);
  
  return { mean, variance, stdDev, confidenceInterval: [mean - 1.96 * stdDev, mean + 1.96 * stdDev] };
}`,
    },
    {
      id: 'cloud-task-manager',
      title_ar: 'نظام إدارة المهام ومساحات العمل السحابية',
      title_en: 'FlowState — Collaborative Task & Workflow Platform',
      summary_ar: 'تطبيق ويب لإدارة سير عمل الفرق البرمجية، يدعم السحب والإفلات وتزامن المهام في الوقت الفعلي.',
      summary_en: 'Modern workflow management app with fluid drag-and-drop kanban boards and optimistic UI updates.',
      body_ar: 'تطبيق لإدارة المشاريع مصمم لفرق العمل الحديثة، يتميز بلوحات كانبان سلسة للغاية وتحديثات فورية دون إعادة تحميل الصفحة، مع دعم الوضع الليلي والنهاري وتخزين محلي مرن.',
      body_en: 'A collaborative project workspace engineered for developers. Includes fluid kanban boards, instant search filtering, keyboard shortcuts, and optimistic state synchronization.',
      cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      tech: ['React', 'TypeScript', 'Tailwind CSS', 'IndexedDB'],
      category: 'fullstack',
      category_label_ar: 'مواقع و Full-Stack',
      category_label_en: 'Full-Stack Apps',
      live_url: 'https://github.com/mohamedhamdy',
      repo_url: 'https://github.com/mohamedhamdy',
      featured: false,
      order: 2,
      status: 'published',
      code_snippet: `// Optimistic state updater with automatic rollback on error
export async function moveTaskOptimistic(taskId: string, targetCol: string) {
  const snapshot = taskStore.getSnapshot();
  taskStore.updateColumn(taskId, targetCol);
  
  try {
    await db.tasks.update(taskId, { column: targetCol, updatedAt: Date.now() });
  } catch (err) {
    taskStore.restore(snapshot); // Rollback seamlessly
    notify.error('Network sync failed, reverted to previous state');
  }
}`,
    },
    {
      id: 'astronomy-sky-canvas',
      title_ar: 'محرك كانفاس تفاعلي ورسوميات ثلاثية الأبعاد',
      title_en: 'Nova — Interactive Canvas & Graphics Engine',
      summary_ar: 'مكتبة ومحرك رسوميات خفيف مبني بـ HTML5 Canvas لمحاكاة حركة الأجرام السماوية بسلاسة 60fps.',
      summary_en: 'High-performance interactive 2D/3D canvas engine simulating celestial physics at 60fps.',
      body_ar: 'تجربة بصرية تفاعلية تستعرض قوة الـ Canvas API وحسابات الرسوميات الرياضية. المحرك خفيف للغاية ولا يعتمد على مكتبات ضخمة، مما يضمن كفاءة استهلاك المعالج وسرعة الرندرة عبر مختلف الأجهزة.',
      body_en: 'An interactive mathematical graphics playground demonstrating lightweight particle mechanics, responsive canvas rendering, and zero-dependency vector animation at a locked 60fps.',
      cover: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
      tech: ['TypeScript', 'Canvas API', 'Math Physics', 'Tailwind'],
      category: 'fullstack',
      category_label_ar: 'مواقع و Full-Stack',
      category_label_en: 'Full-Stack Apps',
      live_url: 'https://github.com/mohamedhamdy',
      repo_url: 'https://github.com/mohamedhamdy',
      featured: false,
      order: 3,
      status: 'published',
    },
    {
      id: 'dev-api-tester',
      title_ar: 'أداة اختبار وفحص الـ REST APIs للمطورين',
      title_en: 'Pulse — Developer REST API & Webhook Inspector',
      summary_ar: 'أداة سريعة في المتصفح لتجربة استدعاءات الـ APIs وفحص الترويسات مع استجابة فورية.',
      summary_en: 'Browser-based REST client for testing HTTP endpoints, inspecting headers, and formatting JSON.',
      body_ar: 'أداة موجهة للمطورين تتيح إرسال طلبات HTTP (GET, POST, PUT, DELETE) ومعاينة الاستجابات مع تلوين بنية الـ JSON وتخزين سجل الاستدعاءات للرجوع إليها بضغطة زر.',
      body_en: 'A zero-install lightweight API testing utility. Formats and highlights JSON payloads, validates request headers, and stores collection history in local browser storage.',
      cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      tech: ['React', 'TypeScript', 'Fetch API', 'Tailwind'],
      category: 'fullstack',
      category_label_ar: 'مواقع و Full-Stack',
      category_label_en: 'Full-Stack Apps',
      live_url: 'https://github.com/mohamedhamdy',
      repo_url: 'https://github.com/mohamedhamdy',
      featured: false,
      order: 4,
      status: 'published',
    },
    {
      id: 'ecommerce-storefront',
      title_ar: 'واجهة متجر إلكتروني عالي السرعة والتحويل',
      title_en: 'Zenith — High-Conversion E-Commerce Storefront',
      summary_ar: 'متجر إلكتروني فائق السرعة مع تجربة عربة شراء فورية وفلاتر تصنيف متطورة للمنتجات.',
      summary_en: 'Modern e-commerce interface with optimistic cart drawer and sub-second catalog search.',
      body_ar: 'واجهة تجارة إلكترونية تركز على تجربة شراء بدون أي تأخير، تتضمن سلة منبثقة سريعة، تصفية متقدمة للمنتجات حسب السعر والمقاس، وتوافق تام مع الهواتف الذكية.',
      body_en: 'Production-ready digital storefront focusing on customer conversion. Includes instant slide-out cart drawer, faceted product filters, and localized bilingual checkout steps.',
      cover: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
      tech: ['React 18', 'Tailwind CSS', 'Lucide', 'Vite'],
      category: 'fullstack',
      category_label_ar: 'مواقع و Full-Stack',
      category_label_en: 'Full-Stack Apps',
      live_url: 'https://github.com/mohamedhamdy',
      repo_url: 'https://github.com/mohamedhamdy',
      featured: false,
      order: 5,
      status: 'published',
    },
    {
      id: 'cloud-invoice-validator',
      title_ar: 'منظومة الفوترة الإلكترونية والمطابقة الذكية',
      title_en: 'VeriTax — Smart Invoicing & Compliance Platform',
      summary_ar: 'نظام سحابي لتدقيق هياكل الفواتير الإلكترونية واحتساب الضرائب والتأكد من مطابقة القيود آلياً.',
      summary_en: 'Automated invoice validator and compliance engine ensuring tax rules and data consistency.',
      body_ar: 'منظومة تدقيق آلية تقوم بفحص هياكل الفواتير الإلكترونية والتحقق من حسابات الضرائب ومطابقة المبالغ لتفادي أي أخطاء حسابية، مع إمكانية تصدير التقارير بصيغ معيارية.',
      body_en: 'Automated validation platform validating digital invoice schemas, verifying tax calculations, and preventing accounting discrepancies before export.',
      cover: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
      tech: ['CMA Financial Math', 'TypeScript', 'Tax Algorithms', 'Data Validation'],
      category: 'accounting',
      category_label_ar: 'محاسبة وأنظمة مالية CMA',
      category_label_en: 'Accounting & CMA',
      live_url: 'https://github.com/mohamedhamdy',
      repo_url: 'https://github.com/mohamedhamdy',
      featured: false,
      order: 6,
      status: 'published',
      code_snippet: `// CMA Cost-Volume-Profit (CVP) & Multi-Step Margin Engine
export function calculateBreakEven(model: CostModel): BreakEvenAnalysis {
  const cm = model.pricePerUnit - model.variableCostPerUnit;
  const cmRatio = cm / model.pricePerUnit;
  const bepUnits = Math.ceil(model.fixedCosts / cm);
  const bepRevenue = model.fixedCosts / cmRatio;
  const marginOfSafety = (model.actualRevenue - bepRevenue) / model.actualRevenue;

  return { cm, cmRatio, bepUnits, bepRevenue, marginOfSafety };
}`,
    },
  ],

  certificates: [
    {
      id: 'modern-web-eng',
      title_ar: 'هندسة تطبيقات الويب الحديثة والواجهات التفاعلية',
      title_en: 'Modern Web Engineering & Interactive Systems',
      issuer: 'مسار تخصصي متقدم في تقنيات React & TypeScript',
      issuer_en: 'Advanced React, TypeScript & Web Performance Specialization',
      issue_date: '٢٠٢٤',
      issue_date_en: '2024',
      status_ar: 'معتمد وموثق',
      status_en: 'Verified',
      credential_url: 'https://github.com/mohamedhamdy',
      order: 1,
    },
    {
      id: 'fullstack-architecture',
      title_ar: 'تصميم البنية المعمارية للأنظمة وقواعد البيانات',
      title_en: 'Software Architecture & Database Systems',
      issuer: 'دراسة وتطبيق عملي للأنظمة الموزعة والـ APIs',
      issuer_en: 'Pragmatic Systems Architecture & API Design',
      issue_date: '٢٠٢٣',
      issue_date_en: '2023',
      status_ar: 'مكتمل',
      status_en: 'Completed',
      credential_url: null,
      order: 2,
    },
    {
      id: 'analytics-quantitative',
      title_ar: 'تحليل البيانات الكمية والنمذجة المالية',
      title_en: 'Quantitative Problem Solving & Data Analytics',
      issuer: 'تحليل البيانات وبناء النماذج الرقمية المتقدمة',
      issuer_en: 'Quantitative Modeling & Applied Financial Analytics',
      issue_date: '٢٠٢٣',
      issue_date_en: '2023',
      status_ar: 'مكتمل',
      status_en: 'Completed',
      credential_url: null,
      order: 3,
    },
  ],

  messages: [],

  settings: {
    hero_name_ar: 'محمد حمدي',
    hero_name_en: 'Mohamed Hamdy',
    hero_title_ar: 'طالب محاسبة دولية ومطور برمجيات سحابية وأدوات ذكية',
    hero_title_en: 'International Accounting Scholar & Pragmatic Software Engineer',
    hero_subtitle_ar: 'أجمع بين الدقة التحليلية الصارمة للمالية، والهندسة النظيفة للبرمجيات الحديثة لبناء أنظمة وحلول عملية ذات قيمة ملموسة.',
    hero_subtitle_en: 'Bridging high-integrity accounting logic with modern cloud software architecture to engineer fast, resilient tools.',
    email: 'mohamed.hamdy.fawzy0@gmail.com',
    github_url: 'https://github.com/mohamdhamd',
    linkedin_url: 'https://www.linkedin.com/in/mohamed-hamdey/',
    youtube_url: 'https://www.youtube.com/@coding-keys',
    facebook_url: 'https://www.facebook.com/m0hamedhamdy1/?locale=ar_AR',
    cma_status_ar: 'مرشح معتمد CMA · طالب محاسبة دولية',
    cma_status_en: 'CMA Candidate · Accounting Scholar',
    location_ar: 'القاهرة، مصر (توقيت المحروسة GMT+3)',
    location_en: 'Cairo, Egypt (Africa/Cairo GMT+3)',
    stats: {
      projects_count: 6,
      years_exp: 3,
      satisfaction_rate: '100%',
    },
  },

  adminUsers: [
    {
      _id: 'admin_local_1',
      username: 'qwertyuiop01152999615',
      email: 'qwertyuiop01152999615@gmail.com',
      password: '01152999615',
      role: 'admin',
    },
    {
      _id: 'admin_local_2',
      username: 'mohamed.hamdy.fawzy0',
      email: 'mohamed.hamdy.fawzy0@gmail.com',
      password: '01152999615',
      role: 'admin',
    },
  ],

  adminUser: {
    _id: 'admin_local_1',
    username: 'qwertyuiop01152999615',
    email: 'qwertyuiop01152999615@gmail.com',
    password: '01152999615',
    role: 'admin',
  },

  resume: null,
};
