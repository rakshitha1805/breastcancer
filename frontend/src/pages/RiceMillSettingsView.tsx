import React, { useState } from 'react';
import { Settings, Building, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { MillSettings } from '../types/ricemill';

interface RiceMillSettingsViewProps {
  settings: MillSettings;
  onSaveSettings: (updated: MillSettings) => void;
  saving?: boolean;
}

export const RiceMillSettingsView: React.FC<RiceMillSettingsViewProps> = ({
  settings,
  onSaveSettings,
  saving = false
}) => {
  const [formData, setFormData] = useState<MillSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFieldChange = (field: keyof MillSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRateChange = (rateKey: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      default_rates: {
        ...prev.default_rates,
        [rateKey]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Mill Profile & Tariff Configuration
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set standard mill details and default labor rates so every new bill starts with your exact rates dynamically.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-colors shadow-md shadow-amber-600/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully! These defaults will be applied to all future bills.</span>
        </div>
      )}

      {/* Mill Identity Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-700">
          <Building className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Mill Identity & Invoice Header Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Mill Name
            </label>
            <input
              type="text"
              value={formData.mill_name}
              onChange={(e) => handleFieldChange('mill_name', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Tagline / Sub-Heading
            </label>
            <input
              type="text"
              value={formData.mill_tagline}
              onChange={(e) => handleFieldChange('mill_tagline', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Mill Physical Address
            </label>
            <input
              type="text"
              value={formData.mill_address}
              onChange={(e) => handleFieldChange('mill_address', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Phone / Mobile Contacts
            </label>
            <input
              type="text"
              value={formData.mill_phone}
              onChange={(e) => handleFieldChange('mill_phone', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              GSTIN / Mill Reg. No.
            </label>
            <input
              type="text"
              value={formData.gstin}
              onChange={(e) => handleFieldChange('gstin', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Default Labor & Milling Rates Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-700">
          <Settings className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Default Tariff & Standard Rates (₹)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Single Batch 70kg Rate (₹)
            </label>
            <input
              type="number"
              step="any"
              value={formData.default_rates?.paddy_70kg_milling_rate ?? 100}
              onChange={(e) => handleRateChange('paddy_70kg_milling_rate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Multi-Load 70kg Rate (₹)
            </label>
            <input
              type="number"
              step="any"
              value={formData.default_rates?.multi_paddy_70kg_rate ?? 110}
              onChange={(e) => handleRateChange('multi_paddy_70kg_rate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Unloading Rate (₹)
            </label>
            <input
              type="number"
              step="any"
              value={formData.default_rates?.unloading_rate ?? 4}
              onChange={(e) => handleRateChange('unloading_rate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Gage Cutting & Dumping (₹)
            </label>
            <input
              type="number"
              step="any"
              value={formData.default_rates?.gage_cutting_rate ?? 6}
              onChange={(e) => handleRateChange('gage_cutting_rate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Rice Pack 26kg (₹)
            </label>
            <input
              type="number"
              step="any"
              value={formData.default_rates?.rice_pack_load_26kg_rate ?? 4}
              onChange={(e) => handleRateChange('rice_pack_load_26kg_rate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Broken Pack 50kg (₹)
            </label>
            <input
              type="number"
              step="any"
              value={formData.default_rates?.bkn_pack_load_50kg_rate ?? 8}
              onChange={(e) => handleRateChange('bkn_pack_load_50kg_rate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Bran Pack 50kg (₹)
            </label>
            <input
              type="number"
              step="any"
              value={formData.default_rates?.bran_pack_load_50kg_rate ?? 8}
              onChange={(e) => handleRateChange('bran_pack_load_50kg_rate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Blower Pack 50kg (₹)
            </label>
            <input
              type="number"
              step="any"
              value={formData.default_rates?.blower_pack_load_50kg_rate ?? 8}
              onChange={(e) => handleRateChange('blower_pack_load_50kg_rate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Default Bran Rate (₹/kg)
            </label>
            <input
              type="number"
              step="any"
              value={formData.default_rates?.bran_default_rate ?? 28.96}
              onChange={(e) => handleRateChange('bran_default_rate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono font-bold text-amber-700 dark:text-amber-400"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Multi-Lot Bran Rate (₹/kg)
            </label>
            <input
              type="number"
              step="any"
              value={formData.default_rates?.multi_bran_rate ?? 25.80}
              onChange={(e) => handleRateChange('multi_bran_rate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono font-bold text-amber-700 dark:text-amber-400"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Stitching Thread Amount (₹)
            </label>
            <input
              type="number"
              step="any"
              value={formData.default_rates?.stitching_thread_amount ?? 200}
              onChange={(e) => handleRateChange('stitching_thread_amount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Outton Fixed Amount (₹)
            </label>
            <input
              type="number"
              step="any"
              value={formData.default_rates?.outton_fixed_amount ?? 500}
              onChange={(e) => handleRateChange('outton_fixed_amount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
            />
          </div>
        </div>
      </div>

    </form>
  );
};
