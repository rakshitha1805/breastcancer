import { SingleBatchBill, MultiLotBill, LaborItem, ByproductItem, PaddyLoad, MultiLotLaborItem } from '../types/ricemill';

export const formatCurrency = (val: number | undefined | null): string => {
  if (val === undefined || val === null || isNaN(val)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(val);
};

export const formatNumber = (val: number | undefined | null, decimals = 2): string => {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
  }).format(val);
};

export const numberToIndianWords = (num: number): string => {
  if (num === undefined || num === null || isNaN(num)) return 'Rupees Zero Only';
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const rupees = Math.floor(absNum);
  const paise = Math.round((absNum - rupees) * 100);

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const twoDigits = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    const rem = n % 10;
    const t = tens[Math.floor(n / 10)];
    return `${t} ${ones[rem]}`.trim();
  };

  const convertBelowThousand = (n: number): string => {
    let res = '';
    const h = Math.floor(n / 100);
    const rem = n % 100;
    if (h > 0) res += `${ones[h]} Hundred `;
    if (rem > 0) res += twoDigits(rem);
    return res.trim();
  };

  let remaining = rupees;
  const parts: string[] = [];

  const crores = Math.floor(remaining / 10000000);
  remaining %= 10000000;
  if (crores > 0) parts.push(`${convertBelowThousand(crores)} Crore`);

  const lakhs = Math.floor(remaining / 100000);
  remaining %= 100000;
  if (lakhs > 0) parts.push(`${twoDigits(lakhs)} Lakh`);

  const thousands = Math.floor(remaining / 1000);
  remaining %= 1000;
  if (thousands > 0) parts.push(`${twoDigits(thousands)} Thousand`);

  if (remaining > 0) parts.push(convertBelowThousand(remaining));

  let rupeesStr = parts.join(' ').trim();
  if (!rupeesStr) rupeesStr = 'Zero';

  let result = `Rupees ${rupeesStr}`;
  if (paise > 0) result += ` and ${twoDigits(paise)} Paise`;
  result += ' Only';

  if (isNegative) result = 'Minus ' + result;
  return result;
};

export const recomputeSingleBatch = (bill: SingleBatchBill): SingleBatchBill => {
  const bagSize = bill.paddy_bag_size || 70;
  const paddyWeight = Number(bill.paddy_weight) || 0;
  const paddyRate = Number(bill.paddy_rate) || 0;

  const paddy70kgBags = bagSize > 0 ? paddyWeight / bagSize : 0;
  const paddyMillingAmount = paddy70kgBags * paddyRate;

  let totalCharges = 0;
  const updatedLaborItems: LaborItem[] = bill.labor_items.map((item) => {
    if (item.is_paddy || item.particulars.includes('Paddy 70')) {
      const amt = paddyMillingAmount;
      totalCharges += amt;
      return {
        ...item,
        is_paddy: true,
        bags: paddy70kgBags,
        weight: paddyWeight,
        rate: paddyRate,
        amount: amt,
      };
    }

    const bags = Number(item.bags) || 0;
    const rate = Number(item.rate) || 0;
    let amt = Number(item.amount) || 0;

    if (rate > 0) {
      amt = bags * rate;
    }

    totalCharges += amt;
    return {
      ...item,
      amount: amt,
    };
  });

  let totalRecoveries = 0;
  const updatedByproducts: ByproductItem[] = bill.byproducts.map((item) => {
    const weight = Number(item.weight) || 0;
    const bags = Number(item.bags) || 0;
    const rate = Number(item.rate) || 0;
    let amt = Number(item.amount) || 0;

    if (weight > 0 && rate > 0) {
      amt = weight * rate;
    } else if (bags > 0 && rate > 0) {
      amt = bags * rate;
    }

    totalRecoveries += amt;
    return {
      ...item,
      amount: amt,
    };
  });

  const netPayable = totalRecoveries - totalCharges;

  return {
    ...bill,
    paddy_70kg_bags: paddy70kgBags,
    paddy_milling_amount: paddyMillingAmount,
    labor_items: updatedLaborItems,
    byproducts: updatedByproducts,
    total_charges: totalCharges,
    total_recoveries: totalRecoveries,
    net_payable: netPayable,
    net_payable_words: numberToIndianWords(netPayable),
    settlement_type: netPayable >= 0 ? 'MILL_PAYS_PARTY' : 'PARTY_PAYS_MILL',
  };
};

export const recomputeMultiLot = (bill: MultiLotBill): MultiLotBill => {
  const bagSize = bill.paddy_bag_size || 70;
  const loads = bill.paddy_loads || [];

  const totalPaddyWeight = loads.reduce((sum, l) => sum + (Number(l.paddy_weight) || 0), 0);
  const totalPaddyBags = loads.reduce((sum, l) => sum + (Number(l.bags) || 0), 0);

  const paddy70kgBags = bagSize > 0 ? totalPaddyWeight / bagSize : 0;
  const paddyRate = Number(bill.paddy_70kg_rate) || 0;
  const paddy70kgAmount = paddy70kgBags * paddyRate;

  let totalPaddyLabor = 0;
  const updatedPaddyLabor: MultiLotLaborItem[] = bill.paddy_labor.map((item) => {
    const bags = Number(item.bags) || 0;
    const rate = Number(item.rate) || 0;
    let amt = Number(item.amount) || 0;
    if (rate > 0) amt = bags * rate;
    totalPaddyLabor += amt;
    return { ...item, amount: amt };
  });

  let computedRiceLaborSum = 0;
  const updatedRiceLabor: MultiLotLaborItem[] = bill.rice_labor.map((item) => {
    const bags = Number(item.bags) || 0;
    const rate = Number(item.rate) || 0;
    let amt = Number(item.amount) || 0;
    if (rate > 0) amt = bags * rate;
    computedRiceLaborSum += amt;
    return { ...item, amount: amt };
  });

  let totalRiceLabor = computedRiceLaborSum;
  if (bill.rice_labor_override_total !== undefined && bill.rice_labor_override_total !== null && !isNaN(bill.rice_labor_override_total)) {
    totalRiceLabor = Number(bill.rice_labor_override_total);
  }

  const branWeight = Number(bill.bran_realization?.weight) || 0;
  const branRate = Number(bill.bran_realization?.rate) || 0;
  let branAmount = Number(bill.bran_realization?.amount) || 0;
  if (branWeight > 0 && branRate > 0) {
    branAmount = branWeight * branRate;
  }

  const totalCharges = paddy70kgAmount + totalPaddyLabor + totalRiceLabor;
  const totalRecoveries = branAmount;
  const netPayable = totalRecoveries - totalCharges;

  return {
    ...bill,
    total_paddy_weight: totalPaddyWeight,
    total_paddy_bags: totalPaddyBags,
    paddy_70kg_bags: paddy70kgBags,
    paddy_70kg_amount: paddy70kgAmount,
    paddy_labor: updatedPaddyLabor,
    total_paddy_labor: totalPaddyLabor,
    rice_labor: updatedRiceLabor,
    total_rice_labor: totalRiceLabor,
    computed_rice_labor_sum: computedRiceLaborSum,
    bran_realization: {
      ...bill.bran_realization,
      amount: branAmount,
    },
    total_charges: totalCharges,
    total_recoveries: totalRecoveries,
    net_payable: netPayable,
    net_payable_words: numberToIndianWords(netPayable),
    settlement_type: netPayable >= 0 ? 'MILL_PAYS_PARTY' : 'PARTY_PAYS_MILL',
  };
};
