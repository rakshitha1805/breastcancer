import React, { useState } from 'react';
import { Sliders, Upload, Play, CheckCircle2, Award, Cpu, RefreshCw, FileText } from 'lucide-react';
import { trainModelsApi } from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const ModelTraining: React.FC = () => {
  const [useCustomFile, setUseCustomFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([
    "Logistic Regression",
    "Decision Tree",
    "Random Forest",
    "Support Vector Machine",
    "K-Nearest Neighbors",
    "Gradient Boosting"
  ]);
  const [scalingMethod, setScalingMethod] = useState("StandardScaler");
  const [testSplitRatio, setTestSplitRatio] = useState(0.2);
  const [cvFolds, setCvFolds] = useState(5);

  const [isTraining, setIsTraining] = useState(false);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [trainResults, setTrainResults] = useState<any>(null);

  const availableAlgorithms = [
    { name: "Logistic Regression", desc: "Linear classifier with L2 regularization" },
    { name: "Decision Tree", desc: "Tree-based split on Gini impurity" },
    { name: "Random Forest", desc: "Ensemble of 100 decision trees" },
    { name: "Support Vector Machine", desc: "RBF kernel hyper-plane margin classifier" },
    { name: "K-Nearest Neighbors", desc: "Distance-based k=5 classifier" },
    { name: "Gradient Boosting", desc: "Sequential boosted tree ensemble" }
  ];

  const handleAlgoToggle = (algoName: string) => {
    setSelectedAlgorithms(prev => 
      prev.includes(algoName)
        ? prev.filter(a => a !== algoName)
        : [...prev, algoName]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRunTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAlgorithms.length === 0) {
      alert("Please select at least one algorithm to train.");
      return;
    }

    setIsTraining(true);
    setTrainingComplete(false);
    
    try {
      let formData: FormData | undefined = undefined;
      if (useCustomFile && selectedFile) {
        formData = new FormData();
        formData.append('file', selectedFile);
      }

      const res = await trainModelsApi(formData);
      setTrainResults(res);
      setTrainingComplete(true);
    } catch (err) {
      console.error('Training failed:', err);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <Sliders className="w-3.5 h-3.5" />
          <span>Authorized Machine Learning Pipeline Training Section</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Custom Model Training & Re-Calibration
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Upload custom datasets, configure preprocessing options, select classification algorithms, and benchmark training metrics.
        </p>
      </div>

      <DisclaimerBanner compact />

      <form onSubmit={handleRunTraining} className="space-y-6">
        {/* Step 1: Dataset Source Selection */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-extrabold">1</span>
            <span>Select Dataset & Source</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
              !useCustomFile 
                ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-100'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}>
              <input 
                type="radio" 
                name="datasetSource" 
                checked={!useCustomFile} 
                onChange={() => setUseCustomFile(false)} 
                className="mt-1 text-teal-600 focus:ring-teal-500"
              />
              <div>
                <div className="font-bold text-sm">Wisconsin Breast Cancer (WDBC) Dataset</div>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Default pre-loaded research dataset (569 instances, 30 features, Benign vs Malignant labels).
                </p>
              </div>
            </label>

            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
              useCustomFile 
                ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-100'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}>
              <input 
                type="radio" 
                name="datasetSource" 
                checked={useCustomFile} 
                onChange={() => setUseCustomFile(true)} 
                className="mt-1 text-teal-600 focus:ring-teal-500"
              />
              <div className="space-y-2">
                <div className="font-bold text-sm">Upload Custom CSV Dataset</div>
                <p className="text-slate-500 dark:text-slate-400">
                  Upload custom clinical CSV file with target column "diagnosis" or last column.
                </p>

                {useCustomFile && (
                  <div className="pt-1">
                    <input 
                      type="file" 
                      accept=".csv" 
                      onChange={handleFileChange}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-100 file:text-teal-700 dark:file:bg-teal-950 dark:file:text-teal-300 hover:file:bg-teal-200"
                    />
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Step 2: Preprocessing Configuration */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-extrabold">2</span>
            <span>Data Preprocessing & Split Options</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Scaling Technique</label>
              <select 
                value={scalingMethod} 
                onChange={(e) => setScalingMethod(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
              >
                <option value="StandardScaler">StandardScaler (z = (x - µ) / σ)</option>
                <option value="MinMaxScaler">MinMaxScaler (0 to 1 normalization)</option>
                <option value="RobustScaler">RobustScaler (IQR quantile scaling)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Train/Test Holdout Ratio</label>
              <select 
                value={testSplitRatio} 
                onChange={(e) => setTestSplitRatio(parseFloat(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
              >
                <option value={0.2}>80% Train / 20% Test (Recommended)</option>
                <option value={0.25}>75% Train / 25% Test</option>
                <option value={0.3}>70% Train / 30% Test</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Cross-Validation Folds</label>
              <select 
                value={cvFolds} 
                onChange={(e) => setCvFolds(parseInt(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
              >
                <option value={5}>5-Fold Stratified K-Fold CV</option>
                <option value={10}>10-Fold Stratified K-Fold CV</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Algorithm Selection Checkboxes */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-extrabold">3</span>
              <span>Select Classification Algorithms ({selectedAlgorithms.length}/6 Selected)</span>
            </h3>

            <button
              type="button"
              onClick={() => setSelectedAlgorithms(availableAlgorithms.map(a => a.name))}
              className="text-xs text-teal-600 font-semibold hover:underline"
            >
              Select All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {availableAlgorithms.map((algo) => {
              const isChecked = selectedAlgorithms.includes(algo.name);
              return (
                <label 
                  key={algo.name}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-2.5 ${
                    isChecked
                      ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-500 text-slate-900 dark:text-white'
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleAlgoToggle(algo.name)}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <div className="font-bold">{algo.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{algo.desc}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isTraining}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-teal-500/20 hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isTraining ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Training & Evaluating Selected Models...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Execute Model Training Pipeline</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results Box */}
      {trainingComplete && trainResults && (
        <div className="p-6 bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-500 rounded-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-3 text-teal-900 dark:text-teal-100">
            <CheckCircle2 className="w-6 h-6 text-teal-500 shrink-0" />
            <div>
              <h3 className="text-lg font-bold">Training Completed Successfully!</h3>
              <p className="text-xs text-teal-700 dark:text-teal-300">
                {trainResults.message || `Best model selected: ${trainResults.best_model}`}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-800 text-xs space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">Active Pipeline Update</div>
            <p className="text-slate-600 dark:text-slate-400">
              The updated active classification model pipeline has been persisted in <code>saved_models/best_model.pkl</code> and is now live for all sample predictions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
