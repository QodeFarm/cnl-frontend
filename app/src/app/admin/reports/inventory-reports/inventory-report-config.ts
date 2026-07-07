// ─────────────────────────────────────────────────────────────
// Inventory Report Config — reuses the shared SalesReportDef shape, the generic
// report-detail engine and the shared column formatters. Field names are the REAL
// inventory response keys (verified against the backend inventory views).
// ─────────────────────────────────────────────────────────────

import { SalesReportDef, BadgeVariant, badge, cur, dt, qty } from '../sales-reports/sales-report-config';

// Stock-status pill: green OK, orange Low, red Out of Stock.
const stockBadge = (v: any) => {
  if (!v) return '—';
  const map: Record<string, BadgeVariant> = {
    ok: 'green', low: 'orange', 'out of stock': 'red',
  };
  return badge(v, map[String(v).toLowerCase()] || 'grey');
};

// Forecast pill: RED Critical, YELLOW Warning, GREEN Healthy.
const forecastBadge = (v: any) => {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    red:    { variant: 'red',    label: 'Critical' },
    yellow: { variant: 'orange', label: 'Warning' },
    green:  { variant: 'green',  label: 'Healthy' },
  };
  const s = map[String(v).toLowerCase()];
  return s ? badge(s.label, s.variant) : (v || '—');
};

// Movement pill: green Receive (in), orange Issue (out).
const movementBadge = (v: any) => {
  if (!v) return '—';
  return badge(v, String(v).toLowerCase() === 'receive' ? 'green' : 'orange');
};

export const INVENTORY_REPORTS: SalesReportDef[] = [
  // ── Stock Summary ────────────────────────────────────────────
  {
    key: 'stock_summary',
    name: 'Stock Summary',
    description: 'Current stock per product with reorder levels and status',
    category: 'Sale Register',
    apiUrl: 'reports/inventory/stock-summary/',
    reportType: 'Summary',
    pkId: 'product_id',
    cols: [
      { fieldKey: 'product_name',  name: 'Product',   sort: true },
      { fieldKey: 'product_code',  name: 'Code',      sort: false },
      { fieldKey: 'product_group', name: 'Group',     sort: false },
      { fieldKey: 'unit',          name: 'Unit',      sort: false },
      { fieldKey: 'balance',       name: 'Stock Qty', sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'minimum_level', name: 'Min Level', sort: true, displayType: 'map', mapFn: (v: any) => v ?? '—' },
      { fieldKey: 'maximum_level', name: 'Max Level', sort: false, displayType: 'map', mapFn: (v: any) => v ?? '—' },
      { fieldKey: 'stock_status',  name: 'Stock',     sort: false, displayType: 'map', mapFn: stockBadge },
      { fieldKey: 'status',        name: 'Status',    sort: false },
    ],
    globalSearch: { keys: ['product_name', 'product_code', 'product_group'] },
    defaultSort: { key: 'name', value: 'ascend' },
    filters: ['search'],
    barFilters: ['productGroup', 'productCategory', 'productBrand'],
    showDateFilters: false,
  },

  // ── Stock Valuation ──────────────────────────────────────────
  {
    key: 'stock_valuation',
    name: 'Stock Valuation',
    description: 'Stock value at cost and at sale price per product',
    category: 'Sale Register',
    apiUrl: 'reports/inventory/stock-valuation/',
    reportType: 'Summary',
    pkId: 'product_id',
    cols: [
      { fieldKey: 'product_name',     name: 'Product',     sort: true },
      { fieldKey: 'product_code',     name: 'Code',        sort: false },
      { fieldKey: 'balance',          name: 'Stock Qty',   sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'purchase_rate',    name: 'Cost Rate',   sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'sales_rate',       name: 'Sale Rate',   sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'stock_cost_value', name: 'Cost Value',  sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'stock_sale_value', name: 'Sale Value',  sort: true, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['product_name', 'product_code'] },
    defaultSort: { key: 'name', value: 'ascend' },
    filters: ['search'],
    barFilters: ['productGroup', 'productCategory', 'productBrand'],
    showDateFilters: false,
    summaryStrip: [
      { key: 'total_products',    label: 'Products' },
      { key: 'total_cost_value',  label: 'Cost Value', currency: true },
      { key: 'total_sale_value',  label: 'Sale Value', currency: true },
      // makes a ₹0 value honest: shows how many products have no cost entered.
      { key: 'unpriced_products', label: 'Unpriced (no cost)' },
    ],
  },

  // ── Reorder Level ────────────────────────────────────────────
  {
    key: 'reorder_level',
    name: 'Reorder Level',
    description: 'Items at or below minimum level — what needs reordering',
    category: 'Sale Register',
    apiUrl: 'reports/inventory/reorder-level/',
    reportType: 'Summary',
    pkId: 'product_id',
    cols: [
      { fieldKey: 'product_name',  name: 'Product',     sort: true },
      { fieldKey: 'product_code',  name: 'Code',        sort: false },
      { fieldKey: 'product_group', name: 'Group',       sort: false },
      { fieldKey: 'balance',       name: 'Stock Qty',   sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'minimum_level', name: 'Min Level',   sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'maximum_level', name: 'Max Level',   sort: false, displayType: 'map', mapFn: (v: any) => v ?? '—' },
      { fieldKey: 'shortfall',     name: 'Shortfall',   sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'reorder_qty',   name: 'Reorder Qty', sort: true, displayType: 'map', mapFn: qty },
    ],
    globalSearch: { keys: ['product_name', 'product_code', 'product_group'] },
    defaultSort: { key: 'balance', value: 'ascend' },
    filters: ['search'],
    barFilters: ['productGroup', 'productCategory', 'productBrand'],
    showDateFilters: false,
  },

  // ── Godown-wise Stock ────────────────────────────────────────
  {
    key: 'godown_stock',
    name: 'Godown-wise Stock',
    description: 'Stock quantity per product per warehouse location',
    category: 'Sale Register',
    apiUrl: 'reports/inventory/godown-stock/',
    reportType: 'Grouped',
    pkId: 'product_item_balance_id',
    cols: [
      { fieldKey: 'warehouse',    name: 'Warehouse', sort: false },
      { fieldKey: 'location',     name: 'Location',  sort: true },
      { fieldKey: 'product_name', name: 'Product',   sort: true },
      { fieldKey: 'product_code', name: 'Code',      sort: false },
      { fieldKey: 'quantity',     name: 'Quantity',  sort: true, displayType: 'map', mapFn: qty },
    ],
    globalSearch: { keys: ['warehouse', 'location', 'product_name', 'product_code'] },
    defaultSort: { key: 'location', value: 'ascend' },
    filters: ['search'],
    showDateFilters: false,
  },

  // ── Fast Moving Items ────────────────────────────────────────
  {
    key: 'fast_moving',
    name: 'Fast Moving Items',
    description: 'Top-selling products by quantity sold in the period',
    category: 'Sale Register',
    apiUrl: 'reports/inventory/fast-moving/',
    reportType: 'Grouped',
    pkId: 'product_id',
    cols: [
      { fieldKey: 'product_name',   name: 'Product',     sort: true },
      { fieldKey: 'product_code',   name: 'Code',        sort: false },
      { fieldKey: 'total_qty_sold', name: 'Qty Sold',    sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'total_revenue',  name: 'Revenue',     sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'invoice_count',  name: 'Invoices',    sort: true },
    ],
    globalSearch: { keys: ['product_name', 'product_code'] },
    defaultSort: { key: 'total_qty_sold', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
  },

  // ── Slow Moving Items ────────────────────────────────────────
  {
    key: 'slow_moving',
    name: 'Slow Moving Items',
    description: 'In-stock products not sold within the selected period',
    category: 'Sale Register',
    apiUrl: 'reports/inventory/slow-moving/',
    reportType: 'Summary',
    pkId: 'product_id',
    cols: [
      { fieldKey: 'product_name',    name: 'Product',      sort: true },
      { fieldKey: 'product_code',    name: 'Code',         sort: false },
      { fieldKey: 'product_group',   name: 'Group',        sort: false },
      { fieldKey: 'balance',         name: 'Stock Qty',    sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'last_sold_date',  name: 'Last Sold',    sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'days_since_sold', name: 'Days Idle',    sort: true, displayType: 'map', mapFn: (v: any) => v ?? 'Never' },
    ],
    globalSearch: { keys: ['product_name', 'product_code', 'product_group'] },
    defaultSort: { key: 'balance', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
  },

  // ── Stock Movement (StockJournal ledger: Receive / Issue) ────
  {
    key: 'stock_movement',
    name: 'Stock Movement',
    description: 'Stock-in (Receive) and stock-out (Issue) ledger entries per product',
    category: 'Sale Register',
    apiUrl: 'reports/inventory/stock-movement/',
    reportType: 'Detailed',
    pkId: 'journal_id',
    cols: [
      { fieldKey: 'date',             name: 'Date',      sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'product_name',     name: 'Product',   sort: true },
      { fieldKey: 'product_code',     name: 'Code',      sort: false },
      { fieldKey: 'transaction_type', name: 'Type',      sort: false, displayType: 'map', mapFn: movementBadge },
      { fieldKey: 'quantity',         name: 'Quantity',  sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'remarks',          name: 'Remarks',   sort: false },
    ],
    globalSearch: { keys: ['product_name', 'product_code', 'remarks'] },
    defaultSort: { key: 'created_at', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    barFilters: ['transactionType'],
  },

  // ── Stock Forecast (current stock vs average demand) ─────────
  {
    key: 'stock_forecast',
    name: 'Stock Forecast',
    description: 'Current stock vs average sales demand — Critical / Warning / Healthy',
    category: 'Sale Register',
    apiUrl: 'reports/inventory/stock-forecast/',
    reportType: 'Summary',
    pkId: 'product_id',
    cols: [
      { fieldKey: 'product_name',     name: 'Product',      sort: true },
      { fieldKey: 'product_code',     name: 'Code',         sort: false },
      { fieldKey: 'product_group',    name: 'Group',        sort: false },
      { fieldKey: 'current_stock',    name: 'Current Stock', sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'average_sales',    name: 'Avg Monthly Sales', sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'stock_difference', name: 'Difference',   sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'stock_status',     name: 'Forecast',     sort: false, displayType: 'map', mapFn: forecastBadge },
      { fieldKey: 'status_message',   name: 'Message',      sort: false },
    ],
    globalSearch: { keys: ['product_name', 'product_code', 'product_group'] },
    defaultSort: { key: 'average_sales', value: 'descend' },
    filters: ['period', 'search'],
    barFilters: ['productGroup'],
    periodOnly: true,   // show only Quick Period (analysis window), hide From/To
    // Only meaningful averaging windows (no Today/Yesterday/Last Week — too short
    // to estimate monthly demand, which would falsely show everything "Healthy").
    quickPeriodOptions: [
      { value: 'current_month',   label: 'Current Month' },
      { value: 'last_month',      label: 'Last Month' },
      { value: 'current_quarter', label: 'Current Quarter (3 Months)' },
      { value: 'last_six_months', label: 'Last 6 Months' },
      { value: 'year_to_date',    label: 'Year to Date' },
      { value: 'last_year',       label: 'Last 12 Months' },
    ],
  },
];
