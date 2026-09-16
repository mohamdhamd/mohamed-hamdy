// أنواع البيانات الخاصة بالبورتفوليو الفلكي

export type Language = 'ar' | 'en';

export type ProjectCategory =
  | 'fullstack'
  | 'data_analysis'
  | 'accounting'
  | 'web'
  | 'tools'
  | 'systems';

export type ProjectDomain = 'fullstack' | 'data_analysis' | 'accounting';

export interface FullStackProjectMeta {
  architecture?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    devops?: string[];
  };
  apiEndpoints?: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    description_ar: string;
    description_en: string;
    mockResponse: any;
  }[];
  lighthouseScores?: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

export interface DataAnalysisProjectMeta {
  kpis?: {
    label_ar: string;
    label_en: string;
    value: string;
    change?: string;
    isPositive?: boolean;
  }[];
  chartData?: {
    label: string;
    value: number;
    comparisonValue?: number;
  }[];
  sampleData?: {
    columns: string[];
    rows: (string | number)[][];
  };
  insights?: {
    title_ar: string;
    title_en: string;
    body_ar: string;
    body_en: string;
    type?: 'positive' | 'warning' | 'neutral';
  }[];
}

export interface AccountingProjectMeta {
  equation?: {
    assets: number;
    liabilities: number;
    equity: number;
    currency?: string;
  };
  cvpDefaults?: {
    pricePerUnit: number;
    variableCostPerUnit: number;
    fixedCosts: number;
    targetUnits?: number;
  };
  incomeStatement?: {
    revenue: number;
    cogs: number;
    grossProfit: number;
    operatingExpenses: number;
    operatingIncome: number;
    netIncome: number;
  };
  financialRatios?: {
    name_ar: string;
    name_en: string;
    value: string;
    benchmark: string;
    status: 'good' | 'warning' | 'excellent';
  }[];
}

export interface Project {
  id: string;
  title_ar: string;
  title_en: string;
  summary_ar: string;
  summary_en: string;
  body_ar: string;
  body_en: string;
  cover: string;
  gallery?: string[];
  tech: string[];
  category: ProjectCategory | string;
  category_label_ar: string;
  category_label_en: string;
  live_url?: string | null;
  repo_url?: string | null;
  featured?: boolean;
  order: number;
  status?: 'published' | 'draft';
  code_snippet?: string;
  fullstack_data?: FullStackProjectMeta;
  analytics_data?: DataAnalysisProjectMeta;
  accounting_data?: AccountingProjectMeta;
  createdAt?: string;
}

export interface Certificate {
  id: string;
  title_ar: string;
  title_en: string;
  issuer: string;
  issuer_en: string;
  issue_date: string;
  issue_date_en: string;
  credential_url?: string | null;
  status_ar: string;
  status_en: string;
  order: number;
  createdAt?: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SiteSettings {
  hero_name_ar: string;
  hero_name_en: string;
  hero_title_ar: string;
  hero_title_en: string;
  hero_subtitle_ar: string;
  hero_subtitle_en: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  cma_status_ar: string;
  cma_status_en: string;
  location_ar: string;
  location_en: string;
  stats: {
    projects_count: number;
    years_exp: number;
    satisfaction_rate: string;
  };
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface MoonData {
  phase: number;           // طور القمر من 0 إلى 1
  illumination: number;    // نسبة الإضاءة من 0 إلى 100
  phaseNameAr: string;     // اسم الطور بالعربي (بدر، هلال متزايد...)
  phaseNameEn: string;     // اسم الطور بالإنجليزي
  hijriDateAr: string;     // التاريخ الهجري بالعربي
  hijriDateEn: string;     // التاريخ الهجري بالأرقام اللاتينية
  isWaxing: boolean;       // هل القمر في حالة زيادة (الإضاءة يمين في النصف الشمالي)
}

// واجهات السيرة الذاتية الرسمية القابلة للتخصيص من لوحة التحكم
export interface ResumePersonal {
  name_ar: string;
  name_en: string;
  title_ar: string;
  title_en: string;
  location_ar: string;
  location_en: string;
  phone: string;
  email: string;
  linkedin: string;
  linkedin_url: string;
  military_status_ar: string;
  military_status_en: string;
  pdf_filename: string;
  pdf_url: string;
}

export interface ResumeSummary {
  ar: string;
  en: string;
}

export interface ResumeEducation {
  degree_ar: string;
  degree_en: string;
  institution_ar: string;
  institution_en: string;
  period: string;
  grade_ar: string;
  grade_en: string;
}

export interface ResumeStat {
  label_ar: string;
  label_en: string;
  value: string;
}

export interface ResumeCertificationItem {
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

export interface ResumeExperienceItem {
  role_ar: string;
  role_en: string;
  organization_ar: string;
  organization_en: string;
  period: string;
  points_ar: string[];
  points_en: string[];
}

export interface ResumeSkillCategoryItem {
  category_ar: string;
  category_en: string;
  iconName: string;
  skills: { name: string; level: number; highlight?: boolean }[];
}

export interface ResumeTrackInfo {
  title_ar: string;
  title_en: string;
  summary_ar: string;
  summary_en: string;
  badge_ar: string;
  badge_en: string;
  stats?: ResumeStat[];
}

export interface ResumeData {
  _id?: string;
  personal: ResumePersonal;
  summary: ResumeSummary;
  education: ResumeEducation;
  stats: ResumeStat[];
  certifications?: ResumeCertificationItem[];
  leadership: ResumeExperienceItem[];
  skills: ResumeSkillCategoryItem[];
  tracks: Record<string, ResumeTrackInfo>;
  createdAt?: string;
  updatedAt?: string;
}

