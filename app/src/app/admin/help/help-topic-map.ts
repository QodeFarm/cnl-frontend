/**
 * Maps a screen's route `moduleName` (and, as a fallback, its `sectionName`)
 * to a help topic id from help-content.ts.
 *
 * Used by the context-aware top-bar help button. Screens not listed here open
 * the User Guide home — never the wrong topic. The per-form <app-help-icon>
 * passes its topic id directly, so it does not depend on this map.
 */
export const HELP_TOPIC_MAP: Record<string, string> = {
  // Dashboard
  dashboard: 'dashboard-overview',

  // Masters
  customers: 'customers',
  vendors: 'vendors',
  products: 'products',
  warehouses: 'warehouses',
  quickpacks: 'quickpacks',

  // Sales
  Sales: 'sale-order',
  'sales-invoice': 'sales-invoice',
  'sales-dispatch': 'sales-dispatch',
  'payment-receipt': 'sales-payment-receipt',
  'sales-return': 'sales-returns-notes',
  'credit-note': 'sales-returns-notes',
  'debit-note': 'sales-returns-notes',
  'delivery-challan': 'sales-dispatch',
  'sale-receipt': 'sales-dispatch',

  // Purchase
  purchase: 'purchase-order',
  purchaseinvoice: 'purchase-invoice',
  purchasereturns: 'purchase-return',
  billpayments: 'bill-payment',

  // Finance
  finance: 'finance-overview',

  // Inventory
  inventory: 'inventory-stock',
  stockjournal: 'stock-journal',

  // Production
  production: 'production-overview',
  bom: 'production-bom',
  machines: 'production-overview',
  workorderboard: 'work-order-board',
  'material-issue': 'material-issue',
  'material-received': 'material-received',
  'stock-summary': 'stock-summary',

  // HRMS
  employees: 'hrms-employee',
  'employee-salary': 'hrms-salary',
  'employee-leaves': 'hrms-leaves',
  'leave-approvals': 'hrms-leaves',
  'employee-leave-balance': 'hrms-leaves',
  'employee-attendance': 'hrms-attendance',
  swipes: 'hrms-swipes',
  timesheets: 'hrms-timesheets',
  'timesheet-approvals': 'hrms-timesheet-approvals',
  'billable-hours': 'hrms-billable-hours',

  // Leads / Assets / Tasks
  leads: 'leads-overview',
  assets: 'assets-register',
  'asset-maintenance': 'asset-maintenance',
  tasks: 'tasks',

  // Settings (gear menu)
  company: 'company',
  branches: 'branches',
  'company-settings': 'company-settings',
  customfields: 'custom-fields',
  reminders: 'reminders-setup',
  workflow: 'workflow',
  'document-print-settings': 'document-print-settings',
  users: 'users',
  'user roles': 'user-roles',

  // Profile
  profile: 'my-profile',
  'change-password': 'change-password',
};

/** Resolve a help topic id for the active screen, or null to open the home. */
export function resolveHelpTopic(moduleName?: string | null, sectionName?: string | null): string | null {
  if (moduleName && HELP_TOPIC_MAP[moduleName]) { return HELP_TOPIC_MAP[moduleName]; }
  if (sectionName && HELP_TOPIC_MAP[sectionName]) { return HELP_TOPIC_MAP[sectionName]; }
  return null;
}
