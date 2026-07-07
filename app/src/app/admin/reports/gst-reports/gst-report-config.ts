// ─────────────────────────────────────────────────────────────
// GST Report Config — built from REAL invoice tax data (cgst/sgst/igst).
// Reuses the shared SalesReportDef shape + formatters.
// ─────────────────────────────────────────────────────────────

import { SalesReportDef, cur } from '../sales-reports/sales-report-config';

export const GST_REPORTS: SalesReportDef[] = [
  // ── GSTR-3B — net tax liability (output tax − input credit) ──
  {
    key: 'gstr3b',
    name: 'GSTR-3B (Tax Liability)',
    description: 'Net GST payable for the period: output tax − input tax credit',
    category: 'Sale Register',
    apiUrl: 'reports/gst/gstr-3b/',
    reportType: 'Summary',
    pkId: 'tax_type',
    cols: [
      { fieldKey: 'tax_type',     name: 'Tax',                 sort: false },
      { fieldKey: 'output_tax',   name: 'Output Tax (Sales)',  sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'input_credit', name: 'Input Credit (Purch)', sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'net_payable',  name: 'Net Payable',         sort: false, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['tax_type'] },
    defaultSort: { key: 'tax_type', value: 'ascend' },
    filters: ['dateRange', 'period', 'search'],
    summaryStrip: [
      { key: 'total_output_tax',   label: 'Output Tax',  currency: true },
      { key: 'total_input_credit', label: 'Input Credit', currency: true },
      { key: 'net_gst_payable',    label: 'Net Payable', currency: true },
    ],
  },
];
