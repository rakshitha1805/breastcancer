export interface LaborItem {
  id: string;
  particulars: string;
  bags: number;
  weight?: number | null;
  rate: number;
  amount: number;
  is_paddy?: boolean;
}

export interface ByproductItem {
  id: string;
  particulars: string;
  bags: number;
  weight?: number | null;
  rate: number;
  amount: number;
}

export interface SingleBatchBill {
  id?: number;
  bill_no: string;
  bill_date: string;
  party_name: string;
  lorry_no: string;
  batch_no: string;
  lot_no: string;
  billing_mode: 'single_batch';
  paddy_bag_size: number;
  paddy_weight: number;
  paddy_bags: number;
  paddy_rate: number;
  paddy_70kg_bags?: number;
  paddy_milling_amount?: number;
  labor_items: LaborItem[];
  byproducts: ByproductItem[];
  total_charges: number;
  total_recoveries: number;
  net_payable: number;
  net_payable_words?: string;
  settlement_type?: 'MILL_PAYS_PARTY' | 'PARTY_PAYS_MILL';
  notes?: string;
}

export interface PaddyLoad {
  id: string;
  load_no: number;
  lorry_no: string;
  bags: number;
  paddy_weight: number;
}

export interface MultiLotLaborItem {
  id: string;
  particulars: string;
  lot_no: string;
  bags: number;
  rate: number;
  amount: number;
}

export interface BranRealization {
  particulars: string;
  weight: number;
  rate: number;
  amount: number;
}

export interface MultiLotBill {
  id?: number;
  bill_no: string;
  bill_date: string;
  party_name: string;
  lorry_no: string;
  batch_no: string;
  lot_no: string;
  billing_mode: 'multi_lot';
  paddy_bag_size: number;
  paddy_loads: PaddyLoad[];
  paddy_70kg_rate: number;
  paddy_labor: MultiLotLaborItem[];
  rice_labor: MultiLotLaborItem[];
  rice_labor_override_total?: number | null;
  computed_rice_labor_sum?: number;
  bran_realization: BranRealization;
  total_paddy_weight: number;
  total_paddy_bags: number;
  paddy_70kg_bags?: number;
  paddy_70kg_amount?: number;
  total_paddy_labor?: number;
  total_rice_labor?: number;
  total_charges: number;
  total_recoveries: number;
  net_payable: number;
  net_payable_words?: string;
  settlement_type?: 'MILL_PAYS_PARTY' | 'PARTY_PAYS_MILL';
  notes?: string;
}

export interface MillSettings {
  mill_name: string;
  mill_tagline: string;
  mill_address: string;
  mill_phone: string;
  gstin: string;
  standard_paddy_bag_weight: number;
  default_rates: Record<string, number>;
}

export interface SavedBillSummary {
  id: number;
  bill_no: string;
  bill_date: string;
  party_name: string;
  lorry_no: string;
  batch_no: string;
  lot_no: string;
  billing_mode: 'single_batch' | 'multi_lot';
  data_json: SingleBatchBill | MultiLotBill;
  total_paddy_weight: number;
  total_paddy_bags: number;
  total_charges: number;
  total_recoveries: number;
  net_payable: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}
