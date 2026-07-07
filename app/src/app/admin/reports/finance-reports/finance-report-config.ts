// ─────────────────────────────────────────────────────────────
// Finance Report Config — double-entry ledger (LedgerAccounts + JournalEntry).
// Reuses the shared SalesReportDef shape + formatters. Field names are the REAL
// finance response keys (verified against the backend finance views).
// ─────────────────────────────────────────────────────────────

import { SalesReportDef, cur, dt } from '../sales-reports/sales-report-config';

// ─── Ledger cell helpers (used by Journal Book / Customer & Vendor Ledger) ───
// esc: escape DB text before it goes into an [innerHTML] cell, so names with
// <, >, & (e.g. "A&B Traders", "Sales <Export>") are not mangled by the sanitizer.
const esc = (s: any): string => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// led: ledger amount — blank for 0/empty (a real ledger leaves the unused side blank).
const led = (v: any): string => (Number(v) ? cur(v) : '');
// bal: running balance with Dr/Cr; honest "—" on null/NaN (never "₹NaN").
const bal = (v: any): string => {
  const n = Number(v);
  if (v == null || !Number.isFinite(n)) return '—';
  if (n === 0) return cur(0);              // zero is neither Dr nor Cr
  return cur(Math.abs(n)) + (n > 0 ? ' Dr' : ' Cr');
};
// particulars: account (bold) + voucher · narration (muted) — for ledger statements.
const particulars = (v: any, row: any): string => {
  let h = v ? `<strong>${esc(v)}</strong>` : '';
  const sub = [row?.voucher_no, row?.description].filter((x: any) => x).map(esc).join(' · ');
  if (sub) h += `<br><span class="rpt-narration">${sub}</span>`;
  return h || '—';
};
// particularsGL: account (bold) + party · narration — for the General Ledger
// (the flat "every line" journal; voucher is its own column there).
const particularsGL = (v: any, row: any): string => {
  let h = v ? `<strong>${esc(v)}</strong>` : '';
  const sub = [row?.party, row?.description].filter((x: any) => x).map(esc).join(' · ');
  if (sub) h += `<br><span class="rpt-narration">${sub}</span>`;
  return h || '—';
};

export const FINANCE_REPORTS: SalesReportDef[] = [
  // ── General Ledger (Journal Book) ────────────────────────────
  {
    key: 'general_ledger',
    name: 'General Ledger',
    description: 'Every debit/credit line with voucher, account and party',
    category: 'Sale Register',
    apiUrl: 'reports/finance/general-ledger/',
    reportType: 'Detailed',
    pkId: 'journal_entry_line_id',
    cols: [
      { fieldKey: 'entry_date',   name: 'Date',       sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'voucher_no',   name: 'Voucher No', sort: true },
      { fieldKey: 'account',      name: 'Particulars', sort: false, displayType: 'map', mapFn: particularsGL },
      { fieldKey: 'debit',        name: 'Debit (₹)',  sort: true, displayType: 'map', mapFn: led },
      { fieldKey: 'credit',       name: 'Credit (₹)', sort: true, displayType: 'map', mapFn: led },
    ],
    globalSearch: { keys: ['voucher_no', 'account', 'party', 'description'] },
    defaultSort: { key: 'created_at', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    barFilters: ['customer'],
  },

  // ── Trial Balance ────────────────────────────────────────────
  {
    key: 'trial_balance',
    name: 'Trial Balance',
    description: 'Total debit, credit and net balance per ledger account',
    category: 'Sale Register',
    apiUrl: 'reports/finance/trial-balance/',
    reportType: 'Grouped',
    pkId: 'account_id',
    cols: [
      { fieldKey: 'account',       name: 'Account',      sort: true },
      { fieldKey: 'account_code',  name: 'Code',         sort: false },
      { fieldKey: 'total_debit',   name: 'Total Debit',  sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_credit',  name: 'Total Credit', sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'balance',       name: 'Balance',      sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'balance_type',  name: 'Dr/Cr',        sort: false },
    ],
    globalSearch: { keys: ['account', 'account_code'] },
    defaultSort: { key: 'account', value: 'ascend' },
    filters: ['search'],
    showDateFilters: false,
  },

  // ── Customer Ledger (party sub-ledger with running balance) ──
  {
    key: 'customer_ledger',
    name: 'Customer Ledger',
    description: 'Each customer\'s debit/credit lines with running balance',
    category: 'Sale Register',
    apiUrl: 'reports/finance/customer-ledger/',
    reportType: 'Detailed',
    pkId: 'journal_entry_line_id',
    cols: [
      // Customer shown ONCE per group (bold); Particulars stacks account + voucher·narration;
      // Balance shows Dr/Cr — the classic clean ledger statement (renders via [innerHTML]).
      { fieldKey: 'party', name: 'Customer', sort: false, displayType: 'map',
        mapFn: (v: any) => v ? `<strong>${esc(v)}</strong>` : '' },
      { fieldKey: 'entry_date', name: 'Date', sort: false, displayType: 'map', mapFn: dt },
      { fieldKey: 'account', name: 'Particulars', sort: false, displayType: 'map', mapFn: particulars },
      { fieldKey: 'debit',  name: 'Debit (₹)',  sort: false, displayType: 'map', mapFn: led },
      { fieldKey: 'credit', name: 'Credit (₹)', sort: false, displayType: 'map', mapFn: led },
      { fieldKey: 'running_balance', name: 'Balance', sort: false, displayType: 'map', mapFn: bal },
    ],
    globalSearch: { keys: ['voucher_no', 'party', 'account', 'description'] },
    defaultSort: { key: 'entry_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    barFilters: ['customer'],
    summaryStrip: [
      { key: 'total_parties', label: 'Customers' },
      { key: 'total_debit',   label: 'Total Debit',  currency: true },
      { key: 'total_credit',  label: 'Total Credit', currency: true },
    ],
  },

  // ── Vendor Ledger (party sub-ledger with running balance) ────
  {
    key: 'vendor_ledger',
    name: 'Vendor Ledger',
    description: 'Each vendor\'s debit/credit lines with running balance',
    category: 'Sale Register',
    apiUrl: 'reports/finance/vendor-ledger/',
    reportType: 'Detailed',
    pkId: 'journal_entry_line_id',
    cols: [
      // Vendor shown ONCE per group (bold); Particulars stacks account + voucher·narration;
      // Balance shows Dr/Cr — the classic clean ledger statement (renders via [innerHTML]).
      { fieldKey: 'party', name: 'Vendor', sort: false, displayType: 'map',
        mapFn: (v: any) => v ? `<strong>${esc(v)}</strong>` : '' },
      { fieldKey: 'entry_date', name: 'Date', sort: false, displayType: 'map', mapFn: dt },
      { fieldKey: 'account', name: 'Particulars', sort: false, displayType: 'map', mapFn: particulars },
      { fieldKey: 'debit',  name: 'Debit (₹)',  sort: false, displayType: 'map', mapFn: led },
      { fieldKey: 'credit', name: 'Credit (₹)', sort: false, displayType: 'map', mapFn: led },
      { fieldKey: 'running_balance', name: 'Balance', sort: false, displayType: 'map', mapFn: bal },
    ],
    globalSearch: { keys: ['voucher_no', 'party', 'account', 'description'] },
    defaultSort: { key: 'entry_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    barFilters: ['vendor'],
    summaryStrip: [
      { key: 'total_parties', label: 'Vendors' },
      { key: 'total_debit',   label: 'Total Debit',  currency: true },
      { key: 'total_credit',  label: 'Total Credit', currency: true },
    ],
  },

  // ── Journal Book (manual journal vouchers) ───────────────────
  {
    key: 'journal_book',
    name: 'Journal Book',
    description: 'Manual journal vouchers, line-by-line with debit/credit',
    category: 'Sale Register',
    apiUrl: 'reports/finance/journal-book/',
    reportType: 'Detailed',
    pkId: 'journal_voucher_line_id',
    cols: [
      // Voucher No & Date show ONCE per voucher (backend blanks repeat lines),
      // so sorting is off — rows stay grouped per voucher like a journal book.
      { fieldKey: 'voucher_no',   name: 'Voucher No', sort: false },
      { fieldKey: 'voucher_date', name: 'Date',       sort: false, displayType: 'map', mapFn: (v: any) => v ? dt(v) : '' },
      // Particulars = account (bold) + party + auto-narration, stacked. Renders via
      // TaTable's [innerHTML]; Angular sanitises it (CLAUDE gotcha #10).
      { fieldKey: 'account', name: 'Particulars', sort: false, displayType: 'map',
        mapFn: (v: any, row: any) => {
          let h = v ? `<strong>${esc(v)}</strong>` : '';
          if (row?.party) h += `<br>${esc(row.party)}`;
          if (row?.narration) h += `<br><span class="rpt-narration">${esc(row.narration)}</span>`;
          return h || '—';
        } },
      { fieldKey: 'debit',  name: 'Debit (₹)',  sort: false, displayType: 'map', mapFn: led },
      { fieldKey: 'credit', name: 'Credit (₹)', sort: false, displayType: 'map', mapFn: led },
    ],
    globalSearch: { keys: ['voucher_no', 'account', 'party', 'narration'] },
    defaultSort: { key: 'voucher_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
    summaryStrip: [
      { key: 'total_vouchers', label: 'Vouchers' },
      { key: 'total_debit',    label: 'Total Debit',  currency: true },
      { key: 'total_credit',   label: 'Total Credit', currency: true },
    ],
  },

  // ── Journal Register (Day Book) ──────────────────────────────
  {
    key: 'journal_register',
    name: 'Journal Register',
    description: 'All journal vouchers with date, type and reference',
    category: 'Sale Register',
    apiUrl: 'reports/finance/journal-register/',
    reportType: 'Detailed',
    pkId: 'journal_entry_id',
    cols: [
      { fieldKey: 'voucher_no',   name: 'Voucher No', sort: true },
      { fieldKey: 'entry_date',   name: 'Date',       sort: true, displayType: 'map', mapFn: dt },
      { fieldKey: 'voucher_type', name: 'Type',       sort: false },
      { fieldKey: 'reference',    name: 'Reference',  sort: false },
      { fieldKey: 'description',  name: 'Narration',  sort: false },
    ],
    globalSearch: { keys: ['voucher_no', 'voucher_type', 'reference', 'description'] },
    defaultSort: { key: 'entry_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
  },

  // ── Bank Book ────────────────────────────────────────────────
  {
    key: 'bank_book',
    name: 'Bank Book',
    description: 'All bank transactions with running balance per bank account',
    category: 'Sale Register',
    apiUrl: 'reports/finance/bank-book/',
    reportType: 'Detailed',
    pkId: 'journal_entry_line_id',
    cols: [
      { fieldKey: 'account', name: 'Bank A/c', sort: false, displayType: 'map',
        mapFn: (v: any) => v ? `<strong>${esc(v)}</strong>` : '' },
      { fieldKey: 'entry_date', name: 'Date', sort: false, displayType: 'map', mapFn: dt },
      { fieldKey: 'party', name: 'Particulars', sort: false, displayType: 'map', mapFn: particulars },
      { fieldKey: 'debit',  name: 'Debit (₹)',  sort: false, displayType: 'map', mapFn: led },
      { fieldKey: 'credit', name: 'Credit (₹)', sort: false, displayType: 'map', mapFn: led },
      { fieldKey: 'running_balance', name: 'Balance', sort: false, displayType: 'map', mapFn: bal },
    ],
    globalSearch: { keys: ['voucher_no', 'account', 'party', 'description'] },
    defaultSort: { key: 'entry_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
  },

  // ── Cash Book ────────────────────────────────────────────────
  {
    key: 'cash_book',
    name: 'Cash Book',
    description: 'Cash receipts and payments with running balance',
    category: 'Sale Register',
    apiUrl: 'reports/finance/cash-book/',
    reportType: 'Detailed',
    pkId: 'journal_entry_line_id',
    cols: [
      { fieldKey: 'account', name: 'Cash A/c', sort: false, displayType: 'map',
        mapFn: (v: any) => v ? `<strong>${esc(v)}</strong>` : '' },
      { fieldKey: 'entry_date', name: 'Date', sort: false, displayType: 'map', mapFn: dt },
      { fieldKey: 'party', name: 'Particulars', sort: false, displayType: 'map', mapFn: particulars },
      { fieldKey: 'debit',  name: 'Receipt (₹)', sort: false, displayType: 'map', mapFn: led },
      { fieldKey: 'credit', name: 'Payment (₹)', sort: false, displayType: 'map', mapFn: led },
      { fieldKey: 'running_balance', name: 'Balance', sort: false, displayType: 'map', mapFn: bal },
    ],
    globalSearch: { keys: ['voucher_no', 'account', 'party', 'description'] },
    defaultSort: { key: 'entry_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
  },

  // ── Account Ledger ───────────────────────────────────────────
  {
    key: 'account_ledger',
    name: 'Account Ledger',
    description: 'Transaction-level ledger for any account with running balance',
    category: 'Sale Register',
    apiUrl: 'reports/finance/account-ledger/',
    reportType: 'Detailed',
    pkId: 'journal_entry_line_id',
    cols: [
      { fieldKey: 'account', name: 'Account', sort: false, displayType: 'map',
        mapFn: (v: any) => v ? `<strong>${esc(v)}</strong>` : '' },
      { fieldKey: 'entry_date', name: 'Date', sort: false, displayType: 'map', mapFn: dt },
      { fieldKey: 'party', name: 'Particulars', sort: false, displayType: 'map', mapFn: particulars },
      { fieldKey: 'debit',  name: 'Debit (₹)',  sort: false, displayType: 'map', mapFn: led },
      { fieldKey: 'credit', name: 'Credit (₹)', sort: false, displayType: 'map', mapFn: led },
      { fieldKey: 'running_balance', name: 'Balance', sort: false, displayType: 'map', mapFn: bal },
    ],
    globalSearch: { keys: ['voucher_no', 'account', 'party', 'description'] },
    defaultSort: { key: 'entry_date', value: 'descend' },
    filters: ['dateRange', 'period', 'search'],
  },

  // ── Profit & Loss Statement ──────────────────────────────────
  {
    key: 'profit_loss',
    name: 'Profit & Loss Statement',
    description: 'Income vs expenses per ledger account with net profit/loss',
    category: 'Sale Register',
    apiUrl: 'reports/finance/profit-loss/',
    reportType: 'Summary',
    pkId: 'account',
    cols: [
      { fieldKey: 'account', name: 'Account', sort: true },
      { fieldKey: 'nature',  name: 'Type',    sort: true },
      { fieldKey: 'amount',  name: 'Amount',  sort: true, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['account', 'nature'] },
    defaultSort: { key: 'nature', value: 'ascend' },
    filters: ['dateRange', 'period', 'search'],
  },

  // ── Balance Sheet ────────────────────────────────────────────
  {
    key: 'balance_sheet',
    name: 'Balance Sheet',
    description: 'Assets and liabilities position per ledger account',
    category: 'Sale Register',
    apiUrl: 'reports/finance/balance-sheet/',
    reportType: 'Summary',
    pkId: 'account',
    cols: [
      { fieldKey: 'account', name: 'Account',  sort: true },
      { fieldKey: 'side',    name: 'Side',     sort: true },
      { fieldKey: 'nature',  name: 'Nature',   sort: false },
      { fieldKey: 'amount',  name: 'Amount',   sort: true, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['account', 'side', 'nature'] },
    defaultSort: { key: 'side', value: 'ascend' },
    filters: ['dateRange', 'period', 'search'],
  },

  // ── Cash Flow Forecast (reuses the AI cash-flow service) ─────
  {
    key: 'cash_flow',
    name: 'Cash Flow Forecast',
    description: 'Week-by-week projected cash inflow vs outflow for the next 90 days',
    category: 'Sale Register',
    apiUrl: 'reports/finance/cash-flow/',
    reportType: 'Summary',
    pkId: 'week',
    cols: [
      { fieldKey: 'period',         name: 'Week',         sort: false },
      { fieldKey: 'inflow',         name: 'Inflow',       sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'outflow_vendor', name: 'Vendor Out',   sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'outflow_expense', name: 'Expense Out', sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'total_outflow',  name: 'Total Out',    sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'net',            name: 'Net',          sort: true, displayType: 'map', mapFn: cur },
      { fieldKey: 'cumulative',     name: 'Cumulative',   sort: false, displayType: 'map', mapFn: cur },
    ],
    globalSearch: { keys: ['period'] },
    defaultSort: { key: 'week', value: 'ascend' },
    filters: [],
    showDateFilters: false,
  },
];
