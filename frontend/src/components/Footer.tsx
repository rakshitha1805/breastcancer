import React from 'react';
import { Cpu, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <Cpu className="w-5 h-5 text-teal-400" />
              <span>Breast Cancer Detection ML</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              An intelligent machine-learning system utilizing Scikit-Learn, SHAP Explainable AI, and Wisconsin Diagnostic Breast Cancer (WDBC) dataset for research & clinical decision support education.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Machine Learning Pipeline
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Dataset: Wisconsin Breast Cancer (WDBC)</li>
              <li>• Preprocessing: StandardScaler & Stratified Split</li>
              <li>• Algorithms: Logistic Regression, Random Forest, SVM, Decision Tree, KNN, Gradient Boosting</li>
              <li>• Explainability: SHAP Feature Importance & Contributions</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Academic Notice & Scope
            </h4>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Decision Support Prototype</span>
              </div>
              <p className="text-[11px] text-slate-300">
                This project is developed for educational and academic research evaluation. It does not replace professional clinical diagnosis.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Breast Cancer ML Research Project. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-slate-400">
              Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Healthcare & ML Research
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
