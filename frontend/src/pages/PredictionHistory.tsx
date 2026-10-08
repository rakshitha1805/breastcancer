import React, { useState, useEffect } from 'react';
import { HistoryRecord } from '../types';
import { 
  getHistoryApi, 
  deleteHistoryItemApi, 
  clearHistoryApi, 
  getExportHistoryUrl 
} from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { 
  History as HistoryIcon, 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const PredictionHistory: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiagnosis, setFilterDiagnosis] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistoryApi(searchTerm, filterDiagnosis);
      setHistory(data.history || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [searchTerm, filterDiagnosis]);

  const handleDelete = async (id: string) => {
    if (confirm(`Delete prediction record ${id}?`)) {
      await deleteHistoryItemApi(id);
      fetchHistory();
    }
  };

  const handleClearAll = async () => {
    if (confirm('Clear all prediction history records?')) {
      await clearHistoryApi();
      fetchHistory();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <HistoryIcon className="w-3.5 h-3.5" />
          <span>Historical Audit Log & Case History</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Prediction History & Export
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          De-identified historical predictions log. No personally identifiable patient information (PII) is stored.
        </p>
      </div>

      <DisclaimerBanner compact />

      {/* Control Bar: Search, Filter, Export */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Case ID, Model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Diagnosis Filter */}
          <select
            value={filterDiagnosis}
            onChange={(e) => setFilterDiagnosis(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
          >
            <option value="All">All Diagnoses</option>
            <option value="Benign">Benign Only</option>
            <option value="Malignant">Malignant Only</option>
          </select>

          {/* Export CSV */}
          <a
            href={getExportHistoryUrl('csv')}
            download="prediction_history.csv"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>

          {/* Export JSON */}
          <a
            href={getExportHistoryUrl('json')}
            download="prediction_history.json"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </a>

          {/* Clear History */}
          <button
            onClick={handleClearAll}
            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors"
            title="Clear History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Case ID</th>
                <th className="p-3.5">Prediction</th>
                <th className="p-3.5 text-center">Probability</th>
                <th className="p-3.5 text-center">Model</th>
                <th className="p-3.5">Features Summary</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-800 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading history records...</td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No prediction history found.</td>
                </tr>
              ) : (
                history.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">{rec.date}</td>
                    <td className="p-3.5 font-bold font-mono">{rec.id}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                        rec.is_malignant 
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' 
                          : 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                      }`}>
                        {rec.is_malignant ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {rec.prediction}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold">
                      {rec.confidence}%
                    </td>
                    <td className="p-3.5 text-center text-slate-500 dark:text-slate-400 text-[11px]">
                      {rec.model_used}
                    </td>
                    <td className="p-3.5 text-slate-500 text-[11px] truncate max-w-xs">
                      {rec.features_summary}
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-teal-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 max-w-lg w-full p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Case Details: {selectedRecord.id}
              </h3>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-mono font-medium">{selectedRecord.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prediction:</span>
                <span className="font-bold text-teal-600">{selectedRecord.prediction} ({selectedRecord.confidence}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Model Used:</span>
                <span>{selectedRecord.model_used}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-200">Sample Feature Inputs</div>
                <div className="max-h-48 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-3 rounded-xl font-mono text-[11px] space-y-1">
                  {Object.entries(selectedRecord.sample_inputs || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-500">{k}:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedRecord(null)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-xs hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
