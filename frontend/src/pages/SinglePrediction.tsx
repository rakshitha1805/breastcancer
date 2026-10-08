import React, { useState } from 'react';
import { 
  Stethoscope, 
  Send, 
  Sparkles, 
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  Activity,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { predictSampleApi } from '../services/api';
import { PredictionResult } from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { FeatureImportanceChart } from '../components/FeatureImportanceChart';
import { SampleDataPresets, PRESET_BENIGN } from '../components/SampleDataPresets';

export const SinglePrediction: React.FC = () => {
  const [features, setFeatures] = useState<Record<string, number>>({
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
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleInputChange = (key: string, val: string) => {
    const num = parseFloat(val);
    setFeatures(prev => ({
      ...prev,
      [key]: isNaN(num) ? 0 : num
    }));
  };

  const handlePresetSelect = (preset: Record<string, number>) => {
    setFeatures(preset);
  };

  const handleReset = () => {
    setFeatures({
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
    });
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await predictSampleApi(features);
      setResult(res);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const featureInputs = [
    { key: "mean radius", label: "Radius (mean)", unit: "mm", default: 13.54, min: 6, max: 30, step: 0.01 },
    { key: "mean texture", label: "Texture (mean)", unit: "gray-scale", default: 14.36, min: 9, max: 40, step: 0.01 },
    { key: "mean perimeter", label: "Perimeter (mean)", unit: "mm", default: 87.46, min: 40, max: 190, step: 0.1 },
    { key: "mean area", label: "Area (mean)", unit: "mm²", default: 566.3, min: 140, max: 2500, step: 1.0 },
    { key: "mean smoothness", label: "Smoothness (mean)", unit: "local var", default: 0.0978, min: 0.05, max: 0.20, step: 0.001 },
    { key: "mean compactness", label: "Compactness (mean)", unit: "perimeter²/area - 1.0", default: 0.0813, min: 0.01, max: 0.35, step: 0.001 },
    { key: "mean concavity", label: "Concavity (mean)", unit: "severity of concave", default: 0.0666, min: 0.0, max: 0.45, step: 0.001 },
    { key: "mean concave points", label: "Concave Points (mean)", unit: "number of concave", default: 0.0478, min: 0.0, max: 0.25, step: 0.001 },
    { key: "mean symmetry", label: "Symmetry (mean)", unit: "ratio", default: 0.1885, min: 0.10, max: 0.35, step: 0.001 },
    { key: "mean fractal dimension", label: "Fractal Dimension (mean)", unit: "coastline approx", default: 0.0577, min: 0.04, max: 0.10, step: 0.001 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Patient & Clinical Sample Input Form</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Clinical Sample Prediction Interface
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Enter nuclear morphometry measurements from fine-needle aspirate (FNA) diagnostic samples to predict malignancy likelihood.
        </p>
      </div>

      <DisclaimerBanner compact />

      {/* Main Grid: Input Form + Result Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <SampleDataPresets 
            onSelectPreset={handlePresetSelect} 
            onReset={handleReset} 
          />

          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-500" />
                <span>Primary Clinical Features (10 Core Measurements)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featureInputs.map((input) => (
                <div key={input.key} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {input.label}
                    </label>
                    <span className="text-[10px] text-slate-400">{input.unit}</span>
                  </div>
                  <input
                    type="number"
                    step={input.step}
                    min={input.min}
                    max={input.max}
                    value={features[input.key] ?? ''}
                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-slate-900 dark:text-white transition-all"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Sample...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Analyze Sample</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Prediction Result Card & Explainability (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {!result ? (
            <div className="bg-slate-50 dark:bg-slate-900/60 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Ready for Analysis
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Adjust feature values or select a preset case on the left, then click <strong>"Analyze Sample"</strong> to view model prediction & SHAP explainability.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {/* Prediction Result Card */}
              <div className={`p-6 rounded-2xl border-2 shadow-md space-y-5 ${
                result.is_malignant
                  ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/80 text-rose-900 dark:text-rose-100'
                  : 'bg-teal-50/90 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800/80 text-teal-900 dark:text-teal-100'
              }`}>
                {/* Result Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {result.is_malignant ? (
                      <div className="p-2 rounded-xl bg-rose-500 text-white">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-teal-500 text-white">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        ML Classification Result
                      </div>
                      <h3 className="text-2xl font-black">
                        Prediction: {result.prediction}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black">{result.confidence}%</div>
                    <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Model Confidence</div>
                  </div>
                </div>

                {/* Probability Bar Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-teal-700 dark:text-teal-300">Benign: {result.probabilities.Benign}%</span>
                    <span className="text-rose-700 dark:text-rose-300">Malignant: {result.probabilities.Malignant}%</span>
                  </div>

                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex p-0.5">
                    <div 
                      className="bg-teal-500 h-full rounded-l-full transition-all duration-500" 
                      style={{ width: `${result.probabilities.Benign}%` }}
                    />
                    <div 
                      className="bg-rose-500 h-full rounded-r-full transition-all duration-500" 
                      style={{ width: `${result.probabilities.Malignant}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between border-t border-slate-200 dark:border-slate-700/60 pt-3">
                  <span>Evaluated by: <strong>{result.model_used}</strong></span>
                  <span className="text-slate-400">WDBC Pipeline</span>
                </div>

                <div className="text-[11px] leading-relaxed p-3 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <strong>Notice:</strong> {result.disclaimer}
                </div>
              </div>

              {/* Explainable AI Section */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
                <FeatureImportanceChart features={result.top_features} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
