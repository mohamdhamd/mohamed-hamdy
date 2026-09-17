// قسم "عني" المتقدم — يدمج بين تطوير الـ Full-Stack الشامل ودقة المنطق المالي والمحاسبي
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { soundFX } from '../utils/audio';
import {
  Terminal,
  Code2,
  Zap,
  CheckCircle2,
  FileCode,
  Gauge,
  ShieldCheck,
  Timer,
  Sparkles,
  Layers,
  Database,
  Calculator,
  Briefcase,
  Play,
  RotateCcw,
  Scale,
  LineChart,
} from 'lucide-react';

export const About: React.FC = () => {
  const { t, lang } = useLanguage();
  const [personaMode, setPersonaMode] = useState<'developer' | 'business'>('developer');
  const [devTab, setDevTab] = useState<'profile' | 'stack' | 'ledger'>('profile');
  const [bizTab, setBizTab] = useState<'roi' | 'balancesheet' | 'audit'>('roi');
  const [isVerifyingLedger, setIsVerifyingLedger] = useState(false);
  const [ledgerVerified, setLedgerVerified] = useState(true);

  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleRunLedgerTest = () => {
    soundFX.playClick();
    setIsVerifyingLedger(true);
    setTimeout(() => {
      soundFX.playChime();
      setIsVerifyingLedger(false);
      setLedgerVerified(true);
    }, 600);
  };

  return (
    <section id="about" ref={sectionRef} className="py-16 sm:py-28 lg:py-32 px-3.5 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        {/* عنوان القسم مع أنيميشن النصوص المتناسق */}
        <div className="reveal-on-scroll text-reveal flex flex-col items-start gap-2">
          <div className="text-reveal-badge inline-flex items-center gap-2 text-brass text-xs font-mono tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>{t('هندسة برمجية ومنطق مالي متين', 'FULL-STACK & FINANCIAL TECH')}</span>
          </div>
          <h2 className="text-reveal-heading font-display text-2xl sm:text-4xl md:text-5xl font-bold text-moonlight">
            {t('بناء أنظمة متكاملة تفهم لغة الأرقام', 'Architecting Systems Powered by Financial Logic')}
          </h2>
        </div>

        {/* شبكة النبذة التعريفية + الطرفية التفاعلية */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* النص التعريفي الأيمن */}
          <div
            style={{ '--reveal-delay': '0ms' } as React.CSSProperties}
            className="reveal-on-scroll card-reveal card-sheen lg:col-span-6 glass-card p-4 sm:p-7 lg:p-10 rounded-2xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4 text-base sm:text-lg text-dust leading-relaxed">
              <h3 className="text-moonlight font-bold text-lg sm:text-2xl font-display">
                {t(
                  'أهلاً بك! أنا محمد حمدي، خريج محاسبة (86%) ومطور Full-Stack ومحلل بيانات.',
                  "Welcome! I'm Mohamed Hamdy, Accounting Graduate (86%), Data Analyst & Full-Stack Developer."
                )}
              </h3>
              <p className="text-dust/90 leading-relaxed text-xs sm:text-base">
                {t(
                  '«خريج كلية التجارة شعبة اللغة الإنجليزية قسم المحاسبة (تقدير جيد جداً بنسبة 86%)، متخصص في تطبيق وتخصيص أنظمة Odoo ERP وحلول ذكاء الأعمال في Power BI ونمذجة Excel المتقدم، إلى جانب بناء وتطوير تطبيقات الويب المتكاملة بنظام MERN Stack. أهتم بصلابة قواعد البيانات ومعمارية الـ Backend وأمان المعاملات المالية، وصولاً إلى واجهات استخدام سلسة وسريعة الأداء. خلفيتي المحاسبية تمنحني ميزة فريدة في فهم منطق الأعمال (Business Logic) وتحويل العمليات المالية المعقدة إلى حلول برمجية دقيقة يعتمد عليها.»',
                  "Faculty of Commerce Accounting Graduate – English Section (Very Good - 86%), experienced in Odoo ERP implementation, Microsoft Power BI intelligence, and financial Excel modeling alongside full-stack MERN engineering. I architect end-to-end web platforms from scratch — ensuring robust database schemas, secure transaction pipelines, and resilient backend services, crowned with fluid, high-performance interfaces."
                )}
              </p>
            </div>

            {/* بطاقات المقاييس الأربعة المطورة (Full-Stack & Financial Metrics) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-4 border-t border-ink">
              {/* كارت 1: سلامة البيانات */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-ink/40 border border-ink/80 flex items-start gap-3 group hover:border-brass/30 transition-colors">
                <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-base font-bold text-moonlight">100%</p>
                  <p className="text-xs font-semibold text-moonlight/90">
                    {t('سلامة البيانات وحساباتها', 'Data Integrity')}
                  </p>
                  <p className="text-[11px] text-dust font-mono">
                    {t('خالية من أخطاء التقريب', 'Zero-error calculations')}
                  </p>
                </div>
              </div>

              {/* كارت 2: معمارية Full-Stack */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-ink/40 border border-ink/80 flex items-start gap-3 group hover:border-brass/30 transition-colors">
                <div className="p-2 sm:p-2.5 rounded-lg bg-brass/10 text-brass shrink-0">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-base font-bold text-moonlight whitespace-nowrap">Full-Stack</p>
                  <p className="text-xs font-semibold text-moonlight/90">
                    {t('معمارية شاملة من الصفر', 'End-to-End Arch')}
                  </p>
                  <p className="text-[11px] text-dust font-mono">
                    {t('من القواعد إلى الواجهات', 'Database to Modern UI')}
                  </p>
                </div>
              </div>

              {/* كارت 3: موثوقية المعاملات المالية ACID */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-ink/40 border border-ink/80 flex items-start gap-3 group hover:border-brass/30 transition-colors">
                <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-base font-bold text-moonlight">ACID</p>
                  <p className="text-xs font-semibold text-moonlight/90">
                    {t('معاملات مالية موثوقة', 'Compliant Transactions')}
                  </p>
                  <p className="text-[11px] text-dust font-mono">
                    {t('تطابق وتوازن القيود', 'Atomic & Consistent')}
                  </p>
                </div>
              </div>

              {/* كارت 4: سرعة المعالجة اللحظية */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-ink/40 border border-ink/80 flex items-start gap-3 group hover:border-brass/30 transition-colors">
                <div className="p-2 sm:p-2.5 rounded-lg bg-brass/10 text-brass shrink-0">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-base font-bold text-moonlight">&lt; 1s</p>
                  <p className="text-xs font-semibold text-moonlight/90">
                    {t('استجابة فورية للنظام', 'Real-time Processing')}
                  </p>
                  <p className="text-[11px] text-dust font-mono">
                    {t('تقارير وقوائم لحظية', 'Instant Ledger & Reports')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* نافذة الطرفية البرمجية التفاعلية (تظهر فقط في الشاشات الكبيرة وتختفي في الموبايل) */}
          <div
            style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
            className="reveal-on-scroll card-reveal card-sheen hidden lg:flex lg:col-span-6 glass-card rounded-2xl overflow-hidden flex-col border border-brass/30 shadow-2xl"
          >
            {/* شريط التحكم العلوي: أزرار النظام + زر التبديل الذكي بين وضعي المطور والأعمال */}
            <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-void/90 border-b border-ink flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span dir="ltr" className="text-xs font-mono text-dust ms-2 hidden sm:inline">
                  mohamed@hamdy:~$
                </span>
              </div>

              {/* زر التبديل الذكي (Interactive Persona Switcher) */}
              <div className="inline-flex p-0.5 sm:p-1 rounded-xl bg-deep border border-ink/90 text-[11px] sm:text-xs font-sans">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setPersonaMode('developer');
                  }}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                    personaMode === 'developer'
                      ? 'bg-brass text-void font-bold shadow-sm'
                      : 'text-dust hover:text-moonlight'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{t('وضع المطور', 'Developer')}</span>
                </button>

                <button
                  onClick={() => {
                    soundFX.playClick();
                    setPersonaMode('business');
                  }}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                    personaMode === 'business'
                      ? 'bg-brass text-void font-bold shadow-sm'
                      : 'text-dust hover:text-moonlight'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{t('منطق الأعمال والمالية', 'Business & Finance')}</span>
                </button>
              </div>
            </div>

            {/* شريط تبويبات الملفات مع فرض dir=ltr */}
            <div dir="ltr" className="px-3 sm:px-4 py-2 bg-void/60 border-b border-ink/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {personaMode === 'developer' ? (
                <>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setDevTab('profile');
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${
                      devTab === 'profile'
                        ? 'bg-ink text-brass border border-brass/30'
                        : 'text-dust hover:text-moonlight'
                    }`}
                  >
                    <FileCode className="w-3 h-3" />
                    <span>profile.json</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setDevTab('stack');
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${
                      devTab === 'stack'
                        ? 'bg-ink text-brass border border-brass/30'
                        : 'text-dust hover:text-moonlight'
                    }`}
                  >
                    <Database className="w-3 h-3" />
                    <span>stack.json</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setDevTab('ledger');
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${
                      devTab === 'ledger'
                        ? 'bg-ink text-brass border border-brass/30'
                        : 'text-dust hover:text-moonlight'
                    }`}
                  >
                    <Calculator className="w-3 h-3" />
                    <span>ledger.ts</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setBizTab('roi');
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${
                      bizTab === 'roi'
                        ? 'bg-ink text-brass border border-brass/30'
                        : 'text-dust hover:text-moonlight'
                    }`}
                  >
                    <LineChart className="w-3 h-3" />
                    <span>business-impact.md</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setBizTab('balancesheet');
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${
                      bizTab === 'balancesheet'
                        ? 'bg-ink text-brass border border-brass/30'
                        : 'text-dust hover:text-moonlight'
                    }`}
                  >
                    <Scale className="w-3 h-3" />
                    <span>balance-sheet.ts</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setBizTab('audit');
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${
                      bizTab === 'audit'
                        ? 'bg-ink text-brass border border-brass/30'
                        : 'text-dust hover:text-moonlight'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>audit-trail.log</span>
                  </button>
                </>
              )}
            </div>

            {/* جسم الطرفية مع فرض dir="ltr" و text-align: left لمنع أي انعكاس في الأقواس والرموز البرمجية */}
            <div
              dir="ltr"
              style={{ direction: 'ltr', textAlign: 'left' }}
              className="p-4 sm:p-6 font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed overflow-x-auto flex-1 bg-void/70 text-moonlight text-left no-scrollbar"
            >
              {/* وضع المطور (Developer Mode) */}
              {personaMode === 'developer' && (
                <>
                  {devTab === 'profile' && (
                    <div className="space-y-2">
                      <p className="text-dust/70">
                        {t(
                          '// بطاقة المطور والأنظمة المالية والبيانات المعتمدة',
                          '// Verified Developer, Data & Financial Systems Profile'
                        )}
                      </p>
                      <p className="text-brass">$ cat profile.json</p>
                      <pre className="text-moonlight/90 pt-1 text-[11px] sm:text-xs">
{lang === 'ar'
? `{
  "name": "محمد حمدي (Mohamed Hamdy)",
  "title": "خريج محاسبة (86%) · متخصص تحليل مالي وبيانات ومطور Full-Stack",
  "education": {
    "degree": "بكالوريوس التجارة - شعبة اللغة الإنجليزية (قسم المحاسبة)",
    "institution": "جامعة الزقازيق (Zagazig University)",
    "grade": "تقدير جيد جداً بنسبة 86% (Very Good)"
  },
  "specializations": [
    "المحاسبة المالية وتطبيق أنظمة Odoo ERP (أكثر من 84 ساعة معتمدة ITIDA)",
    "تحليل البيانات وذكاء الأعمال (Power BI ETL & DAX من Microsoft)",
    "تطوير البرمجيات وتطبيقات الويب (MERN Stack: React, Node, Express, MongoDB)"
  ],
  "location": "الشرقية / القاهرة، مصر (Sharkia / Cairo, Egypt)",
  "contact": {
    "email": "mohamed.hamdy.fawzy0@gmail.com",
    "phone": "+20 115 299 9615",
    "linkedin": "mohamed-hamdey"
  },
  "military_status": "مؤجل (Postponed)",
  "status": "جاهز للأنظمة المعقدة وحلول الأعمال والمالية والبرمجيات",
  "corePhilosophy": [
    "سلامة البيانات وحسابات مالية متطابقة بدون أي فروقات (Zero Variance)",
    "معمارية MERN متينة وشاملة من قاعدة البيانات حتى واجهة المستخدم",
    "ترجمة متطلبات الأعمال والمحاسبة إلى حلول رقمية موثوقة وعالية الأداء"
  ]
}`
: `{
  "name": "Mohamed Hamdy Fawzy",
  "title": "Accounting Graduate (86%) · Financial Analyst, Data Analyst & Full-Stack Developer",
  "education": {
    "degree": "B.Sc. in Accounting – Faculty of Commerce (English Section)",
    "institution": "Zagazig University",
    "grade": "Very Good (86%)"
  },
  "specializations": [
    "Financial Accounting & Odoo ERP Implementation (84+ hrs ITIDA)",
    "Data Analytics & Business Intelligence (Power BI ETL & DAX - Microsoft)",
    "Full-Stack Web Engineering (MERN Stack: React, Node, Express, MongoDB)"
  ],
  "location": "Sharkia / Cairo, Egypt",
  "contact": {
    "email": "mohamed.hamdy.fawzy0@gmail.com",
    "phone": "+20 115 299 9615",
    "linkedin": "mohamed-hamdey"
  },
  "military_status": "Postponed",
  "status": "Ready for complex systems, financial logic & modern web apps",
  "corePhilosophy": [
    "Data integrity and zero-variance financial calculations",
    "Clean, scalable architecture from Database to responsive UI",
    "Translating business needs into robust, high-performance software"
  ]
}`}
                      </pre>
                      <p className="text-emerald-400 pt-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                        <span>
                          {t(
                            'الحالة: النظام موثق وجاهز للنشر والتشغيل ✓',
                            'Status: System verified & ready to deploy ✓'
                          )}
                        </span>
                      </p>
                    </div>
                  )}

                  {devTab === 'stack' && (
                    <div className="space-y-2">
                      <p className="text-dust/70">
                        {t(
                          '// بنية التقنيات والأنظمة المالية وتحليل البيانات',
                          '// Full-Stack Architecture, Data & Financial Stack'
                        )}
                      </p>
                      <p className="text-brass">$ cat stack.json</p>
                      <pre className="text-moonlight/90 pt-1 text-[11px] sm:text-xs">
{`{
  "frontend_and_ui": [
    "React 18", "TypeScript", "Tailwind CSS",
    "Vite", "Context API", "Responsive & Mobile-First UX"
  ],
  "backend_and_database": [
    "Node.js", "Express.js", "MongoDB & Mongoose",
    "RESTful APIs", "JWT Auth", "Multer File Uploads",
    "ACID Transactions & Robust Schema Design"
  ],
  "data_and_analytics": [
    "Microsoft Power BI (ETL & DAX)",
    "Power Query Data Pipelines",
    "Advanced Microsoft Excel (Pivot & XLOOKUP)",
    "Python Automation & Scripting"
  ],
  "erp_and_financial_logic": [
    "Odoo ERP Implementation (84+ hrs ITIDA)",
    "Chart of Accounts (COA) Architecture",
    "Double-Entry General Ledger (Debit = Credit)",
    "Trial Balance & Financial Reporting (PFA)",
    "GAAP & IFRS Accounting Principles"
  ]
}`}
                      </pre>
                      <p className="text-dust text-xs pt-1">
                        {t(
                          'المعمارية: بنية خالية من نقاط الفشل الفردية، مع فحص صارم للأنواع وسلامة البيانات.',
                          'Architecture: Zero single points of failure, strictly type-safe & data-verified.'
                        )}
                      </p>
                    </div>
                  )}

                  {devTab === 'ledger' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-ink/60">
                        <p className="text-dust/70">// Double-Entry Journal Balancing Engine</p>
                        <button
                          onClick={handleRunLedgerTest}
                          disabled={isVerifyingLedger}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brass/20 hover:bg-brass text-brass hover:text-void border border-brass/40 text-xs font-mono transition-all font-semibold"
                        >
                          <Play className={`w-3 h-3 ${isVerifyingLedger ? 'animate-spin' : ''}`} />
                          <span>{isVerifyingLedger ? 'Verifying...' : 'Run Test'}</span>
                        </button>
                      </div>

                      <pre className="text-moonlight/90">
{`interface JournalEntry {
  account: string;
  debit: number;
  credit: number;
}

export function verifyJournalVoucher(entries: JournalEntry[]): boolean {
  const totalDebit  = entries.reduce((s, e) => s + e.debit, 0);
  const totalCredit = entries.reduce((s, e) => s + e.credit, 0);
  
  if (Math.abs(totalDebit - totalCredit) > 0.0001) {
    throw new Error("UNBALANCED_ENTRY: Debits must equal Credits");
  }
  return true; // ✓ ACID Compliant
}`}
                      </pre>

                      {ledgerVerified && (
                        <div className="p-3 rounded-lg bg-ink/50 border border-emerald-500/30 text-xs space-y-1">
                          <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>[ACID RUNTIME] Batch Test PASSED</span>
                          </p>
                          <p className="text-dust">
                            Total Debits: <span className="text-moonlight font-bold">$100,000.00</span> | Total Credits: <span className="text-moonlight font-bold">$100,000.00</span>
                          </p>
                          <p className="text-brass">Variance: $0.0000 | Double-entry balance strictly validated in 0.002ms.</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* وضع الأعمال والمالية (Business Mode) */}
              {personaMode === 'business' && (
                <>
                  {bizTab === 'roi' && (
                    <div className="space-y-3">
                      <p className="text-dust/70"># Value Proposition & Business Impact</p>
                      <h4 className="text-brass font-bold text-sm">
                        {t('كيف تضيف خلفيتي المحاسبية قيمة حقيقية للشركات؟', 'How Accounting Expertise Drives Real ROI:')}
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-moonlight/90">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>
                            <strong className="text-moonlight">أتمتة القيود والدورة المستندية:</strong> استبدال العمل الورقي اليدوي بنظام آلي موثوق يربط الفواتير بالحسابات فورياً.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>
                            <strong className="text-moonlight">تقليص زمن الإقفال الشهري 70%:</strong> تسوية الحسابات ومطابقة كشوف البنوك تلقائياً دون تأخير.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>
                            <strong className="text-moonlight">صفر أخطاء وفروقات (Zero Variance):</strong> بنية برمجية تمنع ترحيل أي قيد غير متزن وتحافظ على دقة السجلات.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>
                            <strong className="text-moonlight">لوحات قيادة لحظية للمديرين:</strong> تقارير فورية للتدفقات النقدية والأرباح والخسائر ومعدل حرق السيولة.
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {bizTab === 'balancesheet' && (
                    <div className="space-y-3">
                      <p className="text-dust/70">// Live Balance Sheet Verification Equation</p>
                      <p className="text-brass font-mono">$ verify-equation --balance-sheet</p>
                      <div className="p-3 rounded-lg bg-deep/70 border border-ink/80 space-y-2">
                        <div className="flex justify-between border-b border-ink/50 pb-1">
                          <span className="text-dust">Total Assets (الأصول):</span>
                          <span className="text-emerald-400 font-bold">$1,250,000.00</span>
                        </div>
                        <div className="flex justify-between border-b border-ink/50 pb-1">
                          <span className="text-dust">Total Liabilities (الالتزامات):</span>
                          <span className="text-amber-400 font-bold">$450,000.00</span>
                        </div>
                        <div className="flex justify-between border-b border-ink/50 pb-1">
                          <span className="text-dust">Owner's Equity (حقوق الملكية):</span>
                          <span className="text-sky-400 font-bold">$800,000.00</span>
                        </div>
                        <div className="pt-2 flex justify-between items-center text-xs">
                          <span className="text-brass font-bold">Assets = Liabilities + Equity</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                            PERFECTLY BALANCED ✓
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {bizTab === 'audit' && (
                    <div className="space-y-2">
                      <p className="text-dust/70">// Immutable Audit Trail & Compliance Ledger</p>
                      <p className="text-brass">$ tail -n 4 /var/log/audit.log</p>
                      <div className="space-y-1.5 text-xs text-dust">
                        <p className="font-mono">
                          <span className="text-emerald-400">[2026-09-16 01:25:04 UTC]</span> JV#8812 POSTED | $50,000.00 | Hash: e3b0c442...
                        </p>
                        <p className="font-mono">
                          <span className="text-emerald-400">[2026-09-16 01:25:12 UTC]</span> VAT_RECON_OK | Rate: 14% | Tax Liability Verified ✓
                        </p>
                        <p className="font-mono">
                          <span className="text-emerald-400">[2026-09-16 01:25:28 UTC]</span> BANK_FEED_SYNC | 42 records reconciled with 0 variance ✓
                        </p>
                        <p className="font-mono">
                          <span className="text-brass">[AUDIT TRAIL]</span> All records cryptographically signed & immutable.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
