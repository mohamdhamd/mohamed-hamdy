// سياق إدارة اللغة والاتجاه (RTL / LTR) مع الحفظ في المتصفح
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
  isRTL: boolean;
  t: (arText: string, enText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // استرجاع تفضيل اللغة المحفوظ أو الافتراضي عربي
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('mh_portfolio_lang');
      return (saved === 'en' || saved === 'ar') ? saved : 'ar';
    } catch {
      return 'ar';
    }
  });

  const isRTL = lang === 'ar';

  // تحديث سمات عنصر html الرئيسي عند تغيير اللغة
  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      localStorage.setItem('mh_portfolio_lang', lang);
    } catch {
      // التعامل الآمن في بيئات التصفح الصارم
    }
  }, [lang, isRTL]);

  const toggleLang = () => {
    setLangState(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  // دالة مساعدة لاختيار النص حسب اللغة النشطة
  const t = (arText: string, enText: string) => {
    return lang === 'ar' ? arText : enText;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
