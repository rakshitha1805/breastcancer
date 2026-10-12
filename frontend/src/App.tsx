import React, { useState, useEffect } from 'react';
import { RiceMillNavbar } from './components/RiceMillNavbar';
import { SingleBatchView } from './pages/SingleBatchView';
import { MultiLotView } from './pages/MultiLotView';
import { DualComparativeView } from './pages/DualComparativeView';
import { SavedBillsHistory } from './pages/SavedBillsHistory';
import { RiceMillSettingsView } from './pages/RiceMillSettingsView';
import { PrintBillModal } from './components/PrintBillModal';
import { 
  SingleBatchBill, 
  MultiLotBill, 
  MillSettings, 
  SavedBillSummary 
} from './types/ricemill';
import { 
  getBillsApi, 
  saveBillApi, 
  deleteBillApi, 
  getSampleDataApi, 
  getSettingsApi, 
  saveSettingsApi 
} from './services/ricemillApi';
import { recomputeSingleBatch, recomputeMultiLot } from './utils/ricemillCalc';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('single_batch');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const [settings, setSettings] = useState<MillSettings | null>(null);
  const [singleBill, setSingleBill] = useState<SingleBatchBill | null>(null);
  const [multiBill, setMultiBill] = useState<MultiLotBill | null>(null);
  const [savedBills, setSavedBills] = useState<SavedBillSummary[]>([]);

  const [printModalOpen, setPrintModalOpen] = useState<boolean>(false);
  const [billToPrint, setBillToPrint] = useState<SingleBatchBill | MultiLotBill | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initial load from backend
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const [sampleData, fetchedSettings, billsData] = await Promise.all([
          getSampleDataApi(),
          getSettingsApi(),
          getBillsApi()
        ]);

        setSettings(fetchedSettings);
        setSingleBill(recomputeSingleBatch(sampleData.single_batch));
        setMultiBill(recomputeMultiLot(sampleData.multi_lot));
        setSavedBills(billsData.bills || []);
      } catch (err) {
        console.warn('Backend connecting or starting, initializing with local defaults:', err);
      }
    };
    initializeApp();
  }, []);

  // Action: Load Sample Sheet
  const handleLoadSample = async () => {
    try {
      const sample = await getSampleDataApi();
      setSingleBill(recomputeSingleBatch(sample.single_batch));
      setMultiBill(recomputeMultiLot(sample.multi_lot));
      showToast('Loaded exact spreadsheet sample data (TN29BF8709 • Batch 1)!', 'success');
    } catch (e) {
      showToast('Loaded local spreadsheet sample data!', 'info');
    }
  };

  // Action: New Bill / Reset
  const handleNewBill = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timestamp = Date.now().toString().slice(-4);
    const standardBag = settings?.standard_paddy_bag_weight || 70;
    const defaultRates = settings?.default_rates || {};

    if (activeTab === 'multi_lot') {
      const newMulti: MultiLotBill = {
        bill_no: `RM-LOT-${timestamp}`,
        bill_date: dateStr,
        party_name: '',
        lorry_no: '',
        batch_no: String(Math.floor(Math.random() * 900) + 100),
        lot_no: '',
        billing_mode: 'multi_lot',
        paddy_bag_size: standardBag,
        paddy_loads: [
          { id: `load_1`, load_no: 1, lorry_no: '', bags: 0, paddy_weight: 0 }
        ],
        paddy_70kg_rate: defaultRates.multi_paddy_70kg_rate || 110.0,
        paddy_labor: [
          { id: 'pl1', particulars: 'Paddy', lot_no: '', bags: 0, rate: defaultRates.gage_cutting_rate || 6, amount: 0 },
          { id: 'pl2', particulars: 'Unloading', lot_no: '', bags: 0, rate: defaultRates.unloading_rate || 5, amount: 0 },
          { id: 'pl3', particulars: 'shifting&cutting', lot_no: '', bags: 0, rate: 5.5, amount: 0 }
        ],
        rice_labor: [
          { id: 'rl1', particulars: 'Rice 26kgs', lot_no: '', bags: 0, rate: 3, amount: 0 },
          { id: 'rl2', particulars: 'Bkn 50kgs', lot_no: '', bags: 0, rate: 6, amount: 0 },
          { id: 'rl3', particulars: 'Bkn 26kgs', lot_no: '', bags: 0, rate: 3, amount: 0 },
          { id: 'rl4', particulars: 'Bran 50kgs', lot_no: '', bags: 0, rate: 6, amount: 0 },
          { id: 'rl5', particulars: 'BB 50kgs', lot_no: '', bags: 0, rate: 6, amount: 0 },
          { id: 'rl6', particulars: '2nd Bkn 50kgs', lot_no: '', bags: 0, rate: 6, amount: 0 },
          { id: 'rl7', particulars: 'Rej Rice 50kgs', lot_no: '', bags: 0, rate: 6, amount: 0 },
          { id: 'rl8', particulars: 'Rej bkn 50kgs', lot_no: '', bags: 0, rate: 6, amount: 0 },
          { id: 'rl9', particulars: 'Rice Gunny', lot_no: '', bags: 0, rate: 0, amount: 0 },
          { id: 'rl10', particulars: 'Gunny', lot_no: '', bags: 0, rate: 15, amount: 0 },
          { id: 'rl11', particulars: 'Outan', lot_no: '', bags: 1, rate: 500, amount: 500 },
          { id: 'rl12', particulars: 'Thread', lot_no: '', bags: 2, rate: 200, amount: 400 }
        ],
        rice_labor_override_total: null,
        bran_realization: {
          particulars: 'Bran Amount',
          weight: 0,
          rate: defaultRates.multi_bran_rate || 25.80,
          amount: 0
        },
        total_paddy_weight: 0,
        total_paddy_bags: 0,
        total_charges: 0,
        total_recoveries: 0,
        net_payable: 0
      };
      setMultiBill(recomputeMultiLot(newMulti));
    } else {
      const newSingle: SingleBatchBill = {
        bill_no: `RM-VEH-${timestamp}`,
        bill_date: dateStr,
        party_name: '',
        lorry_no: '',
        batch_no: String(Math.floor(Math.random() * 900) + 100),
        lot_no: '',
        billing_mode: 'single_batch',
        paddy_bag_size: standardBag,
        paddy_weight: 0,
        paddy_bags: 0,
        paddy_rate: defaultRates.paddy_70kg_milling_rate || 100.0,
        labor_items: [
          { id: '1', particulars: 'Paddy 70KG', bags: 0, weight: 0, rate: 100, amount: 0, is_paddy: true },
          { id: '2', particulars: 'Unloading', bags: 0, weight: null, rate: 4, amount: 0 },
          { id: '3', particulars: 'Gage Cutting & Dumping', bags: 0, weight: null, rate: 6, amount: 0 },
          { id: '4', particulars: 'Rice Pack & Load 26kg', bags: 0, weight: null, rate: 4, amount: 0 },
          { id: '5', particulars: 'Bkn Pack & Load 26kg', bags: 0, weight: null, rate: 4, amount: 0 },
          { id: '6', particulars: 'Bkn Pack & Load 50kg', bags: 0, weight: null, rate: 8, amount: 0 },
          { id: '7', particulars: 'Bran pack&load 50 kg', bags: 0, weight: null, rate: 8, amount: 0 },
          { id: '8', particulars: 'blower pack & load50kg', bags: 0, weight: null, rate: 8, amount: 0 },
          { id: '9', particulars: 'Outton', bags: 0, weight: null, rate: 8, amount: 0 },
          { id: '10', particulars: 'Rej Bkn pack & load 50KG', bags: 0, weight: null, rate: 8, amount: 0 },
          { id: '11', particulars: 'Empty Bags Rice', bags: 0, weight: null, rate: 11.5, amount: 0 },
          { id: '12', particulars: 'Empty Bags Broken', bags: 0, weight: null, rate: 0, amount: 0 },
          { id: '13', particulars: 'Shifting & Cutting Paddy', bags: 0, weight: null, rate: 6, amount: 0 },
          { id: '14', particulars: 'Empty gunny 50kg', bags: 0, weight: null, rate: 9, amount: 0 },
          { id: '15', particulars: 'Stiching Thread', bags: 1, weight: null, rate: 200, amount: 200 },
          { id: '16', particulars: 'Outton', bags: 1, weight: null, rate: 500, amount: 500 }
        ],
        byproducts: [
          { id: 'b1', particulars: 'rice 26kg', bags: 0, weight: 0, rate: 0, amount: 0 },
          { id: 'b2', particulars: 'Broken 26kg', bags: 0, weight: 0, rate: 0, amount: 0 },
          { id: 'b3', particulars: 'Broken 50kg', bags: 0, weight: 0, rate: 0, amount: 0 },
          { id: 'b4', particulars: 'Bran 50kg', bags: 0, weight: 0, rate: defaultRates.bran_default_rate || 28.96, amount: 0 },
          { id: 'b5', particulars: 'Blower 50kg', bags: 0, weight: 0, rate: 0, amount: 0 },
          { id: 'b6', particulars: 'Rejection Rice 26 KG', bags: 0, weight: 0, rate: 0, amount: 0 },
          { id: 'b7', particulars: 'Rejection Broken 26kg', bags: 0, weight: 0, rate: 0, amount: 0 },
          { id: 'b8', particulars: 'Gunny', bags: 0, weight: null, rate: 0, amount: 0 }
        ],
        total_charges: 0,
        total_recoveries: 0,
        net_payable: 0
      };
      setSingleBill(recomputeSingleBatch(newSingle));
    }
    showToast('New blank bill initialized ready for dynamic entry!', 'info');
  };

  // Action: Save Bill
  const handleSaveBill = async () => {
    const billToSave = activeTab === 'multi_lot' ? multiBill : singleBill;
    if (!billToSave) return;

    setSaving(true);
    try {
      const saved = await saveBillApi(billToSave);
      const updatedList = await getBillsApi();
      setSavedBills(updatedList.bills || []);
      showToast(`Bill ${billToSave.bill_no} saved to database successfully!`, 'success');
    } catch (e: any) {
      showToast(`Error saving bill: ${e.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Action: Delete Bill
  const handleDeleteBill = async (id: number) => {
    try {
      await deleteBillApi(id);
      const updatedList = await getBillsApi();
      setSavedBills(updatedList.bills || []);
      showToast('Bill deleted successfully.', 'info');
    } catch (e: any) {
      showToast(`Failed to delete bill: ${e.message}`, 'error');
    }
  };

  // Action: Load Saved Bill into Active Editor
  const handleLoadSavedBill = (summary: SavedBillSummary) => {
    if (summary.billing_mode === 'multi_lot') {
      setMultiBill(recomputeMultiLot(summary.data_json as MultiLotBill));
      setActiveTab('multi_lot');
    } else {
      setSingleBill(recomputeSingleBatch(summary.data_json as SingleBatchBill));
      setActiveTab('single_batch');
    }
    showToast(`Loaded Bill ${summary.bill_no} into active editor!`, 'success');
  };

  // Action: Open Print Modal
  const handleOpenPrint = (customBill?: SingleBatchBill | MultiLotBill) => {
    const toPrint = customBill || (activeTab === 'multi_lot' ? multiBill : singleBill);
    if (toPrint) {
      setBillToPrint(toPrint);
      setPrintModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-bold transition-all border animate-bounce ${
          toast.type === 'success' 
            ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20' 
            : toast.type === 'error'
            ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/20'
            : 'bg-amber-600 text-white border-amber-500 shadow-amber-500/20'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <RiceMillNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLoadSample={handleLoadSample}
        onNewBill={handleNewBill}
        onSaveBill={handleSaveBill}
        onPrintBill={() => handleOpenPrint()}
        saving={saving}
        settings={settings}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Single Batch (Vehicle Bill) */}
        {activeTab === 'single_batch' && singleBill && (
          <SingleBatchView 
            bill={singleBill} 
            onChange={(updated) => setSingleBill(updated)} 
          />
        )}

        {/* Tab 2: Multi-Load (Lot Settlement) */}
        {activeTab === 'multi_lot' && multiBill && (
          <MultiLotView 
            bill={multiBill} 
            onChange={(updated) => setMultiBill(updated)} 
          />
        )}

        {/* Tab 3: Dual Comparative View */}
        {activeTab === 'dual_view' && singleBill && multiBill && (
          <DualComparativeView
            singleBill={singleBill}
            multiBill={multiBill}
            onSelectSingle={() => setActiveTab('single_batch')}
            onSelectMulti={() => setActiveTab('multi_lot')}
            onPrint={() => handleOpenPrint(singleBill)}
          />
        )}

        {/* Tab 4: Saved Bills History */}
        {activeTab === 'history' && (
          <SavedBillsHistory
            bills={savedBills}
            onLoadBill={handleLoadSavedBill}
            onDeleteBill={handleDeleteBill}
            onPrintBill={(b) => handleOpenPrint(b.data_json as SingleBatchBill | MultiLotBill)}
          />
        )}

        {/* Tab 5: Settings & Tariff */}
        {activeTab === 'settings' && settings && (
          <RiceMillSettingsView
            settings={settings}
            onSaveSettings={async (updated) => {
              try {
                const res = await saveSettingsApi(updated);
                setSettings(res);
                showToast('Mill profile & default tariff updated!', 'success');
              } catch (e: any) {
                showToast(`Failed to save settings: ${e.message}`, 'error');
              }
            }}
          />
        )}

      </main>

      {/* Printable Invoice Modal */}
      {printModalOpen && (
        <PrintBillModal
          bill={billToPrint}
          settings={settings}
          onClose={() => setPrintModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {settings?.mill_name || "SRI MODERN RICE MILL"} • Dynamic Paddy Ledger & Labor Settlement Software
          </span>
          <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
            Version 2.0 • Real-Time Dynamic Processing
          </span>
        </div>
      </footer>

    </div>
  );
};

export default App;
