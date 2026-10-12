import React from 'react';
import { Layers, SplitSquareVertical, ArrowRight, Printer, Download } from 'lucide-react';
import { SingleBatchBill, MultiLotBill } from '../types/ricemill';
import { formatCurrency, formatNumber } from '../utils/ricemillCalc';

interface DualComparativeViewProps {
  singleBill: SingleBatchBill;
  multiBill: MultiLotBill;
  onSelectSingle: () => void;
  onSelectMulti: () => void;
  onPrint: () => void;
}

export const DualComparativeView: React.FC<DualComparativeViewProps> = ({
  singleBill,
  multiBill,
  onSelectSingle,
  onSelectMulti,
  onPrint
}) => {
  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <SplitSquareVertical className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Dual Comparative Ledger View
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Side-by-side reconciliation of Single Vehicle Labor Breakdown (Left Sheet) vs Multi-Load Lot Statement (Right Sheet).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onPrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Statements</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT SHEET: Single Batch Vehicle Bill */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border-2 border-amber-300 dark:border-amber-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Sheet A • Vehicle Level
                </span>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
                  Single Batch Labor & Recovery
                </h3>
              </div>
              <button
                onClick={onSelectSingle}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/80 hover:bg-amber-200 rounded-lg transition-colors"
              >
                <span>Edit This Sheet</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Header Mini Info */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs mb-4">
              <div>
                <span className="text-slate-400 block text-[11px]">Vehicle No</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{singleBill.lorry_no || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Batch No</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">#{singleBill.batch_no}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Date</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{singleBill.bill_date}</span>
              </div>
            </div>

            {/* Inward Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block">Reported Inward Bags</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{singleBill.paddy_bags} Bags</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block">Total Paddy Weight</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{formatNumber(singleBill.paddy_weight)} KG</span>
              </div>
            </div>

            {/* Highlights Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 px-2 bg-slate-50 dark:bg-slate-900/40 rounded">
                <span className="font-medium text-slate-600 dark:text-slate-300">Converted 70kg Bags:</span>
                <span className="font-mono font-bold">{formatNumber(singleBill.paddy_70kg_bags, 4)} Bags</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 bg-slate-50 dark:bg-slate-900/40 rounded">
                <span className="font-medium text-slate-600 dark:text-slate-300">Paddy Milling (70kg @ ₹{singleBill.paddy_rate}):</span>
                <span className="font-mono font-bold">{formatCurrency(singleBill.paddy_milling_amount)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 bg-slate-50 dark:bg-slate-900/40 rounded">
                <span className="font-medium text-slate-600 dark:text-slate-300">Total Labor & Handling Items:</span>
                <span className="font-mono">{singleBill.labor_items.length} Lines</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 font-bold rounded">
                <span>Total Labor & Milling Charges:</span>
                <span className="font-mono">{formatCurrency(singleBill.total_charges)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-bold rounded">
                <span>Total By-Product Realization:</span>
                <span className="font-mono">{formatCurrency(singleBill.total_recoveries)}</span>
              </div>
            </div>
          </div>

          {/* Left Net Result */}
          <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                Net Settlement
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {singleBill.net_payable >= 0 ? 'Mill to Pay Party' : 'Party to Pay Mill'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-mono font-black text-amber-700 dark:text-amber-400">
                {formatCurrency(Math.abs(singleBill.net_payable))}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SHEET: Multi-Load Lot Statement */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border-2 border-indigo-300 dark:border-indigo-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Sheet B • Lot Level
                </span>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
                  Multi-Load Consolidated Lot
                </h3>
              </div>
              <button
                onClick={onSelectMulti}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950/80 hover:bg-indigo-200 rounded-lg transition-colors"
              >
                <span>Edit This Sheet</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Header Mini Info */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs mb-4">
              <div>
                <span className="text-slate-400 block text-[11px]">Party Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{multiBill.party_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Lot Marks</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{multiBill.lot_no || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Recorded Loads</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{multiBill.paddy_loads.length} Lorries</span>
              </div>
            </div>

            {/* Inward Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block">Total Consolidated Bags</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatNumber(multiBill.total_paddy_bags, 0)} Bags</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block">Total Consolidated Weight</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{formatNumber(multiBill.total_paddy_weight)} KG</span>
              </div>
            </div>

            {/* Highlights Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 px-2 bg-slate-50 dark:bg-slate-900/40 rounded">
                <span className="font-medium text-slate-600 dark:text-slate-300">Paddy Milling (70kg @ ₹{multiBill.paddy_70kg_rate}):</span>
                <span className="font-mono font-bold">{formatCurrency(multiBill.paddy_70kg_amount)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 bg-slate-50 dark:bg-slate-900/40 rounded">
                <span className="font-medium text-slate-600 dark:text-slate-300">Paddy Labor Total:</span>
                <span className="font-mono font-bold">{formatCurrency(multiBill.total_paddy_labor)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 bg-slate-50 dark:bg-slate-900/40 rounded">
                <span className="font-medium text-slate-600 dark:text-slate-300">Rice Labor Total:</span>
                <span className="font-mono font-bold">{formatCurrency(multiBill.total_rice_labor)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 font-bold rounded">
                <span>Total Gross Expenses:</span>
                <span className="font-mono">{formatCurrency(multiBill.total_charges)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-bold rounded">
                <span>Bran Credit Recovery ({multiBill.bran_realization?.weight}kg @ ₹{multiBill.bran_realization?.rate}):</span>
                <span className="font-mono">{formatCurrency(multiBill.total_recoveries)}</span>
              </div>
            </div>
          </div>

          {/* Right Net Result */}
          <div className="mt-5 p-4 rounded-xl bg-indigo-500/10 border border-indigo-300 dark:border-indigo-700/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 block">
                Net Settlement
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {multiBill.net_payable >= 0 ? 'Mill to Pay Party' : 'Party to Pay Mill'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-mono font-black text-indigo-700 dark:text-indigo-400">
                {formatCurrency(Math.abs(multiBill.net_payable))}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
