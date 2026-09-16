// التطبيق الرئيسي للبورتفوليو العصري مع مزود البيانات ولوحة التحكم
import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { StarCursor } from './components/StarCursor';
import { CosmicSpotlight } from './components/CosmicSpotlight';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Certificates } from './components/Certificates';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { AdminLayout } from './components/admin/AdminLayout';
import { ResumePage } from './components/cv/ResumePage';
import { LoadingScreen } from './components/LoadingScreen';

type AppView = 'site' | 'admin' | 'cv';

const getViewFromUrl = (): AppView => {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (path.startsWith('/admin') || hash.startsWith('#admin')) return 'admin';
  if (path.startsWith('/cv') || hash.startsWith('#cv') || path.startsWith('/resume') || hash.startsWith('#resume'))
    return 'cv';
  return 'site';
};

interface AppContentProps {
  onOpenAdmin: () => void;
  onOpenCV: () => void;
  onReplayLoading?: () => void;
}

export const AppContent: React.FC<AppContentProps> = ({ onOpenAdmin, onOpenCV, onReplayLoading }) => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // استماع لاختصار Ctrl+K و Cmd+K عالمياً
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-void text-moonlight selection:bg-brass selection:text-void font-sans overflow-x-hidden">
      {/* مؤشر الماوس الفلكي على شكل نجمة ذهبية مشعة مع ذيل غبار */}
      <StarCursor />

      {/* توهج الماوس التفاعلي الموضعي */}
      <CosmicSpotlight />

      {/* حقل النجوم الكوني الغني بالنجوم الساطعة والشهب العابرة */}
      <StarfieldCanvas />

      {/* شريط التنقل العلوي الزجاجي */}
      <Navbar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenCV={onOpenCV}
      />

      {/* لوحة الأوامر السريعة المنبثقة */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenAdmin={onOpenAdmin}
        onOpenCV={onOpenCV}
        onReplayLoading={onReplayLoading}
      />

      {/* متن الصفحة الرئيسي */}
      <main className="relative z-10">
        {/* الـ Hero مع الهلال الفلكي الحي وطبقة حماية التباين */}
        <Hero onOpenCV={onOpenCV} />

        {/* قسم عني والمهارات والطرفية البرمجية */}
        <About />

        {/* معرض المشاريع مع كروت التوهج التفاعلي والإمالة ثلاثية الأبعاد */}
        <Projects />

        {/* المسار المهني بتصميم خط الأبراج الفلكية */}
        <Certificates />

        {/* قسم التواصل المباشر ونموذج المراسلة الفوري */}
        <Contact />
      </main>

      {/* الفوتر مع رابط لوحة الإدارة */}
      <Footer onOpenAdmin={onOpenAdmin} onOpenCV={onOpenCV} />
    </div>
  );
};

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(getViewFromUrl);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentView(getViewFromUrl());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleOpenAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setCurrentView('admin');
    window.scrollTo(0, 0);
  };

  const handleOpenCV = () => {
    window.history.pushState({}, '', '/cv');
    setCurrentView('cv');
    window.scrollTo(0, 0);
  };

  const handleBackToSite = () => {
    window.history.pushState({}, '', '/');
    setCurrentView('site');
    window.scrollTo(0, 0);
  };

  return (
    <DataProvider>
      <LanguageProvider>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
        {currentView === 'admin' && <AdminLayout onBackToSite={handleBackToSite} />}
        {currentView === 'cv' && <ResumePage onBackToSite={handleBackToSite} />}
        {currentView === 'site' && (
          <AppContent
            onOpenAdmin={handleOpenAdmin}
            onOpenCV={handleOpenCV}
            onReplayLoading={() => setIsLoading(true)}
          />
        )}
      </LanguageProvider>
    </DataProvider>
  );
};

export default App;

