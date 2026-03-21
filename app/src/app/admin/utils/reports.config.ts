// reports.config.ts

interface ReportConfig {
    value: string;
    label: string;
    endpoint: string;
    apiUrl?: string;  // Make apiUrl optional
    labelField: string;
    dataField: string;
    module?: string;
    category?: string;
}

// reports.config.ts
export const REPORT_CONFIGS = {
     // ============== STANDARD DASHBOARD REPORTS ==============
    Dashboard: {
        module: 'Dashboard Reports',
        icon: '📊',
        reports: [
            {
                value: 'top_5_products',
                label: 'Top 5 Products',
                endpoint: 'dashboard/Top_5_Itmes_Sold_In_Last_30_Days/', // Your existing endpoint
                labelField: 'product_name',
                dataField: 'total_sold_quantity',
                category: 'Top Lists'
            },
            {
                value: 'top_5_customers',
                label: 'Top 5 Customers',
                endpoint: 'dashboard/Top_5_Customers_In_Last_6_Months/', // Your existing endpoint
                labelField: 'CustomerName',
                dataField: 'TotalAmount',
                category: 'Top Lists'
            },
            {
                value: 'top_5_profit_items',
                label: 'Top 5 Profit Making Items',
                endpoint: 'dashboard/Top_5_Sold_Items_In_Current_FY/',
                labelField: 'item_name',
                dataField: 'total_amount',
                category: 'Top Lists'
            },
            {
                value: 'products_not_sold',
                label: 'Products Not Sold (30 Days)',
                endpoint: 'dashboard/Product_Not_Sold_In_30_Days_For_Table/',
                labelField: 'product_name',
                dataField: 'days_without_sale',
                category: 'Exceptions'
            },
            {
                value: 'customers_no_sales',
                label: 'Customers with No Sales (30 Days)',
                endpoint: 'dashboard/Customers_With_No_Sales_In_30_Days_For_Table/',
                labelField: 'customer_name',
                dataField: 'days_without_sale',
                category: 'Exceptions'
            },
            {
                value: 'pending_orders',
                label: 'Pending Orders',
                endpoint: 'dashboard/Pending_For_Table/',
                labelField: 'order_type',
                dataField: 'total_value',
                category: 'Pending'
            }
        ]
    },
    // ============== SALES MODULE ==============
    sales: {
        module: 'Sales',
        icon: '💰',
        reports: [
            // Sales Register (Essential)
            {
                value: 'sales_general_register',
                label: 'Sales General Register',
                endpoint: 'sales/sale_invoice_order/?sale_register&register_type=general',
                labelField: 'invoice_no',
                dataField: 'total_amount',
                category: 'Sales Register'
            },
            {
                value: 'sales_detailed_register',
                label: 'Sales Detailed Register',
                endpoint: 'sales/sale_invoice_order/?sale_register&register_type=detailed',
                labelField: 'invoice_no',
                dataField: 'total_amount',
                category: 'Sales Register'
            },
            
            // Sales Order Reports
            {
                value: 'sales_summary',
                label: 'Sales Order Summary',
                endpoint: 'sales/sale_order/?sales_order_report=true',
                labelField: 'order_no',
                dataField: 'amount',
                category: 'Sales Orders'
            },
            {
                value: 'all_sales_report',
                label: 'All Sales Report',
                endpoint: 'sales/sale_order/?records_all=true',
                labelField: 'order_no',
                dataField: 'amount',
                category: 'Sales Orders'
            },
            
            // Invoice Reports
            {
                value: 'sales_invoice',
                label: 'Sales Invoice Summary',
                endpoint: 'sales/sale_invoice_order/?summary=true',
                labelField: 'invoice_no',
                dataField: 'total_amount',
                category: 'Invoices'
            },
            {
                value: 'all_invoice',
                label: 'All Invoice Report',
                endpoint: 'sales/sale_invoice_order/?records_all=true',
                labelField: 'invoice_no',
                dataField: 'total_amount',
                category: 'Invoices'
            },
            
            // Sales Analysis
            {
                value: 'sales_by_product',
                label: 'Sales by Product',
                endpoint: 'sales/sale_order/?sales_by_product=true',
                labelField: 'product',
                dataField: 'total_sales',
                category: 'Sales Analysis'
            },
            {
                value: 'sales_by_customer',
                label: 'Sales by Customer',
                endpoint: 'sales/sale_order/?sales_by_customer=true',
                labelField: 'customer',
                dataField: 'total_sales',
                category: 'Sales Analysis'
            },
            {
                value: 'outstanding_by_customer',
                label: 'Outstanding by Customer',
                endpoint: 'sales/sale_order/?outstanding_sales_by_customer=true',
                labelField: 'customer',
                dataField: 'total_pending',
                category: 'Sales Analysis'
            },
            
            // Returns & Tax
            {
                value: 'sales_return',
                label: 'Sales Return Report',
                endpoint: 'sales/sale_return_order/?summary=true',
                labelField: 'return_no',
                dataField: 'total_amount',
                category: 'Returns'
            },
            {
                value: 'sales_tax',
                label: 'Sales Tax Report',
                endpoint: 'sales/sale_order/?sales_tax_report=true',
                labelField: 'tax_name',
                dataField: 'tax_amount',
                category: 'Tax Reports'
            },
            
            // Performance
            {
                value: 'salesperson_performance',
                label: 'Salesperson Performance',
                endpoint: 'sales/sale_order/?salesperson_performance_report=true',
                labelField: 'salesperson',
                dataField: 'total_sales',
                category: 'Performance'
            },
            {
                value: 'profit_margin',
                label: 'Profit Margin Report',
                endpoint: 'sales/sale_order/?profit_margin_report=true',
                labelField: 'product',
                dataField: 'profit_margin',
                category: 'Performance'
            },
            {
                value: 'payment_receipts',
                label: 'Payment Receipts',
                endpoint: 'sales/payment_transactions/',
                labelField: 'receipt_no',
                dataField: 'amount',
                category: 'Payments'
            }
        ]
    },

    // ============== PURCHASE MODULE ==============
    purchase: {
        module: 'Purchase',
        icon: '📦',
        reports: [
            {
                value: 'purchase_report',
                label: 'Purchase Report',
                endpoint: 'purchase/purchase_order/?summary=true',
                labelField: 'purchase_no',
                dataField: 'total_amount',
                category: 'Purchase Register'
            },
            {
                value: 'purchase_invoice',
                label: 'Purchase Invoice Report',
                endpoint: 'purchase/purchase_invoice_order/?summary=true',
                labelField: 'invoice_no',
                dataField: 'total_amount',
                category: 'Purchase Invoices'
            },
            {
                value: 'purchases_by_vendor',
                label: 'Purchases by Vendor',
                endpoint: 'purchase/purchase_order/?purchases_by_vendor=true',
                labelField: 'vendor',
                dataField: 'total_purchases',
                category: 'Vendor Analysis'
            },
            {
                value: 'purchase_return',
                label: 'Purchase Return Report',
                endpoint: 'purchase/purchase_return_order/?summary=true',
                labelField: 'return_no',
                dataField: 'total_amount',
                category: 'Returns'
            },
            {
                value: 'outstanding_purchase',
                label: 'Outstanding Purchase',
                endpoint: 'purchase/purchase_order/?outstanding_purchases=true',
                labelField: 'vendor',
                dataField: 'pending_amount',
                category: 'Outstanding'
            },
            {
                value: 'purchase_order_status',
                label: 'Purchase Order Status',
                endpoint: 'purchase/purchase_order/',
                labelField: 'order_no',
                dataField: 'status',
                category: 'Order Status'
            },
            {
                value: 'stock_replenishment',
                label: 'Stock Replenishment Report',
                endpoint: 'purchase/purchase_order/?stock_replenishment_report=true',
                labelField: 'product',
                dataField: 'required_quantity',
                category: 'Inventory'
            }
        ]
    },

    // ============== CUSTOMER MODULE ==============
    customer: {
        module: 'Customer',
        icon: '👥',
        reports: [
            {
                value: 'customer_summary',
                label: 'Customer Summary Report',
                endpoint: 'customers/customers/?customer_summary_report=true',
                labelField: 'customer',
                dataField: 'total_sales',
                category: 'Customer Summary'
            },
            {
                value: 'customer_ledger',
                label: 'Customer Ledger Report',
                endpoint: 'customers/customers/?customer_ledger_report=true',
                labelField: 'customer',
                dataField: 'balance',
                category: 'Ledger'
            },
            {
                value: 'customer_outstanding',
                label: 'Customer Outstanding Report',
                endpoint: 'customers/customers/?customer_outstanding_report=true',
                labelField: 'customer',
                dataField: 'outstanding',
                category: 'Outstanding'
            },
            {
                value: 'customer_order_history',
                label: 'Customer Order History',
                endpoint: 'customers/customers/?customer_order_history=true',
                labelField: 'customer',
                dataField: 'total_orders',
                category: 'History'
            },
            {
                value: 'customer_credit_limit',
                label: 'Credit Limit Report',
                endpoint: 'customers/customers/?credit_limit_report=true',
                labelField: 'customer',
                dataField: 'credit_limit',
                category: 'Credit'
            },
            {
                value: 'customer_payment',
                label: 'Customer Payment Report',
                endpoint: 'customers/customers/?customer_payment_report=true',
                labelField: 'customer',
                dataField: 'total_paid',
                category: 'Payments'
            }
        ]
    },

    // ============== VENDOR MODULE ==============
    vendor: {
        module: 'Vendor',
        icon: '🏭',
        reports: [
            {
                value: 'vendor_summary',
                label: 'Vendor Summary Report',
                endpoint: 'vendors/vendors/?vendor_summary_report=true',
                labelField: 'vendor',
                dataField: 'total_purchases',
                category: 'Vendor Summary'
            },
            {
                value: 'vendor_ledger',
                label: 'Vendor Ledger Report',
                endpoint: 'vendors/vendors/?vendor_ledger_report=true',
                labelField: 'vendor',
                dataField: 'balance',
                category: 'Ledger'
            },
            {
                value: 'vendor_outstanding',
                label: 'Vendor Outstanding Report',
                endpoint: 'vendors/vendors/?vendor_outstanding_report=true',
                labelField: 'vendor',
                dataField: 'outstanding',
                category: 'Outstanding'
            },
            {
                value: 'vendor_performance',
                label: 'Vendor Performance Report',
                endpoint: 'vendors/vendors/?vendor_performance_report=true',
                labelField: 'vendor',
                dataField: 'performance_score',
                category: 'Performance'
            },
            {
                value: 'vendor_payment',
                label: 'Vendor Payment Report',
                endpoint: 'vendors/vendors/?vendor_payment_report=true',
                labelField: 'vendor',
                dataField: 'total_paid',
                category: 'Payments'
            }
        ]
    },

    // ============== FINANCE/LEDGER MODULE ==============
    finance: {
        module: 'Finance',
        icon: '💵',
        reports: [
            {
                value: 'bank_book',
                label: 'Bank Book Report',
                endpoint: 'finance/financial_reports/bank_book/',
                labelField: 'bank',
                dataField: 'balance',
                category: 'Books'
            },
            {
                value: 'cash_book',
                label: 'Cash Book Report',
                endpoint: 'finance/financial_reports/cash_book/',
                labelField: 'date',
                dataField: 'amount',
                category: 'Books'
            },
            {
                value: 'general_ledger',
                label: 'General Ledger Report',
                endpoint: 'finance/financial_reports/general_ledger/',
                labelField: 'account',
                dataField: 'balance',
                category: 'Ledger'
            },
            {
                value: 'trial_balance',
                label: 'Trial Balance',
                endpoint: 'finance/financial_reports/trial_balance/',
                labelField: 'account',
                dataField: 'balance',
                category: 'Financial Statements'
            },
            {
                value: 'profit_loss',
                label: 'Profit & Loss Statement',
                endpoint: 'finance/financial_reports/profit_and_loss/',
                labelField: 'account',
                dataField: 'amount',
                category: 'Financial Statements'
            },
            {
                value: 'balance_sheet',
                label: 'Balance Sheet',
                endpoint: 'finance/financial_reports/balance_sheet/',
                labelField: 'account',
                dataField: 'amount',
                category: 'Financial Statements'
            },
            {
                value: 'cash_flow',
                label: 'Cash Flow Statement',
                endpoint: 'finance/financial_reports/cash_flow/',
                labelField: 'month',
                dataField: 'amount',
                category: 'Financial Statements'
            },
            {
                value: 'aging_report',
                label: 'Aging Report',
                endpoint: 'finance/financial_reports/aging_report/',
                labelField: 'customer',
                dataField: 'amount',
                category: 'Receivables'
            },
            {
                value: 'journal_entry',
                label: 'Journal Entry Report',
                endpoint: 'finance/financial_reports/journal_entry_report/',
                labelField: 'journal_no',
                dataField: 'amount',
                category: 'Journals'
            },
            {
                value: 'bank_reconciliation',
                label: 'Bank Reconciliation',
                endpoint: 'finance/financial_reports/bank_reconciliation/',
                labelField: 'bank',
                dataField: 'difference',
                category: 'Reconciliation'
            },
            {
                value: 'journal_book',
                label: 'Journal Book Report',
                endpoint: 'finance/journal_book_report/',
                labelField: 'entry_no',
                dataField: 'amount',
                category: 'Journals'
            }
        ]
    },

    // ============== PRODUCTION MODULE ==============
    production: {
        module: 'Production',
        icon: '⚙️',
        reports: [
            {
                value: 'production_summary',
                label: 'Production Summary Report',
                endpoint: 'production/work_order/?production_summary_report=true',
                labelField: 'product',
                dataField: 'produced_quantity',
                category: 'Summary'
            },
            {
                value: 'bom_report',
                label: 'Bill of Materials Report',
                endpoint: 'production/bom/?bom_report=true',
                labelField: 'product',
                dataField: 'total_cost',
                category: 'BOM'
            },
            {
                value: 'work_order_status',
                label: 'Work Order Status Report',
                endpoint: 'production/work_order/?work_order_status_report=true',
                labelField: 'work_order',
                dataField: 'status',
                category: 'Work Orders'
            },
            {
                value: 'raw_material_consumption',
                label: 'Raw Material Consumption',
                endpoint: 'production/bom/?raw_material_consumption_report=true',
                labelField: 'material',
                dataField: 'consumed_quantity',
                category: 'Materials'
            },
            {
                value: 'finished_goods',
                label: 'Finished Goods Report',
                endpoint: 'production/work_order/?finished_goods_report=true',
                labelField: 'product',
                dataField: 'finished_quantity',
                category: 'Finished Goods'
            },
            {
                value: 'production_cost',
                label: 'Production Cost Report',
                endpoint: 'production/work_order/?production_cost_report=true',
                labelField: 'product',
                dataField: 'total_cost',
                category: 'Costing'
            },
            {
                value: 'wip_report',
                label: 'Work in Progress Report',
                endpoint: 'production/work_order/?wip_report=true',
                labelField: 'product',
                dataField: 'wip_quantity',
                category: 'WIP'
            }
        ]
    },
};

// Helper function to get all reports as flat array
export const getAllReports = () => {
    const allReports = [];
    for (const moduleKey in REPORT_CONFIGS) {
        const module = REPORT_CONFIGS[moduleKey as keyof typeof REPORT_CONFIGS];
        module.reports.forEach((report: any) => {
            allReports.push({
                ...report,
                moduleName: module.module,
                moduleIcon: module.icon
            });
        });
    }
    return allReports;
};

// Helper function to get reports grouped by module
export const getReportsByModule = () => {
    const grouped: any = {};
    for (const moduleKey in REPORT_CONFIGS) {
        const module = REPORT_CONFIGS[moduleKey as keyof typeof REPORT_CONFIGS];
        grouped[module.module] = {
            icon: module.icon,
            reports: module.reports.map((report: any) => ({
                ...report,
                moduleName: module.module
            }))
        };
    }
    return grouped;
};