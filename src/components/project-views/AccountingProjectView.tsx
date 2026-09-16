// منصة العمل المحاسبية والهندسة المالية الذكية (CMA Financial Workstation)
import React, { useState, useMemo } from 'react';
import { Project } from '../../types';
import { getAccountingData } from '../../utils/projectDomains';
import { useLanguage } from '../../context/LanguageContext';
import { soundFX } from '../../utils/audio';
import {
  Scale,
  Calculator,
  FileText,
  ShieldCheck,
  Percent,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Sliders,
  CheckCircle,
  BarChart,
  BookOpen,
} from 'lucide-react';

interface AccountingProjectViewProps {
  project: Project;
}

export const AccountingProjectView: React.FC<AccountingProjectViewProps> = ({ project }) => {
  const { lang, t } = useLanguage();
  const meta = getAccountingData(project);

  const [activeSubTab, setActiveSubTab] = useState<'cvp' | 'statements' | 'ratios'>('cvp');

  // معطيات محاكي التعادل CVP التفاعلي
  const defaults = meta.cvpDefaults || {
    pricePerUnit: 120,
    variableCostPerUnit: 45,
    fixedCosts: 180000,
    targetUnits: 3500,
  };

  const [price, setPrice] = useState(defaults.pricePerUnit);
  const [variableCost, setVariableCost] = useState(defaults.variableCostPerUnit);
  const [fixedCosts, setFixedCosts] = useState(defaults.fixedCosts);
  const [volume, setVolume] = useState(defaults.targetUnits || 3500);

  // العمليات الحسابية اللحظية لمعادلات CVP
  const calculations = useMemo(() => {
    const cm = Math.max(0.01, price - variableCost); // هامش المساهمة للوحدة
    const cmr = price > 0 ? (cm / price) * 100 : 0; // نسبة هامش المساهمة
    const bepUnits = Math.round(fixedCosts / cm); // نقطة التعادل بالوحدات
    const bepRevenue = Math.round(fixedCosts / (cm / price)); // نقطة التعادل بالدولار
    const totalRevenue = price * volume;
    const totalVariableCosts = variableCost * volume;
    const totalCosts = fixedCosts + totalVariableCosts;
    const netProfit = totalRevenue - totalCosts;
    const marginOfSafety =
      totalRevenue > bepRevenue ? Math.round(((totalRevenue - bepRevenue) / totalRevenue) * 100) : 0;

    return {
      cm,
      cmr,
      bepUnits,
      bepRevenue,
      totalRevenue,
      totalCosts,
      netProfit,
      marginOfSafety,
      isProfitable: netProfit >= 0,
    };
  }, [price, variableCost, fixedCosts, volume]);

  const eq = meta.equation;
  const isEquationBalanced = eq ? eq.assets === eq.liabilities + eq.equity : false;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. رأس استوديو المحاسبة والـ CMA */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-ink/40 border border-ink/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold font-display text-moonlight">
              {t('منظومة الهندسة المالية ونمذجة التكاليف CMA', 'CMA Financial Engineering & CVP Engine')}
            </h4>
            <p className="text-[11px] text-dust">
              {t('محاكاة القرارات التمويلية، نقطة التعادل، وهيكل القوائم المالية', 'Break-even sensitivity, multi-step income modeling & audit trail')}
            </p>
          </div>
        </div>

        {/* مؤشر اعتماد وتوازن المعادلة المحاسبية إن وجدت */}
        {eq && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-void/90 border border-ink text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">
              {isEquationBalanced ? t('ميزان متوازن (ACID ✓)', 'Balanced Ledger ✓') : 'Unbalanced'}
            </span>
          </div>
        )}
      </div>

      {/* 2. شريط معادلة الميزانية الذهبية (Assets = Liabilities + Equity) */}
      {eq && (
        <div className="p-4 rounded-2xl bg-void border border-ink shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-dust">
            <span className="font-bold text-brass uppercase tracking-wider">
              {t('المعادلة المحاسبية الأساسية (The Golden Accounting Equation):', 'The Golden Accounting Equation:')}
            </span>
            <span className="text-emerald-400 text-[11px] font-bold">GAAP / IFRS Aligned</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {/* الأصول */}
            <div className="p-3 rounded-xl bg-deep/90 border border-ink/80">
              <span className="text-[11px] font-mono text-dust block">{t('إجمالي الأصول (Assets)', 'Total Assets')}</span>
              <span className="text-lg font-bold font-display text-emerald-400">
                ${eq.assets.toLocaleString()}
              </span>
            </div>

            {/* الخصوم / الالتزامات */}
            <div className="p-3 rounded-xl bg-deep/90 border border-ink/80">
              <span className="text-[11px] font-mono text-dust block">
                {t('الالتزامات (Liabilities)', 'Total Liabilities')}
              </span>
              <span className="text-lg font-bold font-display text-amber-400">
                ${eq.liabilities.toLocaleString()}
              </span>
            </div>

            {/* حقوق الملكية */}
            <div className="p-3 rounded-xl bg-deep/90 border border-ink/80">
              <span className="text-[11px] font-mono text-dust block">
                {t('حقوق الملكية (Equity)', "Stockholders' Equity")}
              </span>
              <span className="text-lg font-bold font-display text-sky-400">
                ${eq.equity.toLocaleString()}
              </span>
            </div>
          </div>

          {/* شريط الإثبات البصري */}
          <div className="text-center font-mono text-xs text-dust/80 pt-1">
            <span className="text-emerald-400 font-bold">${eq.assets.toLocaleString()}</span>
            <span className="mx-2 text-brass font-bold">=</span>
            <span className="text-amber-400 font-bold">${eq.liabilities.toLocaleString()}</span>
            <span className="mx-2 text-brass font-bold">+</span>
            <span className="text-sky-400 font-bold">${eq.equity.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* 3. شريط التبويب الداخلي للأدوات المالية */}
      {(meta.incomeStatement || (meta.financialRatios && meta.financialRatios.length > 0)) && (
        <div className="flex items-center gap-2 border-b border-ink/80 pb-2">
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveSubTab('cvp');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono transition-all ${
              activeSubTab === 'cvp'
                ? 'bg-brass text-void font-bold shadow-astral'
                : 'text-dust hover:text-moonlight hover:bg-ink/40'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{t('حاسبة التعادل CVP', 'CVP Break-Even Sim')}</span>
          </button>

          {meta.incomeStatement && (
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveSubTab('statements');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono transition-all ${
                activeSubTab === 'statements'
                  ? 'bg-brass text-void font-bold shadow-astral'
                  : 'text-dust hover:text-moonlight hover:bg-ink/40'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('نموذج القوائم المالية', 'Financial Statements')}</span>
            </button>
          )}

          {meta.financialRatios && meta.financialRatios.length > 0 && (
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveSubTab('ratios');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono transition-all ${
                activeSubTab === 'ratios'
                  ? 'bg-brass text-void font-bold shadow-astral'
                  : 'text-dust hover:text-moonlight hover:bg-ink/40'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>{t('مؤشرات النسب المالية (Ratios)', 'CMA Financial Ratios')}</span>
            </button>
          )}
        </div>
      )}

      {/* 4. محتوى التبويب المختار */}
      {activeSubTab === 'cvp' && (
        /* تبويب حاسبة التعادل التفاعلية */
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-deep/60 border border-ink/80 text-xs text-dust space-y-1">
            <span className="font-bold text-moonlight block">
              {t('تحليل حساسية التكلفة والحجم والربح (CVP Sensitivity Modeling):', 'Dynamic Cost-Volume-Profit Engine:')}
            </span>
            <p>
              {t(
                'حرك المنزلقات أدناه لمشاهدة نقطة التعادل، هامش الأمان، وصافي الأرباح يتغير لحظياً وفق معادلات المحاسبة الإدارية الصارمة.',
                'Adjust parameters dynamically to watch break-even thresholds and safety margins recalculate in sub-milliseconds.'
              )}
            </p>
          </div>

          {/* شبكة المنزلقات التفاعلية (Sliders) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-void border border-ink">
            {/* سعر البيع للوحدة */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-dust">{t('سعر البيع للوحدة (P):', 'Unit Price ($):')}</span>
                <span className="text-moonlight font-bold">${price}</span>
              </div>
              <input
                type="range"
                min="60"
                max="300"
                step="5"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-brass cursor-pointer"
              />
            </div>

            {/* التكلفة المتغيرة للوحدة */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-dust">{t('التكلفة المتغيرة للوحدة (V):', 'Unit Variable Cost ($):')}</span>
                <span className="text-moonlight font-bold">${variableCost}</span>
              </div>
              <input
                type="range"
                min="20"
                max={Math.max(25, price - 5)}
                step="5"
                value={variableCost}
                onChange={(e) => setVariableCost(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* التكاليف الثابتة الإجمالية */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-dust">{t('التكاليف الثابتة الإجمالية (FC):', 'Fixed Costs ($):')}</span>
                <span className="text-moonlight font-bold">${fixedCosts.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="400000"
                step="10000"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            {/* حجم المبيعات المتوقع */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-dust">{t('حجم المبيعات المستهدف (Q):', 'Sales Volume (Units):')}</span>
                <span className="text-moonlight font-bold">{volume.toLocaleString()} {t('وحدة', 'units')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="8000"
                step="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          {/* مخرجات ونتائج التعادل اللحظية */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* هامش المساهمة للوحدة */}
            <div className="p-3.5 rounded-xl bg-deep/80 border border-ink text-center space-y-1">
              <span className="text-[11px] font-mono text-dust block">{t('هامش المساهمة (CM)', 'Unit CM')}</span>
              <span className="text-lg font-bold font-display text-brass">${calculations.cm}</span>
              <span className="text-[10px] font-mono text-dust block">CMR: {calculations.cmr.toFixed(1)}%</span>
            </div>

            {/* نقطة التعادل بالوحدات */}
            <div className="p-3.5 rounded-xl bg-deep/80 border border-ink text-center space-y-1">
              <span className="text-[11px] font-mono text-dust block">{t('نقطة التعادل (وحدات)', 'BEP Units')}</span>
              <span className="text-lg font-bold font-display text-sky-400">
                {calculations.bepUnits.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-dust block">{t('وحدة للتوازن', 'Break-even')}</span>
            </div>

            {/* نقطة التعادل بالقيمة */}
            <div className="p-3.5 rounded-xl bg-deep/80 border border-ink text-center space-y-1">
              <span className="text-[11px] font-mono text-dust block">{t('إيراد التعادل ($)', 'BEP Revenue')}</span>
              <span className="text-lg font-bold font-display text-moonlight">
                ${calculations.bepRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-dust block">{t('صفر أرباح وخسائر', 'Zero Profit Level')}</span>
            </div>

            {/* صافي الدخل التشغيلي */}
            <div
              className={`p-3.5 rounded-xl border text-center space-y-1 ${
                calculations.isProfitable
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              }`}
            >
              <span className="text-[11px] font-mono block">
                {calculations.isProfitable ? t('صافي الربح المتوقع', 'Operating Profit') : t('صافي الخسارة', 'Operating Loss')}
              </span>
              <span className="text-lg font-bold font-display">
                {calculations.netProfit >= 0 ? `+$${calculations.netProfit.toLocaleString()}` : `-$${Math.abs(calculations.netProfit).toLocaleString()}`}
              </span>
              <span className="text-[10px] font-mono block">
                {t('هامش الأمان:', 'MOS:')} {calculations.marginOfSafety}%
              </span>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'statements' && (
        /* تبويب القوائم المالية النموذجية */
        <div className="rounded-2xl border border-ink bg-void p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono border-b border-ink/80 pb-3">
            <div className="flex items-center gap-2 text-moonlight font-bold">
              <FileText className="w-4 h-4 text-brass" />
              <span>{t('قائمة الدخل التقديرية متعددة المراحل (Income Statement):', 'Multi-Step Income Statement:')}</span>
            </div>
            <span className="text-dust">FY-2026 Forecast</span>
          </div>

          {meta.incomeStatement && (
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-ink/40 text-moonlight font-semibold">
                <span>{t('إيرادات المبيعات (Revenues)', 'Gross Sales Revenues')}</span>
                <span className="text-emerald-400 font-bold">${meta.incomeStatement.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-ink/40 text-dust ps-4">
                <span>{t('تكلفة البضاعة المباعة (COGS)', 'Cost of Goods Sold (COGS)')}</span>
                <span className="text-rose-400">(${meta.incomeStatement.cogs.toLocaleString()})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-ink bg-deep/50 px-2 rounded text-moonlight font-bold">
                <span>{t('إجمالي الربح (Gross Profit)', 'Gross Profit Margin')}</span>
                <span className="text-brass">${meta.incomeStatement.grossProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-ink/40 text-dust ps-4">
                <span>{t('المصروفات البيعية والإدارية (SG&A)', 'Operating & Admin Expenses')}</span>
                <span className="text-rose-400">(${meta.incomeStatement.operatingExpenses.toLocaleString()})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-ink bg-emerald-950/30 px-2 rounded text-emerald-300 font-bold">
                <span>{t('صافي الدخل التشغيلي (EBIT)', 'Operating Income (EBIT)')}</span>
                <span>${meta.incomeStatement.operatingIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 bg-brass/10 border border-brass/40 px-3 rounded-lg text-brass font-bold text-sm">
                <span>{t('صافي الربح النهائي (Net Income)', 'Bottom-Line Net Income')}</span>
                <span>${meta.incomeStatement.netIncome.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'ratios' && (
        /* تبويب مؤشرات النسب المالية */
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-deep/70 border border-ink flex items-center justify-between text-xs font-mono">
            <span className="text-moonlight font-bold">
              {t('مؤشرات القياس والنسب المالية القياسية CMA:', 'CMA Benchmark Financial Ratios:')}
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Investment Grade</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(meta.financialRatios || []).map((ratio, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-void border border-ink/80 space-y-2 hover:border-brass/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-dust">
                    {lang === 'ar' ? ratio.name_ar : ratio.name_en}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    {ratio.benchmark}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold font-display text-moonlight">{ratio.value}</span>
                  <span className="text-xs font-mono text-brass flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Compliant</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
