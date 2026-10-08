import React from 'react';
import { ConfusionMatrix, FalseNegativeAnalysis } from '../types';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface Props {
  confusionMatrix: ConfusionMatrix;
  fnAnalysis?: FalseNegativeAnalysis;
  modelName?: string;
}

export const ConfusionMatrixView: React.FC<Props> = ({ confusionMatrix, fnAnalysis, modelName = 'Model' }) => {
  const { tn, fp, fn, tp } = confusionMatrix;
  const total = tn + fp + fn + tp;
  
  const accuracy = total > 0 ? ((tp + tn) / total * 100).toFixed(1) : '0';
  const sensitivity = (tp + fn) > 0 ? (tp / (tp + fn) * 100).toFixed(1) : '0';
  const specificity = (tn + fp) > 0 ? (tn / (tn + fp) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span>Confusion Matrix & Diagnostic Metrics</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-normal">
              {modelName}
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Holdout test set evaluation (n = {total} samples)
          </p>
        </div>
      </div>

      {/* Grid Matrix */}
      <div className="grid grid-cols-2 gap-3 text-center">
        {/* True Negatives */}
        <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 space-y-1">
          <div className="flex items-center justify-between text-teal-700 dark:text-teal-400 text-xs font-semibold">
            <span>True Negatives (TN)</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-teal-900 dark:text-teal-200">{tn}</div>
          <p className="text-[11px] text-teal-700 dark:text-teal-400">Actual Benign → Predicted Benign</p>
        </div>

        {/* False Positives */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-1">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <span>False Positives (FP)</span>
            <Info className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-900 dark:text-amber-200">{fp}</div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400">Actual Benign → Predicted Malignant</p>
        </div>

        {/* False Negatives (Critical Medical Focus) */}
        <div className="p-4 rounded-xl bg-rose-150 dark:bg-rose-950/60 border-2 border-rose-400 dark:border-rose-600 space-y-1 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-300 text-xs font-bold">
            <span className="flex items-center gap-1 text-rose-800 dark:text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-600 fill-rose-100 dark:fill-rose-900" />
              False Negatives (FN)
            </span>
            <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
              Critical Risk
            </span>
          </div>
          <div className="text-3xl font-extrabold text-rose-700 dark:text-rose-300">{fn}</div>
          <p className="text-[11px] text-rose-800 dark:text-rose-200 font-medium">Actual Malignant → Predicted Benign</p>
        </div>

        {/* True Positives */}
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-1">
          <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
            <span>True Positives (TP)</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-900 dark:text-indigo-200">{tp}</div>
          <p className="text-[11px] text-indigo-700 dark:text-indigo-400">Actual Malignant → Predicted Malignant</p>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-slate-500 dark:text-slate-400">Overall Accuracy</div>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{accuracy}%</div>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
          <div className="text-emerald-700 dark:text-emerald-400 font-semibold">Recall / Sensitivity</div>
          <div className="text-base font-bold text-emerald-900 dark:text-emerald-200 mt-0.5">{sensitivity}%</div>
        </div>
        <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
          <div className="text-teal-700 dark:text-teal-400 font-semibold">Specificity</div>
          <div className="text-base font-bold text-teal-900 dark:text-teal-200 mt-0.5">{specificity}%</div>
        </div>
      </div>

      {/* False Negative Analysis Callout */}
      <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-900 dark:text-rose-200 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          Medical Focus: False Negative Minimization
        </div>
        <p className="text-rose-700 dark:text-rose-300 leading-relaxed">
          In clinical oncology, missing a malignant case (False Negative = {fn}) carries far greater risk than a false alarm (False Positive = {fp}). Our evaluation prioritizes <strong>Sensitivity/Recall ({sensitivity}%)</strong> to maximize early detection safety.
        </p>
      </div>
    </div>
  );
};
