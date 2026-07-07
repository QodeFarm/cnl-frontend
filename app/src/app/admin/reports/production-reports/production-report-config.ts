// ─────────────────────────────────────────────────────────────
// Production Report Config — only the Material Issue / Received flow has real
// data (work-order / BOM tables are not migrated in any tenant), so we build
// exactly those reports. Reuses the shared SalesReportDef shape + formatters.
// ─────────────────────────────────────────────────────────────

import { SalesReportDef, cur, dt, qty, statusBadge } from '../sales-reports/sales-report-config';

export const PRODUCTION_REPORTS: SalesReportDef[] = [
  // ── Work Order Status ────────────────────────────────────────
  {
    key: 'work_order_status',
    name: 'Work Order Status',
    description: 'All work orders with quantity, completed and balance',
    category: 'Sale Register',
    apiUrl: 'reports/production/work-order-status/',
    reportType: 'Summary',
    pkId: 'work_order_id',
    cols: [
      { fieldKey: 'product_name',  name: 'Product',   sort: true },
      { fieldKey: 'product_code',  name: 'Code',      sort: false },
      { fieldKey: 'status',        name: 'Status',    sort: false, displayType: 'map', mapFn: statusBadge },
      { fieldKey: 'quantity',      name: 'Order Qty', sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'completed_qty', name: 'Completed', sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'balance_qty',   name: 'Balance',   sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'start_date',    name: 'Start',     sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'end_date',      name: 'End',       sort: true, displayType: 'map', mapFn: dt },
    ],
    globalSearch: { keys: ['product_name', 'product_code', 'status'] },
    defaultSort: { key: 'created_at', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
  },

  // ── Production Summary (work orders by status) ───────────────
  {
    key: 'production_summary',
    name: 'Production Summary',
    description: 'Work orders grouped by production status',
    category: 'Sale Register',
    apiUrl: 'reports/production/production-summary/',
    reportType: 'Grouped',
    pkId: 'status',
    cols: [
      { fieldKey: 'status',        name: 'Status',      sort: true },
      { fieldKey: 'work_orders',   name: 'Work Orders', sort: true },
      { fieldKey: 'total_qty',     name: 'Order Qty',   sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'completed_qty', name: 'Completed',   sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'balance_qty',   name: 'Balance',     sort: true, displayType: 'map', mapFn: qty },
    ],
    globalSearch: { keys: ['status'] },
    defaultSort: { key: 'work_orders', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
  },

  // ── Bill of Materials ────────────────────────────────────────
  {
    key: 'bom_report',
    name: 'Bill of Materials',
    description: 'BOM component lines with quantity and cost',
    category: 'Sale Register',
    apiUrl: 'reports/production/bom/',
    reportType: 'Detailed',
    pkId: 'material_id',
    cols: [
      { fieldKey: 'product_name', name: 'Material',   sort: true },
      { fieldKey: 'product_code', name: 'Code',       sort: false },
      { fieldKey: 'reference_id', name: 'BOM Ref',    sort: false },
      { fieldKey: 'quantity',     name: 'Qty',        sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'unit_cost',    name: 'Unit Cost',  sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_cost',   name: 'Total Cost', sort: true, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['product_name', 'product_code', 'reference_id'] },
    defaultSort: { key: 'total_cost', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
  },

  // ── Material Issue Register ──────────────────────────────────
  {
    key: 'material_issue_register',
    name: 'Material Issue Register',
    description: 'Raw material issued to production floors',
    category: 'Sale Register',
    apiUrl: 'reports/production/material-issue/',
    reportType: 'Detailed',
    pkId: 'material_issue_item_id',
    cols: [
      { fieldKey: 'issue_no',         name: 'Issue No',   sort: true },
      { fieldKey: 'issue_date',       name: 'Date',       sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'production_floor', name: 'Floor',      sort: false },
      { fieldKey: 'product_name',     name: 'Material',   sort: true },
      { fieldKey: 'product_code',     name: 'Code',       sort: false },
      { fieldKey: 'unit',             name: 'Unit',       sort: false },
      { fieldKey: 'quantity',         name: 'Qty',        sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'rate',             name: 'Rate',       sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'amount',           name: 'Amount',     sort: true, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['issue_no', 'production_floor', 'product_name', 'product_code'] },
    defaultSort: { key: 'issue_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
  },

  // ── Material Received Register ───────────────────────────────
  {
    key: 'material_received_register',
    name: 'Material Received Register',
    description: 'Finished / semi-finished goods received from production',
    category: 'Sale Register',
    apiUrl: 'reports/production/material-received/',
    reportType: 'Detailed',
    pkId: 'material_received_item_id',
    cols: [
      { fieldKey: 'receipt_no',       name: 'Receipt No', sort: true },
      { fieldKey: 'receipt_date',     name: 'Date',       sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'production_floor', name: 'Floor',      sort: false },
      { fieldKey: 'product_name',     name: 'Product',    sort: true },
      { fieldKey: 'product_code',     name: 'Code',       sort: false },
      { fieldKey: 'unit',             name: 'Unit',       sort: false },
      { fieldKey: 'quantity',         name: 'Qty',        sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'rate',             name: 'Rate',       sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'amount',           name: 'Amount',     sort: true, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['receipt_no', 'production_floor', 'product_name', 'product_code'] },
    defaultSort: { key: 'receipt_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
  },

  // ── Raw Material Consumption ─────────────────────────────────
  {
    key: 'raw_material_consumption',
    name: 'Raw Material Consumption',
    description: 'Total raw material consumed (issued) grouped by product',
    category: 'Sale Register',
    apiUrl: 'reports/production/raw-material-consumption/',
    reportType: 'Grouped',
    pkId: 'product_id',
    cols: [
      { fieldKey: 'product_name',  name: 'Material',     sort: true },
      { fieldKey: 'product_code',  name: 'Code',         sort: false },
      { fieldKey: 'total_qty',     name: 'Qty Consumed', sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'total_amount',  name: 'Total Amount', sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'issue_count',   name: 'Issues',       sort: true },
    ],
    globalSearch: { keys: ['product_name', 'product_code'] },
    defaultSort: { key: 'total_qty', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
  },
];
