// ─────────────────────────────────────────────────────────────────────────────
// Master Reports Catalog — single source of truth for ALL report modules
// Sales reports are 'active' (full detail view); others are 'coming_soon'
// ─────────────────────────────────────────────────────────────────────────────

export type ReportModule =
  | 'Sales'
  | 'Purchase'
  | 'Finance'
  | 'Customer'
  | 'Vendor'
  | 'Production'
  | 'GST'
  | 'Inventory';

export interface MasterReportDef {
  key: string;
  name: string;
  description: string;
  module: ReportModule;
  reportType: 'Summary' | 'Detailed' | 'Grouped';
  status: 'active' | 'coming_soon';
  // Which config holds the active report definition. Defaults to 'sales'.
  source?: 'sales' | 'purchase' | 'inventory' | 'production' | 'finance' | 'gst';
  // Key into the source config (SALES_REPORTS or PURCHASE_REPORTS) by SalesReportDef.key.
  salesReportKey?: string;
}

export interface ModuleMeta {
  color: string;
  bgColor: string;
  icon: string;
  route: string;
}

export const MODULE_META: Record<ReportModule, ModuleMeta> = {
  Sales:      { color: '#1890ff', bgColor: '#e6f7ff', icon: 'rise',          route: 'reports/sales-reports' },
  Purchase:   { color: '#fa8c16', bgColor: '#fff7e6', icon: 'shopping-cart', route: 'reports/purchase-reports' },
  Finance:    { color: '#52c41a', bgColor: '#f6ffed', icon: 'bank',          route: 'reports/ledgers-reports' },
  Customer:   { color: '#722ed1', bgColor: '#f9f0ff', icon: 'team',          route: 'reports/customer-reports' },
  Vendor:     { color: '#13c2c2', bgColor: '#e6fffb', icon: 'shop',          route: 'reports/vendor-reports' },
  Production: { color: '#f5222d', bgColor: '#fff1f0', icon: 'tool',          route: 'reports/production-reports' },
  GST:        { color: '#eb2f96', bgColor: '#fff0f6', icon: 'percentage',    route: 'reports/gst-reports' },
  Inventory:  { color: '#faad14', bgColor: '#fffbe6', icon: 'database',      route: 'reports/inventory-reports' },
};

export const MODULE_ORDER: (ReportModule | 'All')[] = [
  'All', 'Sales', 'Purchase', 'Finance', 'Customer',
  'Vendor', 'Production', 'GST', 'Inventory',
];

// ─────────────────────────────────────────────────────────────────────────────
// ALL REPORTS — 71 total across 8 modules
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_REPORTS: MasterReportDef[] = [

  // ── SALES (19) — fully active ─────────────────────────────────────────────
  {
    key: 'sale_register',
    name: 'Sale Register',
    description: 'Invoice-level register — 13 view types including daily, monthly & tax columnar',
    module: 'Sales', reportType: 'Detailed', status: 'active', salesReportKey: 'sale_register',
  },
  {
    key: 'pending_orders',
    name: 'Pending Sale Orders',
    description: 'Sale orders not yet completed or converted to invoice',
    module: 'Sales', reportType: 'Summary', status: 'active', salesReportKey: 'pending_orders',
  },
  {
    key: 'pending_challans',
    name: 'Pending Challans',
    description: 'Delivery challans not yet converted to invoice',
    module: 'Sales', reportType: 'Summary', status: 'active', salesReportKey: 'pending_challans',
  },
  {
    key: 'order_register',
    name: 'Sale Order Register',
    description: 'Complete register of all sale orders with status and value',
    module: 'Sales', reportType: 'Detailed', status: 'active', salesReportKey: 'order_register',
  },
  {
    key: 'challan_register',
    name: 'Challan Register',
    description: 'Delivery challans register with conversion status',
    module: 'Sales', reportType: 'Detailed', status: 'active', salesReportKey: 'challan_register',
  },
  {
    key: 'return_register',
    name: 'Sale Return Register',
    description: 'Sales return orders with reason and credit amounts',
    module: 'Sales', reportType: 'Detailed', status: 'active', salesReportKey: 'return_register',
  },
  {
    key: 'credit_debit_notes',
    name: 'Credit / Debit Notes',
    description: 'Combined register of all credit and debit notes raised',
    module: 'Sales', reportType: 'Detailed', status: 'active', salesReportKey: 'credit_debit_notes',
  },
  {
    key: 'payment_reminder',
    name: 'Payment Reminder',
    description: 'Customers with pending dues — summary or invoice-level detail',
    module: 'Sales', reportType: 'Summary', status: 'active', salesReportKey: 'payment_reminder',
  },
  {
    key: 'customer_aging',
    name: 'Customer Aging',
    description: 'Outstanding receivables bucketed 0-30, 31-60, 61-90, 120+ days',
    module: 'Sales', reportType: 'Grouped', status: 'active', salesReportKey: 'customer_aging',
  },
  {
    key: 'new_customers',
    name: 'New Customers (MIS)',
    description: 'Customers whose first invoice falls within the selected date range',
    module: 'Sales', reportType: 'Summary', status: 'active', salesReportKey: 'new_customers',
  },
  {
    key: 'no_sales_customers',
    name: 'No Sales Customers (MIS)',
    description: 'Active customers with no invoices in the selected period',
    module: 'Sales', reportType: 'Summary', status: 'active', salesReportKey: 'no_sales_customers',
  },
  {
    key: 'limit_exceeded',
    name: 'Credit Limit Exceeded (MIS)',
    description: 'Customers whose outstanding exceeds their approved credit limit',
    module: 'Sales', reportType: 'Summary', status: 'active', salesReportKey: 'limit_exceeded',
  },
  {
    key: 'order_analysis',
    name: 'Sales Order Analysis',
    description: 'Order count, completed vs pending and total value per customer',
    module: 'Sales', reportType: 'Grouped', status: 'active', salesReportKey: 'order_analysis',
  },
  {
    key: 'analysis_product',
    name: 'Product Sales Analysis',
    description: 'Quantity sold, revenue and average rate per product',
    module: 'Sales', reportType: 'Grouped', status: 'active', salesReportKey: 'analysis_product',
  },
  {
    key: 'analysis_customer',
    name: 'Customer Sales Analysis',
    description: 'Invoice count, revenue and collection rate per customer',
    module: 'Sales', reportType: 'Grouped', status: 'active', salesReportKey: 'analysis_customer',
  },
  {
    key: 'analysis_salesperson',
    name: 'Salesperson Performance',
    description: 'Sales, collection and pending amounts per salesperson',
    module: 'Sales', reportType: 'Grouped', status: 'active', salesReportKey: 'analysis_salesperson',
  },
  {
    key: 'profit_margin',
    name: 'Profit Margin Analysis',
    description: 'Revenue vs purchase cost and gross margin % per product',
    module: 'Sales', reportType: 'Grouped', status: 'active', salesReportKey: 'profit_margin',
  },
  {
    key: 'sales_trend',
    name: 'Sales Trend (YoY)',
    description: 'Year-over-year monthly or quarterly sales comparison',
    module: 'Sales', reportType: 'Grouped', status: 'active', salesReportKey: 'sales_trend',
  },
  {
    key: 'gst_summary_sales',
    name: 'GST Summary (Sales)',
    description: 'CGST, SGST and IGST breakdown per sale invoice',
    module: 'Sales', reportType: 'Detailed', status: 'active', salesReportKey: 'gst_summary',
  },

  // ── PURCHASE (9) — Purchase Register active; rest coming soon ──────────────
  {
    key: 'purchase_register',
    name: 'Purchase Register',
    description: 'Invoice-level purchase register — 13 view types (general, detailed, columnar tax/HSN, daily & monthly)',
    module: 'Purchase', reportType: 'Detailed', status: 'active',
    source: 'purchase', salesReportKey: 'purchase_register',
  },
  {
    key: 'pending_purchase_orders',
    name: 'Pending Purchase Orders',
    description: 'Purchase orders not yet completed',
    module: 'Purchase', reportType: 'Summary', status: 'active',
    source: 'purchase', salesReportKey: 'pending_purchase_orders',
  },
  {
    key: 'purchase_order_register',
    name: 'Purchase Order Register',
    description: 'All purchase orders with status and value',
    module: 'Purchase', reportType: 'Detailed', status: 'active',
    source: 'purchase', salesReportKey: 'purchase_order_register',
  },
  {
    key: 'purchase_return_register',
    name: 'Purchase Return Register',
    description: 'All purchase returns with reason and value',
    module: 'Purchase', reportType: 'Detailed', status: 'active',
    source: 'purchase', salesReportKey: 'purchase_return_register',
  },
  {
    key: 'bill_payment_register',
    name: 'Bill Payment Register',
    description: 'All payments made to vendors with method and status',
    module: 'Purchase', reportType: 'Detailed', status: 'active',
    source: 'purchase', salesReportKey: 'bill_payment_register',
  },
  {
    key: 'vendor_outstanding_purchase',
    name: 'Vendor Outstanding',
    description: 'Purchase invoices with pending payables and days overdue',
    module: 'Purchase', reportType: 'Summary', status: 'active',
    source: 'purchase', salesReportKey: 'vendor_outstanding',
  },
  {
    key: 'vendor_aging_purchase',
    name: 'Vendor Aging',
    description: 'Payables bucketed by overdue days, per vendor',
    module: 'Purchase', reportType: 'Grouped', status: 'active',
    source: 'purchase', salesReportKey: 'vendor_aging',
  },
  {
    key: 'purchase_analysis_vendor',
    name: 'Purchase Analysis — Vendor',
    description: 'Spend, paid and pending grouped by vendor',
    module: 'Purchase', reportType: 'Grouped', status: 'active',
    source: 'purchase', salesReportKey: 'purchase_analysis_vendor',
  },
  {
    key: 'purchase_analysis_product',
    name: 'Purchase Analysis — Product',
    description: 'Quantity bought, cost and tax per product',
    module: 'Purchase', reportType: 'Grouped', status: 'active',
    source: 'purchase', salesReportKey: 'purchase_analysis_product',
  },
  {
    key: 'gst_input_summary',
    name: 'GST Input Summary',
    description: 'Input tax credit (CGST/SGST/IGST) per purchase invoice',
    module: 'Purchase', reportType: 'Detailed', status: 'active',
    source: 'purchase', salesReportKey: 'gst_input_summary',
  },
  {
    key: 'purchase_price_variance',
    name: 'Purchase Price Variance',
    description: 'Overspend vs the best available vendor rate, per product',
    module: 'Purchase', reportType: 'Grouped', status: 'active',
    source: 'purchase', salesReportKey: 'purchase_price_variance',
  },
  {
    key: 'stock_replenishment',
    name: 'Stock Replenishment',
    description: 'Items at/below reorder level needing a purchase, with best vendor',
    module: 'Purchase', reportType: 'Summary', status: 'active',
    source: 'purchase', salesReportKey: 'stock_replenishment',
  },

  // ── FINANCE (13) — coming soon ────────────────────────────────────────────
  {
    key: 'bank_book',
    name: 'Bank Book',
    description: 'All bank transactions with running balance per bank account',
    module: 'Finance', reportType: 'Detailed', status: 'active',
    source: 'finance', salesReportKey: 'bank_book',
  },
  {
    key: 'cash_book',
    name: 'Cash Book',
    description: 'Cash receipts and payments with running balance',
    module: 'Finance', reportType: 'Detailed', status: 'active',
    source: 'finance', salesReportKey: 'cash_book',
  },
  {
    key: 'general_ledger',
    name: 'General Ledger',
    description: 'Every debit/credit line with voucher, account and party',
    module: 'Finance', reportType: 'Detailed', status: 'active',
    source: 'finance', salesReportKey: 'general_ledger',
  },
  {
    key: 'trial_balance',
    name: 'Trial Balance',
    description: 'Total debit, credit and net balance per ledger account',
    module: 'Finance', reportType: 'Summary', status: 'active',
    source: 'finance', salesReportKey: 'trial_balance',
  },
  {
    key: 'profit_loss',
    name: 'Profit & Loss Statement',
    description: 'Income vs expenses per ledger account with net profit/loss',
    module: 'Finance', reportType: 'Summary', status: 'active',
    source: 'finance', salesReportKey: 'profit_loss',
  },
  {
    key: 'balance_sheet',
    name: 'Balance Sheet',
    description: 'Assets and liabilities position per ledger account',
    module: 'Finance', reportType: 'Summary', status: 'active',
    source: 'finance', salesReportKey: 'balance_sheet',
  },
  {
    key: 'cash_flow',
    name: 'Cash Flow Forecast',
    description: 'Week-by-week projected cash inflow vs outflow for the next 90 days',
    module: 'Finance', reportType: 'Summary', status: 'active',
    source: 'finance', salesReportKey: 'cash_flow',
  },
  {
    key: 'journal_entry_report',
    name: 'Journal Register',
    description: 'All journal vouchers with date, type and reference',
    module: 'Finance', reportType: 'Detailed', status: 'active',
    source: 'finance', salesReportKey: 'journal_register',
  },
  {
    key: 'journal_book',
    name: 'Journal Book',
    description: 'Manual journal vouchers, line-by-line with debit/credit',
    module: 'Finance', reportType: 'Detailed', status: 'active',
    source: 'finance', salesReportKey: 'journal_book',
  },
  {
    key: 'account_ledger',
    name: 'Account Ledger',
    description: 'Transaction-level ledger for any account with running balance',
    module: 'Finance', reportType: 'Detailed', status: 'active',
    source: 'finance', salesReportKey: 'account_ledger',
  },

  // ── CUSTOMER ──────────────────────────────────────────────────────────────
  {
    key: 'customer_ledger',
    name: 'Customer Ledger',
    description: 'Each customer\'s debit/credit lines with running balance',
    module: 'Customer', reportType: 'Detailed', status: 'active',
    source: 'finance', salesReportKey: 'customer_ledger',
  },

  // ── VENDOR ────────────────────────────────────────────────────────────────
  {
    key: 'vendor_ledger',
    name: 'Vendor Ledger',
    description: 'Each vendor\'s debit/credit lines with running balance',
    module: 'Vendor', reportType: 'Detailed', status: 'active',
    source: 'finance', salesReportKey: 'vendor_ledger',
  },
  {
    key: 'vendor_performance',
    name: 'Vendor Performance',
    description: 'Price / delivery / quality scorecard per vendor',
    module: 'Vendor', reportType: 'Grouped', status: 'active',
    source: 'purchase', salesReportKey: 'vendor_performance',
  },

  // ── PRODUCTION — Material flow + Work Orders + BOM active (Machine has no data) ──
  {
    key: 'material_issue_register',
    name: 'Material Issue Register',
    description: 'Raw material issued to production floors',
    module: 'Production', reportType: 'Detailed', status: 'active',
    source: 'production', salesReportKey: 'material_issue_register',
  },
  {
    key: 'material_received_register',
    name: 'Material Received Register',
    description: 'Finished / semi-finished goods received from production',
    module: 'Production', reportType: 'Detailed', status: 'active',
    source: 'production', salesReportKey: 'material_received_register',
  },
  {
    key: 'work_order_status',
    name: 'Work Order Status',
    description: 'All work orders with quantity, completed and balance',
    module: 'Production', reportType: 'Summary', status: 'active',
    source: 'production', salesReportKey: 'work_order_status',
  },
  {
    key: 'production_summary',
    name: 'Production Summary',
    description: 'Work orders grouped by production status',
    module: 'Production', reportType: 'Grouped', status: 'active',
    source: 'production', salesReportKey: 'production_summary',
  },
  {
    key: 'bill_of_materials',
    name: 'Bill of Materials',
    description: 'BOM component lines with quantity and cost',
    module: 'Production', reportType: 'Detailed', status: 'active',
    source: 'production', salesReportKey: 'bom_report',
  },
  {
    key: 'raw_material_consumption',
    name: 'Raw Material Consumption',
    description: 'Total raw material consumed (issued) grouped by product',
    module: 'Production', reportType: 'Grouped', status: 'active',
    source: 'production', salesReportKey: 'raw_material_consumption',
  },

  // ── GST ───────────────────────────────────────────────────────────────────
  {
    key: 'gstr3b',
    name: 'GSTR-3B (Tax Liability)',
    description: 'Net GST payable for the period: output tax − input tax credit',
    module: 'GST', reportType: 'Summary', status: 'active',
    source: 'gst', salesReportKey: 'gstr3b',
  },

  // ── INVENTORY ─────────────────────────────────────────────────────────────
  {
    key: 'stock_summary',
    name: 'Stock Summary',
    description: 'Current stock per product with reorder levels and status',
    module: 'Inventory', reportType: 'Summary', status: 'active',
    source: 'inventory', salesReportKey: 'stock_summary',
  },
  {
    key: 'stock_valuation',
    name: 'Stock Valuation Report',
    description: 'Current stock quantity and value at cost and sale rate per item',
    module: 'Inventory', reportType: 'Summary', status: 'active',
    source: 'inventory', salesReportKey: 'stock_valuation',
  },
  {
    key: 'godown_wise_stock',
    name: 'Godown-wise Stock',
    description: 'Current stock quantity per item across all warehouses',
    module: 'Inventory', reportType: 'Grouped', status: 'active',
    source: 'inventory', salesReportKey: 'godown_stock',
  },
  {
    key: 'slow_moving',
    name: 'Slow Moving Items',
    description: 'In-stock items with no sales in the selected period',
    module: 'Inventory', reportType: 'Summary', status: 'active',
    source: 'inventory', salesReportKey: 'slow_moving',
  },
  {
    key: 'fast_moving',
    name: 'Fast Moving Items',
    description: 'Top items by quantity sold in the selected period',
    module: 'Inventory', reportType: 'Summary', status: 'active',
    source: 'inventory', salesReportKey: 'fast_moving',
  },
  {
    key: 'stock_forecast',
    name: 'Stock Forecast Report',
    description: 'Current stock vs average demand — Critical / Warning / Healthy',
    module: 'Inventory', reportType: 'Summary', status: 'active',
    source: 'inventory', salesReportKey: 'stock_forecast',
  },
  {
    key: 'stock_movement',
    name: 'Stock Movement Report',
    description: 'Stock-in (Receive) and stock-out (Issue) ledger entries per item',
    module: 'Inventory', reportType: 'Detailed', status: 'active',
    source: 'inventory', salesReportKey: 'stock_movement',
  },
  {
    key: 'reorder_level',
    name: 'Reorder Level Report',
    description: 'Items at or below defined reorder level requiring replenishment',
    module: 'Inventory', reportType: 'Summary', status: 'active',
    source: 'inventory', salesReportKey: 'reorder_level',
  },
];
