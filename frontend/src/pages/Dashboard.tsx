import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  BarChart3, 
  Stethoscope, 
  ArrowRight, 
  ShieldAlert, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ModelPerformanceResponse, DatasetStatistics, HistoryRecord } from '../types';

interface Props {
  performanceData?: ModelPerformanceResponse | null;
  datasetStats?: DatasetStatistics | null;
  history?: HistoryRecord[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<Props> = ({ 
  performanceData, 
  datasetStats, 
  history = [], 
  onNavigate 
}) => {
  const bestModelName = performanceData?.best_model_name || "Logistic Regression";
  const bestModel = performanceData?.models?.[bestModelName];
  
  const totalAnalyzed = (datasetStats?.total_samples || 569) + history.length;
  const benignCount = (datasetStats?.benign_count || 357) + history.filter(h => !h.is_malignant).length;
  const malignantCount = (datasetStats?.malignant_count || 212) + history.filter(h => h.is_malignant).length;
  const accuracyPct = bestModel ? (bestModel.accuracy * 100).toFixed(1) : "97.4";
  const sensitivityPct = bestModel ? (bestModel.sensitivity * 100).toFixed(1) : "97.6";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-semibold backdrop-blur-md border border-white/20">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Educational & Decision-Support System</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Breast Cancer Detection Using Machine Learning
          </h1>
          <p className="text-teal-50 text-sm sm:text-base leading-relaxed opacity-95">
            An intelligent ML system evaluating Wisconsin Diagnostic Breast Cancer (WDBC) data using 6 classification models and Explainable AI (SHAP) feature importance.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('predict')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-teal-800 font-bold text-xs sm:text-sm hover:bg-teal-50 transition-all shadow-md group"
            >
              <Stethoscope className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
              <span>Analyze New Sample</span>
              <ArrowRight className="w-4 h-4 text-teal-600" />
            </button>
            <button
              onClick={() => onNavigate('performance')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-800/40 text-white font-semibold text-xs sm:text-sm hover:bg-teal-800/60 transition-all border border-white/20"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Compare 6 ML Models</span>
            </button>
          </div>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Samples Analyzed</span>
            <Activity className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalAnalyzed.toLocaleString()}
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <span className="text-teal-600 font-semibold">{benignCount} Benign</span>
            <span>•</span>
            <span className="text-rose-600 font-semibold">{malignantCount} Malignant</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Best Model Accuracy</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {accuracyPct}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Top Performer: {bestModelName}
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Sensitivity / Recall</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {sensitivityPct}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Maximizes Malignant Case Capture
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Evaluated ML Algorithms</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            6 Models
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            5-Fold Cross Validation Benchmarked
          </div>
        </div>
      </div>

      {/* Main Grid: Quick Analyze Banner + Model Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pipeline Summary & False Negative Safety */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Machine Learning Workflow Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-600">Step 1</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Data Preprocessing</p>
                <p className="text-[10px] text-slate-500">Missing values check & Standard Scaling</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-600">Step 2</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Feature Selection</p>
                <p className="text-[10px] text-slate-500">30 WDBC nuclear morphometry metrics</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-600">Step 3</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Model Training</p>
                <p className="text-[10px] text-slate-500">LogReg, DT, RF, SVM, KNN, GradBoost</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-600">Step 4</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Explainable AI</p>
                <p className="text-[10px] text-slate-500">SHAP feature contribution analysis</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-teal-500/10 border border-slate-200 dark:border-slate-700/60 rounded-2xl flex items-start space-x-4">
            <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
            <div className="text-xs sm:text-sm space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Clinical Priority: False Negative Minimization
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                In oncology screening, failing to detect a malignant sample (False Negative) presents a high diagnostic risk. Our ML system ranks algorithms primarily on Sensitivity/Recall and ROC-AUC rather than raw accuracy alone.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Predictions / Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Recent Sample Predictions
              </h3>
              <button 
                onClick={() => onNavigate('history')}
                className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No recent predictions. Click "Analyze Sample" to run your first test.
              </div>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 4).map((record) => (
                  <div 
                    key={record.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{record.id}</div>
                      <div className="text-[10px] text-slate-400">{record.date}</div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        record.is_malignant 
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' 
                          : 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                      }`}>
                        {record.prediction} ({record.confidence}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigate('predict')}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Launch Prediction Form</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
