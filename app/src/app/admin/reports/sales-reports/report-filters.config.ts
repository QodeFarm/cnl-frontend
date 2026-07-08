// ─────────────────────────────────────────────────────────────
// Report Filter Registry — single source of truth for Layer-2 filters
// ─────────────────────────────────────────────────────────────
// Each report declares a list of filter keys (`barFilters` on SalesReportDef).
// This registry maps every key to its UI control + the backend query param it
// drives + where its dropdown options come from. The detail view renders the
// controls generically, so adding a filter to a report = adding one key to its
// `barFilters` array. No per-report code.
//
// Grounding (verified against the codebase):
//   • List endpoints return  { data: [ ... ] }  (relative paths, interceptor adds /api/v1/)
//   • Backend BaseReportFilter already accepts these params — no backend changes.

export type FilterControlType = 'select' | 'staticSelect' | 'number' | 'text';

export interface FilterOption {
  value: string;
  label: string;
}

export interface ReportFilterControl {
  /** Human label shown above the control and in the active-filter chip. */
  label: string;
  /** Control kind: backend-loaded dropdown ('select') or fixed list ('staticSelect'). */
  type: FilterControlType;
  /** Backend query-param name this filter sends (matches BaseReportFilter). */
  param: string;
  /** Placeholder text in the dropdown. */
  placeholder?: string;

  // ── For type: 'select' (backend-loaded) ──────────────────────
  /** Relative endpoint that returns { data: [...] }. */
  endpoint?: string;
  /** Field on each row used as the option VALUE (what's sent to the backend). */
  valueField?: string;
  /** Field on each row used as the visible LABEL. */
  labelField?: string;

  // ── For type: 'staticSelect' (fixed list) ────────────────────
  options?: FilterOption[];

  /** Approx control width in px (keeps the bar tidy). */
  width?: number;
}

export const FILTER_REGISTRY: Record<string, ReportFilterControl> = {
  // ── Backend-loaded dropdowns ─────────────────────────────────
  customer: {
    label: 'Customer',
    type: 'select',
    param: 'customer_id',
    placeholder: 'All Customers',
    // minimal=true returns a PLAIN array of { customer_id, name } for ALL customers
    // (lightweight, built for dropdowns). The summary=true endpoint is paginated.
    endpoint: 'customers/customer/?minimal=true',
    valueField: 'customer_id',
    labelField: 'name',
    width: 160,
  },
  vendor: {
    label: 'Vendor',
    type: 'select',
    param: 'vendor_id',
    placeholder: 'All Vendors',
    // minimal=true returns a PLAIN array of { vendor_id, name } for ALL vendors.
    endpoint: 'vendors/vendor_get/?minimal=true',
    valueField: 'vendor_id',
    labelField: 'name',
    width: 160,
  },
  status: {
    label: 'Status',
    type: 'select',
    param: 'status',                 // SalesRegisterFilter matches status_name__iexact
    placeholder: 'All Statuses',
    endpoint: 'masters/order_status/',
    valueField: 'status_name',
    labelField: 'status_name',
    width: 130,
  },
  orderStatus: {
    label: 'Order Status',
    type: 'select',
    param: 'order_status',           // SaleOrderFilter matches status_name__iexact
    placeholder: 'All Statuses',
    endpoint: 'masters/order_status/',
    valueField: 'status_name',
    labelField: 'status_name',
    width: 150,
  },
  flowStatus: {
    label: 'Flow Status',
    type: 'select',
    param: 'flow_status',            // matches flow_status_name__icontains
    placeholder: 'All Flow Stages',
    endpoint: 'masters/flow_status/',
    valueField: 'flow_status_name',
    labelField: 'flow_status_name',
    width: 160,
  },
  saleType: {
    label: 'Sale Type',
    type: 'select',
    param: 'sale_type',              // matches sale_type_id__name__icontains
    placeholder: 'All Sale Types',
    endpoint: 'masters/sale_types/',
    valueField: 'name',
    labelField: 'name',
    width: 150,
  },
  salesperson: {
    label: 'Salesperson',
    type: 'select',
    param: 'salesperson_id',         // entity layer matches order_salesman_id
    placeholder: 'All Salespersons',
    endpoint: 'masters/orders_salesman/',
    valueField: 'order_salesman_id',
    labelField: 'name',
    width: 170,
  },
  city: {
    label: 'City',
    type: 'select',
    param: 'city',                   // matches city_name__icontains
    placeholder: 'All Cities',
    endpoint: 'masters/city/',
    valueField: 'city_name',
    labelField: 'city_name',
    width: 150,
  },
  productGroup: {
    label: 'Product Group',
    type: 'select',
    param: 'product_group_id',
    placeholder: 'All Groups',
    endpoint: 'products/product_groups/',
    valueField: 'product_group_id',
    labelField: 'group_name',
    width: 170,
  },
  productCategory: {
    label: 'Category',
    type: 'select',
    param: 'product_category_id',
    placeholder: 'All Categories',
    endpoint: 'products/product_categories/',
    valueField: 'category_id',
    labelField: 'category_name',
    width: 160,
  },
  productBrand: {
    label: 'Brand',
    type: 'select',
    param: 'product_brand_id',
    placeholder: 'All Brands',
    endpoint: 'masters/product_brands/',
    valueField: 'brand_id',
    labelField: 'brand_name',
    width: 150,
  },

  // ── Advanced inputs (used in the "More Filters" drawer) ──────
  minAmount: {
    label: 'Min Amount',
    type: 'number',
    param: 'min_amount',
    placeholder: '₹ min',
    width: 130,
  },
  maxAmount: {
    label: 'Max Amount',
    type: 'number',
    param: 'max_amount',
    placeholder: '₹ max',
    width: 130,
  },
  minPending: {
    label: 'Min Pending',
    type: 'number',
    param: 'min_pending',
    placeholder: '₹ min',
    width: 130,
  },
  hsn: {
    label: 'HSN Code',
    type: 'text',
    param: 'hsn_code',
    placeholder: 'HSN',
    width: 130,
  },

  // ── Static (fixed) dropdowns ─────────────────────────────────
  billType: {
    label: 'Bill Type',
    type: 'staticSelect',
    param: 'bill_type',
    placeholder: 'All Bill Types',
    options: [
      { value: 'CASH', label: 'Cash' },
      { value: 'CREDIT', label: 'Credit' },
      { value: 'OTHERS', label: 'Others' },
    ],
    width: 120,
  },
  voucher: {
    label: 'Voucher',
    type: 'staticSelect',
    param: 'voucher',
    placeholder: 'All Vouchers',
    options: [
      { value: 'GST_Purchase', label: 'GST Purchase' },
      { value: 'Purchase', label: 'Purchase' },
    ],
    width: 140,
  },
  noteType: {
    label: 'Note Type',
    type: 'staticSelect',
    param: 'note_type',
    placeholder: 'Credit + Debit',
    options: [
      { value: 'credit', label: 'Credit Notes' },
      { value: 'debit', label: 'Debit Notes' },
    ],
    width: 150,
  },
  transactionType: {
    label: 'Type',
    type: 'staticSelect',
    param: 'transaction_type',
    placeholder: 'All Movements',
    options: [
      { value: 'Receive', label: 'Receive (In)' },
      { value: 'Issue', label: 'Issue (Out)' },
    ],
    width: 150,
  },
  converted: {
    label: 'Converted',
    type: 'staticSelect',
    param: 'is_converted',
    placeholder: 'All',
    options: [
      { value: 'true', label: 'Converted' },
      { value: 'false', label: 'Not Converted' },
    ],
    width: 150,
  },
};
