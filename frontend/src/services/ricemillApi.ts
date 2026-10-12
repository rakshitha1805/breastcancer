import axios from 'axios';
import { SingleBatchBill, MultiLotBill, MillSettings, SavedBillSummary } from '../types/ricemill';

const API_BASE_URL = 
  typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173'
    ? 'http://127.0.0.1:8000/api/ricemill'
    : '/api/ricemill';

export const calculateBillApi = async (
  mode: 'single_batch' | 'multi_lot',
  data: SingleBatchBill | MultiLotBill
) => {
  const res = await axios.post(`${API_BASE_URL}/calculate`, { mode, data });
  return res.data.result;
};

export const getBillsApi = async (search?: string, mode?: string) => {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (mode) params.mode = mode;
  const res = await axios.get<{ total: number; bills: SavedBillSummary[] }>(`${API_BASE_URL}/bills`, { params });
  return res.data;
};

export const getBillByIdApi = async (id: number) => {
  const res = await axios.get<SavedBillSummary>(`${API_BASE_URL}/bills/${id}`);
  return res.data;
};

export const saveBillApi = async (data: SingleBatchBill | MultiLotBill) => {
  const res = await axios.post(`${API_BASE_URL}/bills`, data);
  return res.data.bill;
};

export const updateBillApi = async (id: number, data: SingleBatchBill | MultiLotBill) => {
  const res = await axios.put(`${API_BASE_URL}/bills/${id}`, data);
  return res.data.bill;
};

export const deleteBillApi = async (id: number) => {
  const res = await axios.delete(`${API_BASE_URL}/bills/${id}`);
  return res.data;
};

export const getSampleDataApi = async () => {
  const res = await axios.get<{ single_batch: SingleBatchBill; multi_lot: MultiLotBill }>(`${API_BASE_URL}/sample-data`);
  return res.data;
};

export const getSettingsApi = async () => {
  const res = await axios.get<MillSettings>(`${API_BASE_URL}/settings`);
  return res.data;
};

export const saveSettingsApi = async (settings: MillSettings) => {
  const res = await axios.post(`${API_BASE_URL}/settings`, settings);
  return res.data.settings;
};

export const getExportCsvUrl = (billId: number) => {
  return `${API_BASE_URL}/export/csv/${billId}`;
};
