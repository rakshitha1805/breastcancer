import React from 'react';
import { X, Printer, Coins, Check } from 'lucide-react';
import { SingleBatchBill, MultiLotBill, MillSettings } from '../types/ricemill';
import { formatCurrency, formatNumber } from '../utils/ricemillCalc';

interface PrintBillModalProps {
  bill: SingleBatchBill | MultiLotBill | null;
  settings: MillSettings | null;
  onClose: () => void;
}

export const PrintBillModal: React.FC<PrintBillModalProps> = ({ bill, settings, onClose }) => {
  if (!bill) return null;

  const isSingle = bill.billing_mode === 'single_batch';
  const single = bill as SingleBatchBill;
  const multi = bill as MultiLotBill;
  const isMillPays = bill.net_payable >= 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Modal Toolbar - Hidden during print */}
        <div className="print:hidden p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">Settlement Bill Print Preview</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Bill Paper Content */}
        <div className="p-8 overflow-y-auto print:p-2 print:overflow-visible font-sans bg-white" id="printable-bill">
          
          {/* Header & Mill Brand */}
          <div className="text-center pb-4 mb-4 border-b-2 border-slate-900">
            <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">
              {settings?.mill_name || "SRI MODERN RICE MILL"}
            </h1>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              {settings?.mill_tagline || "Paddy Processing & Modern Rice Milling Specialists"}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {settings?.mill_address || "NH-48 Main Road, Industrial Estate, Tamil Nadu - 635109"}
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs font-medium text-slate-600 mt-1">
              <span>Ph: {settings?.mill_phone || "+91 98765 43210"}</span>
              <span>•</span>
              <span className="font-mono">GSTIN: {settings?.gstin || "33AABCS1429B1Z8"}</span>
            </div>
            <div className="mt-2 inline-block px-4 py-0.5 border border-slate-900 font-bold text-xs uppercase tracking-widest bg-slate-100">
              {isSingle ? 'VEHICLE BATCH MILLING & LABOR SETTLEMENT SLIP' : 'CONSOLIDATED LOT SETTLEMENT STATEMENT'}
            </div>
          </div>

          {/* Bill Meta Data */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-6 border p-3 border-slate-300 rounded-lg">
            <div className="space-y-1">
              <div>
                <span className="text-slate-500 font-medium">Party / Miller:</span>{' '}
                <span className="font-bold text-slate-900">{bill.party_name || 'Standard Party'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Lorry / Vehicle:</span>{' '}
                <span className="font-mono font-bold text-slate-900">{bill.lorry_no || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Batch No:</span>{' '}
                <span className="font-bold text-slate-900">#{bill.batch_no}</span>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <div>
                <span className="text-slate-500 font-medium">Bill Slip No:</span>{' '}
                <span className="font-mono font-bold text-slate-900">{bill.bill_no}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Date:</span>{' '}
                <span className="font-mono font-bold text-slate-900">{bill.bill_date}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Lot Reference:</span>{' '}
                <span className="font-mono font-bold text-slate-900">{bill.lot_no || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* SINGLE BATCH PRINT LAYOUT */}
          {isSingle && (
            <div className="space-y-4">
              
              {/* Paddy Inward Summary */}
              <div className="border border-slate-300 p-2.5 rounded text-xs bg-slate-50/70 flex justify-between items-center">
                <div>
                  <span className="text-slate-600">Inward Paddy Weight:</span>{' '}
                  <span className="font-mono font-bold">{formatNumber(single.paddy_weight)} KG</span>{' '}
                  ({single.paddy_bags} Bags)
                </div>
                <div>
                  <span className="text-slate-600">Converted 70KG Bags:</span>{' '}
                  <span className="font-mono font-bold">{formatNumber(single.paddy_70kg_bags, 4)}</span>
                </div>
                <div>
                  <span className="text-slate-600">Rate:</span>{' '}
                  <span className="font-mono font-bold">₹{single.paddy_rate}/bag</span>
                </div>
              </div>

              {/* Labor Charges Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1 border-b border-slate-300 pb-1">
                  1. Milling, Labor & Handling Particulars
                </h4>
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 font-bold">
                      <th className="py-1 px-2">Particulars</th>
                      <th className="py-1 px-2 text-right">Bags / Qty</th>
                      <th className="py-1 px-2 text-right">Rate (₹)</th>
                      <th className="py-1 px-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {single.labor_items.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="py-1 px-2">{item.particulars}</td>
                        <td className="py-1 px-2 text-right font-mono">{item.bags ? formatNumber(item.bags, 2) : '-'}</td>
                        <td className="py-1 px-2 text-right font-mono">{item.rate ? formatNumber(item.rate, 2) : '-'}</td>
                        <td className="py-1 px-2 text-right font-mono font-semibold">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-slate-100 border-t-2 border-slate-400">
                      <td colSpan={3} className="py-1.5 px-2 text-right">TOTAL LABOR & MILLING CHARGES:</td>
                      <td className="py-1.5 px-2 text-right font-mono">{formatCurrency(single.total_charges)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* By-Products Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1 border-b border-slate-300 pb-1">
                  2. By-Products Realization (Recoveries / Credit)
                </h4>
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 font-bold">
                      <th className="py-1 px-2">Particulars</th>
                      <th className="py-1 px-2 text-right">Bags</th>
                      <th className="py-1 px-2 text-right">Weight (KG)</th>
                      <th className="py-1 px-2 text-right">Rate (₹)</th>
                      <th className="py-1 px-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {single.byproducts.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="py-1 px-2">{item.particulars}</td>
                        <td className="py-1 px-2 text-right font-mono">{item.bags ? formatNumber(item.bags, 2) : '-'}</td>
                        <td className="py-1 px-2 text-right font-mono">{item.weight ? formatNumber(item.weight, 2) : '-'}</td>
                        <td className="py-1 px-2 text-right font-mono">{item.rate ? formatNumber(item.rate, 2) : '-'}</td>
                        <td className="py-1 px-2 text-right font-mono font-semibold">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-slate-100 border-t-2 border-slate-400">
                      <td colSpan={4} className="py-1.5 px-2 text-right">TOTAL BY-PRODUCTS REALIZATION:</td>
                      <td className="py-1.5 px-2 text-right font-mono">{formatCurrency(single.total_recoveries)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MULTI LOT PRINT LAYOUT */}
          {!isSingle && (
            <div className="space-y-4">
              
              {/* Paddy Inward Loads Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1 border-b border-slate-300 pb-1">
                  Inward Paddy Weighment Loads
                </h4>
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 font-bold">
                      <th className="py-1 px-2">Load #</th>
                      <th className="py-1 px-2">Lorry No</th>
                      <th className="py-1 px-2 text-right">Inward Bags</th>
                      <th className="py-1 px-2 text-right">Paddy Weight (KG)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {multi.paddy_loads.map((load, idx) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="py-1 px-2 font-mono">Load {idx + 1}</td>
                        <td className="py-1 px-2 font-mono uppercase">{load.lorry_no || '-'}</td>
                        <td className="py-1 px-2 text-right font-mono">{formatNumber(load.bags, 0)}</td>
                        <td className="py-1 px-2 text-right font-mono font-semibold">{formatNumber(load.paddy_weight)}</td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-slate-100 border-t-2 border-slate-400">
                      <td colSpan={2} className="py-1.5 px-2">TOTAL PADDY WEIGHT:</td>
                      <td className="py-1.5 px-2 text-right font-mono">{formatNumber(multi.total_paddy_bags, 0)} Bags</td>
                      <td className="py-1.5 px-2 text-right font-mono">{formatNumber(multi.total_paddy_weight)} KG</td>
                    </tr>
                    <tr className="font-semibold text-slate-700 bg-slate-50">
                      <td colSpan={3} className="py-1 px-2 text-right">Converted 70KG Bags ({formatNumber(multi.paddy_70kg_bags, 4)} @ ₹{multi.paddy_70kg_rate}):</td>
                      <td className="py-1 px-2 text-right font-mono font-bold">{formatCurrency(multi.paddy_70kg_amount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Paddy & Rice Labor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1 border-b border-slate-300 pb-1">
                    Paddy Labor
                  </h4>
                  <table className="w-full text-xs text-left">
                    <tbody>
                      {multi.paddy_labor.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-200">
                          <td className="py-1 px-1">{item.particulars}</td>
                          <td className="py-1 px-1 text-right font-mono">{item.bags}</td>
                          <td className="py-1 px-1 text-right font-mono">₹{item.rate}</td>
                          <td className="py-1 px-1 text-right font-mono">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                      <tr className="font-bold border-t border-slate-300">
                        <td colSpan={3} className="py-1 px-1 text-right">Subtotal:</td>
                        <td className="py-1 px-1 text-right font-mono">{formatCurrency(multi.total_paddy_labor)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1 border-b border-slate-300 pb-1">
                    Rice & Packing Labor
                  </h4>
                  <table className="w-full text-xs text-left">
                    <tbody>
                      {multi.rice_labor.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-200">
                          <td className="py-1 px-1">{item.particulars}</td>
                          <td className="py-1 px-1 text-right font-mono">{item.bags}</td>
                          <td className="py-1 px-1 text-right font-mono">₹{item.rate}</td>
                          <td className="py-1 px-1 text-right font-mono">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                      <tr className="font-bold border-t border-slate-300">
                        <td colSpan={3} className="py-1 px-1 text-right">Subtotal:</td>
                        <td className="py-1 px-1 text-right font-mono">{formatCurrency(multi.total_rice_labor)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bran Realization Deduction */}
              <div className="border border-slate-300 p-2.5 rounded text-xs bg-slate-50 flex justify-between items-center">
                <span className="font-bold">Bran Realization Credit ({multi.bran_realization?.weight} KG @ ₹{multi.bran_realization?.rate}/KG):</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(multi.total_recoveries)}</span>
              </div>
            </div>
          )}

          {/* Grand Net Settlement Box */}
          <div className="mt-6 border-2 border-slate-900 p-4 rounded-xl bg-slate-50">
            <div className="flex justify-between items-center text-sm font-extrabold pb-2 border-b border-slate-300">
              <span className="uppercase tracking-wider">
                {isMillPays ? 'NET AMOUNT PAYABLE BY MILL TO PARTY:' : 'NET AMOUNT DUE FROM PARTY TO MILL:'}
              </span>
              <span className="text-xl font-mono">
                {formatCurrency(Math.abs(bill.net_payable))}
              </span>
            </div>

            {bill.net_payable_words && (
              <p className="text-xs italic text-slate-700 mt-2 font-medium">
                Amount in Words: <span className="font-bold text-slate-900">{bill.net_payable_words}</span>
              </p>
            )}

            {bill.notes && (
              <p className="text-xs text-slate-600 mt-1">
                Remarks: <span className="font-medium">{bill.notes}</span>
              </p>
            )}
          </div>

          {/* Signatures */}
          <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end text-xs">
            <div className="text-center">
              <div className="w-48 border-b border-slate-400 mb-1"></div>
              <span className="text-slate-600 font-semibold">Driver / Customer Signature</span>
            </div>

            <div className="text-center">
              <div className="w-48 border-b border-slate-400 mb-1"></div>
              <span className="text-slate-600 font-semibold">For {settings?.mill_name || "SRI MODERN RICE MILL"}</span>
              <span className="block text-[10px] text-slate-400">Authorized Signatory</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
