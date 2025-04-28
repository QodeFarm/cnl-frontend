import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-purchase-reports',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule],
  templateUrl: './purchase-reports.component.html',
  styleUrls: ['./purchase-reports.component.scss']
})
export class PurchaseReportsComponent {

  isAccordionOpen = true;
    selectedReportKey: string | null = null;
    tableConfig: TaTableConfig | null = null;
    // totalRecords: number | null = null; 
  
    reportsConfig: { [key: string]: TaTableConfig } = {
  
      purchaseReport: {
        apiUrl: 'purchase/purchase_order/?summary=true',
        pkId: "purchase_order_id",
        fixedFilters: [
          {
            key: 'summary',
            value: 'true'
          }
        ],
        pageSize: 10,
        "globalSearch": {
          keys: ['order_date','purchase_type_id','order_no','tax','tax_amount','total_amount','vendor','status_name','remarks']
        },
        export: {downloadName: 'PurchaseReport'},
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'vendor',
            name: 'Vendor',
            displayType: "map",
            mapFn: (currentValue: any, row: any, col: any) => {
              return `${row.vendor.name}`;
            },
            sort: true
          },
          {
            fieldKey: 'order_no',
            name: 'Order No',
            sort: true
          },
          {
            fieldKey: 'order_date',
            name: 'Order Date',
            sort: true
          },
          {
            fieldKey: 'purchase_type_id',
            name: 'Purchase Type',
            sort: true,
            displayType: "map",
            mapFn: (currentValue: any, row: any, col: any) => {
              // console.log("-->", currentValue);
              return `${row.purchase_type.name}`;
            },
          },
          // {
          //   fieldKey: 'tax',
          //   name: 'Tax',
          //   sort: true
          // },
          {
            fieldKey: 'status_name',
            name: 'Status',
            displayType: "map",
            mapFn: (currentValue: any, row: any, col: any) => {
              return `${row.order_status.status_name}`;
            },
            sort: true
          },
          {
            fieldKey: 'tax_amount',
            name: 'Tax amount',
            sort: true
          },
          {
            fieldKey: 'total_amount',
            name: 'Total amount',
            sort: true
          },
          
          
          // {
          //   fieldKey: 'remarks',
          //   name: 'Remarks',
          //   sort: true
          // },
        ]
      },
      //  =====================================PurchaseInvoiceReport  =======================   
      PurchaseInvoiceReport: {
        apiUrl: 'purchase/purchase_invoice_order/?summary=true',
        pkId: "purchase_invoice_id",
        pageSize: 10,
        "globalSearch": {
          keys: ['invoice_date','vendor','purchase_type','invoice_no','supplier_invoice_no','tax','total_amount','tax_amount','advance_amount','status_name','remarks']
        },
        export: {downloadName: 'PurchaseInvoiceReport'},
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'vendor',
            name: 'Vendor',
            displayType: "map",
            mapFn: (currentValue: any, row: any, col: any) => {
              return `${row.vendor.name}`;
            },
            sort: true
          },
          {
            fieldKey: 'purchase_type',
            name: 'Purchase Type',
            sort: true,
            displayType: "map",
            mapFn: (currentValue: any, row: any, col: any) => {
              // console.log("-->", currentValue);
              return `${row.purchase_type.name}`;
            },
          },
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
          //   fieldKey: 'supplier_invoice_no',
          //   name: 'Supplier invoice no',
          //   sort: true
          // },
          // {
          //   fieldKey: 'tax',
          //   name: 'Tax',
          //   sort: true
          // },
          {
            fieldKey: 'total_amount',
            name: 'Total amount',
            sort: true
          },
          // {
          //   fieldKey: 'tax_amount',
          //   name: 'Tax amount',
          //   sort: true
          // },
          // {
          //   fieldKey: 'advance_amount',
          //   name: 'Advance Amount',
          //   sort: true
          // },
          // {
          //   fieldKey: 'status_name',
          //   name: 'Status',
          //   displayType: "map",
          //   mapFn: (currentValue: any, row: any, col: any) => {
          //     return `${row.order_status.status_name}`;
          //   },
          //   sort: true
          // },
          // {
          //   fieldKey: 'remarks',
          //   name: 'Remarks',
          //   sort: true
          // },
        ]
      },
  
      // =========================== PurchasesbyVendorReport ===========================
      PurchasesbyVendorReport: {
        apiUrl: 'purchase/purchase_order/?purchases_by_vendor=true',
        pageSize: 10,
        "globalSearch": {
          keys: ['vendor','total_purchase','order_count']
        },
        export: {downloadName: 'PurchasesbyVendorReport'},
        // defaultSort: { key: 'total_purchase', value: 'descend' },
        cols: [
          {
            fieldKey: 'vendor',
            name: 'Vendor',
            sort: true
          },
          {
            fieldKey: 'total_purchase',
            name: 'Total Purchases',
            sort: true
          },
          {
            fieldKey: 'order_count',
            name: 'Order Count',
            sort: true
          },
        ]
      },
      // ========================= Purchase Return Report ==============================
      PurchaseReturnReport: {
        apiUrl: 'purchase/purchase_return_order/?summary=true',
        pageSize: 10,
        globalSearch: {
          keys: ['due_date', 'return_no', 'vendor', 'purchase_type', 'return_reason', 'item_value', 'dis_amt', 'taxable', 'tax_amount', 'cess_amount','total_amount','remarks']
        },
        export: {downloadName: 'PurchaseReturnReport'},
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'vendor',
            name: 'Vendor',
            displayType: "map",
            mapFn: (currentValue: any, row: any, col: any) => {
              return `${row.vendor.name}`;
            },
            sort: true
          },
          {
            fieldKey: 'return_no',
            name: 'Return No',
            sort: true
          },
          {
            fieldKey: 'due_date',
            name: 'Due Date',
            sort: true
          },
          
          {
            fieldKey: 'purchase_type',
            name: 'Purchase Type',
            displayType: "map",
            mapFn: (currentValue: any, row: any, col: any) => {
              return `${row.purchase_type.name}`;
            },
            sort: true
          },
          
          {
            fieldKey: 'return_reason',
            name: 'Return Reason',
            sort: true
          },
          // {
          //   fieldKey: 'item_value',
          //   name: 'Item value',
          //   sort: true
          // },
          // {
          //   fieldKey: 'dis_amt',
          //   name: 'Discount',
          //   sort: true
          // },
          // {
          //   fieldKey: 'taxable',
          //   name: 'Taxable Amount ',
          //   sort: true
          // },
          // {
          //   fieldKey: 'tax_amount',
          //   name: 'Tax Amount',
          //   sort: true
          // },
          // {
          //   fieldKey: 'cess_amount',
          //   name: 'Cess Amount',
          //   sort: true
          // },
          {
            fieldKey: 'total_amount',
            name: 'Total Refund Amount',
            sort: true
          },
          // {
          //   fieldKey: 'remarks',
          //   name: 'Remarks ',
          //   sort: true
          // }, 
        ]
      },
      // ========================= Outstanding Purchase Report ==============================
      OutstandingPurchaseReport: {
        apiUrl: 'purchase/purchase_order/?outstanding_purchases=true',
        pageSize: 10,
        globalSearch: {
          keys: ['vendor_name', 'invoice_no', 'invoice_date', 'due_date', 'total_amount', 'item_value', 'dis_amt', 'taxable', 'tax_amount', 'cess_amount','total_amount','remarks']
        },
        export: {downloadName: 'OutstandingPurchaseReport'},
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'vendor_name',
            name: 'Vendor',
            sort: true
          },
          {
            fieldKey: 'invoice_num',
            name: 'Invoice No',
            sort: true
          },
          {
            fieldKey: 'invoice_dates',
            name: 'Invoice Date',
            sort: true
          },
          {
            fieldKey: 'due_dates',
            name: 'Due Date',
            sort: true
          },
          {
            fieldKey: 'payment_status',
            name: 'Status',
            sort: true
          }, 
          {
            fieldKey: 'total_amounts',
            name: 'Total Amount',
            sort: true
          },
          {
            fieldKey: 'advance_payments',
            name: 'Advance Amount ',
            sort: true
          }, 
          {
            fieldKey: 'outstanding_amount',
            name: 'Outstanding Amount',
            sort: true
          },   
        ]
      },

      // ========================= PurchaseOrderStatusReport ==============================
      PurchaseOrderStatusReport: {
        apiUrl: 'purchase/purchase_order/',
        pageSize: 10,
        globalSearch: {
          keys: ['vendor', 'order_no', 'order_date','status_name' ,'total_amount']
        },
        export: {downloadName: 'PurchaseOrderStatusReport'},
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'vendor',
            name: 'Vendor',
            displayType: "map",
            mapFn: (currentValue: any, row: any, col: any) => {
              return `${row.vendor.name}`;
            },
            sort: true
          },
          {
            fieldKey: 'order_no',
            name: 'Order No',
            sort: true
          },
          {
            fieldKey: 'order_date',
            name: 'Order Date',
            sort: true
          },
          {
            fieldKey: 'delivery_date',
            name: 'Delivery Date',
            sort: true
          },
          {
            fieldKey: 'status_name',
            name: 'Status',
            displayType: "map",
            mapFn: (currentValue: any, row: any, col: any) => {
              return `${row.order_status.status_name}`;
            },
            sort: true
          },
          {
            fieldKey: 'advance_amount',
            name: 'Advance Amount',
            sort: true
          },
          {
            fieldKey: 'total_amount',
            name: 'Total Amount',
            sort: true
          },  
        ]
      },
      
       // ========================= Landed Cost Report ==============================
       LandedCostReport: {
        apiUrl: 'purchase/purchase_order/?landed_cost_report=true',
        pageSize: 10,
        globalSearch: {
          keys: ['vendor_name', 'return_no', 'total_purchases', 'total_cess', 'total_round_off', 'landed_cost']
        },
        export: {downloadName: 'LandedCostReport'},
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'vendor_name',
            name: 'Vendor',
            sort: true
          },
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
            fieldKey: 'due_date',
            name: 'Due Date',
            sort: true
          },
          {
            fieldKey: 'total_amount',
            name: 'Total Amount',
            sort: true
          },
          {
            fieldKey: 'advance_amount',
            name: 'Advance Amount',
            sort: true
          },
          {
            fieldKey: 'tax_amount',
            name: 'Tax Amount',
            sort: true
          },
          {
            fieldKey: 'cess_amount',
            name: 'Cess Amount',
            sort: true
          },
          {
            fieldKey: 'transport_charges',
            name: 'Transport Charges',
            sort: true
          },
          {
            fieldKey: 'dis_amt',
            name: 'Discount Amount',
            sort: true
          },
          {
            fieldKey: 'round_off',
            name: 'Round Off',
            sort: true
          },
          {
            fieldKey: 'landed_cost',
            name: 'Landed Cost',
            sort: true
          },
        ]
      },
       // ========================= Purchase Price Variance Report ==============================
       PurchasePriceVarianceReport: {
        apiUrl: 'purchase/purchase_order/?purchase_price_variance_report=true',
        pageSize: 10,
        globalSearch: {
          keys: ['product', 'vendor_name', 'order_date', 'min_price', 'max_price', 'avg_price']
        },
        export: {downloadName: 'PurchasePriceVarianceReport'},
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'product',
            name: 'Product',
            sort: true
          },
          {
            fieldKey: 'vendor_name',
            name: 'Vendor',
            sort: true
          },
          {
            fieldKey: 'order_date',
            name: 'Order Date',
            sort: true
          },
          // {
          //   fieldKey: 'min_price',
          //   name: 'Minimum Price',
          //   sort: true
          // },
          // {
          //   fieldKey: 'max_price',
          //   name: 'Maximum Price',
          //   sort: true
          // },
          {
            fieldKey: 'avg_price',
            name: 'Average Price',
            sort: true
          },
        ]
      },
      // ========================= Stock Replenishment Report ==============================
      StockReplenishmentReport: {
        apiUrl: 'purchase/purchase_order/?stock_replenishment_report=true',
        pageSize: 10,
        globalSearch: {
          keys: ['name', 'current_stock', 'minimum_stock', 'reorder_quantity']
        },
        export: {downloadName: 'StockReplenishmentReport'},
        defaultSort: { key: 'reorder_quantity', value: 'descend' },
        cols: [
          {
            fieldKey: 'name',
            name: 'Product Name',
            sort: true
          },
          {
            fieldKey: 'current_stock',
            name: 'Current Stock',
            sort: true
          },
          {
            fieldKey: 'minimum_stock',
            name: 'Minimum Stock',
            sort: true
          },
          {
            fieldKey: 'reorder_quantity',
            name: 'Suggested Order Quantity',
            sort: true
          }
        ]
      }
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
  
    // // ✅ Function to get total records from the table data
    // onDataLoaded(data: any[]) {
    //   this.totalRecords = data.length; // ✅ Update total records dynamically
    // }
  

}
