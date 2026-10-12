import React from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowRightLeft, 
  Receipt, 
  Scale, 
  Package, 
  Calculator, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { SingleBatchBill, LaborItem, ByproductItem } from '../types/ricemill';
import { formatCurrency, formatNumber, recomputeSingleBatch } from '../utils/ricemillCalc';

interface SingleBatchViewProps {
  bill: SingleBatchBill;
  onChange: (updatedBill: SingleBatchBill) => void;
}

export const SingleBatchView: React.FC<SingleBatchViewProps> = ({ bill, onChange }) => {

  const handleFieldChange = (field: keyof SingleBatchBill, value: any) => {
    const updated = { ...bill, [field]: value };
    onChange(recomputeSingleBatch(updated));
  };

  const handleLaborItemChange = (index: number, field: keyof LaborItem, value: any) => {
    const updatedItems = [...bill.labor_items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    const updated = { ...bill, labor_items: updatedItems };
    onChange(recomputeSingleBatch(updated));
  };

  const handleAddLaborItem = () => {
    const newItem: LaborItem = {
      id: `custom_${Date.now()}`,
      particulars: 'New Labor / Handling Task',
      bags: 0,
      weight: null,
      rate: 0,
      amount: 0,
    };
    const updated = { ...bill, labor_items: [...bill.labor_items, newItem] };
    onChange(recomputeSingleBatch(updated));
  };

  const handleDeleteLaborItem = (index: number) => {
    const updatedItems = bill.labor_items.filter((_, i) => i !== index);
    const updated = { ...bill, labor_items: updatedItems };
    onChange(recomputeSingleBatch(updated));
  };

  const handleByproductChange = (index: number, field: keyof ByproductItem, value: any) => {
    const updatedItems = [...bill.byproducts];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    const updated = { ...bill, byproducts: updatedItems };
    onChange(recomputeSingleBatch(updated));
  };

  const handleAddByproduct = () => {
    const newItem: ByproductItem = {
      id: `bp_${Date.now()}`,
      particulars: 'New By-Product / Recovery',
      bags: 0,
      weight: 0,
      rate: 0,
      amount: 0,
    };
    const updated = { ...bill, byproducts: [...bill.byproducts, newItem] };
    onChange(recomputeSingleBatch(updated));
  };

  const handleDeleteByproduct = (index: number) => {
    const updatedItems = bill.byproducts.filter((_, i) => i !== index);
    const updated = { ...bill, byproducts: updatedItems };
    onChange(recomputeSingleBatch(updated));
  };

  const isMillPaysParty = bill.net_payable >= 0;

  return (
    <div className="space-y-6">

      {/* Top Banner & Header Information Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 transition-all">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-700 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Single Batch Vehicle Billing & Labor Settlement
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculate live paddy conversions, handling costs, and by-product recoveries dynamically for every vehicle.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300">
              Bill No: <span className="font-mono font-bold">{bill.bill_no}</span>
            </div>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Party / Customer Name
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
              Vehicle / Lorry No
            </label>
            <input
              type="text"
              value={bill.lorry_no}
              onChange={(e) => handleFieldChange('lorry_no', e.target.value.toUpperCase())}
              placeholder="e.g. TN29BF8709"
              className="w-full px-3 py-2 text-sm font-mono uppercase rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
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
              Lot No / Ref
            </label>
            <input
              type="text"
              value={bill.lot_no}
              onChange={(e) => handleFieldChange('lot_no', e.target.value)}
              placeholder="e.g. LOT-A1"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Bag Size Std (KG)
            </label>
            <input
              type="number"
              value={bill.paddy_bag_size}
              onChange={(e) => handleFieldChange('paddy_bag_size', parseFloat(e.target.value) || 70)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        {/* Live Paddy Conversion Bar */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-amber-200 dark:border-slate-700">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
              <div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Paddy Total Weight (kg)</span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <input
                    type="number"
                    value={bill.paddy_weight || ''}
                    onChange={(e) => handleFieldChange('paddy_weight', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-32 px-2.5 py-1 text-base font-bold rounded-lg border border-amber-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">KG</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Reported Inward Bags</span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <input
                    type="number"
                    value={bill.paddy_bags || ''}
                    onChange={(e) => handleFieldChange('paddy_bags', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-24 px-2.5 py-1 text-base font-bold rounded-lg border border-amber-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Bags</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Milling Rate (₹/70kg)</span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400">₹</span>
                  <input
                    type="number"
                    value={bill.paddy_rate || ''}
                    onChange={(e) => handleFieldChange('paddy_rate', parseFloat(e.target.value) || 0)}
                    placeholder="100"
                    className="w-24 px-2.5 py-1 text-base font-bold rounded-lg border border-amber-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-amber-200/60 dark:border-slate-700">
              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                  Converted {bill.paddy_bag_size}KG Bags
                </span>
                <span className="text-lg font-mono font-extrabold text-amber-700 dark:text-amber-400">
                  {formatNumber(bill.paddy_70kg_bags, 4)} Bags
                </span>
              </div>

              <div className="text-right bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-amber-200 dark:border-slate-700 shadow-sm">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                  Paddy Milling Charge
                </span>
                <span className="text-xl font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(bill.paddy_milling_amount)}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Tables Grid: Left = Labor & Milling Particulars, Right = By-Products / Realization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Labor & Handling Expenses Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  1. Milling, Labor & Handling Expenses
                </h3>
              </div>
              <button
                onClick={handleAddLaborItem}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors"
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
                    <th className="py-2.5 px-2 text-right">Bags / Qty</th>
                    <th className="py-2.5 px-2 text-right">Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-1 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {bill.labor_items.map((item, idx) => (
                    <tr 
                      key={item.id || idx}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors ${
                        item.is_paddy ? 'bg-amber-50/40 dark:bg-amber-950/20 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2 px-3">
                        {item.is_paddy ? (
                          <span className="text-amber-800 dark:text-amber-300 font-bold flex items-center space-x-1">
                            <span>{item.particulars}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
                              Auto
                            </span>
                          </span>
                        ) : (
                          <input
                            type="text"
                            value={item.particulars}
                            onChange={(e) => handleLaborItemChange(idx, 'particulars', e.target.value)}
                            className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 px-1 py-0.5 rounded outline-none text-slate-800 dark:text-slate-200"
                          />
                        )}
                      </td>

                      <td className="py-2 px-2 text-right">
                        {item.is_paddy ? (
                          <span className="font-mono text-slate-700 dark:text-slate-300">
                            {formatNumber(item.bags, 2)}
                          </span>
                        ) : (
                          <input
                            type="number"
                            step="any"
                            value={item.bags ?? ''}
                            onChange={(e) => handleLaborItemChange(idx, 'bags', parseFloat(e.target.value) || 0)}
                            className="w-20 text-right bg-transparent border border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 px-1.5 py-0.5 rounded font-mono outline-none text-slate-800 dark:text-slate-200"
                          />
                        )}
                      </td>

                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="any"
                          value={item.rate ?? ''}
                          disabled={item.is_paddy}
                          onChange={(e) => handleLaborItemChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-16 text-right bg-transparent border border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 px-1.5 py-0.5 rounded font-mono outline-none text-slate-800 dark:text-slate-200 disabled:opacity-70"
                        />
                      </td>

                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                        {formatCurrency(item.amount)}
                      </td>

                      <td className="py-2 px-1 text-center">
                        {!item.is_paddy && (
                          <button
                            onClick={() => handleDeleteLaborItem(idx)}
                            title="Delete Row"
                            className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Labor Total Footer */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-amber-50/50 dark:bg-slate-900/60 p-3 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Total Labor & Milling Charges
            </span>
            <span className="text-base font-mono font-extrabold text-rose-600 dark:text-rose-400">
              {formatCurrency(bill.total_charges)}
            </span>
          </div>
        </div>

        {/* 2. By-Products & Output Realization Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  2. By-Products Realization (Recoveries / Credit)
                </h3>
              </div>
              <button
                onClick={handleAddByproduct}
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
                    <th className="py-2.5 px-2 text-right">Bags</th>
                    <th className="py-2.5 px-2 text-right">Weight (KG)</th>
                    <th className="py-2.5 px-2 text-right">Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-1 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {bill.byproducts.map((item, idx) => (
                    <tr 
                      key={item.id || idx}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.particulars}
                          onChange={(e) => handleByproductChange(idx, 'particulars', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 px-1 py-0.5 rounded outline-none text-slate-800 dark:text-slate-200"
                        />
                      </td>

                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="any"
                          value={item.bags ?? ''}
                          onChange={(e) => handleByproductChange(idx, 'bags', parseFloat(e.target.value) || 0)}
                          className="w-16 text-right bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 px-1.5 py-0.5 rounded font-mono outline-none text-slate-800 dark:text-slate-200"
                        />
                      </td>

                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="any"
                          value={item.weight ?? ''}
                          onChange={(e) => handleByproductChange(idx, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-20 text-right bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 px-1.5 py-0.5 rounded font-mono outline-none text-slate-800 dark:text-slate-200"
                        />
                      </td>

                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="any"
                          value={item.rate ?? ''}
                          onChange={(e) => handleByproductChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-16 text-right bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 px-1.5 py-0.5 rounded font-mono outline-none text-slate-800 dark:text-slate-200"
                        />
                      </td>

                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                        {formatCurrency(item.amount)}
                      </td>

                      <td className="py-2 px-1 text-center">
                        <button
                          onClick={() => handleDeleteByproduct(idx)}
                          title="Delete Row"
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
          </div>

          {/* Byproduct Total Footer */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-emerald-50/50 dark:bg-slate-900/60 p-3 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Total By-Product Realization
            </span>
            <span className="text-base font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(bill.total_recoveries)}
            </span>
          </div>
        </div>

      </div>

      {/* Net Financial Settlement & Summary Card */}
      <div className={`rounded-2xl p-6 border shadow-md transition-all ${
        isMillPaysParty
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 border-emerald-300 dark:border-emerald-800'
          : 'bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900 border-rose-300 dark:border-rose-800'
      }`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <div className="space-y-2 w-full lg:w-2/3">
            <div className="flex items-center space-x-2">
              {isMillPaysParty ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              )}
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Settlement Direction:{' '}
                <span className={isMillPaysParty ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
                  {isMillPaysParty ? 'Mill Pays to Party' : 'Party to Pay Mill'}
                </span>
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
              <div>
                Total Realization: <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">{formatCurrency(bill.total_recoveries)}</span>
              </div>
              <div>-</div>
              <div>
                Total Labor & Milling: <span className="font-bold font-mono text-rose-700 dark:text-rose-400">{formatCurrency(bill.total_charges)}</span>
              </div>
              <div>=</div>
              <div>
                Net Amount Payable: <span className="font-bold font-mono">{formatCurrency(Math.abs(bill.net_payable))}</span>
              </div>
            </div>

            {bill.net_payable_words && (
              <p className="text-xs italic font-medium text-slate-700 dark:text-slate-300 pt-1">
                Amount in Words: <span className="font-semibold text-slate-900 dark:text-slate-100">{bill.net_payable_words}</span>
              </p>
            )}
          </div>

          <div className="text-right w-full lg:w-auto bg-white/90 dark:bg-slate-800/90 px-6 py-4 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              {isMillPaysParty ? 'Net Payable to Party' : 'Net Receivable from Party'}
            </span>
            <span className={`text-3xl font-mono font-black ${
              isMillPaysParty ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {formatCurrency(Math.abs(bill.net_payable))}
            </span>
          </div>

        </div>

        {/* Notes */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Settlement Notes & Gate Pass Remarks
          </label>
          <input
            type="text"
            value={bill.notes || ''}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            placeholder="Add driver contact, gate pass number, moisture content or weighbridge slip notes..."
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40"
          />
        </div>
      </div>

    </div>
  );
};
