import React, { useState } from 'react';
import { ModelPerformanceResponse } from '../types';
import { ConfusionMatrixView } from '../components/ConfusionMatrixView';
import { ROCCurveView } from '../components/ROCCurveView';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { BarChart3, Award, ShieldAlert, CheckCircle2, Sliders, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface Props {
  performanceData?: ModelPerformanceResponse | null;
}

export const ModelPerformance: React.FC<Props> = ({ performanceData }) => {
  const [selectedModel, setSelectedModel] = useState<string>("Logistic Regression");
  const [metricTab, setMetricTab] = useState<string>("accuracy");

  if (!performanceData || !performanceData.models) {
    return (
      <div className="text-center py-12 text-slate-500">
        Loading model evaluation benchmarks...
      </div>
    );
  }

  const { models, best_model_name } = performanceData;
  const modelEntries = Object.entries(models);

  // Prepare chart comparison data
  const comparisonData = modelEntries.map(([name, m]) => ({
    name,
    Accuracy: roundPct(m.accuracy),
    Precision: roundPct(m.precision),
    Sensitivity: roundPct(m.sensitivity),
    Specificity: roundPct(m.specificity),
    F1Score: roundPct(m.f1_score),
    ROCAUC: roundPct(m.roc_auc),
    FalseNegatives: m.confusion_matrix.fn
  }));

  function roundPct(val: number) {
    return Math.round(val * 1000) / 10;
  }

  const currentModelMetrics = models[selectedModel] || models[best_model_name];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Multi-Algorithm Evaluation & Comparative Benchmarks</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Machine Learning Models Performance Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Comparing 6 classification algorithms on the Wisconsin Diagnostic Breast Cancer (WDBC) test dataset.
        </p>
      </div>

      <DisclaimerBanner compact />

      {/* Metric Highlights & Best Model Callout */}
      <div className="p-6 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-500/10 border border-teal-200 dark:border-teal-800/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-teal-500 text-white shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              Top Ranked Model (Composite ROC-AUC + Recall)
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {best_model_name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Accuracy: {(models[best_model_name]?.accuracy * 100).toFixed(1)}% | Recall: {(models[best_model_name]?.sensitivity * 100).toFixed(1)}% | ROC-AUC: {models[best_model_name]?.roc_auc}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold border border-rose-500/30">
            FN Count: {models[best_model_name]?.confusion_matrix.fn}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/30">
            5-Fold CV Score: {models[best_model_name]?.cv_roc_auc_mean}
          </span>
        </div>
      </div>

      {/* Models Comparative Performance Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            6 Models Benchmark Summary Table
          </h3>
          <span className="text-xs text-slate-500">Stratified Holdout Test Set (20%)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Model Algorithm</th>
                <th className="p-3.5 text-center">Accuracy</th>
                <th className="p-3.5 text-center">Precision</th>
                <th className="p-3.5 text-center bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300">
                  Recall / Sensitivity ⭐
                </th>
                <th className="p-3.5 text-center">Specificity</th>
                <th className="p-3.5 text-center">F1-Score</th>
                <th className="p-3.5 text-center">ROC-AUC</th>
                <th className="p-3.5 text-center text-rose-600 dark:text-rose-400">False Negatives</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-800 dark:text-slate-200">
              {modelEntries.map(([name, m]) => {
                const isBest = name === best_model_name;
                const isSelected = name === selectedModel;
                return (
                  <tr 
                    key={name}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                      isSelected ? 'bg-teal-50/60 dark:bg-teal-950/40 font-semibold' : ''
                    }`}
                  >
                    <td className="p-3.5 font-bold flex items-center space-x-2">
                      <span>{name}</span>
                      {isBest && (
                        <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                          BEST
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center font-mono">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="p-3.5 text-center font-mono">{(m.precision * 100).toFixed(1)}%</td>
                    <td className="p-3.5 text-center font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50/30 dark:bg-teal-950/20">
                      {(m.sensitivity * 100).toFixed(1)}%
                    </td>
                    <td className="p-3.5 text-center font-mono">{(m.specificity * 100).toFixed(1)}%</td>
                    <td className="p-3.5 text-center font-mono">{(m.f1_score * 100).toFixed(1)}%</td>
                    <td className="p-3.5 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {m.roc_auc}
                    </td>
                    <td className="p-3.5 text-center font-bold text-rose-600 dark:text-rose-400">
                      {m.confusion_matrix.fn}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedModel(name)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          isSelected
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graphical Metric Comparison Bar Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Comparative Bar Chart
          </h3>
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs">
            {['Accuracy', 'Sensitivity', 'Specificity', 'F1Score', 'ROCAUC'].map(m => (
              <button
                key={m}
                onClick={() => setMetricTab(m)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  metricTab === m
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs space-y-1">
                        <p className="font-bold text-teal-300">{payload[0].payload.name}</p>
                        <p>{metricTab}: <span className="font-bold text-white">{payload[0].value}%</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey={metricTab} fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Confusion Matrix & ROC Curve View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfusionMatrixView 
          confusionMatrix={currentModelMetrics.confusion_matrix}
          fnAnalysis={currentModelMetrics.fn_analysis}
          modelName={selectedModel}
        />
        <ROCCurveView 
          modelsData={models}
          selectedModel={selectedModel}
        />
      </div>
    </div>
  );
};
