// سياق البيانات الموحد (Data Context) لتزويد الموقع بالبيانات الحية والـ Fallback
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, Certificate, SiteSettings, ContactMessage, ResumeData } from '../types';
import {
  projectsApi,
  certificatesApi,
  settingsApi,
  messagesApi,
  resumeApi,
  defaultResumeData,
  checkBackendHealth,
  defaultSiteSettings,
  authService,
} from '../services/api';
import { portfolioProjects, portfolioCertificates } from '../data/portfolioData';

interface BackendStatus {
  online: boolean;
  dbConnected: boolean;
  lastChecked?: Date;
}

interface DataContextType {
  projects: Project[];
  certificates: Certificate[];
  settings: SiteSettings;
  messages: ContactMessage[];
  unreadCount: number;
  resumeData: ResumeData;
  backendStatus: BackendStatus;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  refreshMessages: () => Promise<void>;
  refreshResume: () => Promise<void>;
  updateResumeData: (data: Partial<ResumeData>) => Promise<ResumeData>;
  submitMessage: (data: {
    name: string;
    email: string;
    message: string;
  }) => Promise<{ success: boolean; message: string }>;
  markMessageRead: (id: string, read?: boolean) => Promise<void>;
  markAllMessagesRead: () => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // البدء فوراً بالبيانات الثابتة لمنع أي وميض أو تأخير في تجربة المستخدم
  const [projects, setProjects] = useState<Project[]>(portfolioProjects);
  const [certificates, setCertificates] = useState<Certificate[]>(portfolioCertificates);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [resumeDataState, setResumeDataState] = useState<ResumeData>(defaultResumeData);
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    online: false,
    dbConnected: false,
  });

  const refreshMessages = useCallback(async () => {
    try {
      if (authService.hasToken()) {
        const res = await messagesApi.getAll();
        setMessages(res.messages);
        setUnreadCount(res.unreadCount);
      }
    } catch (err) {
      console.warn('⚠️ خطأ أثناء تحديث الرسائل في DataContext:', err);
    }
  }, []);

  const refreshResume = useCallback(async () => {
    try {
      const res = await resumeApi.get();
      if (res && res.personal) {
        setResumeDataState(res);
      }
    } catch (err) {
      console.warn('⚠️ خطأ أثناء تحديث السيرة الذاتية في DataContext:', err);
    }
  }, []);

  const updateResumeData = async (data: Partial<ResumeData>): Promise<ResumeData> => {
    const updated = await resumeApi.update(data);
    setResumeDataState(updated);
    return updated;
  };

  const refreshData = useCallback(async () => {
    try {
      // 1. فحص صحة السيرفر وقاعدة البيانات
      const health = await checkBackendHealth();
      setBackendStatus({
        online: health.online,
        dbConnected: health.dbConnected,
        lastChecked: new Date(),
      });

      // 2. جلب البيانات من الـ API
      const [fetchedProjects, fetchedCerts, fetchedSettings, fetchedResume] = await Promise.all([
        projectsApi.getAll(),
        certificatesApi.getAll(),
        settingsApi.get(),
        resumeApi.get(),
      ]);

      if (fetchedProjects && fetchedProjects.length > 0) {
        setProjects(fetchedProjects);
      }
      if (fetchedCerts && fetchedCerts.length > 0) {
        setCertificates(fetchedCerts);
      }
      if (fetchedSettings) {
        setSettings(fetchedSettings);
      }
      if (fetchedResume && fetchedResume.personal) {
        setResumeDataState(fetchedResume);
      }

      // 3. تحديث الرسائل إن كان المستخدم مسجلاً
      await refreshMessages();
    } catch (err) {
      console.warn('⚠️ خطأ أثناء تحديث البيانات من السيرفر:', err);
    } finally {
      setIsLoading(false);
    }
  }, [refreshMessages]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // إرسال رسالة تواصل
  const submitMessage = async (data: { name: string; email: string; message: string }) => {
    const res = await messagesApi.send(data);
    if (authService.hasToken()) {
      await refreshMessages();
    }
    return res;
  };

  // تبديل حالة القراءة لرسالة
  const markMessageRead = async (id: string, read?: boolean) => {
    const updated = await messagesApi.toggleRead(id, read);
    setMessages((prev) =>
      prev.map((m) => (m._id === id ? { ...m, read: updated.read } : m))
    );
    setUnreadCount((prev) => (updated.read ? Math.max(0, prev - 1) : prev + 1));
  };

  // تحديد كل الرسائل كمقروءة دفعة واحدة
  const markAllMessagesRead = async () => {
    await messagesApi.markAllAsRead();
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
    setUnreadCount(0);
  };

  // حذف رسالة
  const deleteMessage = async (id: string) => {
    await messagesApi.delete(id);
    setMessages((prev) => {
      const remaining = prev.filter((m) => m._id !== id);
      setUnreadCount(remaining.filter((m) => !m.read).length);
      return remaining;
    });
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        certificates,
        settings,
        messages,
        unreadCount,
        resumeData: resumeDataState,
        backendStatus,
        isLoading,
        refreshData,
        refreshMessages,
        refreshResume,
        updateResumeData,
        submitMessage,
        markMessageRead,
        markAllMessagesRead,
        deleteMessage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
