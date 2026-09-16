// الإطار العام للوحة التحكم الفلكية (Admin Dashboard Layout)
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { authApi, authService } from '../../services/api';
import { AuthUser } from '../../types';
import { soundFX } from '../../utils/audio';

import { AdminLogin } from './AdminLogin';
import { AdminOverview } from './AdminOverview';
import { ProjectsManager } from './ProjectsManager';
import { CertificatesManager } from './CertificatesManager';
import { MessagesInbox } from './MessagesInbox';
import { SiteSettingsManager } from './SiteSettingsManager';
import { ResumeManager } from './ResumeManager';

import {
  LayoutDashboard,
  FolderGit2,
  GraduationCap,
  FileText,
  Mail,
  Sliders,
  LogOut,
  ExternalLink,
  Sparkles,
  Database,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';

interface AdminLayoutProps {
  onBackToSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToSite }) => {
  const { projects, certificates, settings, messages, unreadCount, backendStatus, refreshData } = useData();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'certificates' | 'resume' | 'messages' | 'settings'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // التحقق من صلاحية الجلسة عند التحميل
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.hasToken()) {
        try {
          const user = await authApi.getMe();
          setCurrentUser(user);
        } catch {
          setCurrentUser(null);
        }
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    soundFX.playClick();
    authApi.logout();
    setCurrentUser(null);
  };

  // شاشة فحص الجلسة
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center text-moonlight text-xs font-mono">
        <Sparkles className="w-5 h-5 text-brass animate-spin me-2" />
        <span>جاري التحقق من الصلاحيات الفلكية...</span>
      </div>
    );
  }

  // إذا لم يكن مسجلاً، اعرض شاشة تسجيل الدخول
  if (!currentUser) {
    return (
      <AdminLogin
        onLoginSuccess={(user) => setCurrentUser(user)}
        onBackToSite={onBackToSite}
      />
    );
  }

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'projects', label: 'إدارة المشاريع', icon: FolderGit2, badge: projects.length },
    { id: 'certificates', label: 'الشهادات والمسار', icon: GraduationCap, badge: certificates.length },
    { id: 'resume', label: 'السيرة الذاتية (CV)', icon: FileText },
    {
      id: 'messages',
      label: 'صندوق الرسائل',
      icon: Mail,
      badge: unreadCount > 0 ? `${unreadCount} جديدة` : messages.length > 0 ? messages.length : undefined,
      isAlert: unreadCount > 0,
    },
    { id: 'settings', label: 'إعدادات الموقع', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-void text-moonlight selection:bg-brass selection:text-void flex flex-col font-sans">
      {/* الشريط العلوي للوحة التحكم */}
      <header className="sticky top-0 z-40 bg-deep/90 border-b border-ink backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* الشعار واسم اللوحة */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-void border border-brass/50 flex items-center justify-center text-brass shadow-[0_0_12px_rgba(201,162,39,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold font-display text-sm sm:text-base text-moonlight flex items-center gap-2">
                <span>لوحة تحكم محفظة محمد حمدي</span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-brass/10 border border-brass/30 text-brass">
                  MERN Admin
                </span>
              </div>
              <div className="text-[11px] text-dust font-mono flex items-center gap-2">
                <span>المستخدم: {currentUser.username}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  {backendStatus.dbConnected ? (
                    <span className="text-emerald-400">MongoDB متصلة</span>
                  ) : (
                    <span className="text-amber-400">وضع المحاكاة (Fallback)</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* الأزرار العلوية */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToSite}
              className="px-3 py-2 rounded-lg bg-void border border-ink hover:border-brass/40 text-dust hover:text-moonlight text-xs flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brass" />
              <span className="hidden sm:inline">معاينة الموقع العام</span>
            </button>

            <button
              onClick={handleLogout}
              title="تسجيل الخروج"
              className="p-2 rounded-lg bg-void border border-ink hover:border-red-500 text-dust hover:text-red-400 text-xs transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* زر القائمة للشاشات الصغيرة */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-void border border-ink text-dust"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* أشرطة التبويب للديسكتوب */}
        <div className="max-w-7xl mx-auto hidden md:flex items-center gap-2 pt-3 mt-2 border-t border-ink/50 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFX.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-brass text-void font-bold shadow-[0_0_15px_rgba(201,162,39,0.3)]'
                    : 'text-dust hover:text-moonlight hover:bg-void/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold transition-colors ${
                      tab.isAlert
                        ? isActive
                          ? 'bg-void text-brass ring-1 ring-brass'
                          : 'bg-brass text-void shadow-[0_0_8px_rgba(201,162,39,0.5)] animate-pulse'
                        : isActive
                        ? 'bg-void text-brass'
                        : 'bg-void border border-ink text-dust'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* قائمة الموبايل المنسدلة */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 mt-2 border-t border-ink/50 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab(tab.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-lg text-xs font-mono flex items-center justify-between ${
                    isActive ? 'bg-brass text-void font-bold' : 'text-dust hover:bg-void'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        tab.isAlert
                          ? 'bg-brass text-void font-bold animate-pulse'
                          : 'bg-void border border-ink text-dust'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* المحتوى الرئيسي للوحة التحكم */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8">
        {activeTab === 'overview' && (
          <AdminOverview
            projects={projects}
            certificates={certificates}
            settings={settings}
            backendStatus={backendStatus}
            onNavigate={(tab) => {
              soundFX.playClick();
              setActiveTab(tab);
            }}
            onOpenNewProject={() => {
              soundFX.playClick();
              setActiveTab('projects');
              setIsNewProjectModalOpen(true);
            }}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsManager
            projects={projects}
            onRefresh={refreshData}
            isAddModalOpenInitially={isNewProjectModalOpen}
            onCloseAddModalInitially={() => setIsNewProjectModalOpen(false)}
          />
        )}

        {activeTab === 'certificates' && (
          <CertificatesManager
            certificates={certificates}
            onRefresh={refreshData}
          />
        )}

        {activeTab === 'resume' && <ResumeManager />}

        {activeTab === 'messages' && <MessagesInbox />}

        {activeTab === 'settings' && (
          <SiteSettingsManager
            settings={settings}
            onRefresh={refreshData}
          />
        )}
      </main>
    </div>
  );
};
