import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  ExternalLink, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Truck, 
  Calendar, 
  User, 
  Coins, 
  Filter
} from 'lucide-react';
import { SavedBillSummary, SingleBatchBill, MultiLotBill } from '../types/ricemill';
import { formatCurrency, formatNumber } from '../utils/ricemillCalc';
import { getExportCsvUrl } from '../services/ricemillApi';

interface SavedBillsHistoryProps {
  bills: SavedBillSummary[];
  onLoadBill: (bill: SavedBillSummary) => void;
  onDeleteBill: (id: number) => void;
  onPrintBill: (bill: SavedBillSummary) => void;
}

export const SavedBillsHistory: React.FC<SavedBillsHistoryProps> = ({
  bills,
  onLoadBill,
  onDeleteBill,
  onPrintBill,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<string>('all');

  const filteredBills = bills.filter((b) => {
    const matchesSearch = 
      b.party_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.lorry_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.batch_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bill_no?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesMode = filterMode === 'all' || b.billing_mode === filterMode;
    return matchesSearch && matchesMode;
  });

  const totalProcessedWeight = bills.reduce((sum, b) => sum + (b.total_paddy_weight || 0), 0);
  const totalSettlementAmount = bills.reduce((sum, b) => sum + Math.abs(b.net_payable || 0), 0);

  return (
    <div className="space-y-6">

      {/* Top Banner & Stats Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-700 gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Saved Bills & Processing History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access, inspect, search, print, or re-load any past paddy processing settlement ledger dynamically.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Total Bills</span>
              <span className="font-mono font-bold text-amber-800 dark:text-amber-300">{bills.length} Records</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Total Paddy</span>
              <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300">{formatNumber(totalProcessedWeight)} KG</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by party, vehicle, batch # or bill #..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
            >
              <option value="all">All Modes</option>
              <option value="single_batch">Single Batch</option>
              <option value="multi_lot">Multi-Load Lot</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bills Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
        {filteredBills.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Coins className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
              No bills found matching your search.
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria or create a new bill in the calculator.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4">Bill Details</th>
                  <th className="py-3 px-4">Party & Vehicle</th>
                  <th className="py-3 px-3 text-right">Inward Weight</th>
                  <th className="py-3 px-3 text-right">Charges</th>
                  <th className="py-3 px-3 text-right">Recoveries</th>
                  <th className="py-3 px-4 text-right">Net Settlement</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredBills.map((bill) => {
                  const isMillPays = bill.net_payable >= 0;
                  return (
                    <tr 
                      key={bill.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {bill.bill_no}
                        </div>
                        <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 pt-0.5">
                          <span>{bill.bill_date}</span>
                          <span>•</span>
                          <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                            bill.billing_mode === 'single_batch' 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' 
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                          }`}>
                            {bill.billing_mode === 'single_batch' ? 'Single Batch' : 'Multi-Load Lot'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                          {bill.party_name || 'Standard Party'}
                        </div>
                        <div className="font-mono text-slate-500 text-[11px]">
                          {bill.lorry_no ? `Veh: ${bill.lorry_no}` : `Batch #${bill.batch_no}`}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                        {formatNumber(bill.total_paddy_weight)} KG
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-rose-600 dark:text-rose-400">
                        {formatCurrency(bill.total_charges)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(bill.total_recoveries)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className={`font-mono font-extrabold text-sm ${
                          isMillPays ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {formatCurrency(Math.abs(bill.net_payable))}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {isMillPays ? 'Mill Pays Party' : 'Party Pays Mill'}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => onLoadBill(bill)}
                            title="Open & Edit in Calculator"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onPrintBill(bill)}
                            title="Print Settlement Slip"
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <a
                            href={getExportCsvUrl(bill.id)}
                            download
                            title="Download CSV"
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete bill ${bill.bill_no}?`)) {
                                onDeleteBill(bill.id);
                              }
                            }}
                            title="Delete Bill"
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
