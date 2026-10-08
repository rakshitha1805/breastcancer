import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<Props> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-200 flex items-start space-x-2">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Educational & Research Notice:</span> This AI decision-support system is not a substitute for professional medical diagnosis or clinical evaluation.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 rounded-xl p-4 shadow-sm text-slate-800 dark:text-slate-200 flex items-start space-x-3.5 my-4">
      <div className="bg-amber-500/20 p-2 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
        <ShieldAlert className="w-5 h-5" />
      </div>
      <div className="text-xs sm:text-sm space-y-1">
        <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
          Important Medical & Research Disclaimer
        </h4>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This web application is designed strictly as an <strong>AI/ML decision-support and educational prototype</strong> trained on the Wisconsin Diagnostic Breast Cancer (WDBC) dataset. It <strong>does not provide a medical diagnosis</strong>, clinical risk assessment, or replace the evaluation of a qualified healthcare professional. Always consult licensed medical specialists for health advice and diagnostic decisions.
        </p>
      </div>
    </div>
  );
};
