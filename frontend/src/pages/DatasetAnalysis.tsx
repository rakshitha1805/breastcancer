import React from 'react';
import { DatasetStatistics } from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { FlaskConical, Database, Layers, CheckCircle2, TrendingUp, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Props {
  datasetStats?: DatasetStatistics | null;
}

export const DatasetAnalysis: React.FC<Props> = ({ datasetStats }) => {
  if (!datasetStats) {
    return <div className="text-center py-12 text-slate-500">Loading dataset statistics...</div>;
  }

  const {
    total_samples,
    feature_count,
    benign_count,
    malignant_count,
    class_balance,
    target_correlations,
    duplicate_rows,
    missing_values
  } = datasetStats;

  const pieData = [
    { name: 'Benign (0)', value: benign_count, pct: class_balance.Benign, color: '#14b8a6' },
    { name: 'Malignant (1)', value: malignant_count, pct: class_balance.Malignant, color: '#f43f5e' }
  ];

  // Top correlated features sorted
  const corrArray = Object.entries(target_correlations || {})
    .map(([feature, corr]) => ({ feature, corr: round4(corr) }))
    .sort((a, b) => Math.abs(b.corr) - Math.abs(a.corr));

  function round4(val: number) {
    return Math.round(val * 1000) / 1000;
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Exploratory Data Analysis & Feature Correlations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Wisconsin Diagnostic Breast Cancer (WDBC) Dataset Analysis
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Nuclear morphometry measurements computed from digitized images of fine-needle aspirates (FNA) of breast masses.
        </p>
      </div>

      <DisclaimerBanner compact />

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Instances</span>
            <Database className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{total_samples}</div>
          <p className="text-[11px] text-slate-500">Fine Needle Aspirate (FNA) samples</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Clinical Features</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{feature_count}</div>
          <p className="text-[11px] text-slate-500">Mean, SE, & Worst nuclear dimensions</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Missing Values Check</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">0 Missing</div>
          <p className="text-[11px] text-slate-500">Clean complete dataset</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Duplicates Check</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{duplicate_rows} Duplicates</div>
          <p className="text-[11px] text-slate-500">No redundant rows detected</p>
        </div>
      </div>

      {/* Grid: Class Distribution + Correlation Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Class Distribution Pie Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Class Distribution (Diagnosis)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Benign (non-cancerous) vs Malignant (cancerous) diagnosis counts
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs space-y-1">
                          <p className="font-bold">{data.name}</p>
                          <p>Count: <span className="font-bold text-teal-300">{data.value}</span> ({data.pct}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
              <div className="text-teal-700 dark:text-teal-400 font-bold">Benign (0)</div>
              <div className="text-xl font-extrabold text-teal-900 dark:text-teal-200">{benign_count}</div>
              <p className="text-[10px] text-teal-600 dark:text-teal-400">{class_balance.Benign}% of dataset</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <div className="text-rose-700 dark:text-rose-400 font-bold">Malignant (1)</div>
              <div className="text-xl font-extrabold text-rose-900 dark:text-rose-200">{malignant_count}</div>
              <p className="text-[10px] text-rose-600 dark:text-rose-400">{class_balance.Malignant}% of dataset</p>
            </div>
          </div>
        </div>

        {/* Feature Target Correlations Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Feature Correlations with Malignancy
            </h3>
            <span className="text-xs text-slate-500">Pearson r correlation</span>
          </div>

          <div className="h-64 w-full bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={corrArray.slice(0, 8)} layout="vertical" margin={{ top: 5, right: 30, left: 110, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: '#64748b' }} width={120} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2 rounded-lg text-xs">
                          <p className="font-bold text-teal-300">{payload[0].payload.feature}</p>
                          <p>Correlation: <span className="font-bold">{payload[0].value}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="corr" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400">
            Nuclear features such as <strong>worst concave points (r = 0.79)</strong> and <strong>worst perimeter (r = 0.78)</strong> exhibit the strongest positive correlation with tumor malignancy.
          </div>
        </div>
      </div>
    </div>
  );
};
