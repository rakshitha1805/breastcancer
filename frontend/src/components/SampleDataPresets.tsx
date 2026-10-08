import React from 'react';
import { Sparkles, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  onSelectPreset: (features: Record<string, number>) => void;
  onReset: () => void;
}

export const PRESET_BENIGN: Record<string, number> = {
  "mean radius": 13.54,
  "mean texture": 14.36,
  "mean perimeter": 87.46,
  "mean area": 566.3,
  "mean smoothness": 0.09779,
  "mean compactness": 0.08129,
  "mean concavity": 0.06664,
  "mean concave points": 0.04781,
  "mean symmetry": 0.1885,
  "mean fractal dimension": 0.05766
};

export const PRESET_MALIGNANT: Record<string, number> = {
  "mean radius": 17.99,
  "mean texture": 10.38,
  "mean perimeter": 122.8,
  "mean area": 1001.0,
  "mean smoothness": 0.1184,
  "mean compactness": 0.2776,
  "mean concavity": 0.3001,
  "mean concave points": 0.1471,
  "mean symmetry": 0.2419,
  "mean fractal dimension": 0.07871
};

export const PRESET_BORDERLINE: Record<string, number> = {
  "mean radius": 14.86,
  "mean texture": 15.68,
  "mean perimeter": 95.78,
  "mean area": 680.9,
  "mean smoothness": 0.098,
  "mean compactness": 0.108,
  "mean concavity": 0.089,
  "mean concave points": 0.052,
  "mean symmetry": 0.192,
  "mean fractal dimension": 0.062
};

export const SampleDataPresets: React.FC<Props> = ({ onSelectPreset, onReset }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          Load Sample Clinical Cases
        </h4>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Clear Inputs
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <button
          onClick={() => onSelectPreset(PRESET_BENIGN)}
          className="flex items-center space-x-2 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-900/60 hover:border-teal-500 text-teal-700 dark:text-teal-300 transition-all text-left shadow-sm group"
        >
          <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 group-hover:scale-110 transition-transform" />
          <div>
            <div className="font-bold">Typical Benign Case</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Radius ~13.5mm, Low Concavity</div>
          </div>
        </button>

        <button
          onClick={() => onSelectPreset(PRESET_MALIGNANT)}
          className="flex items-center space-x-2 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/60 hover:border-rose-500 text-rose-700 dark:text-rose-300 transition-all text-left shadow-sm group"
        >
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
          <div>
            <div className="font-bold">Malignant Case</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Radius ~18.0mm, High Concavity</div>
          </div>
        </button>

        <button
          onClick={() => onSelectPreset(PRESET_BORDERLINE)}
          className="flex items-center space-x-2 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-300 transition-all text-left shadow-sm group"
        >
          <Sparkles className="w-4 h-4 text-slate-500 shrink-0 group-hover:scale-110 transition-transform" />
          <div>
            <div className="font-bold">Intermediate Case</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Radius ~14.8mm, Moderate Concavity</div>
          </div>
        </button>
      </div>
    </div>
  );
};
