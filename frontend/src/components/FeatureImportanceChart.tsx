import React from 'react';
import { FeatureContribution } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts';
import { HelpCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Props {
  features: FeatureContribution[];
}

export const FeatureImportanceChart: React.FC<Props> = ({ features }) => {
  if (!features || features.length === 0) {
    return (
      <div className="text-center py-6 text-slate-400 text-xs">
        No feature contribution data available.
      </div>
    );
  }

  // Format data for Recharts
  const chartData = features.map((f) => ({
    name: f.feature,
    impact: f.signed_impact || (f.direction === 'Malignant' ? f.impact : -f.impact),
    absImpact: f.impact,
    direction: f.direction,
    value: f.value
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <span>Top Influential Clinical Features (Explainable AI / SHAP)</span>
        </h3>
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            Pushes towards Malignant
          </span>
          <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block"></span>
            Pushes towards Benign
          </span>
        </div>
      </div>

      <div className="h-64 w-full bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 11, fill: '#64748b' }}
              width={110}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs space-y-1 border border-slate-700">
                      <p className="font-bold text-teal-300">{data.name}</p>
                      <p className="text-slate-300">Observed Value: <span className="font-mono text-white">{data.value}</span></p>
                      <p className="text-slate-300">
                        Impact: <span className={`font-bold ${data.direction === 'Malignant' ? 'text-rose-400' : 'text-teal-400'}`}>
                          {data.direction === 'Malignant' ? '+' : '-'}{data.absImpact} ({data.direction})
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x={0} stroke="#94a3b8" strokeDasharray="3 3" />
            <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.direction === 'Malignant' ? '#f43f5e' : '#14b8a6'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {features.slice(0, 4).map((f, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60"
          >
            <div className="flex items-center space-x-2 truncate">
              {f.direction === 'Malignant' ? (
                <ArrowUpRight className="w-4 h-4 text-rose-500 shrink-0" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-teal-500 shrink-0" />
              )}
              <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{f.feature}</span>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-slate-600 dark:text-slate-400 mr-2">{f.value}</span>
              <span className={`font-bold ${f.direction === 'Malignant' ? 'text-rose-600 dark:text-rose-400' : 'text-teal-600 dark:text-teal-400'}`}>
                {f.direction}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
