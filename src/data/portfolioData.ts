// بيانات المشاريع والشهادات الحديثة لمحمد حمدي (خالية من الكليشيهات ومركزة على البرمجيات)
import { Project, Certificate } from '../types';

export const portfolioProjects: Project[] = [
  {
    id: 'fintech-analytics-engine',
    title_ar: 'منصة تحليلات مالية وتوقعات ذكية',
    title_en: 'Financial Analytics & Forecasting Dashboard',
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
    title_en: 'Collaborative Task & Workflow Platform',
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
    title_en: 'Interactive Canvas & Graphics Engine',
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
  },
  {
    id: 'dev-api-tester',
    title_ar: 'أداة اختبار وفحص الـ REST APIs للمطورين',
    title_en: 'Developer REST API & Webhook Inspector',
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
  },
  {
    id: 'ecommerce-storefront',
    title_ar: 'واجهة متجر إلكتروني عالي السرعة والتحويل',
    title_en: 'High-Conversion E-Commerce Storefront',
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
  },
  {
    id: 'cloud-invoice-validator',
    title_ar: 'منظومة الفوترة الإلكترونية والمطابقة الذكية',
    title_en: 'Smart Invoicing & Compliance Platform',
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
  {
    id: 'powerbi-sales-intelligence',
    title_ar: 'لوحة تحليلات Power BI التنفيذية ومؤشرات المبيعات والربحية',
    title_en: 'Power BI Executive Sales & Profitability Intelligence Dashboard',
    summary_ar: 'لوحة مؤشرات تنفيذية تفاعلية مدعومة بنماذج بيانات Star Schema ومعادلات DAX متقدمة لمراقبة هوامش الأرباح وسلاسل الإمداد.',
    summary_en: 'Enterprise Power BI business intelligence dashboard featuring Star Schema data modeling, dynamic DAX measures, and drill-through profit analysis.',
    body_ar: 'منظومة ذكاء أعمال تنفيذية مطبقة على بيانات مبيعات وسلاسل إمداد ضخمة. تتضمن لوحات تفاعلية متعددة الطبقات (Drill-down)، واحتساب معدلات النمو السنوية والموسمية، وتحليل باريتو (80/20) للمنتجات الأكثر ربحية، مع إمكانية التحديث التلقائي للبيانات.',
    body_en: 'Comprehensive executive BI suite engineered on enterprise sales data. Built with optimized Star Schema models, advanced Time-Intelligence DAX formulas, Pareto profitability clustering, and automated ETL data refresh pipelines.',
    cover: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    tech: ['Power BI', 'DAX Formulas', 'Power Query', 'Data Modeling', 'Excel Advanced'],
    category: 'data_analysis',
    category_label_ar: 'تحليل بيانات و BI',
    category_label_en: 'Data Analysis & BI',
    live_url: 'https://github.com/mohamedhamdy',
    repo_url: 'https://github.com/mohamedhamdy',
    featured: false,
    order: 7,
    code_snippet: `// Advanced DAX Time-Intelligence & Sales Growth Measure
YoY_Sales_Growth % = 
VAR CurrentYearSales = [Total_Revenue]
VAR PriorYearSales = CALCULATE([Total_Revenue], SAMEPERIODLASTYEAR('Calendar'[Date]))
RETURN
    DIVIDE(CurrentYearSales - PriorYearSales, PriorYearSales, 0)`,
  },
  {
    id: 'odoo-erp-financials',
    title_ar: 'منظومة Odoo المالية المحاسبية وإدارة قيود اليومية ومراكز التكلفة',
    title_en: 'Odoo ERP Financial Accounting & Cost Centers Management Suite',
    summary_ar: 'تهيئة وتخصيص دورة محاسبية متكاملة على Odoo تشمل شجرة الحسابات، قيود التسوية، وتحليل التكاليف المعيارية.',
    summary_en: 'Full-cycle Odoo ERP financial implementation covering multi-currency chart of accounts, automated journal entries, and analytic cost centers.',
    body_ar: 'تطبيق عملي متكامل لمنظومة Odoo ERP المحاسبية وفقاً لمعايير المحاسبة والـ CMA. يغطي المشروع إدارة فواتير الموردين والعملاء، قيود الإقفال والتسويات الجردية، مطابقة كشوف الحسابات البنكية آلياً، وتقارير قائمة الدخل والمركز المالي اللحظية.',
    body_en: 'Enterprise-grade Odoo accounting architecture aligning with CMA cost standards. Covers vendor/customer ledgers, automated reconciliation rules, multi-tier analytic accounting for departmental cost allocation, and balance sheet synthesis.',
    cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    tech: ['Odoo ERP', 'Financial Accounting', 'Cost Centers (CMA)', 'Python', 'PostgreSQL'],
    category: 'accounting',
    category_label_ar: 'محاسبة وأنظمة مالية CMA',
    category_label_en: 'Accounting & CMA',
    live_url: 'https://github.com/mohamedhamdy',
    repo_url: 'https://github.com/mohamedhamdy',
    featured: false,
    order: 8,
    code_snippet: `# Odoo automated journal entry reconciliation helper
def reconcile_bank_statement_lines(statement_line_ids):
    for line in statement_line_ids:
        matching_moves = env['account.move.line'].search([
            ('partner_id', '=', line.partner_id.id),
            ('amount_residual', '=', -line.amount),
            ('reconciled', '=', False)
        ], limit=1)
        if matching_moves:
            (line.move_id.line_ids + matching_moves).reconcile()`,
  },
];

export const portfolioCertificates: Certificate[] = [
  {
    id: 'odoo-erp-implementer',
    title_ar: 'تطبيق وتخصيص أنظمة Odoo ERP (أكثر من 84 ساعة معتمدة)',
    title_en: 'Odoo ERP Implementer (84+ Certified Hours)',
    issuer: 'هيئة تنمية صناعة تكنولوجيا المعلومات (ITIDA)',
    issuer_en: 'Information Technology Industry Development Agency (ITIDA)',
    issue_date: '٢٠٢٥',
    issue_date_en: '2025',
    status_ar: 'معتمد وموثق (84+ ساعة)',
    status_en: 'Certified (84+ hrs)',
    credential_url: 'https://itida.gov.eg',
    order: 1,
  },
  {
    id: 'powerbi-etl-ms',
    title_ar: 'استخراج وتحويل وتحميل البيانات في Power BI (ETL)',
    title_en: 'Extract, Transform and Load Data in Power BI',
    issuer: 'Microsoft عبر منصة Coursera',
    issuer_en: 'Microsoft via Coursera',
    issue_date: 'أبريل ٢٠٢٦',
    issue_date_en: 'April 2026',
    status_ar: 'معتمد من Microsoft',
    status_en: 'Microsoft Verified',
    credential_url: 'https://coursera.org/verify/BE7F5GGM8SF7',
    order: 2,
  },
  {
    id: 'powerbi-dax-ms',
    title_ar: 'استثمار قوة البيانات باستخدام Power BI و DAX',
    title_en: 'Harnessing the Power of Data with Power BI',
    issuer: 'Microsoft عبر منصة Coursera',
    issuer_en: 'Microsoft via Coursera',
    issue_date: 'أبريل ٢٠٢٦',
    issue_date_en: 'April 2026',
    status_ar: 'معتمد من Microsoft',
    status_en: 'Microsoft Verified',
    credential_url: 'https://coursera.org/verify/BQW9KUG80EHZ',
    order: 3,
  },
  {
    id: 'excel-data-prep-ms',
    title_ar: 'تجهيز وتحليل البيانات باستخدام Microsoft Excel المتقدم',
    title_en: 'Preparing Data for Analysis with Microsoft Excel',
    issuer: 'Microsoft عبر منصة Coursera',
    issuer_en: 'Microsoft via Coursera',
    issue_date: 'مارس ٢٠٢٦',
    issue_date_en: 'March 2026',
    status_ar: 'معتمد من Microsoft',
    status_en: 'Microsoft Verified',
    credential_url: 'https://coursera.org/verify/U25JP9BYK5YA',
    order: 4,
  },
  {
    id: 'prompt-engineering-google',
    title_ar: 'هندسة الأوامر والنماذج اللغوية باحترافية (Prompt Engineering)',
    title_en: 'Start Writing Prompts like a Pro',
    issuer: 'Google عبر منصة Coursera',
    issuer_en: 'Google via Coursera',
    issue_date: 'ديسمبر ٢٠٢٥',
    issue_date_en: 'December 2025',
    status_ar: 'معتمد من Google',
    status_en: 'Google Verified',
    credential_url: 'https://coursera.org/verify/CQASM1AG30K1',
    order: 5,
  },
  {
    id: 'pfa-accounting-diploma',
    title_ar: 'دبلومة المحاسب المالي المحترف (PFA Diploma - 60+ ساعة)',
    title_en: 'PFA Diploma (Professional Financial Accountant)',
    issuer: 'أكاديمية حافظ (Hafez Academy)',
    issuer_en: 'Hafez Academy',
    issue_date: '٢٠٢٥',
    issue_date_en: '2025',
    status_ar: 'دبلومة معتمدة',
    status_en: 'Certified Diploma',
    credential_url: null,
    order: 6,
  },
  {
    id: 'web-development-bravo',
    title_ar: 'تدريب تطوير تطبيقات الويب واللغات البرمجية Full-Stack',
    title_en: 'Web Application Development Training & Languages',
    issuer: 'Bravo Academy',
    issuer_en: 'Bravo Academy',
    issue_date: '٢٠٢٣',
    issue_date_en: '2023',
    status_ar: 'تدريب عملي مكتمل',
    status_en: 'Completed Training',
    credential_url: null,
    order: 7,
  },
  {
    id: 'python-programming-udemy',
    title_ar: 'أساسيات بايثون والأتمتة للمبتدئين (Python Automation)',
    title_en: 'Python For Beginners & Scripting',
    issuer: 'Udemy',
    issuer_en: 'Udemy',
    issue_date: '٢٠٢٥',
    issue_date_en: '2025',
    status_ar: 'شهادة معتمدة موثقة',
    status_en: 'Verified Certificate',
    credential_url: 'https://udemy.com/certificate/UC-7e740765-3bc8-4a07-bc03-f8c0ff62bb8a',
    order: 8,
  },
  {
    id: 'career-development-tiec',
    title_ar: 'دبلومة التطوير المهني وإدارة الأعمال (28 ساعة)',
    title_en: 'Career Development Diploma (28 hrs)',
    issuer: 'Creativa / ITIDA / TIEC',
    issuer_en: 'Creativa / ITIDA / TIEC',
    issue_date: '٢٠٢٥',
    issue_date_en: '2025',
    status_ar: 'معتمد من وزارة الاتصالات',
    status_en: 'MCIT / TIEC Certified',
    credential_url: null,
    order: 9,
  },
  {
    id: 'digital-marketing-google',
    title_ar: 'أساسيات التسويق الرقمي واستراتيجيات المحتوى و SEO',
    title_en: 'Fundamentals of Digital Marketing & SEO',
    issuer: 'Google',
    issuer_en: 'Google',
    issue_date: '٢٠٢٥',
    issue_date_en: '2025',
    status_ar: 'معتمد من Google',
    status_en: 'Google Certified',
    credential_url: null,
    order: 10,
  },
];
