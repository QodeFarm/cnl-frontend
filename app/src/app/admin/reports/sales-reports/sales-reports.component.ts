import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { LocalStorageService } from '@ta/ta-core';
import { TaTableComponent, TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-sales-repots',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './sales-reports.component.html',
  styleUrls: ['./sales-reports.component.scss']
})
export class SalesRepotsComponent {
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;
  
  isAccordionOpen = true;
  selectedReportKey: string | null = null;
  tableConfig: TaTableConfig | null = null;
  // totalRecords: number | null = null; 

  isSuperUser: boolean = false;

  constructor(private localStorage: LocalStorageService) {
    const user = this.localStorage.getItem('user');
    this.isSuperUser = user?.is_sp_user === true;
    // this.initReportsConfig();
  }

  reportsConfig: { [key: string]: TaTableConfig } = {

    salesSummary: {
      apiUrl: 'sales/sale_order/?sales_order_report=true',
      pkId: "sale_order_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['order_no', 'customer', 'order_date','sale_type','status', 'amount']
      },
      export: {downloadName: 'SalesSummaryReport'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'order_no',
          name: 'Order No',
          sort: true
        },
        {
          fieldKey: 'customer',
          name: 'Customer',
          sort: true
        },
        {
          fieldKey: 'order_date',
          name: 'Order Date',
          sort: true
        },
        {
          fieldKey: 'sale_type',
          name: 'Sale Type',
          sort: true,
        },
        {
          fieldKey: 'status_name',
          name: 'Status',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row?.order_status?.status_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'amount',
          name: 'Amount',
          sort: true
        }
      ]
    },

    OtherSalesReport: {
      apiUrl: 'sales/sale_order/?records_mstcnl=true',
      pkId: "sale_order_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['order_no', 'customer_id', 'order_date','sale_type_id','order_status_id', 'amount']
      },
      export: {downloadName: 'SalesOtherReport'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'order_no',
          name: 'Order No',
          sort: true
        },
        {
          fieldKey: 'customer_id',
          name: 'Customer',
          sort: true
        },
        {
          fieldKey: 'order_date',
          name: 'Order Date',
          sort: true
        },
        {
          fieldKey: 'sale_type_id',
          name: 'Sale Type',
          sort: true,
        },
        {
          fieldKey: 'order_status_id',
          name: 'Status',
          sort: true
        },
        {
          fieldKey: 'amount',
          name: 'Amount',
          sort: true
        }
      ]
    },

    AllSalesReport: {
      apiUrl: 'sales/sale_order/?records_all=true', //sales_order_report=true&report_type=all',
      pkId: "sale_order_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['order_no', 'customer', 'order_date','sale_type','status', 'amount']
      },
      export: {downloadName: 'AllSalesordersReport'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'order_no',
          name: 'Order No',
          sort: true
        },
        {
          fieldKey: 'customer',
          name: 'Customer',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            // return `${row.customer.name}`;
            return row.customer?.name || row.customer_id || '';
          },
          sort: true
        },
        {
          fieldKey: 'order_date',
          name: 'Order Date',
          sort: true
        },
        // {
        //   fieldKey: 'sale_type',
        //   name: 'Sale Type',
        //   sort: true,
        // },
        {
          fieldKey: 'sale_type',
          name: 'Sale Type',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            // console.log("-->", currentValue);
            // return `${row.sale_type?.name || ''}`;
            return row.sale_type?.name || row.sale_type_id || '';
          },
        },
        {
          fieldKey: 'status_name',
          name: 'Status',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            // return `${row?.order_status?.status_name}`;
            return row.order_status?.status_name || row.order_status_id || '';
          },
          sort: true
        },
        {
          fieldKey: 'total_amount',
          name: 'Amount',
          sort: true
        }
      ]
    },
    //  =====================================sales_invoice_report=======================   
    salesInvoice: {
      apiUrl: 'sales/sale_invoice_order/?summary=true',
      pkId: "sale_invoice_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['invoice_no','invoice_date','customer','created_at','bill_type','item_value','dis_amt','tax_amount','total_amount','due_date','payment_status','created_at']
      },
      export: {downloadName: 'SalesInvoiceReport'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'invoice_no',
          name: 'Invoice No',
          sort: true
        },
        {
          fieldKey: 'invoice_date',
          name: 'Invoice Date',
          sort: true
        }, 
        // {
        //   fieldKey: 'customer',
        //   name: 'Customer',
        //   sort: true
        // },
        {
          fieldKey: 'customer',
          name: 'Customer',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row?.customer?.name}`;
          },
          sort: true
        },
        {
          fieldKey: 'bill_type',
          name: 'Bill Type',
          sort: true
        },
        {
          fieldKey: 'item_value',
          name: 'Item Value',
          sort: true
        },
        {
          fieldKey: 'dis_amt',
          name: 'Discount Amount',
          sort: true
        },
        {
          fieldKey: 'tax_amount',
          name: 'Tax Amount',
          
          sort: true
        },
        {
          fieldKey: 'due_date',
          name: 'Due Date',
          sort: true
        },
        {
          fieldKey: 'status_name',
          name: 'Status',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row?.order_status?.status_name}`;
          },
          sort: true
        },
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true
      },
        // {
        //   fieldKey: 'created_at',
        //   name: 'created_at',
        //   sort: true
        // },
      ]
    },

    OtherInvoice: {
      apiUrl: 'sales/sale_invoice_order/?records_mstcnl=true',
      pkId: "sale_invoice_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['invoice_no','invoice_date','customer_id','created_at','bill_type','item_value','dis_amt','tax_amount','total_amount','due_date','created_at']
      },
      export: {downloadName: 'OtherInvoiceReport'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'invoice_no',
          name: 'Invoice No',
          sort: true
        },
        {
          fieldKey: 'invoice_date',
          name: 'Invoice Date',
          sort: true
        }, 
        {
          fieldKey: 'customer_id',
          name: 'Customer',
          sort: true
        },
        {
          fieldKey: 'bill_type',
          name: 'Bill Type',
          sort: true
        },
        {
          fieldKey: 'item_value',
          name: 'Item Value',
          sort: true
        },
        {
          fieldKey: 'dis_amt',
          name: 'Discount Amount',
          sort: true
        },
        {
          fieldKey: 'tax_amount',
          name: 'Tax Amount',
          
          sort: true
        },
        {
          fieldKey: 'due_date',
          name: 'Due Date',
          sort: true
        },
        {
          fieldKey: 'order_status_id',
          name: 'Status',
          sort: true
        },
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true
      },
      ]
    },

    AllInvoice: {
      apiUrl: 'sales/sale_invoice_order/?records_all=true',
      pkId: "sale_invoice_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['invoice_no','invoice_date','customer','created_at','bill_type','item_value','dis_amt','tax_amount','total_amount','due_date','payment_status','created_at']
      },
      export: {downloadName: 'AllInvoiceReport'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'invoice_no',
          name: 'Invoice No',
          sort: true
        },
        {
          fieldKey: 'invoice_date',
          name: 'Invoice Date',
          sort: true
        }, 
        // {
        //   fieldKey: 'customer',
        //   name: 'Customer',
        //   sort: true
        // },
        {
          fieldKey: 'customer',
          name: 'Customer',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            // return `${row.customer.name}`;
            return row.customer?.name || row.customer_id || '';
          },
          sort: true
        },
        {
          fieldKey: 'bill_type',
          name: 'Bill Type',
          sort: true
        },
        {
          fieldKey: 'item_value',
          name: 'Item Value',
          sort: true
        },
        {
          fieldKey: 'dis_amt',
          name: 'Discount Amount',
          sort: true
        },
        {
          fieldKey: 'tax_amount',
          name: 'Tax Amount',
          
          sort: true
        },
        {
          fieldKey: 'due_date',
          name: 'Due Date',
          sort: true
        },
        {
          fieldKey: 'status_name',
          name: 'Status',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            // return `${row?.order_status?.status_name}`;
            return row.order_status?.status_name || row.order_status_id || '';
          },
          sort: true
        },
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true
      },
      ]
    },

    // =========================== SalesbyProductReport ===========================
    SalesbyProductReport: {
      apiUrl: 'sales/sale_order/?sales_by_product=true',
      pkId: "sale_order_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['product','total_sales','total_quantity_sold']
      },
      export: {downloadName: 'SalesByProductReport'},
      defaultSort: { key: 'total_sales', value: 'descend' },

      cols: [
        {
          fieldKey: 'product',
          name: 'Products',
          sort: true
        },
        {
          fieldKey: 'total_quantity_sold',
          name: 'Total Quantity Sold',
          sort: true
        },
        {
          fieldKey: 'total_sales',
          name: 'Total Sales',
          sort: true
        },
      ]
    },
    // ========================= SalesByCustomerReport ==============================
    SalesByCustomerReport: {
      apiUrl: 'sales/sale_order/?sales_by_customer=true',
      pkId: "customer_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['customer','total_sales']
      },
      export: {downloadName: 'SalesByCustomerReport'},
      defaultSort: { key: 'total_sales', value: 'descend' },
      cols: [
        {
          fieldKey: 'customer',
          name: 'Customer',
          sort: true
        },
        {
          fieldKey: 'total_sales',
          name: 'Total Sales',
          sort: true
        },
       
      ]
    },

     // ========================= Outstanding Sales Report – Pending payments from customers. ==============================
     OutstandingSalesByCustomerReport: {
      apiUrl: 'sales/sale_order/?outstanding_sales_by_customer=true',
      pageSize: 10,
      "globalSearch": {
        keys: ['customer','total_invoice','total_paid','total_pending']
      },
      export: {downloadName: 'OutstandingSalesReport'},
      defaultSort: { key: 'total_pending', value: 'descend' },
      cols: [
        {
          fieldKey: 'customer',
          name: 'Customer',
          sort: true
        },
        {
          fieldKey: 'total_invoice',
          name: 'Total Invoice',
          sort: true
        },
        {
          fieldKey: 'total_paid',
          name: 'Total Paid',
          sort: true
        },
        {
          fieldKey: 'total_pending',
          name: 'Total Pending',
          sort: true
        },
       
      ]
    },

    
    // ==========================SalesReturnReport=================================================
    SalesReturnReport: {
      apiUrl: 'sales/sale_return_order/?summary=true',
      pkId: "sale_return_id",
      fixedFilters: [
        {
          key: 'summary',
          value: 'true'
        }
      ],
      pageSize: 10,
      export: {downloadName: 'SalesReturnReport'},
      "globalSearch": {
        keys: ['return_date', 'customer', 'return_no', 'status_name', 'tax', 'return_reason', 'due_date', 'tax_amount', 'total_amount', 'remarks']
      },
      cols: [
        {
          fieldKey: 'customer',
          name: 'Customer',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.customer.name}`;
          },
          sort: true
        },
        {
          fieldKey: 'return_date',
          name: 'Return Date',
          sort: true
        },
        
        {
          fieldKey: 'return_no',
          name: 'Return No',
          sort: true
        },
        {
          fieldKey: 'return_reason',
          name: 'Return Reason',
          sort: true
        },
        {
          fieldKey: 'total_amount',
          name: 'Total Amount',
          sort: true
        },
        
      ]
    }, 


     // ==========================Sales Tax Report=================================================
     SalesTaxReport: {
      apiUrl: 'sales/sale_order/?sales_tax_report=true',
      pkId: "sale_return_id",
      pageSize: 10,
      export: {downloadName: 'SalesTaxReport'},
      "globalSearch": {
        keys: ['product', 'gst_type', 'total_sales', 'total_sales', 'total_tax']
      },
      cols: [
        {
          fieldKey: 'product',
          name: 'Product',
          sort: true
        },
        {
          fieldKey: 'gst_type',
          name: 'Gst Type',
          sort: true
        },
        
        {
          fieldKey: 'total_sales',
          name: 'Total Sales',
          sort: true
        },
        {
          fieldKey: 'total_tax',
          name: 'Total Tax',
          sort: true
        },
      ]
    }, 

     // ========================= Salesperson Performance Report ==============================
     SalespersonPerformanceReport: {
      apiUrl: 'sales/sale_order/?salesperson_performance_report=true',
      pkId: "customer_id",
      pageSize: 10,
      export: {downloadName: 'SalespersonPerformanceReport'},
      "globalSearch": {
        keys: ['salesperson','total_sales']
      },
      defaultSort: { key: 'total_sales', value: 'descend' },
      cols: [
        {
          fieldKey: 'salesperson',
          name: 'Sales Person',
          sort: true
        },
        {
          fieldKey: 'total_sales',
          name: 'Total Sales',
          sort: true
        },
       
      ]
    },
     // ==========================Profit Margin Report=================================================
     ProfitMarginReport: {
      apiUrl: 'sales/sale_order/?profit_margin_report=true',
      pageSize: 10,
      export: {downloadName: 'ProfitMarginReport'},
      "globalSearch": {
        keys: ['product', 'total_sales', 'total_cost', 'profit', 'profit_margin']
      },
      defaultSort: { key: 'profit_margin', value: 'descend' },

      cols: [
        {
          fieldKey: 'product',
          name: 'Product',
          sort: true
        },
        {
          fieldKey: 'total_sales',
          name: 'Total Sales',
          sort: true
        },
        
        {
          fieldKey: 'total_cost',
          name: 'Total Cost',
          sort: true
        },
        {
          fieldKey: 'profit',
          name: 'Profit',
          sort: true
        },
        {
          fieldKey: 'profit_margin',
          name: 'Profit Margin',
          sort: true
        },
        
      ]
    }, 
    // Adding Sales Payment Receipts report
    salesPaymentReceipts: {
      apiUrl: 'sales/payment_transactions/',
      pkId: "payment_transaction_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['invoice_no', 'payment_receipt_no', 'payment_date', 'payment_method', 'payment_status', 'customer_name']
      },
      export: {downloadName: 'SalesPaymentReceipts'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'payment_receipt_no',
          name: 'Receipt No',
          sort: true
        },
        {
          fieldKey: 'invoice_no',
          name: 'Invoice No',
          sort: true
        },
        {
          fieldKey: 'customer_name',
          name: 'Customer',
          sort: true
        },
        {
          fieldKey: 'invoice_date',
          name: 'Invoice Date',
          sort: true
        },
        {
          fieldKey: 'payment_date',
          name: 'Payment Date',
          sort: true,
          displayType : 'date',
        },
        {
          fieldKey: 'due_date',
          name: 'Due Date',
          sort: true
        },
        {
          fieldKey: 'payment_method',
          name: 'Payment Method',
          sort: true
        },
        {
          fieldKey: 'payment_status',
          name: 'Status',
          sort: true
        },
        {
          fieldKey: 'total_amount',
          name: 'Amount',
          sort: true
        },
        {
          fieldKey: 'adjusted_now',
          name: 'Adjusted Now',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue}` : '₹0.00';
          }
        },
        {
          fieldKey: 'outstanding_amount',
          name: 'Outstanding',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue}` : '₹0.00';
          }
        },
        // {
        //   fieldKey: 'remarks',
        //   name: 'Remarks',
        //   sort: true
        // }
      ]
    },
  };

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  loading: boolean = false;
  error: string | null = null;

  selectReport(reportKey: string) {
    this.loading = true; // Show loading state
    this.error = null; // Clear any previous errors
    this.selectedReportKey = null;
    this.tableConfig = null;
    this.isAccordionOpen = true;

    if (reportKey) {
      this.selectedReportKey = reportKey;
      this.tableConfig = this.reportsConfig[reportKey];
      this.isAccordionOpen = false;
    }

    setTimeout(() => {
      this.loading = false; // Hide loading after data loads
    },); // Adjust timeout based on API response time
  }

  onDataLoaded(data: any[]) {
    if (!data || data.length === 0) {
      this.error = 'No data available for this report.';
    }
    this.loading = false;
  }

  // //  Function to get total records from the table data
  // onDataLoaded(data: any[]) {
  //   this.totalRecords = data.length; //  Update total records dynamically
  // }
}



