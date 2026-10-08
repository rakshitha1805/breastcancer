import React from 'react';
import { ModelMetrics } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface Props {
  modelsData: Record<string, ModelMetrics>;
  selectedModel?: string;
}

const MODEL_COLORS: Record<string, string> = {
  "Logistic Regression": "#14b8a6", // Teal
  "Random Forest": "#3b82f6",       // Blue
  "Gradient Boosting": "#8b5cf6",    // Purple
  "Support Vector Machine": "#f59e0b",// Amber
  "K-Nearest Neighbors": "#ec4899",   // Pink
  "Decision Tree": "#64748b"         // Slate
};

export const ROCCurveView: React.FC<Props> = ({ modelsData, selectedModel }) => {
  if (!modelsData || Object.keys(modelsData).length === 0) {
    return <div className="text-slate-400 text-xs text-center py-6">No ROC curve data available</div>;
  }

  // Generate standardized 20 step FPR points from 0.0 to 1.0
  const steps = Array.from({ length: 21 }, (_, i) => roundVal(i * 0.05));

  const chartData = steps.map((fpr) => {
    const point: Record<string, any> = { fpr, random: fpr };
    
    Object.entries(modelsData).forEach(([modelName, metrics]) => {
      const rocPoints = metrics.roc_curve || [];
      // Find closest point or interpolate
      let closestTpr = 0;
      for (let p of rocPoints) {
        if (p.fpr <= fpr) {
          closestTpr = p.tpr;
        }
      }
      point[modelName] = roundVal(closestTpr);
    });

    return point;
  });

  function roundVal(val: number) {
    return Math.round(val * 100) / 100;
  }

  const modelNames = Object.keys(modelsData);

  return (
    <div className="space-y-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Receiver Operating Characteristic (ROC) Curves
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            True Positive Rate (Sensitivity) vs False Positive Rate (1 - Specificity)
          </p>
        </div>
      </div>

      <div className="h-72 w-full bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis 
              dataKey="fpr" 
              label={{ value: 'False Positive Rate (1 - Specificity)', position: 'bottom', offset: 10, fill: '#64748b', fontSize: 11 }} 
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <YAxis 
              label={{ value: 'True Positive Rate (Sensitivity)', angle: -90, position: 'insideLeft', offset: 10, fill: '#64748b', fontSize: 11 }}
              tick={{ fontSize: 11, fill: '#64748b' }}
              domain={[0, 1]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg text-xs space-y-1 border border-slate-700">
                      <p className="font-bold text-slate-300">FPR: {payload[0].payload.fpr}</p>
                      {payload.map((entry, idx) => (
                        <p key={idx} style={{ color: entry.color }} className="font-medium">
                          {entry.name}: TPR = {entry.value} (AUC = {modelsData[entry.name]?.roc_auc || 'N/A'})
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
            
            {/* Random guess baseline */}
            <Line 
              type="monotone" 
              dataKey="random" 
              name="Random Classifier (AUC = 0.50)" 
              stroke="#94a3b8" 
              strokeDasharray="5 5" 
              dot={false}
              strokeWidth={1.5}
            />

            {modelNames.map((name) => {
              const isHighlighted = !selectedModel || selectedModel === name;
              return (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  name={`${name} (AUC = ${modelsData[name]?.roc_auc})`}
                  stroke={MODEL_COLORS[name] || '#14b8a6'}
                  strokeWidth={isHighlighted ? 2.5 : 1}
                  opacity={isHighlighted ? 1 : 0.25}
                  dot={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Model AUC Ranking List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {modelNames.map((name) => (
          <div 
            key={name}
            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <span className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200 truncate">
              <span 
                className="w-2.5 h-2.5 rounded-full shrink-0" 
                style={{ backgroundColor: MODEL_COLORS[name] || '#14b8a6' }}
              />
              {name}
            </span>
            <span className="font-bold text-teal-600 dark:text-teal-400 shrink-0">
              {modelsData[name]?.roc_auc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
