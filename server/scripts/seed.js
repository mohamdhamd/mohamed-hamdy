// سكريبت ملء وتهيئة قاعدة بيانات MongoDB بالبيانات الأولية وحساب الأدمن
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { Project } from '../models/Project.js';
import { Certificate } from '../models/Certificate.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { User } from '../models/User.js';
import { Resume } from '../models/Resume.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تحميل المتغيرات البيئية
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const initialProjects = [
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
    status: 'published',
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
    status: 'published',
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
    status: 'published',
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
    status: 'published',
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
    status: 'published',
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

const initialCertificates = [
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

async function runSeed() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mohamed_hamdy_portfolio';

  try {
    console.log('⏳ جاري الاتصال بقاعدة البيانات MongoDB...');
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ تم الاتصال بنجاح!');

    // 1. تهيئة حسابات الأدمن
    console.log('👤 جاري إعداد وتحديث حسابات الأدمن...');
    const adminAccounts = [
      {
        username: 'qwertyuiop01152999615',
        email: 'qwertyuiop01152999615@gmail.com',
        password: '01152999615',
        role: 'admin',
      },
      {
        username: 'mohamed.hamdy.fawzy0',
        email: 'mohamed.hamdy.fawzy0@gmail.com',
        password: '01152999615',
        role: 'admin',
      },
    ];

    for (const acc of adminAccounts) {
      let existingUser = await User.findOne({
        $or: [{ email: acc.email }, { username: acc.username }],
      });

      if (!existingUser) {
        existingUser = new User(acc);
        await existingUser.save();
        console.log(`✨ تم إنشاء حساب أدمن جديد: ${acc.email}`);
      } else {
        existingUser.password = acc.password;
        await existingUser.save();
        console.log(`🔑 تم تحديث كلمة المرور للحساب: ${acc.email}`);
      }
    }

    // تحديث حساب الأدمن القديم بكلمة المرور الجديدة أيضاً إن وُجد
    const legacyAdmin = await User.findOne({ email: 'admin@mohamedhamdy.com' });
    if (legacyAdmin) {
      legacyAdmin.password = '01152999615';
      await legacyAdmin.save();
    }

    // 2. تهيئة وتحديث إعدادات الموقع
    console.log('⚙️ جاري إعداد نصوص ومعلومات الموقع المعتمدة...');
    const siteSettingsPayload = {
      hero_name_ar: 'محمد حمدي فوزي',
      hero_name_en: 'Mohamed Hamdy Fawzy',
      hero_title_ar: 'خريج محاسبة (86%) · متخصص تحليل بيانات ونمذجة مالية ومطور Full-Stack',
      hero_title_en: 'Accounting Graduate (86%) · Financial Analyst, Data Analyst & Full-Stack Developer',
      hero_subtitle_ar:
        'خريج كلية التجارة شعبة اللغة الإنجليزية قسم المحاسبة (تقدير جيد جداً بنسبة 86%)، متخصص في تطبيق وتخصيص أنظمة Odoo ERP وحلول ذكاء الأعمال في Power BI ونمذجة Excel المتقدم، إلى جانب بناء وتطوير تطبيقات الويب المتكاملة بنظام MERN Stack.',
      hero_subtitle_en:
        'Faculty of Commerce Accounting Graduate – English Section (Very Good - 86%), specialized in Odoo ERP implementation, Microsoft Power BI intelligence, and financial Excel modeling alongside full-stack MERN engineering.',
      email: 'mohamed.hamdy.fawzy0@gmail.com',
      github_url: 'https://github.com/mohamedhamdy',
      linkedin_url: 'https://linkedin.com/in/mohammed-hamdy-761369324',
      cma_status_ar: 'خريج كلية التجارة (86%) · محاسب مالي & Odoo ERP',
      cma_status_en: 'Commerce English Graduate (86%) · Financial Accountant & Odoo ERP',
      location_ar: 'الشرقية / القاهرة، مصر (توقيت مصر GMT+3)',
      location_en: 'Sharkia / Cairo, Egypt (Africa/Cairo GMT+3)',
      stats: {
        projects_count: 6,
        years_exp: 3,
        satisfaction_rate: '100%',
      },
    };

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(siteSettingsPayload);
      console.log('✨ تم إنشاء إعدادات الموقع الافتراضية.');
    } else {
      await SiteSettings.findByIdAndUpdate(settings._id, siteSettingsPayload);
      console.log('✨ تم تحديث إعدادات الموقع بالبيانات الواقعية المعتمدة.');
    }

    // 3. تهيئة المشاريع
    console.log('📁 جاري ترحيل المشاريع إلى MongoDB...');
    const validProjectIds = initialProjects.map((p) => p.id);
    await Project.deleteMany({ id: { $nin: validProjectIds } });
    for (const proj of initialProjects) {
      await Project.findOneAndUpdate({ id: proj.id }, proj, { upsert: true, new: true });
    }
    console.log(`✨ تم ترحيل/تحديث ${initialProjects.length} مشاريع بنجاح وتنظيف البيانات الزائدة.`);

    // 4. تهيئة الشهادات
    console.log('🎓 جاري ترحيل الشهادات والاعتمادات...');
    for (const cert of initialCertificates) {
      await Certificate.findOneAndUpdate({ id: cert.id }, cert, { upsert: true, new: true });
    }
    // 5. تهيئة بيانات السيرة الذاتية (CV)
    console.log('📄 جاري ترحيل وتهيئة بيانات السيرة الذاتية (CV)...');
    const resumePayload = {
      personal: {
        name_ar: 'محمد حمدي فوزي',
        name_en: 'Mohamed Hamdy Fawzy',
        title_ar: 'خريج محاسبة (86%) · متخصص تحليل بيانات ونمذجة مالية ومطور برمجيات',
        title_en: 'Accounting Graduate (86%) · Financial Analyst & Web Developer',
        location_ar: 'الزقازيق، الشرقية، مصر',
        location_en: 'Zagazig, Al Sharqia, Egypt',
        phone: '+201152999615',
        email: 'mohamed.hamdy.fawzy0@gmail.com',
        linkedin: 'linkedin.com/in/mohammed-hamdy-761369324',
        linkedin_url: 'https://linkedin.com/in/mohammed-hamdy-761369324',
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
      ],
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
      ],
      tracks: {
        all: {
          title_ar: 'خريج محاسبة (86%) · متخصص تحليل بيانات ونمذجة مالية ومطور برمجيات',
          title_en: 'Accounting Graduate (86%) · Financial Analyst & Web Developer',
          summary_ar: 'خريج كلية التجارة شعبة اللغة الإنجليزية قسم المحاسبة (تقدير جيد جداً بنسبة 86%)، متخصص في التحليل المالي، تحليل البيانات، وتطوير تطبيقات الويب. متمرس عملياً في النمذجة البيانية وحلول ذكاء الأعمال باستخدام Power BI و Excel المتقدم ونظام Odoo ERP. أسعى لشغل دور يدمج الدقة المحاسبية الصارمة مع الحلول البرمجية الحديثة لخلق قيمة ملموسة.',
          summary_en: 'Accounting graduate – English Section (Very Good - 86%) specializing in financial analysis, data analytics, and web development. Equipped with practical skills in data modeling and business intelligence using Power BI. Seeking a challenging role in a data-driven environment to bridge the gap between finance and technology, utilizing analytical skills and English language proficiency.',
          badge_ar: 'خريج كلية التجارة - قسم المحاسبة (تقدير 86%)',
          badge_en: 'Faculty of Commerce Accounting Graduate (Grade: 86%)',
        },
        accountant: {
          title_ar: 'محاسب مالي معتمد & أخصائي تطبيق أنظمة Odoo ERP والنمذجة المالية',
          title_en: 'Certified Financial Accountant & Odoo ERP Implementation Specialist',
          summary_ar: 'خريج كلية التجارة شعبة اللغة الإنجليزية قسم المحاسبة (تقدير جيد جداً 86%)، متمرس عملياً في تطبيق وإعداد أنظمة Odoo ERP (أكثر من 84 ساعة تدريبية معتمدة من هيئة ITIDA). متخصص في بناء شجرة الحسابات (Chart of Accounts)، إدارة قيود اليومية، إعداد موازين المراجعة، والقوائم المالية وفق معايير GAAP و IFRS. حاصل على دبلومة المحاسب المالي المحترف (PFA) وخبير في توظيف Excel المتقدم والبرمجيات لأتمتة العمليات المالية وتقليل الأخطاء الدفترية.',
          summary_en: 'Faculty of Commerce Accounting Graduate – English Section (Very Good - 86%), hands-on experienced in Odoo ERP implementation (84+ accredited hours by ITIDA). Specialized in Chart of Accounts configuration, journal entries, trial balance generation, and financial statements preparation under GAAP & IFRS standards. PFA Diploma holder, utilizing advanced Excel and financial modeling to automate reporting cycles and enhance internal accounting controls.',
          badge_ar: 'مسار المحاسبة المالية وإدارة تخطيط الموارد (Accounting & ERP Track)',
          badge_en: 'Financial Accounting & ERP Track Specialist',
        },
        data_analyst: {
          title_ar: 'محلل بيانات معتمد & أخصائي ذكاء الأعمال (Power BI & DAX Specialist)',
          title_en: 'Certified Data Analyst & Business Intelligence Specialist (Power BI & DAX)',
          summary_ar: 'محلل بيانات معتمد من Microsoft، متخصص في بناء وتطوير نماذج ذكاء الأعمال المتقدمة عبر Power BI وهندسة مقاييس DAX المعقدة. خبير في تصميم خطوط أنابيب استخراج وتحويل وتجهيز البيانات (ETL Pipelines) باستخدام Power Query ومجموعات بيانات Excel الكبيرة، مع التركيز على استخلاص الرؤى المالية والتجارية القابلة للتنفيذ المباشر.',
          summary_en: 'Microsoft Certified Data Analyst specialized in architecting advanced Business Intelligence models via Power BI and authoring complex DAX formulas. Expert in building resilient ETL data pipelines using Power Query and large-scale Excel modeling, with a targeted focus on distilling financial and operational datasets into actionable executive insights.',
          badge_ar: 'مسار تحليل البيانات وذكاء الأعمال (BI & Analytics Track)',
          badge_en: 'Business Intelligence & Data Analytics Track',
        },
        fullstack: {
          title_ar: 'مطور برمجيات ويب Full-Stack (MERN) & مهندس أنظمة تفاعلية',
          title_en: 'Full-Stack Software Developer (MERN Stack) & Systems Builder',
          summary_ar: 'مطور واجهات وتطبيقات ويب متكاملة، يجمع بين دقة المنطق الرياضي المحاسبي وكفاءة الهندسة البرمجية النظيفة. متخصص في بناء تطبيقات عصرية سريعة باستخدام React 18, TypeScript, Tailwind CSS, Node.js, و MongoDB. رئيس سابق لقسم البرمجة بمبادرة DO IT ومتمرس في قيادة الفرق البرمجية وإدارة الأكواد البرمجية النظيفة.',
          summary_en: 'Full-Stack software engineer combining rigorous mathematical-accounting logic with high-performance modern web engineering. Specialized in crafting scalable, responsive web systems with React 18, TypeScript, Tailwind CSS, Node.js, and MongoDB. Former Head of Programming at DO IT Initiative with proven technical leadership in code reviews and architecture design.',
          badge_ar: 'مسار تطوير البرمجيات والأنظمة السحابية (Full-Stack Track)',
          badge_en: 'Full-Stack Web & Systems Engineering Track',
        },
      },
    };

    let existingResume = await Resume.findOne();
    if (existingResume) {
      await Resume.findByIdAndUpdate(existingResume._id, resumePayload);
      console.log('✨ تم تحديث بيانات السيرة الذاتية (CV) في MongoDB بنجاح.');
    } else {
      await Resume.create(resumePayload);
      console.log('✨ تم إنشاء بيانات السيرة الذاتية (CV) في MongoDB بنجاح.');
    }

    console.log('\n🎉 اكتملت عملية التهيئة (Seeding) بنجاح تام!');
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ أثناء التهيئة:', error.message);
    console.log('💡 تأكد من تشغيل MongoDB محلياً أو وضع رابط Atlas في server/.env');
    process.exit(1);
  }
}

runSeed();
