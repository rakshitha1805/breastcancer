import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { SinglePrediction } from './pages/SinglePrediction';
import { ModelPerformance } from './pages/ModelPerformance';
import { DatasetAnalysis } from './pages/DatasetAnalysis';
import { ModelTraining } from './pages/ModelTraining';
import { PredictionHistory } from './pages/PredictionHistory';
import { ResearchProjectDoc } from './pages/ResearchProjectDoc';
import { getModelPerformanceApi, getDatasetStatisticsApi, getHistoryApi } from './services/api';
import { ModelPerformanceResponse, DatasetStatistics, HistoryRecord } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [performanceData, setPerformanceData] = useState<ModelPerformanceResponse | null>(null);
  const [datasetStats, setDatasetStats] = useState<DatasetStatistics | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    // Dark mode toggle effect
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Fetch initial data
    const loadData = async () => {
      try {
        const [perf, stats, hist] = await Promise.all([
          getModelPerformanceApi(),
          getDatasetStatisticsApi(),
          getHistoryApi()
        ]);
        setPerformanceData(perf);
        setDatasetStats(stats);
        setHistory(hist.history || []);
      } catch (err) {
        console.error('Data loading error:', err);
      }
    };
    loadData();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            performanceData={performanceData} 
            datasetStats={datasetStats} 
            history={history} 
            onNavigate={setActiveTab} 
          />
        )}

        {activeTab === 'predict' && (
          <SinglePrediction />
        )}

        {activeTab === 'performance' && (
          <ModelPerformance performanceData={performanceData} />
        )}

        {activeTab === 'dataset' && (
          <DatasetAnalysis datasetStats={datasetStats} />
        )}

        {activeTab === 'training' && (
          <ModelTraining />
        )}

        {activeTab === 'history' && (
          <PredictionHistory />
        )}

        {activeTab === 'paper' && (
          <ResearchProjectDoc />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
