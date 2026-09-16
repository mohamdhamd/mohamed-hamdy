// مساعد تصنيف وتوليد البيانات التفاعلية لمجالات المشاريع
import { Project, ProjectDomain, FullStackProjectMeta, DataAnalysisProjectMeta, AccountingProjectMeta } from '../types';

/**
 * تحديد المجال الرئيسي للمشروع (Full-Stack, Data Analysis, Accounting)
 * يعتمد على الحقل category أولاً، ثم الكلمات المفتاحية في العنوان والتقنيات
 */
export function getProjectDomain(project: Project): ProjectDomain {
  const cat = (project.category || '').toLowerCase();
  const techStr = (project.tech || []).join(' ').toLowerCase();
  const textStr = `${project.title_ar} ${project.title_en} ${project.summary_ar} ${project.summary_en}`.toLowerCase();

  // 1. الأولوية المطلقة لحقل الفئة الصريح (Direct Category Matching)
  if (cat === 'data_analysis' || cat === 'analytics' || cat === 'bi' || cat === 'data') {
    return 'data_analysis';
  }
  if (cat === 'accounting' || cat === 'finance' || cat === 'cma') {
    return 'accounting';
  }
  if (cat === 'fullstack' || cat === 'web' || cat === 'tools' || cat === 'systems') {
    return 'fullstack';
  }

  // 2. فحص تحليل البيانات وذكاء الأعمال Data Analysis & BI
  if (
    techStr.includes('power bi') ||
    techStr.includes('dax') ||
    techStr.includes('chart') ||
    techStr.includes('analytics') ||
    techStr.includes('pandas') ||
    techStr.includes('tableau') ||
    techStr.includes('bi') ||
    textStr.includes('تحليل بيانات') ||
    textStr.includes('تحليلات') ||
    textStr.includes('لوحة تحليلات') ||
    textStr.includes('ذكاء أعمال') ||
    textStr.includes('dashboard') ||
    textStr.includes('forecasting') ||
    textStr.includes('kpi')
  ) {
    return 'data_analysis';
  }

  // 3. فحص المحاسبة والأنظمة المالية CMA
  if (
    techStr.includes('cma') ||
    techStr.includes('accounting') ||
    techStr.includes('cost') ||
    techStr.includes('invoice') ||
    techStr.includes('ضريب') ||
    textStr.includes('محاسب') ||
    textStr.includes('دفاتر') ||
    textStr.includes('فوترة') ||
    textStr.includes('قوائم مالية') ||
    textStr.includes('تعادل') ||
    textStr.includes('cvp')
  ) {
    return 'accounting';
  }

  // 4. الافتراضي: Full-Stack & Web Engineering
  return 'fullstack';
}

/**
 * تزويد مشروع الـ Full-Stack ببيانات معمارية ومحاكي API متكامل
 */
export function getFullStackData(project: Project): FullStackProjectMeta {
  if (project.fullstack_data) return project.fullstack_data;

  // استنتاج التقنيات تلقائياً من تقنيات المشروع
  const tech = project.tech || [];
  const fe = tech.filter((t) => /react|vue|svelte|vite|tailwind|html|css|typescript|next/i.test(t));
  const be = tech.filter((t) => /node|express|nest|python|django|fastapi|rest/i.test(t));
  const db = tech.filter((t) => /mongo|postgres|sql|indexeddb|redis|firebase/i.test(t));
  const other = tech.filter((t) => !fe.includes(t) && !be.includes(t) && !db.includes(t));

  return {
    architecture: {
      frontend: fe.length ? fe : ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite'],
      backend: be.length ? be : ['Node.js', 'Express REST API', 'JWT Middleware'],
      database: db.length ? db : ['MongoDB Atlas', 'Mongoose ORM'],
      devops: other.length ? other : ['Docker', 'Vercel / Cloud Engine', 'CI/CD Pipelines'],
    },
    apiEndpoints: [
      {
        method: 'GET',
        path: `/api/v1/${project.id}/status`,
        description_ar: 'التحقق من حالة المنظومة ومعدل الاستجابة اللحظي',
        description_en: 'System healthcheck and live latency telemetry',
        mockResponse: {
          status: 'healthy',
          uptime: '99.98%',
          latency: '24ms',
          activeNodes: 3,
          ssl: 'TLS 1.3 Certified',
        },
      },
      {
        method: 'POST',
        path: `/api/v1/${project.id}/dispatch`,
        description_ar: 'معالجة وتوثيق العمليات عبر خطوط الأنابيب الآمنة',
        description_en: 'Secure pipeline job dispatch and payload handling',
        mockResponse: {
          success: true,
          transactionId: `tx_${Math.random().toString(36).substring(2, 9)}`,
          mode: 'ACID Transaction Guaranteed',
          executedAt: new Date().toISOString(),
        },
      },
    ],
    lighthouseScores: {
      performance: 99,
      accessibility: 100,
      bestPractices: 100,
      seo: 98,
    },
  };
}

/**
 * تزويد مشروع تحليل البيانات بمؤشرات أداء وجدول بيانات ورسوم بيانية تفاعلية
 */
export function getDataAnalysisData(project: Project): DataAnalysisProjectMeta {
  if (project.analytics_data) return project.analytics_data;

  return {
    kpis: [
      {
        label_ar: 'إجمالي السجلات المحللة',
        label_en: 'Records Processed',
        value: '1.45M+',
        change: '+24.5%',
        isPositive: true,
      },
      {
        label_ar: 'دقة النموذج والتوقع (R²)',
        label_en: 'Model Accuracy (R²)',
        value: '97.2%',
        change: '+3.1%',
        isPositive: true,
      },
      {
        label_ar: 'معدل التباين المعياري',
        label_en: 'Standard Deviation (σ)',
        value: '0.042',
        change: '-12.8%',
        isPositive: true,
      },
      {
        label_ar: 'زمن المعالجة اللحظية',
        label_en: 'Query Latency',
        value: '< 18ms',
        change: 'Optimized',
        isPositive: true,
      },
    ],
    chartData: [
      { label: 'Q1', value: 45000, comparisonValue: 38000 },
      { label: 'Q2', value: 68000, comparisonValue: 52000 },
      { label: 'Q3', value: 89000, comparisonValue: 71000 },
      { label: 'Q4', value: 124000, comparisonValue: 95000 },
    ],
    insights: [
      {
        title_ar: 'ارتباط طردي قوي بين سرعة الإنجاز وزيادة العائد',
        title_en: 'Strong Positive Correlation Detected',
        body_ar: 'كشفت النمذجة الإحصائية أن تقليل زمن دورة العمل بنسبة 15% يرفع معدل استبقاء العملاء بنسبة 22.4%.',
        body_en: 'Regression analysis reveals a 15% reduction in cycle duration correlates with a 22.4% surge in client retention.',
        type: 'positive',
      },
      {
        title_ar: 'كشف الانحرافات اللحظية والشذوذ الإحصائي (Outlier Detection)',
        title_en: 'Automated Anomaly & Outlier Mitigation',
        body_ar: 'تم ضبط عتبات Z-Score لاكتشاف ومعالجة البيانات المتطرفة قبل تأثيرها على حساب المتوسطات التقديرية.',
        body_en: 'Z-score thresholds successfully filtered anomalous spikes, safeguarding projection models from skewed distributions.',
        type: 'neutral',
      },
    ],
  };
}

/**
 * تزويد مشروع المحاسبة والمالية ببيانات تحليل التعادل CVP والقوائم والنسب المالية
 */
export function getAccountingData(project: Project): AccountingProjectMeta {
  if (project.accounting_data) return project.accounting_data;

  return {
    cvpDefaults: {
      pricePerUnit: 120,
      variableCostPerUnit: 45,
      fixedCosts: 180000,
      targetUnits: 3500,
    },
    incomeStatement: {
      revenue: 420000,
      cogs: 157500,
      grossProfit: 262500,
      operatingExpenses: 95000,
      operatingIncome: 167500,
      netIncome: 134000,
    },
    financialRatios: [
      {
        name_ar: 'نسبة التداول (Current Ratio)',
        name_en: 'Current Ratio',
        value: '2.45x',
        benchmark: '> 1.5x (Safe)',
        status: 'excellent',
      },
      {
        name_ar: 'هامش الربح التشغيلي (Operating Margin)',
        name_en: 'Operating Margin (EBIT %)',
        value: '39.8%',
        benchmark: '> 25% (High)',
        status: 'excellent',
      },
      {
        name_ar: 'العائد على حقوق الملكية (ROE)',
        name_en: 'Return on Equity (ROE)',
        value: '24.2%',
        benchmark: '> 15% (Superior)',
        status: 'excellent',
      },
      {
        name_ar: 'نسبة الرافعة المالية (Debt to Equity)',
        name_en: 'Debt-to-Equity Ratio',
        value: '0.61x',
        benchmark: '< 1.0x (Prudent)',
        status: 'good',
      },
    ],
  };
}
