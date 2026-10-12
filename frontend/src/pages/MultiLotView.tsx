import React from 'react';
import { 
  Plus, 
  Trash2, 
  Truck, 
  Scale, 
  Package, 
  Receipt, 
  AlertCircle, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { MultiLotBill, PaddyLoad, MultiLotLaborItem } from '../types/ricemill';
import { formatCurrency, formatNumber, recomputeMultiLot } from '../utils/ricemillCalc';

interface MultiLotViewProps {
  bill: MultiLotBill;
  onChange: (updatedBill: MultiLotBill) => void;
}

export const MultiLotView: React.FC<MultiLotViewProps> = ({ bill, onChange }) => {

  const handleFieldChange = (field: keyof MultiLotBill, value: any) => {
    const updated = { ...bill, [field]: value };
    onChange(recomputeMultiLot(updated));
  };

  // Paddy Loads handlers
  const handleLoadChange = (index: number, field: keyof PaddyLoad, value: any) => {
    const updatedLoads = [...bill.paddy_loads];
    updatedLoads[index] = { ...updatedLoads[index], [field]: value };
    const updated = { ...bill, paddy_loads: updatedLoads };
    onChange(recomputeMultiLot(updated));
  };

  const handleAddLoad = () => {
    const newLoad: PaddyLoad = {
      id: `load_${Date.now()}`,
      load_no: bill.paddy_loads.length + 1,
      lorry_no: '',
      bags: 0,
      paddy_weight: 0,
    };
    const updated = { ...bill, paddy_loads: [...bill.paddy_loads, newLoad] };
    onChange(recomputeMultiLot(updated));
  };

  const handleDeleteLoad = (index: number) => {
    const updatedLoads = bill.paddy_loads.filter((_, i) => i !== index);
    const updated = { ...bill, paddy_loads: updatedLoads };
    onChange(recomputeMultiLot(updated));
  };

  // Paddy Labor handlers
  const handlePaddyLaborChange = (index: number, field: keyof MultiLotLaborItem, value: any) => {
    const updatedList = [...bill.paddy_labor];
    updatedList[index] = { ...updatedList[index], [field]: value };
    const updated = { ...bill, paddy_labor: updatedList };
    onChange(recomputeMultiLot(updated));
  };

  const handleAddPaddyLabor = () => {
    const newItem: MultiLotLaborItem = {
      id: `pl_${Date.now()}`,
      particulars: 'New Paddy Labor Task',
      lot_no: '',
      bags: 0,
      rate: 0,
      amount: 0,
    };
    const updated = { ...bill, paddy_labor: [...bill.paddy_labor, newItem] };
    onChange(recomputeMultiLot(updated));
  };

  const handleDeletePaddyLabor = (index: number) => {
    const updatedList = bill.paddy_labor.filter((_, i) => i !== index);
    const updated = { ...bill, paddy_labor: updatedList };
    onChange(recomputeMultiLot(updated));
  };

  // Rice Labor handlers
  const handleRiceLaborChange = (index: number, field: keyof MultiLotLaborItem, value: any) => {
    const updatedList = [...bill.rice_labor];
    updatedList[index] = { ...updatedList[index], [field]: value };
    const updated = { ...bill, rice_labor: updatedList };
    onChange(recomputeMultiLot(updated));
  };

  const handleAddRiceLabor = () => {
    const newItem: MultiLotLaborItem = {
      id: `rl_${Date.now()}`,
      particulars: 'New Rice Labor Item',
      lot_no: '',
      bags: 0,
      rate: 0,
      amount: 0,
    };
    const updated = { ...bill, rice_labor: [...bill.rice_labor, newItem] };
    onChange(recomputeMultiLot(updated));
  };

  const handleDeleteRiceLabor = (index: number) => {
    const updatedList = bill.rice_labor.filter((_, i) => i !== index);
    const updated = { ...bill, rice_labor: updatedList };
    onChange(recomputeMultiLot(updated));
  };

  // Bran Realization handlers
  const handleBranChange = (field: string, value: any) => {
    const updatedBran = { ...bill.bran_realization, [field]: value };
    const updated = { ...bill, bran_realization: updatedBran };
    onChange(recomputeMultiLot(updated));
  };

  const isMillPaysParty = bill.net_payable >= 0;

  return (
    <div className="space-y-6">

      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 transition-all">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-700 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Multi-Load Batch & Lot Consolidated Billing
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Consolidate multiple lorry weighments, separate Paddy & Rice labor lines, and apply Bran recovery credit dynamically.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300">
              Lot Bill No: <span className="font-mono font-bold">{bill.bill_no}</span>
            </div>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Party / Miller Name
            </label>
            <input
              type="text"
              value={bill.party_name}
              onChange={(e) => handleFieldChange('party_name', e.target.value)}
              placeholder="e.g. M/S Sri Venkateswara"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Bill Date
            </label>
            <input
              type="date"
              value={bill.bill_date}
              onChange={(e) => handleFieldChange('bill_date', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Batch No
            </label>
            <input
              type="text"
              value={bill.batch_no}
              onChange={(e) => handleFieldChange('batch_no', e.target.value)}
              placeholder="e.g. 1"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Lot Reference / Marks
            </label>
            <input
              type="text"
              value={bill.lot_no}
              onChange={(e) => handleFieldChange('lot_no', e.target.value)}
              placeholder="e.g. 500/256bg"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Paddy 70KG Rate (₹)
            </label>
            <input
              type="number"
              value={bill.paddy_70kg_rate || ''}
              onChange={(e) => handleFieldChange('paddy_70kg_rate', parseFloat(e.target.value) || 0)}
              placeholder="110"
              className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Inward Paddy Weighment Table (Multi-Load) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Inward Paddy Weighment Records (Lorry Loads)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
              {bill.paddy_loads.length} Loads Recorded
            </span>
          </div>

          <button
            onClick={handleAddLoad}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lorry Load</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                <th className="py-2.5 px-3 w-16">Load #</th>
                <th className="py-2.5 px-3">Lorry / Vehicle No</th>
                <th className="py-2.5 px-3 text-right">Inward Bags</th>
                <th className="py-2.5 px-3 text-right">Paddy Weight (KG)</th>
                <th className="py-2.5 px-3 text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {bill.paddy_loads.map((load, idx) => (
                <tr key={load.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-2 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                    #{idx + 1}
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={load.lorry_no}
                      onChange={(e) => handleLoadChange(idx, 'lorry_no', e.target.value.toUpperCase())}
                      placeholder={`Lorry ${idx + 1}`}
                      className="w-48 uppercase font-mono px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-amber-500 bg-transparent focus:bg-white dark:focus:bg-slate-900 outline-none"
                    />
                  </td>

                  <td className="py-2 px-3 text-right">
                    <input
                      type="number"
                      step="any"
                      value={load.bags ?? ''}
                      onChange={(e) => handleLoadChange(idx, 'bags', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-28 text-right font-mono px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-amber-500 bg-transparent focus:bg-white dark:focus:bg-slate-900 outline-none"
                    />
                  </td>

                  <td className="py-2 px-3 text-right">
                    <input
                      type="number"
                      step="any"
                      value={load.paddy_weight ?? ''}
                      onChange={(e) => handleLoadChange(idx, 'paddy_weight', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-36 text-right font-mono font-bold px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-amber-500 bg-transparent focus:bg-white dark:focus:bg-slate-900 outline-none"
                    />
                  </td>

                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => handleDeleteLoad(idx)}
                      title="Delete Load"
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Weighment Summary Banner */}
        <div className="mt-4 p-4 rounded-xl bg-amber-50/70 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Total Inward Bags</span>
              <span className="text-base font-mono font-bold text-slate-800 dark:text-slate-100">
                {formatNumber(bill.total_paddy_bags, 0)} Bags
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Total Paddy Weight</span>
              <span className="text-base font-mono font-extrabold text-amber-700 dark:text-amber-400">
                {formatNumber(bill.total_paddy_weight, 2)} KG
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Converted 70kg Bags</span>
              <span className="text-base font-mono font-bold text-indigo-700 dark:text-indigo-400">
                {formatNumber(bill.paddy_70kg_bags, 4)} Bags
              </span>
            </div>
          </div>

          <div className="text-right bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-amber-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              Paddy Milling Charge ({formatNumber(bill.paddy_70kg_bags, 2)} @ ₹{bill.paddy_70kg_rate})
            </span>
            <span className="text-xl font-mono font-black text-emerald-700 dark:text-emerald-400">
              {formatCurrency(bill.paddy_70kg_amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Dual Labor Tables: Paddy Handling vs Rice / Output Handling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Paddy Labor Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Paddy Handling & Labor Charges
                </h3>
              </div>
              <button
                onClick={handleAddPaddyLabor}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2.5 px-3">Particulars</th>
                    <th className="py-2.5 px-2">Lot No</th>
                    <th className="py-2.5 px-2 text-right">Bags</th>
                    <th className="py-2.5 px-2 text-right">Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-1 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {bill.paddy_labor.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.particulars}
                          onChange={(e) => handlePaddyLaborChange(idx, 'particulars', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 px-1 py-0.5 rounded outline-none"
                        />
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.lot_no}
                          onChange={(e) => handlePaddyLaborChange(idx, 'lot_no', e.target.value)}
                          placeholder="Lot"
                          className="w-20 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 px-1 py-0.5 rounded outline-none"
                        />
                      </td>

                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="any"
                          value={item.bags ?? ''}
                          onChange={(e) => handlePaddyLaborChange(idx, 'bags', parseFloat(e.target.value) || 0)}
                          className="w-16 text-right font-mono bg-transparent border border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 px-1 py-0.5 rounded outline-none"
                        />
                      </td>

                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="any"
                          value={item.rate ?? ''}
                          onChange={(e) => handlePaddyLaborChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-16 text-right font-mono bg-transparent border border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 px-1 py-0.5 rounded outline-none"
                        />
                      </td>

                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                        {formatCurrency(item.amount)}
                      </td>

                      <td className="py-2 px-1 text-center">
                        <button
                          onClick={() => handleDeletePaddyLabor(idx)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-amber-50/50 dark:bg-slate-900/60 p-3 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Total Paddy Labor Charges
            </span>
            <span className="text-base font-mono font-extrabold text-amber-700 dark:text-amber-400">
              {formatCurrency(bill.total_paddy_labor)}
            </span>
          </div>
        </div>

        {/* Rice / Output Handling Labor Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Rice, By-Product & Gunny Labor Charges
                </h3>
              </div>
              <button
                onClick={handleAddRiceLabor}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2.5 px-3">Particulars</th>
                    <th className="py-2.5 px-2">Lot No</th>
                    <th className="py-2.5 px-2 text-right">Bags</th>
                    <th className="py-2.5 px-2 text-right">Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-1 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {bill.rice_labor.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.particulars}
                          onChange={(e) => handleRiceLaborChange(idx, 'particulars', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 px-1 py-0.5 rounded outline-none"
                        />
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.lot_no}
                          onChange={(e) => handleRiceLaborChange(idx, 'lot_no', e.target.value)}
                          placeholder="Lot"
                          className="w-16 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 px-1 py-0.5 rounded outline-none"
                        />
                      </td>

                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="any"
                          value={item.bags ?? ''}
                          onChange={(e) => handleRiceLaborChange(idx, 'bags', parseFloat(e.target.value) || 0)}
                          className="w-16 text-right font-mono bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 px-1 py-0.5 rounded outline-none"
                        />
                      </td>

                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="any"
                          value={item.rate ?? ''}
                          onChange={(e) => handleRiceLaborChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-16 text-right font-mono bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 px-1 py-0.5 rounded outline-none"
                        />
                      </td>

                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                        {formatCurrency(item.amount)}
                      </td>

                      <td className="py-2 px-1 text-center">
                        <button
                          onClick={() => handleDeleteRiceLabor(idx)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2 bg-emerald-50/50 dark:bg-slate-900/60 p-3 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Rice Labor Total:
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                (Computed: {formatCurrency(bill.computed_rice_labor_sum)})
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Active Total:</span>
              <input
                type="number"
                step="any"
                value={bill.total_rice_labor ?? ''}
                onChange={(e) => handleFieldChange('rice_labor_override_total', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder={String(bill.computed_rice_labor_sum)}
                className="w-24 text-right font-mono font-extrabold text-base px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 outline-none"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Bran Realization (Credit Deduction) & Consolidated Settlement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bran Credit Deduction Card */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-700">
              <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Bran Realization (Credit Deduction)
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Bran Total Weight (KG)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="any"
                    value={bill.bran_realization?.weight ?? ''}
                    onChange={(e) => handleBranChange('weight', parseFloat(e.target.value) || 0)}
                    placeholder="5500"
                    className="w-full px-3 py-2 text-base font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-500">KG</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Bran Selling Rate (₹ / KG)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    step="any"
                    value={bill.bran_realization?.rate ?? ''}
                    onChange={(e) => handleBranChange('rate', parseFloat(e.target.value) || 0)}
                    placeholder="25.80"
                    className="w-full px-3 py-2 text-base font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 bg-indigo-50/50 dark:bg-slate-900/60 p-3 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Total Bran Credit
            </span>
            <span className="text-lg font-mono font-black text-indigo-700 dark:text-indigo-400">
              {formatCurrency(bill.bran_realization?.amount)}
            </span>
          </div>
        </div>

        {/* Consolidated Settlement Card */}
        <div className={`lg:col-span-2 rounded-2xl p-6 border shadow-md flex flex-col justify-between transition-all ${
          isMillPaysParty
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 border-emerald-300 dark:border-emerald-800'
            : 'bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900 border-rose-300 dark:border-rose-800'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center space-x-2">
                {isMillPaysParty ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                )}
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Lot Settlement Balance:{' '}
                  <span className={isMillPaysParty ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
                    {isMillPaysParty ? 'Mill to Pay Party' : 'Party to Pay Mill'}
                  </span>
                </h3>
              </div>

              <div className="text-xs px-2.5 py-1 rounded-md font-bold uppercase bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {isMillPaysParty ? 'Refundable to Party' : 'Due from Party'}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-xs">
              <div className="bg-white/70 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-slate-500 block">Paddy Milling (70kg)</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(bill.paddy_70kg_amount)}
                </span>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-slate-500 block">Paddy Labor</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(bill.total_paddy_labor)}
                </span>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-slate-500 block">Rice Labor</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(bill.total_rice_labor)}
                </span>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-slate-500 block">Gross Expenses</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                  {formatCurrency(bill.total_charges)}
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              Formula: Bran Amount ({formatCurrency(bill.total_recoveries)}) - Total Charges ({formatCurrency(bill.total_charges)}) = {formatCurrency(bill.net_payable)}
            </div>

            {bill.net_payable_words && (
              <p className="text-xs italic font-medium text-slate-700 dark:text-slate-300 pt-1">
                In Words: <span className="font-semibold text-slate-900 dark:text-slate-100">{bill.net_payable_words}</span>
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-2/3">
              <input
                type="text"
                value={bill.notes || ''}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder="Remarks, vehicle breakdown, payment mode (Cheque / RTGS / Cash)..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            <div className="text-right w-full sm:w-auto bg-white/90 dark:bg-slate-800/90 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {isMillPaysParty ? 'Payable to Party' : 'Payable by Party'}
              </span>
              <span className={`text-2xl font-mono font-black ${
                isMillPaysParty ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {formatCurrency(Math.abs(bill.net_payable))}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
