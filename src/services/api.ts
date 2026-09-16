// خدمة الاتصال بالـ REST API مع إدارة التوكن ونظام Fallback التلقائي الذكي
import { Project, Certificate, ContactMessage, SiteSettings, AuthUser, ResumeData } from '../types';
import { portfolioProjects, portfolioCertificates } from '../data/portfolioData';
import { resumeData } from '../data/resumeData';
import { resumeTracks } from '../data/resumeTracks';

const envApiUrl = (import.meta as any).env?.VITE_API_URL;
const API_BASE = envApiUrl ? `${envApiUrl.replace(/\/$/, '')}/api` : '/api';
const TOKEN_KEY = 'mh_portfolio_admin_token';

// إعدادات الموقع الافتراضية كـ Fallback في حال تعذر الاتصال بالباك إند
export const defaultSiteSettings: SiteSettings = {
  hero_name_ar: 'محمد حمدي ',
  hero_name_en: 'Mohamed Hamdy ',
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

// إدارة التوكن
export const authService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  hasToken: () => !!localStorage.getItem(TOKEN_KEY),
};

// مساعد لطلبات الـ HTTP مع حقن التوكن ومعالجة الأخطاء
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authService.getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `خطأ في الاتصال بالخادم (${response.status})`);
  }

  return data;
}

// 🩺 فحص حالة السيرفر وقاعدة البيانات
export async function checkBackendHealth(): Promise<{
  online: boolean;
  dbConnected: boolean;
  details?: any;
}> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    if (!res.ok) return { online: false, dbConnected: false };
    const data = await res.json();
    return {
      online: true,
      dbConnected: data.database?.connected === true,
      details: data,
    };
  } catch {
    return { online: false, dbConnected: false };
  }
}

// 📁 خدمات المشاريع (Projects API)
export const projectsApi = {
  async getAll(params?: { all?: boolean; category?: string }): Promise<Project[]> {
    try {
      const query = new URLSearchParams();
      if (params?.all) query.append('all', 'true');
      if (params?.category && params.category !== 'all') query.append('category', params.category);

      const res = await request<{ success: boolean; data: Project[] }>(
        `/projects?${query.toString()}`
      );
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return portfolioProjects;
    } catch (err) {
      console.warn('⚠️ تعذر جلب المشاريع من السيرفر، تم التبديل إلى البيانات المحلية:', err);
      return portfolioProjects;
    }
  },

  async getById(id: string): Promise<Project | null> {
    try {
      const res = await request<{ success: boolean; data: Project }>(`/projects/${id}`);
      return res.data;
    } catch {
      return portfolioProjects.find((p) => p.id === id) || null;
    }
  },

  async create(project: Partial<Project>): Promise<Project> {
    const res = await request<{ success: boolean; data: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
    return res.data;
  },

  async update(id: string, project: Partial<Project>): Promise<Project> {
    const res = await request<{ success: boolean; data: Project }>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
    return res.data;
  },

  async delete(id: string): Promise<boolean> {
    const res = await request<{ success: boolean }>(`/projects/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },

  async reorder(items: { id: string; order: number }[]): Promise<boolean> {
    const res = await request<{ success: boolean }>('/projects/reorder/batch', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
    return res.success;
  },
};

// 🎓 خدمات الشهادات (Certificates API)
export const certificatesApi = {
  async getAll(): Promise<Certificate[]> {
    try {
      const res = await request<{ success: boolean; data: Certificate[] }>('/certificates');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return portfolioCertificates;
    } catch (err) {
      console.warn('⚠️ تعذر جلب الشهادات من السيرفر، تم التبديل إلى البيانات المحلية:', err);
      return portfolioCertificates;
    }
  },

  async create(cert: Partial<Certificate>): Promise<Certificate> {
    const res = await request<{ success: boolean; data: Certificate }>('/certificates', {
      method: 'POST',
      body: JSON.stringify(cert),
    });
    return res.data;
  },

  async update(id: string, cert: Partial<Certificate>): Promise<Certificate> {
    const res = await request<{ success: boolean; data: Certificate }>(`/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cert),
    });
    return res.data;
  },

  async delete(id: string): Promise<boolean> {
    const res = await request<{ success: boolean }>(`/certificates/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },
};

// ✉️ خدمات الرسائل (Messages API)
export const messagesApi = {
  async send(data: { name: string; email: string; message: string }): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getAll(): Promise<{ messages: ContactMessage[]; unreadCount: number }> {
    const res = await request<{ success: boolean; data: ContactMessage[]; unreadCount: number }>(
      '/messages'
    );
    return { messages: res.data || [], unreadCount: res.unreadCount || 0 };
  },

  async toggleRead(id: string, read?: boolean): Promise<ContactMessage> {
    const res = await request<{ success: boolean; data: ContactMessage }>(`/messages/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ read }),
    });
    return res.data;
  },

  async markAllAsRead(): Promise<boolean> {
    const res = await request<{ success: boolean }>('/messages/read-all', {
      method: 'PATCH',
    });
    return res.success;
  },

  async delete(id: string): Promise<boolean> {
    const res = await request<{ success: boolean }>(`/messages/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },
};

// ⚙️ خدمات إعدادات الموقع (Site Settings API)
export const settingsApi = {
  async get(): Promise<SiteSettings> {
    try {
      const res = await request<{ success: boolean; data: SiteSettings }>('/settings');
      if (res.success && res.data) {
        return { ...defaultSiteSettings, ...res.data };
      }
      return defaultSiteSettings;
    } catch {
      return defaultSiteSettings;
    }
  },

  async update(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await request<{ success: boolean; data: SiteSettings }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return res.data;
  },
};

// 📄 بيانات السيرة الذاتية الافتراضية
export const defaultResumeData: ResumeData = {
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
  leadership: (resumeData as any).leadership || [],
  skills: (resumeData as any).skills || [],
  tracks: {
    all: {
      title_ar: resumeTracks.all.title_ar,
      title_en: resumeTracks.all.title_en,
      summary_ar: resumeTracks.all.summary_ar,
      summary_en: resumeTracks.all.summary_en,
      badge_ar: resumeTracks.all.badge_ar,
      badge_en: resumeTracks.all.badge_en,
    },
    accountant: {
      title_ar: resumeTracks.accountant.title_ar,
      title_en: resumeTracks.accountant.title_en,
      summary_ar: resumeTracks.accountant.summary_ar,
      summary_en: resumeTracks.accountant.summary_en,
      badge_ar: resumeTracks.accountant.badge_ar,
      badge_en: resumeTracks.accountant.badge_en,
    },
    data_analyst: {
      title_ar: resumeTracks.data_analyst.title_ar,
      title_en: resumeTracks.data_analyst.title_en,
      summary_ar: resumeTracks.data_analyst.summary_ar,
      summary_en: resumeTracks.data_analyst.summary_en,
      badge_ar: resumeTracks.data_analyst.badge_ar,
      badge_en: resumeTracks.data_analyst.badge_en,
    },
    fullstack: {
      title_ar: resumeTracks.fullstack.title_ar,
      title_en: resumeTracks.fullstack.title_en,
      summary_ar: resumeTracks.fullstack.summary_ar,
      summary_en: resumeTracks.fullstack.summary_en,
      badge_ar: resumeTracks.fullstack.badge_ar,
      badge_en: resumeTracks.fullstack.badge_en,
    },
  },
};

// 📄 خدمات السيرة الذاتية (Resume API)
export const resumeApi = {
  async get(): Promise<ResumeData> {
    try {
      const res = await request<{ success: boolean; data: ResumeData }>('/resume');
      if (res.success && res.data && res.data.personal) {
        return {
          ...defaultResumeData,
          ...res.data,
          personal: { ...defaultResumeData.personal, ...(res.data.personal || {}) },
          summary: { ...defaultResumeData.summary, ...(res.data.summary || {}) },
          education: { ...defaultResumeData.education, ...(res.data.education || {}) },
          tracks: { ...defaultResumeData.tracks, ...(res.data.tracks || {}) },
        };
      }
      return defaultResumeData;
    } catch {
      return defaultResumeData;
    }
  },

  async update(data: Partial<ResumeData>): Promise<ResumeData> {
    const res = await request<{ success: boolean; data: ResumeData }>('/resume', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },
};

// 🖼️ خدمة رفع الصور (Upload API)
export const uploadApi = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await request<{ success: boolean; url: string }>('/upload', {
      method: 'POST',
      body: formData,
    });

    return res.url;
  },
};

// 🔐 خدمات المصادقة وتسجيل الدخول
export const authApi = {
  async login(identifier: string, password: string): Promise<{ user: AuthUser; token: string }> {
    const res = await request<{ success: boolean; token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    authService.setToken(res.token);
    return { user: res.user, token: res.token };
  },

  async getMe(): Promise<AuthUser | null> {
    try {
      const res = await request<{ success: boolean; user: AuthUser }>('/auth/me');
      return res.user;
    } catch {
      authService.removeToken();
      return null;
    }
  },

  logout() {
    authService.removeToken();
  },
};
