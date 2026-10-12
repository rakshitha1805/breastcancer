import React from 'react';
import { 
  FileSpreadsheet, 
  Truck, 
  Layers, 
  History, 
  Settings, 
  Sparkles, 
  PlusCircle, 
  Save, 
  Printer, 
  Sun, 
  Moon,
  Coins
} from 'lucide-react';
import { MillSettings } from '../types/ricemill';

interface RiceMillNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onLoadSample: () => void;
  onNewBill: () => void;
  onSaveBill: () => void;
  onPrintBill: () => void;
  saving?: boolean;
  settings?: MillSettings | null;
}

export const RiceMillNavbar: React.FC<RiceMillNavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onLoadSample,
  onNewBill,
  onSaveBill,
  onPrintBill,
  saving = false,
  settings
}) => {
  const millName = settings?.mill_name || "SRI MODERN RICE MILL";

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-amber-200/50 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Mill Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('single_batch')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-bold ring-2 ring-amber-300/40">
              <Coins className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500 bg-clip-text text-transparent">
                  {millName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/60">
                  Dynamic Ledger
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paddy Inward, Labor Charges & By-Product Billing System
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('single_batch')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === 'single_batch'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/60 dark:hover:bg-slate-700/40'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Single Batch (Vehicle Bill)</span>
            </button>

            <button
              onClick={() => setActiveTab('multi_lot')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === 'multi_lot'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/60 dark:hover:bg-slate-700/40'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Multi-Load (Lot Settlement)</span>
            </button>

            <button
              onClick={() => setActiveTab('dual_view')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === 'dual_view'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/60 dark:hover:bg-slate-700/40'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Dual Comparative View</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === 'history'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/60 dark:hover:bg-slate-700/40'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Saved Bills</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === 'settings'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/60 dark:hover:bg-slate-700/40'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2">
            
            {/* Load Sample Sheet Button */}
            <button
              onClick={onLoadSample}
              title="Populate exact sample values from spreadsheet (TN29BF8709)"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Load Sample Sheet</span>
            </button>

            {/* New Bill Button */}
            <button
              onClick={onNewBill}
              title="Clear form for a new dynamic calculation"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">New Bill</span>
            </button>

            {/* Save Bill Button */}
            <button
              onClick={onSaveBill}
              disabled={saving}
              title="Save current calculation to history database"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save Bill'}</span>
            </button>

            {/* Print Slip Button */}
            <button
              onClick={onPrintBill}
              title="Print standard Invoice / Settlement Slip"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            >
              {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-200 dark:border-slate-800 space-x-1">
          <button
            onClick={() => setActiveTab('single_batch')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'single_batch' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Single Batch
          </button>
          <button
            onClick={() => setActiveTab('multi_lot')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'multi_lot' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Multi-Load
          </button>
          <button
            onClick={() => setActiveTab('dual_view')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'dual_view' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Dual View
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'history' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Saved Bills
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Settings
          </button>
        </div>

      </div>
    </header>
  );
};
