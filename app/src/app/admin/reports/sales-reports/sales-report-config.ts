// ─────────────────────────────────────────────────────────────
// Sales Report Config — single source of truth for all 19 reports
// ─────────────────────────────────────────────────────────────

export type ReportCategory =
  | 'Sale Register'
  | 'Pending Registers'
  | 'Trading Registers'
  | 'Payment & Outstanding'
  | 'MIS Reports'
  | 'Analysis';

export type FilterKey =
  | 'dateRange' | 'period' | 'registerType' | 'viewType'
  | 'billType' | 'city' | 'search' | 'minAmount' | 'maxAmount'
  | 'asOfDate' | 'compareType' | 'currentYear' | 'previousYear';

export interface SummaryField {
  key: string;
  label: string;
  currency?: boolean;
  suffix?: string;
}

export interface SalesReportDef {
  key: string;
  name: string;
  description: string;
  category: ReportCategory;
  apiUrl: string;
  reportType: 'Summary' | 'Detailed' | 'Grouped';
  pkId: string;
  cols: any[];
  globalSearch: { keys: string[] };
  defaultSort?: { key: string; value: 'ascend' | 'descend' };
  filters: FilterKey[];
  // Layer-2 dropdown filters shown in the report bar. Each string is a key into
  // FILTER_REGISTRY (report-filters.config.ts). The detail view renders these
  // generically and sends their values as backend query params.
  barFilters?: string[];
  // Layer-3 advanced filters shown in the collapsible "More Filters" drawer
  // (amount range, salesperson, city, product group/category/brand, HSN…).
  moreFilters?: string[];
  // Optional explicit strip. When omitted, the detail view auto-derives the
  // strip from the backend's response.summary via SUMMARY_KPI_REGISTRY.
  summaryStrip?: SummaryField[];
  registerTypes?: { value: string; label: string }[];
  // For multi-view "register" reports (Sale Register, Purchase Register…): the
  // columns + global-search keys per register type, and whether to show the
  // summary strip. Provided by each report so the detail view stays source-agnostic.
  registerCols?: Record<string, any[]>;
  registerGlobalSearch?: Record<string, string[]>;
  showSummaryStrip?: boolean;
  // Show the Quick Period + From/To date controls. Default true. Set false for
  // current-snapshot reports (e.g. stock) where a date filter would be misleading.
  showDateFilters?: boolean;
  // Show ONLY the Quick Period dropdown, hide From/To date (e.g. Stock Forecast,
  // where the period is an analysis window, not a date range).
  periodOnly?: boolean;
  // Override the Quick Period choices for this report (e.g. Stock Forecast =
  // only meaningful averaging windows; Today/Yesterday are not useful there).
  quickPeriodOptions?: { value: string; label: string }[];
}

// ─── Column value helpers (shared across report modules — single source) ──────
export const cur = (v: any) =>
  v != null ? `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—';

export const dt = (v: any) =>
  v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export const pct = (v: any) => (v != null ? `${Number(v).toFixed(2)}%` : '—');

export const qty = (v: any) => (v != null ? Number(v).toLocaleString('en-IN') : '—');

export type BadgeVariant = 'green' | 'orange' | 'red' | 'blue' | 'grey';

// Colored pill for TaTable cells. MUST use a CSS class (.rpt-badge in the global
// styles.scss) — Angular's [innerHTML] sanitizer strips inline `style`, so inline
// colors never render; `class` is preserved.
export const badge = (label: any, variant: BadgeVariant) =>
  `<span class="rpt-badge rpt-badge--${variant}">${label}</span>`;

// Status badge — colored pill matching the invoice/order status
export const statusBadge = (v: any) => {
  if (!v) return '—';
  const map: Record<string, BadgeVariant> = {
    pending: 'orange', paid: 'green', completed: 'green',
    cancelled: 'red', partial: 'blue',
  };
  return badge(v, map[String(v).toLowerCase()] || 'grey');
};

// ─── Register-type column sets ────────────────────────────────
export const REGISTER_TYPE_COLS: Record<string, any[]> = {
  general: [
    // ── Primary columns: always visible ──────────────────────────
    { fieldKey: 'invoice_no',     name: 'Invoice No',   sort: true },
    { fieldKey: 'invoice_date',   name: 'Date',         sort: true,  displayType: 'map',  mapFn: dt },
    { fieldKey: 'customer_name',  name: 'Customer',     sort: true },
    { fieldKey: 'bill_type',      name: 'Bill Type',    sort: false },
    { fieldKey: 'total_amount',   name: 'Net Amount',   sort: true,  displayType: 'map',  mapFn: cur },
    { fieldKey: 'paid_amount',    name: 'Paid',         sort: false, displayType: 'map',  mapFn: cur },
    { fieldKey: 'pending_amount', name: 'Pending',      sort: true,  displayType: 'map',  mapFn: cur },
    { fieldKey: 'status',         name: 'Status',       sort: false, displayType: 'map',  mapFn: statusBadge },
    { fieldKey: 'due_date',       name: 'Due Date',     sort: true,  displayType: 'map',  mapFn: dt },
    // ── Secondary columns: hidden by default, available via Columns picker ─
    { fieldKey: 'item_value',     name: 'Gross Amount', sort: true,  displayType: 'map',  mapFn: cur,                                        hidden: true },
    { fieldKey: 'dis_amt',        name: 'Discount',     sort: false, displayType: 'map',  mapFn: cur,                                        hidden: true },
    { fieldKey: 'tax_amount',     name: 'Tax',          sort: false, displayType: 'map',  mapFn: cur,                                        hidden: true },
    { fieldKey: 'round_off',      name: 'Round Off',    sort: false, displayType: 'map',  mapFn: (v: any) => v != null && Number(v) !== 0 ? cur(v) : '—', hidden: true },
    { fieldKey: 'city',           name: 'City',         sort: false, displayType: 'map',  mapFn: (v: any) => v || '—',                       hidden: true },
    { fieldKey: 'salesperson',    name: 'Salesperson',  sort: false, displayType: 'map',  mapFn: (v: any) => v || '—',                       hidden: true },
  ],
  detailed: [
    { fieldKey: 'invoice_no', name: 'Invoice No', sort: true },
    { fieldKey: 'invoice_date', name: 'Date', sort: true, displayType: 'map', mapFn: dt },
    { fieldKey: 'customer_name', name: 'Customer', sort: true },
    { fieldKey: 'product_name', name: 'Product', sort: true },
    { fieldKey: 'product_code', name: 'Code', sort: false },
    { fieldKey: 'hsn_code', name: 'HSN', sort: false },
    { fieldKey: 'unit', name: 'Unit', sort: false },
    { fieldKey: 'quantity', name: 'Qty', sort: true, displayType: 'map', mapFn: qty },
    { fieldKey: 'rate', name: 'Rate', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'amount', name: 'Amount', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'discount', name: 'Discount', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'cgst', name: 'CGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'sgst', name: 'SGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'igst', name: 'IGST', sort: false, displayType: 'map', mapFn: cur },
  ],
  columnar_tax_wise: [
    { fieldKey: 'invoice_no', name: 'Invoice No', sort: true },
    { fieldKey: 'invoice_date', name: 'Date', sort: true, displayType: 'map', mapFn: dt },
    { fieldKey: 'customer_name', name: 'Customer', sort: true },
    { fieldKey: 'taxable_amount', name: 'Taxable', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'cgst', name: 'CGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'sgst', name: 'SGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'igst', name: 'IGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'total_tax', name: 'Total Tax', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'net_amount', name: 'Net Amount', sort: true, displayType: 'map', mapFn: cur },
  ],
  columnar_product_group: [
    { fieldKey: 'group_name', name: 'Product Group', sort: true },
    { fieldKey: 'total_qty', name: 'Total Qty', sort: true, displayType: 'map', mapFn: qty },
    { fieldKey: 'gross_amount', name: 'Gross Amount', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'total_discount', name: 'Discount', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'cgst', name: 'CGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'sgst', name: 'SGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'igst', name: 'IGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'net_amount', name: 'Net Amount', sort: true, displayType: 'map', mapFn: cur },
  ],
  columnar_product_category: [
    { fieldKey: 'group_name', name: 'Category', sort: true },
    { fieldKey: 'total_qty', name: 'Total Qty', sort: true, displayType: 'map', mapFn: qty },
    { fieldKey: 'gross_amount', name: 'Gross Amount', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'total_discount', name: 'Discount', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'cgst', name: 'CGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'sgst', name: 'SGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'igst', name: 'IGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'net_amount', name: 'Net Amount', sort: true, displayType: 'map', mapFn: cur },
  ],
  columnar_product_brand: [
    { fieldKey: 'group_name', name: 'Brand', sort: true },
    { fieldKey: 'total_qty', name: 'Total Qty', sort: true, displayType: 'map', mapFn: qty },
    { fieldKey: 'gross_amount', name: 'Gross Amount', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'total_discount', name: 'Discount', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'net_amount', name: 'Net Amount', sort: true, displayType: 'map', mapFn: cur },
  ],
  columnar_hsn_wise: [
    { fieldKey: 'group_name', name: 'HSN Code', sort: true },
    { fieldKey: 'total_qty', name: 'Total Qty', sort: true, displayType: 'map', mapFn: qty },
    { fieldKey: 'gross_amount', name: 'Taxable Value', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'total_discount', name: 'Discount', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'cgst', name: 'CGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'sgst', name: 'SGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'igst', name: 'IGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'net_amount', name: 'Net Amount', sort: true, displayType: 'map', mapFn: cur },
  ],
  cancelled: [
    { fieldKey: 'invoice_no', name: 'Invoice No', sort: true },
    { fieldKey: 'invoice_date', name: 'Date', sort: true, displayType: 'map', mapFn: dt },
    { fieldKey: 'bill_type', name: 'Bill Type', sort: false },
    { fieldKey: 'customer_name', name: 'Customer', sort: true },
    { fieldKey: 'total_amount', name: 'Amount', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'status', name: 'Status', sort: false },
  ],
  daily_summary: [
    { fieldKey: 'date', name: 'Date', sort: true, displayType: 'map', mapFn: dt },
    { fieldKey: 'invoice_count', name: 'Invoices', sort: true },
    { fieldKey: 'gross_amount', name: 'Gross Amount', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'total_discount', name: 'Discount', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'tax_amount', name: 'Tax', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'net_amount', name: 'Net Amount', sort: true, displayType: 'map', mapFn: cur },
  ],
  daily_payment_summary: [
    { fieldKey: 'date', name: 'Date', sort: true, displayType: 'map', mapFn: dt },
    { fieldKey: 'invoice_count', name: 'Invoices', sort: true },
    { fieldKey: 'total_billed', name: 'Total Billed', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'total_collected', name: 'Collected', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'total_pending', name: 'Pending', sort: true, displayType: 'map', mapFn: cur },
  ],
  daily_tax_analysis: [
    { fieldKey: 'date', name: 'Date', sort: true, displayType: 'map', mapFn: dt },
    { fieldKey: 'taxable_amount', name: 'Taxable', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'cgst', name: 'CGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'sgst', name: 'SGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'igst', name: 'IGST', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'total_tax', name: 'Total Tax', sort: false, displayType: 'map', mapFn: cur },
  ],
  monthly_summary: [
    { fieldKey: 'month', name: 'Month', sort: true },
    { fieldKey: 'invoice_count', name: 'Invoices', sort: true },
    { fieldKey: 'gross_amount', name: 'Gross Amount', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'total_discount', name: 'Discount', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'tax_amount', name: 'Tax', sort: false, displayType: 'map', mapFn: cur },
    { fieldKey: 'net_amount', name: 'Net Amount', sort: true, displayType: 'map', mapFn: cur },
  ],
  monthly_payment_summary: [
    { fieldKey: 'month', name: 'Month', sort: true },
    { fieldKey: 'invoice_count', name: 'Invoices', sort: true },
    { fieldKey: 'total_billed', name: 'Total Billed', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'total_collected', name: 'Collected', sort: true, displayType: 'map', mapFn: cur },
    { fieldKey: 'total_pending', name: 'Pending', sort: true, displayType: 'map', mapFn: cur },
  ],
};

// Global search keys per register type — drives TaTable's inline search
export const REGISTER_TYPE_GLOBAL_SEARCH: Record<string, string[]> = {
  general:                 ['invoice_no', 'customer_name', 'city', 'salesperson', 'bill_type', 'status'],
  detailed:                ['invoice_no', 'customer_name', 'product_name', 'product_code', 'hsn_code', 'unit'],
  columnar_tax_wise:       ['invoice_no', 'customer_name'],
  columnar_product_group:  ['group_name'],
  columnar_product_category: ['group_name'],
  columnar_product_brand:  ['group_name'],
  columnar_hsn_wise:       ['group_name'],
  cancelled:               ['invoice_no', 'customer_name', 'bill_type', 'status'],
  daily_summary:           ['date'],
  daily_payment_summary:   ['date'],
  daily_tax_analysis:      ['date'],
  monthly_summary:         ['month'],
  monthly_payment_summary: ['month'],
};

// ─────────────────────────────────────────────────────────────
// Global Summary KPI Registry
// ─────────────────────────────────────────────────────────────
// The single source of truth for how every backend summary key is labelled
// and formatted in the summary strip. Reports do NOT hardcode their own strip:
// the detail view reads response.summary, looks each key up here, and renders
// — in the order defined below — only the keys the backend actually returned.
//
// Why this beats per-report config:
//   • Add a new KPI on the backend → just add one line here, every report shows it.
//   • Switch Sale Register from "General" to "Detailed" → strip re-derives itself
//     from the new keys (total_items / total_qty …) with zero report changes.
//   • A key the backend stops sending simply disappears — never an empty "—" cell.
//
// To customise a label, edit it here once. To omit a KPI from the strip
// (e.g. the CGST/SGST/IGST breakdown, which is already rolled into Tax),
// simply leave it out of this registry.
export const SUMMARY_KPI_REGISTRY: SummaryField[] = [
  // ── Counts ───────────────────────────────────────────────
  { key: 'total_invoices',            label: 'Invoices' },
  { key: 'total_items',               label: 'Line Items' },
  { key: 'total_orders',              label: 'Orders' },
  { key: 'total_challans',            label: 'Challans' },
  { key: 'total_returns',             label: 'Returns' },
  { key: 'total_credit_notes',        label: 'Credit Notes' },
  { key: 'total_debit_notes',         label: 'Debit Notes' },
  { key: 'total_records',             label: 'Records' },
  { key: 'total_customers',           label: 'Customers' },
  { key: 'total_new_customers',       label: 'New Customers' },
  { key: 'total_no_sales_customers',  label: 'No-Sale Customers' },
  { key: 'total_customers_exceeded',  label: 'Customers Exceeded' },
  { key: 'total_salespersons',        label: 'Salespersons' },
  { key: 'total_products',            label: 'Products' },
  { key: 'total_qty',                 label: 'Total Qty' },
  // ── Money ────────────────────────────────────────────────
  { key: 'total_gross',               label: 'Gross',        currency: true },
  { key: 'total_amount',              label: 'Amount',       currency: true },
  { key: 'total_revenue',             label: 'Revenue',      currency: true },
  { key: 'total_sales',               label: 'Total Sales',  currency: true },
  { key: 'total_sales_value',         label: 'Total Sales',  currency: true },
  { key: 'total_billed',              label: 'Total Billed', currency: true },
  { key: 'total_value',               label: 'Total Value',  currency: true },
  { key: 'total_taxable',             label: 'Taxable',      currency: true },
  { key: 'total_discount',            label: 'Discount',     currency: true },
  { key: 'total_tax',                 label: 'Tax',          currency: true },
  { key: 'total_net',                 label: 'Net Amount',   currency: true },
  { key: 'total_paid',                label: 'Paid',         currency: true },
  { key: 'total_collected',           label: 'Collected',    currency: true },
  { key: 'total_pending',             label: 'Pending',      currency: true },
  { key: 'total_outstanding',         label: 'Outstanding',  currency: true },
  { key: 'total_cost',                label: 'Cost',         currency: true },
  { key: 'total_profit',              label: 'Gross Profit', currency: true },
  { key: 'total_credit_amount',       label: 'Credit Total', currency: true },
  { key: 'total_debit_amount',        label: 'Debit Total',  currency: true },
  { key: 'total_exceeded_amount',     label: 'Exceeded By',  currency: true },
  { key: 'current_year_total',        label: 'Current Year', currency: true },
  { key: 'previous_year_total',       label: 'Previous Year',currency: true },
];

export const REGISTER_TYPES = [
  { value: 'general',                 label: 'General Register' },
  { value: 'detailed',                label: 'Detailed Register' },
  { value: 'columnar_tax_wise',       label: 'Columnar — Tax Wise' },
  { value: 'columnar_product_group',  label: 'Columnar — Product Group' },
  { value: 'columnar_product_category', label: 'Columnar — Product Category' },
  { value: 'columnar_product_brand',  label: 'Columnar — Brand Wise' },
  { value: 'columnar_hsn_wise',       label: 'Columnar — HSN Code Wise' },
  { value: 'cancelled',               label: 'Cancelled Voucher List' },
  { value: 'daily_summary',           label: 'Daily Sales Summary' },
  { value: 'daily_payment_summary',   label: 'Daily Payment Summary' },
  { value: 'daily_tax_analysis',      label: 'Daily Tax Analysis' },
  { value: 'monthly_summary',         label: 'Monthly Sales Summary' },
  { value: 'monthly_payment_summary', label: 'Monthly Payment Summary' },
];

// ─── 19 Report Definitions ────────────────────────────────────
export const SALES_REPORTS: SalesReportDef[] = [
  // ── 1. Sale Register ─────────────────────────────────────────
  {
    key: 'sale_register',
    name: 'Sale Register',
    description: 'Invoice-level sales register — 13 view types including daily, monthly, tax & columnar',
    category: 'Sale Register',
    apiUrl: 'reports/sales/register/',
    reportType: 'Detailed',
    pkId: 'sale_invoice_id',
    cols: REGISTER_TYPE_COLS['general'],
    globalSearch: { keys: REGISTER_TYPE_GLOBAL_SEARCH['general'] },
    defaultSort: { key: 'invoice_date', value: 'descend' },
    filters: ['dateRange', 'period', 'registerType', 'billType', 'search'],
    // Lean bar (Customer only) so the toolbar never overflows under the sidebar;
    // Bill Type / Status / etc. live in the More Filters dropdown.
    barFilters: ['customer'],
    moreFilters: ['billType', 'status', 'salesperson', 'city', 'minAmount', 'maxAmount'],
    // No summaryStrip: the strip is auto-derived from response.summary so it stays
    // correct across all 13 register types (invoice-level vs item-level KPIs differ).
    registerTypes: REGISTER_TYPES,
    registerCols: REGISTER_TYPE_COLS,
    registerGlobalSearch: REGISTER_TYPE_GLOBAL_SEARCH,
    showSummaryStrip: true,
  },

  // ── 2. Pending Sale Orders ────────────────────────────────────
  {
    key: 'pending_orders',
    name: 'Pending Sale Orders',
    description: 'Sale orders not yet completed or invoiced',
    category: 'Pending Registers',
    apiUrl: 'reports/sales/pending-orders/',
    reportType: 'Summary',
    pkId: 'sale_order_id',
    cols: [
      { fieldKey: 'order_no',       name: 'Order No',      sort: true },
      { fieldKey: 'order_date',     name: 'Order Date',    sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'delivery_date',  name: 'Delivery Date', sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'customer_name',  name: 'Customer',      sort: true },
      { fieldKey: 'sale_type',      name: 'Sale Type',     sort: false },
      { fieldKey: 'flow_status',    name: 'Flow Status',   sort: false },
      { fieldKey: 'order_status',   name: 'Status',        sort: false },
      { fieldKey: 'item_value',     name: 'Item Value',    sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'tax_amount',     name: 'Tax',           sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_amount',   name: 'Total',         sort: true, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['order_no', 'customer_name', 'sale_type', 'flow_status', 'order_status'] },
    defaultSort: { key: 'order_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    barFilters: ['customer', 'orderStatus', 'saleType'],
    moreFilters: ['flowStatus', 'minAmount', 'maxAmount'],
    summaryStrip: [
      { key: 'total_orders', label: 'Pending Orders' },
      { key: 'total_value',  label: 'Total Value', currency: true },
    ],
  },

  // ── 3. Pending Sale Challans ──────────────────────────────────
  {
    key: 'pending_challans',
    name: 'Pending Sale Challans',
    description: 'Delivery challans not yet converted to invoices',
    category: 'Pending Registers',
    apiUrl: 'reports/sales/pending-challans/',
    reportType: 'Summary',
    pkId: 'delivery_challan_id',
    cols: [
      { fieldKey: 'challan_no',      name: 'Challan No',  sort: true },
      { fieldKey: 'challan_date',    name: 'Date',        sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'customer_name',   name: 'Customer',    sort: true },
      { fieldKey: 'linked_order_no', name: 'Order No',    sort: false },
      { fieldKey: 'salesperson',     name: 'Salesperson', sort: false },
      { fieldKey: 'item_value',      name: 'Item Value',  sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'tax_amount',      name: 'Tax',         sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_amount',    name: 'Total',       sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'order_status',    name: 'Status',      sort: false },
    ],
    globalSearch: { keys: ['challan_no', 'customer_name', 'linked_order_no', 'salesperson', 'order_status'] },
    defaultSort: { key: 'challan_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    barFilters: ['customer'],
    summaryStrip: [
      { key: 'total_challans', label: 'Pending Challans' },
      { key: 'total_value',    label: 'Total Value', currency: true },
    ],
  },

  // ── 4. Sale Order Register ────────────────────────────────────
  {
    key: 'order_register',
    name: 'Sale Order Register',
    description: 'All sale orders with status and value details',
    category: 'Trading Registers',
    apiUrl: 'reports/sales/order-register/',
    reportType: 'Detailed',
    pkId: 'sale_order_id',
    cols: [
      { fieldKey: 'order_no',      name: 'Order No',      sort: true },
      { fieldKey: 'order_date',    name: 'Date',          sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'delivery_date', name: 'Delivery Date', sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'customer_name', name: 'Customer',      sort: true },
      { fieldKey: 'sale_type',     name: 'Sale Type',     sort: false },
      { fieldKey: 'flow_status',   name: 'Flow Status',   sort: false },
      { fieldKey: 'order_status',  name: 'Status',        sort: false },
      { fieldKey: 'item_value',    name: 'Item Value',    sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'tax_amount',    name: 'Tax',           sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_amount',  name: 'Total',         sort: true, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['order_no', 'customer_name', 'sale_type', 'flow_status', 'order_status'] },
    defaultSort: { key: 'order_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search', 'minAmount', 'maxAmount'],
    barFilters: ['customer', 'orderStatus', 'saleType'],
    moreFilters: ['flowStatus', 'minAmount', 'maxAmount'],
    summaryStrip: [
      { key: 'total_orders', label: 'Orders' },
      { key: 'total_value',  label: 'Total Value', currency: true },
    ],
  },

  // ── 5. Sale Challan Register ──────────────────────────────────
  {
    key: 'challan_register',
    name: 'Sale Challan Register',
    description: 'All delivery challans with conversion status',
    category: 'Trading Registers',
    apiUrl: 'reports/sales/challan-register/',
    reportType: 'Detailed',
    pkId: 'delivery_challan_id',
    cols: [
      { fieldKey: 'challan_no',      name: 'Challan No',  sort: true },
      { fieldKey: 'challan_date',    name: 'Date',        sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'customer_name',   name: 'Customer',    sort: true },
      { fieldKey: 'linked_order_no', name: 'Order No',    sort: false },
      { fieldKey: 'salesperson',     name: 'Salesperson', sort: false },
      { fieldKey: 'item_value',      name: 'Item Value',  sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'tax_amount',      name: 'Tax',         sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_amount',    name: 'Total',       sort: true, displayType: 'map', mapFn: cur },
      {
        fieldKey: 'is_converted', name: 'Converted', sort: false,
        displayType: 'map', mapFn: (v: any) => v ? 'Yes' : 'No',
      },
      { fieldKey: 'order_status', name: 'Status', sort: false },
    ],
    globalSearch: { keys: ['challan_no', 'customer_name', 'linked_order_no', 'salesperson', 'order_status'] },
    defaultSort: { key: 'challan_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    barFilters: ['customer', 'converted'],
    summaryStrip: [
      { key: 'total_challans', label: 'Challans' },
      { key: 'total_value',    label: 'Total Value', currency: true },
    ],
  },

  // ── 6. Sale Return Register ───────────────────────────────────
  {
    key: 'return_register',
    name: 'Sale Return Register',
    description: 'Sales returns with reason and linked invoices',
    category: 'Trading Registers',
    apiUrl: 'reports/sales/return-register/',
    reportType: 'Detailed',
    pkId: 'sale_return_id',
    cols: [
      { fieldKey: 'return_no',          name: 'Return No',       sort: true },
      { fieldKey: 'return_date',        name: 'Date',            sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'bill_type',          name: 'Bill Type',       sort: false },
      { fieldKey: 'customer_name',      name: 'Customer',        sort: true },
      { fieldKey: 'against_invoice_no', name: 'Against Invoice', sort: false },
      { fieldKey: 'return_reason',      name: 'Reason',          sort: false },
      { fieldKey: 'item_value',         name: 'Item Value',      sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'tax_amount',         name: 'Tax',             sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_amount',       name: 'Total',           sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'order_status',       name: 'Status',          sort: false },
    ],
    globalSearch: { keys: ['return_no', 'customer_name', 'against_invoice_no', 'return_reason', 'bill_type', 'order_status'] },
    defaultSort: { key: 'return_date', value: 'descend' },
    filters: ['dateRange', 'period', 'billType', 'search', 'minAmount'],
    barFilters: ['customer', 'billType'],
    summaryStrip: [
      { key: 'total_returns', label: 'Returns' },
      { key: 'total_value',   label: 'Total Value', currency: true },
    ],
  },

  // ── 7. Credit / Debit Note Register ──────────────────────────
  {
    key: 'credit_debit_notes',
    name: 'Credit / Debit Note Register',
    description: 'All credit and debit notes issued to customers',
    category: 'Trading Registers',
    apiUrl: 'reports/sales/credit-debit-notes/',
    reportType: 'Detailed',
    pkId: 'note_id',
    cols: [
      { fieldKey: 'note_number',        name: 'Note No',         sort: true },
      { fieldKey: 'note_type',          name: 'Type',            sort: false },
      { fieldKey: 'note_date',          name: 'Date',            sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'customer_name',      name: 'Customer',        sort: true },
      { fieldKey: 'against_invoice_no', name: 'Against Invoice', sort: false },
      { fieldKey: 'reason',             name: 'Reason',          sort: false },
      { fieldKey: 'total_amount',       name: 'Amount',          sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'order_status',       name: 'Status',          sort: false },
    ],
    globalSearch: { keys: ['note_number', 'note_type', 'customer_name', 'against_invoice_no', 'reason', 'order_status'] },
    defaultSort: { key: 'note_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    barFilters: ['customer', 'noteType'],
    summaryStrip: [
      { key: 'total_credit_notes', label: 'Credit Notes' },
      { key: 'total_debit_notes',  label: 'Debit Notes' },
      { key: 'total_amount',       label: 'Total Amount', currency: true },
    ],
  },

  // ── 8. Payment Reminder ───────────────────────────────────────
  {
    key: 'payment_reminder',
    name: 'Payment Reminder',
    description: 'Overdue invoices grouped by customer or per invoice',
    category: 'Payment & Outstanding',
    // view_type=detail → one row per invoice, matching the columns below.
    // (The backend also supports view_type=summary for a per-customer roll-up;
    //  that can be exposed later as a toggle if needed.)
    apiUrl: 'reports/sales/payment-reminder/?view_type=detail',
    reportType: 'Summary',
    pkId: 'sale_invoice_id',
    cols: [
      { fieldKey: 'invoice_no',      name: 'Invoice No',    sort: true },
      { fieldKey: 'invoice_date',    name: 'Invoice Date',  sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'due_date',        name: 'Due Date',      sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'customer_name',   name: 'Customer',      sort: true },
      { fieldKey: 'total_amount',    name: 'Total',         sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'paid_amount',     name: 'Paid',          sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'pending_amount',  name: 'Pending',       sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'days_overdue',    name: 'Days Overdue',  sort: true },
      { fieldKey: 'status',          name: 'Status',        sort: false },
    ],
    globalSearch: { keys: ['invoice_no', 'customer_name', 'status'] },
    defaultSort: { key: 'due_date', value: 'ascend' },
    filters: ['dateRange', 'period', 'viewType', 'search'],
    barFilters: ['customer'],
    moreFilters: ['city', 'minPending'],
    summaryStrip: [
      // BE returns `total_invoices` (count of all pending invoices). The old key
      // `total_overdue_invoices` never existed in the response → chip showed "—".
      { key: 'total_invoices', label: 'Pending Invoices' },
      { key: 'total_pending',  label: 'Total Pending', currency: true },
    ],
  },

  // ── 9. Customer Aging ─────────────────────────────────────────
  {
    key: 'customer_aging',
    name: 'Customer Aging',
    description: 'Outstanding balances bucketed: Current, 1-30, 31-60, 61-90, 91-120, 120+ days',
    category: 'Payment & Outstanding',
    apiUrl: 'reports/sales/customer-aging/',
    reportType: 'Grouped',
    pkId: 'customer_id',
    cols: [
      { fieldKey: 'customer_name',      name: 'Customer',         sort: true },
      { fieldKey: 'total_outstanding',  name: 'Total Outstanding',sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'current',            name: 'Current',          sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'days_1_30',          name: '1-30 Days',        sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'days_31_60',         name: '31-60 Days',       sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'days_61_90',         name: '61-90 Days',       sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'days_91_120',        name: '91-120 Days',      sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'days_120_plus',      name: '120+ Days',        sort: false, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['customer_name'] },
    defaultSort: { key: 'total_outstanding', value: 'descend' },
    filters: ['asOfDate', 'search', 'city'],
    barFilters: ['customer', 'city'],
    moreFilters: ['minPending'],
    summaryStrip: [
      { key: 'total_customers',    label: 'Customers' },
      { key: 'total_outstanding',  label: 'Total Outstanding', currency: true },
    ],
  },

  // ── 10. New Customers ─────────────────────────────────────────
  {
    key: 'new_customers',
    name: 'New Customers',
    description: 'Customers whose first invoice falls within the selected date range',
    category: 'MIS Reports',
    apiUrl: 'reports/sales/mis/new-customers/',
    reportType: 'Summary',
    pkId: 'customer_id',
    cols: [
      { fieldKey: 'customer_name',      name: 'Customer',      sort: true },
      { fieldKey: 'customer_code',      name: 'Code',          sort: false },
      { fieldKey: 'first_invoice_date', name: 'First Invoice', sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'total_invoices',     name: 'Total Invoices',sort: true },
      { fieldKey: 'total_sales_value',  name: 'Total Sales',   sort: true, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['customer_name', 'customer_code'] },
    defaultSort: { key: 'first_invoice_date', value: 'ascend' },
    filters: ['dateRange', 'period', 'search', 'city'],
    barFilters: ['city'],
    summaryStrip: [
      { key: 'total_new_customers', label: 'New Customers' },
      { key: 'total_sales_value',   label: 'Total Sales', currency: true },
    ],
  },

  // ── 11. No Sales Customers ────────────────────────────────────
  {
    key: 'no_sales_customers',
    name: 'No Sales Customers',
    description: 'Customers with no invoices in the selected period',
    category: 'MIS Reports',
    apiUrl: 'reports/sales/mis/no-sales-customers/',
    reportType: 'Summary',
    pkId: 'customer_id',
    cols: [
      { fieldKey: 'customer_name',       name: 'Customer',      sort: true },
      { fieldKey: 'customer_code',       name: 'Code',          sort: false },
      { fieldKey: 'last_invoice_date',   name: 'Last Invoice',  sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'days_since_last_sale',name: 'Days Inactive', sort: true },
    ],
    globalSearch: { keys: ['customer_name', 'customer_code'] },
    defaultSort: { key: 'days_since_last_sale', value: 'descend' },
    filters: ['dateRange', 'period', 'search', 'city'],
    barFilters: ['city'],
    summaryStrip: [
      // "No-Sale" (never bought / none in period) — distinct from the Smart
      // Insight "Dormant Customers" (lapsed >180 days). Different question;
      // keep the labels distinct so the two never look contradictory (flow.md).
      { key: 'total_no_sales_customers', label: 'No-Sale Customers' },
    ],
  },

  // ── 12. Credit Limit Exceeded ─────────────────────────────────
  {
    key: 'limit_exceeded',
    name: 'Credit Limit Exceeded',
    description: 'Customers whose outstanding balance exceeds their credit limit',
    category: 'MIS Reports',
    apiUrl: 'reports/sales/mis/limit-exceeded/',
    reportType: 'Summary',
    pkId: 'customer_id',
    cols: [
      { fieldKey: 'customer_name',     name: 'Customer',     sort: true },
      { fieldKey: 'customer_code',     name: 'Code',         sort: false },
      { fieldKey: 'credit_limit',      name: 'Credit Limit', sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_outstanding', name: 'Outstanding',  sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'exceeded_by',       name: 'Exceeded By',  sort: true, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['customer_name', 'customer_code'] },
    defaultSort: { key: 'exceeded_by', value: 'descend' },
    filters: ['search'],
    summaryStrip: [
      { key: 'total_customers_exceeded', label: 'Customers Exceeded' },
      { key: 'total_exceeded_amount',    label: 'Total Exceeded', currency: true },
    ],
  },

  // ── 13. Sales Order Analysis ──────────────────────────────────
  {
    key: 'order_analysis',
    name: 'Sales Order Analysis',
    description: 'Order completion rate and value per customer',
    category: 'MIS Reports',
    apiUrl: 'reports/sales/order-analysis/',
    reportType: 'Grouped',
    pkId: 'customer_id',
    cols: [
      { fieldKey: 'customer_name',   name: 'Customer',     sort: true },
      { fieldKey: 'total_orders',    name: 'Total Orders', sort: true },
      { fieldKey: 'completed_orders',name: 'Completed',    sort: true },
      { fieldKey: 'pending_orders',  name: 'Pending',      sort: true },
      { fieldKey: 'total_value',     name: 'Total Value',  sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'avg_order_value', name: 'Avg Value',    sort: false, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['customer_name'] },
    defaultSort: { key: 'total_value', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    barFilters: ['customer', 'orderStatus', 'saleType'],
    summaryStrip: [
      { key: 'total_customers', label: 'Customers' },
      { key: 'total_orders',    label: 'Orders' },
      { key: 'total_value',     label: 'Total Value', currency: true },
    ],
  },

  // ── 14. Product Sales Analysis ────────────────────────────────
  {
    key: 'analysis_product',
    name: 'Product Sales Analysis',
    description: 'Quantity sold, revenue, discount and avg rate per product',
    category: 'Analysis',
    apiUrl: 'reports/sales/analysis/product/',
    reportType: 'Grouped',
    pkId: 'product_id',
    cols: [
      { fieldKey: 'product_name',    name: 'Product',      sort: true },
      { fieldKey: 'product_code',    name: 'Code',         sort: false },
      { fieldKey: 'total_qty',       name: 'Total Qty',    sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'gross_amount',    name: 'Gross Amount', sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_discount',  name: 'Discount',     sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_tax',       name: 'Tax',          sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'net_amount',      name: 'Net Amount',   sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'avg_rate',        name: 'Avg Rate',     sort: false, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['product_name', 'product_code'] },
    defaultSort: { key: 'gross_amount', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    barFilters: ['productGroup', 'productCategory', 'productBrand'],
    summaryStrip: [
      { key: 'total_products', label: 'Products' },
      { key: 'total_qty',      label: 'Total Qty' },
      { key: 'total_revenue',  label: 'Revenue', currency: true },
    ],
  },

  // ── 15. Customer Sales Analysis ───────────────────────────────
  {
    key: 'analysis_customer',
    name: 'Customer Sales Analysis',
    description: 'Invoice count, revenue, collection rate per customer',
    category: 'Analysis',
    apiUrl: 'reports/sales/analysis/customer/',
    reportType: 'Grouped',
    pkId: 'customer_id',
    cols: [
      { fieldKey: 'customer_name',      name: 'Customer',     sort: true },
      { fieldKey: 'total_invoices',     name: 'Invoices',     sort: true },
      { fieldKey: 'total_amount',       name: 'Total Amount', sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_paid',         name: 'Paid',         sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_pending',      name: 'Pending',      sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'avg_invoice_value',  name: 'Avg Invoice',  sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'last_invoice_date',  name: 'Last Invoice', sort: true, displayType: 'map', mapFn: dt },
    ],
    globalSearch: { keys: ['customer_name'] },
    defaultSort: { key: 'total_amount', value: 'descend' },
    filters: ['dateRange', 'period', 'search', 'city'],
    barFilters: ['customer', 'city'],
    summaryStrip: [
      { key: 'total_customers', label: 'Customers' },
      { key: 'total_amount',    label: 'Total Amount', currency: true },
      { key: 'total_pending',   label: 'Pending',      currency: true },
    ],
  },

  // ── 16. Salesperson Performance ───────────────────────────────
  {
    key: 'analysis_salesperson',
    name: 'Salesperson Performance',
    description: 'Sales, collection and pending amounts per salesperson',
    category: 'Analysis',
    apiUrl: 'reports/sales/analysis/salesperson/',
    reportType: 'Grouped',
    pkId: 'salesperson_id',
    cols: [
      { fieldKey: 'salesperson_name', name: 'Salesperson',  sort: true },
      { fieldKey: 'total_invoices',   name: 'Invoices',     sort: true },
      { fieldKey: 'total_sales',      name: 'Total Sales',  sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_collected',  name: 'Collected',    sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_pending',    name: 'Pending',      sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'collection_pct',   name: 'Collection %', sort: true, displayType: 'map', mapFn: pct },
    ],
    globalSearch: { keys: ['salesperson_name'] },
    defaultSort: { key: 'total_sales', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    barFilters: ['salesperson'],
    summaryStrip: [
      { key: 'total_salespersons', label: 'Salespersons' },
      { key: 'total_sales',        label: 'Total Sales', currency: true },
      { key: 'total_collected',    label: 'Collected',   currency: true },
    ],
  },

  // ── 17. Profit Margin ─────────────────────────────────────────
  {
    key: 'profit_margin',
    name: 'Profit Margin Analysis',
    description: 'Revenue vs purchase cost and gross margin % per product',
    category: 'Analysis',
    apiUrl: 'reports/sales/profit-margin/',
    reportType: 'Grouped',
    pkId: 'product_id',
    cols: [
      { fieldKey: 'product_name',  name: 'Product',      sort: true },
      { fieldKey: 'product_code',  name: 'Code',         sort: false },
      { fieldKey: 'total_qty',     name: 'Qty',          sort: true, displayType: 'map', mapFn: qty },
      { fieldKey: 'total_revenue', name: 'Revenue',      sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_cost',    name: 'Cost',         sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'gross_profit',  name: 'Gross Profit', sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'margin_pct',    name: 'Margin %',     sort: true, displayType: 'map', mapFn: pct },
    ],
    globalSearch: { keys: ['product_name', 'product_code'] },
    defaultSort: { key: 'gross_profit', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    barFilters: ['productGroup', 'productCategory', 'productBrand'],
    summaryStrip: [
      { key: 'total_products', label: 'Products' },
      { key: 'total_revenue',  label: 'Revenue',      currency: true },
      { key: 'total_profit',   label: 'Gross Profit', currency: true },
    ],
  },

  // ── 18. Sales Trend (YoY) ─────────────────────────────────────
  {
    key: 'sales_trend',
    name: 'Sales Trend (YoY)',
    description: 'Year-over-year monthly or quarterly sales comparison',
    category: 'Analysis',
    apiUrl: 'reports/sales/sales-trend/',
    reportType: 'Grouped',
    pkId: 'period',
    cols: [
      { fieldKey: 'period',               name: 'Period',        sort: false },
      { fieldKey: 'current_year_sales',   name: 'Current Year',  sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'previous_year_sales',  name: 'Previous Year', sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'growth_amount',        name: 'Growth ₹',      sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'growth_pct',           name: 'Growth %',      sort: false, displayType: 'map', mapFn: pct },
    ],
    globalSearch: { keys: ['period'] },
    filters: ['compareType', 'currentYear', 'previousYear'],
    summaryStrip: [
      { key: 'current_year_total',  label: 'Current Year',  currency: true },
      { key: 'previous_year_total', label: 'Previous Year', currency: true },
    ],
  },

  // ── 19. GST Summary ───────────────────────────────────────────
  {
    key: 'gst_summary',
    name: 'GST Summary',
    description: 'CGST, SGST and IGST breakdown per invoice',
    category: 'Analysis',
    apiUrl: 'reports/sales/tax/gst-summary/',
    reportType: 'Detailed',
    pkId: 'invoice_no',
    cols: [
      { fieldKey: 'invoice_no',      name: 'Invoice No',  sort: true },
      { fieldKey: 'invoice_date',    name: 'Date',        sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'customer_name',   name: 'Customer',    sort: true },
      { fieldKey: 'taxable_amount',  name: 'Taxable',     sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'cgst',            name: 'CGST',        sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'sgst',            name: 'SGST',        sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'igst',            name: 'IGST',        sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_tax',       name: 'Total Tax',   sort: false, displayType: 'map', mapFn: cur },
      { fieldKey: 'net_amount',      name: 'Net Amount',  sort: true, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['invoice_no', 'customer_name'] },
    defaultSort: { key: 'invoice_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    barFilters: ['customer'],
    summaryStrip: [
      { key: 'total_invoices', label: 'Invoices' },
      { key: 'total_taxable',  label: 'Taxable',   currency: true },
      { key: 'total_tax',      label: 'Total Tax', currency: true },
    ],
  },
];

// ─── Category helpers ─────────────────────────────────────────
export const CATEGORY_ORDER: ReportCategory[] = [
  'Sale Register', 'Pending Registers', 'Trading Registers',
  'Payment & Outstanding', 'MIS Reports', 'Analysis',
];

export const CATEGORY_TAG_COLOR: Record<ReportCategory, string> = {
  'Sale Register':         '#1890ff',
  'Pending Registers':     '#fa8c16',
  'Trading Registers':     '#722ed1',
  'Payment & Outstanding': '#f5222d',
  'MIS Reports':           '#52c41a',
  'Analysis':              '#13c2c2',
};

export const PERIOD_OPTIONS = [
  { value: '',               label: 'Custom Range' },
  { value: 'today',          label: 'Today' },
  { value: 'this_week',      label: 'This Week' },
  { value: 'current_month',  label: 'Current Month' },
  { value: 'last_month',     label: 'Last Month' },
  { value: 'current_quarter',label: 'Current Quarter' },
  { value: 'current_year',   label: 'Current Year' },
  { value: 'last_year',      label: 'Last Year' },
];

export const BILL_TYPE_OPTIONS = [
  { value: '',       label: 'All Types' },
  { value: 'CASH',   label: 'Cash' },
  { value: 'CREDIT', label: 'Credit' },
  { value: 'OTHERS', label: 'Others' },
];

export const VIEW_TYPE_OPTIONS = [
  { value: 'detail',  label: 'Detail View' },
  { value: 'summary', label: 'Customer Summary' },
];

export const COMPARE_TYPE_OPTIONS = [
  { value: 'monthly',   label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];
