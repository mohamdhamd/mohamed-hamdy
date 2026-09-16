// استوديو ذكاء الأعمال وتحليل البيانات المتقدم (Data Analysis & BI Studio)
import React, { useState, useMemo } from 'react';
import { Project } from '../../types';
import { getDataAnalysisData } from '../../utils/projectDomains';
import { useLanguage } from '../../context/LanguageContext';
import { soundFX } from '../../utils/audio';
import {
  BarChart3,
  LineChart,
  Table as TableIcon,
  Search,
  Download,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Filter,
  Lightbulb,
  FileSpreadsheet,
  Check,
} from 'lucide-react';

interface DataAnalysisProjectViewProps {
  project: Project;
}

export const DataAnalysisProjectView: React.FC<DataAnalysisProjectViewProps> = ({ project }) => {
  const { lang, t } = useLanguage();
  const meta = getDataAnalysisData(project);

  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; value: number } | null>(null);
  const [exportState, setExportState] = useState<'idle' | 'exporting' | 'exported'>('idle');

  // تصفية صفوف الجدول التفاعلي
  const filteredRows = useMemo(() => {
    const rows = meta.sampleData?.rows || [];
    if (!searchTerm.trim()) return rows;
    const q = searchTerm.toLowerCase();
    return rows.filter((row) => row.some((cell) => String(cell).toLowerCase().includes(q)));
  }, [meta.sampleData, searchTerm]);

  // محاكاة تصدير التقرير
  const handleExport = (format: 'csv' | 'json') => {
    soundFX.playClick();
    setExportState('exporting');
    setTimeout(() => {
      soundFX.playChime();
      setExportState('exported');
      setTimeout(() => setExportState('idle'), 2500);
    }, 600);
  };

  const chartData = meta.chartData || [
    { label: 'Q1', value: 45000, comparisonValue: 38000 },
    { label: 'Q2', value: 68000, comparisonValue: 52000 },
    { label: 'Q3', value: 89000, comparisonValue: 71000 },
    { label: 'Q4', value: 124000, comparisonValue: 95000 },
  ];

  const maxValue = Math.max(...chartData.map((d) => Math.max(d.value, d.comparisonValue || 0))) * 1.15;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. رأس استوديو تحليل البيانات والـ BI */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-ink/40 border border-ink/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold font-display text-moonlight">
              {t('استوديو ذكاء الأعمال والنمذجة الإحصائية', 'Business Intelligence & Statistical Studio')}
            </h4>
            <p className="text-[11px] text-dust">
              {t('استخراج الرؤى المالية والتنبؤية من تدفقات البيانات الضخمة', 'Predictive modeling, EDA, & automated decision intelligence')}
            </p>
          </div>
        </div>

        {/* أزرار تصدير البيانات والمخططات */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={exportState === 'exporting'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-void/90 border border-ink text-xs font-mono text-dust hover:text-brass hover:border-brass/40 transition-all disabled:opacity-50"
          >
            {exportState === 'exported' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{t('تم التصدير!', 'Exported!')}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{exportState === 'exporting' ? t('جاري التجهيز...', 'Preparing...') : t('تصدير CSV', 'Export CSV')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. كروت مؤشرات الأداء الحية (Dynamic KPI Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(meta.kpis || []).map((kpi, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-deep/80 border border-ink/80 space-y-1.5 transition-all hover:border-emerald-500/40 group"
          >
            <span className="text-[11px] font-mono text-dust block truncate">
              {lang === 'ar' ? kpi.label_ar : kpi.label_en}
            </span>
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-lg sm:text-xl font-bold font-display text-moonlight tracking-tight group-hover:text-emerald-400 transition-colors">
                {kpi.value}
              </span>
              {kpi.change && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-bold">
                  {kpi.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. الرسم البياني التفاعلي (Interactive SVG Visualizer) */}
      <div className="rounded-2xl border border-ink bg-void p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/80 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-moonlight">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">
              {t('مخطط الاتجاه والتحليل الزمني (Time-Series Cohort):', 'Time-Series & Growth Visualizer:')}
            </span>
          </div>

          {/* تبديل نوع الرسم: أعمدة أو خطي */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-deep border border-ink">
            <button
              onClick={() => {
                soundFX.playClick();
                setChartType('bar');
              }}
              className={`p-1.5 rounded-md text-xs font-mono transition-all ${
                chartType === 'bar' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-dust hover:text-moonlight'
              }`}
              title={t('أعمدة بيانية', 'Bar Chart')}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setChartType('line');
              }}
              className={`p-1.5 rounded-md text-xs font-mono transition-all ${
                chartType === 'line' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-dust hover:text-moonlight'
              }`}
              title={t('مخطط خطي', 'Line Chart')}
            >
              <LineChart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* قراءة النقطة الحالية عند تمرير الماوس */}
        <div className="h-6 flex items-center justify-between text-xs font-mono text-dust">
          <span>
            {hoveredPoint ? (
              <span className="text-emerald-400">
                {hoveredPoint.label}: <strong className="text-moonlight">${hoveredPoint.value.toLocaleString()}</strong>
              </span>
            ) : (
              <span>{t('مرر المؤشر فوق الأعمدة لعرض التفاصيل', 'Hover points to inspect telemetry data')}</span>
            )}
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block" />
              <span>{t('العام الحالي (Actual)', 'Actual')}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-ink inline-block" />
              <span>{t('المستهدف / السابق', 'Target')}</span>
            </span>
          </div>
        </div>

        {/* لوحة رسم الـ SVG التفاعلية */}
        <div className="w-full h-48 sm:h-56 relative flex items-end justify-around gap-2 pt-6 pb-2 px-4 bg-deep/40 rounded-xl border border-ink/60">
          {chartType === 'bar' ? (
            /* مخطط الأعمدة المتطورة */
            chartData.map((d) => {
              const actualH = (d.value / maxValue) * 100;
              const compH = ((d.comparisonValue || 0) / maxValue) * 100;

              return (
                <div
                  key={d.label}
                  className="flex-1 max-w-[60px] h-full flex flex-col items-center justify-end gap-1.5 group cursor-pointer"
                  onMouseEnter={() => setHoveredPoint({ label: d.label, value: d.value })}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* عمود المقارنة */}
                    <div
                      style={{ height: `${compH}%` }}
                      className="w-2 sm:w-3 bg-ink/80 rounded-t transition-all group-hover:bg-dust/60"
                    />
                    {/* عمود القيمة الفعلية */}
                    <div
                      style={{ height: `${actualH}%` }}
                      className="w-3.5 sm:w-5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t shadow-[0_0_12px_rgba(52,211,153,0.3)] transition-all group-hover:brightness-125"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-dust group-hover:text-emerald-400 font-bold transition-colors">
                    {d.label}
                  </span>
                </div>
              );
            })
          ) : (
            /* مخطط خطي SVG سلس */
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* مسار المنحنى المعبأ */}
              <polygon
                fill="url(#chartGradient)"
                points={`
                  20,150
                  20,${150 - (chartData[0].value / maxValue) * 130}
                  140,${150 - (chartData[1].value / maxValue) * 130}
                  260,${150 - (chartData[2].value / maxValue) * 130}
                  380,${150 - (chartData[3].value / maxValue) * 130}
                  380,150
                `}
              />

              {/* خط الاتجاه الأساسي */}
              <polyline
                fill="none"
                stroke="#34d399"
                strokeWidth="3"
                points={`
                  20,${150 - (chartData[0].value / maxValue) * 130}
                  140,${150 - (chartData[1].value / maxValue) * 130}
                  260,${150 - (chartData[2].value / maxValue) * 130}
                  380,${150 - (chartData[3].value / maxValue) * 130}
                `}
              />

              {/* نقاط البيانات */}
              {chartData.map((d, i) => {
                const cx = 20 + i * 120;
                const cy = 150 - (d.value / maxValue) * 130;
                return (
                  <g
                    key={d.label}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint({ label: d.label, value: d.value })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle cx={cx} cy={cy} r="6" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <text x={cx} y={145} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                      {d.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* 4. مستكشف جداول البيانات وعينات الـ Dataset (Data Table Explorer) */}
      {meta.sampleData && (
        <div className="rounded-2xl border border-ink bg-deep/70 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-moonlight font-bold">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>{t('عينة البيانات المحللة (Sample Dataset Table):', 'Dataset Explorer & Schema:')}</span>
            </div>

            {/* شريط البحث والتصفية في الجدول */}
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('بحث في البيانات...', 'Filter rows...')}
                className="w-full bg-void border border-ink focus:border-emerald-400 rounded-lg px-3 py-1.5 text-xs text-moonlight placeholder:text-dust/40 outline-none ps-8 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-dust/60 absolute start-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-ink bg-void/90">
            <table className="w-full text-start text-xs font-mono">
              <thead>
                <tr className="border-b border-ink bg-deep/90 text-dust">
                  {(meta.sampleData.columns || []).map((col) => (
                    <th key={col} className="py-2.5 px-3.5 text-start font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/60">
                {filteredRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-deep/50 transition-colors text-moonlight">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2 px-3.5 whitespace-nowrap">
                        {typeof cell === 'number' ? `$${cell.toLocaleString()}` : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. الرؤى والأفكار التنفيذية (Key Business Insights) */}
      {(meta.insights || []).length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
            <Lightbulb className="w-4 h-4" />
            <span>{t('الرؤى التحليلية والتوصيات المستنتجة:', 'Executive Analytical Findings:')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {meta.insights?.map((ins, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-ink/80 bg-void/80 space-y-1.5 relative overflow-hidden"
              >
                <div className="w-1 h-full bg-emerald-400 absolute start-0 top-0" />
                <h5 className="text-xs font-bold text-moonlight font-display">
                  {lang === 'ar' ? ins.title_ar : ins.title_en}
                </h5>
                <p className="text-xs text-dust leading-relaxed">
                  {lang === 'ar' ? ins.body_ar : ins.body_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
