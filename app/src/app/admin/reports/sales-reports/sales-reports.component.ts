import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@ta/ta-core';
import { TaTableComponent, TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-sales-repots',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, FormsModule, NzSelectModule, NzModalModule, NzUploadModule, NzTableModule, NzButtonModule, NzIconModule],
  templateUrl: './sales-reports.component.html',
  styleUrls: ['./sales-reports.component.scss']
})
export class SalesRepotsComponent {
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;
  
  isAccordionOpen = true;
  selectedReportKey: string | null = null;
  tableConfig: TaTableConfig | null = null;

  isSuperUser: boolean = false;

  // Sale Register Properties
  isSaleRegister: boolean = false;
  selectedRegisterType: string = 'general';
  registerTypeOptions = [
    { value: 'general', label: 'General Register' },
    { value: 'detailed', label: 'Detailed Register' },
    { value: 'cancelled', label: 'Cancelled Voucher List' },
    { value: 'product_group_wise', label: 'Columnar (Product Group Wise)' },
    { value: 'product_category_wise', label: 'Columnar (Product Category Wise)' },
    { value: 'product_brand_wise', label: 'Columnar (Product Brand Wise)' },
    { value: 'hsn_wise', label: 'Columnar (HSN Code Wise)' },
    { value: 'daily_sales_summary', label: 'Daily Sales Summary' },
    { value: 'monthly_sales_summary', label: 'Monthly Sales Summary' }
  ];

  // Document Attachment Properties
  isAttachmentModalVisible: boolean = false;
  selectedInvoiceForAttachment: any = null;
  attachmentList: any[] = [];
  attachmentLoading: boolean = false;

  constructor(
    private localStorage: LocalStorageService,
    private http: HttpClient,
    private modal: NzModalService,
    private message: NzMessageService
  ) {
    const user = this.localStorage.getItem('user');
    this.isSuperUser = user?.is_sp_user === true;
  }

  // ============== Sale Register Configs ==============
  saleRegisterConfigs: { [key: string]: TaTableConfig } = {
    
    general: {
      apiUrl: 'sales/sale_invoice_order/?sale_register&register_type=general',
      pkId: "sale_invoice_id",
      showCheckbox: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['invoice_no', 'customer_name', 'date', 'city', 'voucher_type', 'amount']
      },
      export: { downloadName: 'SaleRegister_General' },
      defaultSort: { key: 'date', value: 'descend' },
      cols: [
        {
          fieldKey: 'docs',
          name: 'Docs',
          type: 'action',
          actions: [
            {
              type: 'callBackFn',
              icon: 'fa fa-upload',
              tooltip: 'Attach Documents',
              callBackFn: (row: any) => {
                this.openAttachmentModal(row);
              }
            }
          ]
        },
        {
          fieldKey: 's_no',
          name: 'S.No',
          sort: true
        },
        {
          fieldKey: 'voucher_type',
          name: 'Voucher Type',
          sort: true
        },
        {
          fieldKey: 'date',
          name: 'Date',
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
          fieldKey: 'city',
          name: 'City',
          sort: true
        },
        {
          fieldKey: 'gross_amount',
          name: 'Gross Amount',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'discount',
          name: 'Discount',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'tax_amount',
          name: 'Tax',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'round_off',
          name: 'Round Off',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'amount',
          name: 'Amount',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'status',
          name: 'Status',
          sort: true
        }
      ]
    },

    detailed: {
      apiUrl: 'sales/sale_invoice_order/?sale_register&register_type=detailed',
      pkId: "s_no",
      showCheckbox: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['doc_no', 'customer_name', 'product_name', 'date']
      },
      export: { downloadName: 'SaleRegister_Detailed' },
      defaultSort: { key: 'date', value: 'descend' },
      cols: [
        {
          fieldKey: 's_no',
          name: 'S.No',
          sort: true
        },
        {
          fieldKey: 'date',
          name: 'Date',
          sort: true
        },
        {
          fieldKey: 'doc_no',
          name: 'Doc No',
          sort: true
        },
        {
          fieldKey: 'customer_name',
          name: 'Customer',
          sort: true
        },
        {
          fieldKey: 'product_name',
          name: 'Product Name',
          sort: true
        },
        {
          fieldKey: 'qty',
          name: 'Qty',
          sort: true
        },
        {
          fieldKey: 'unit_name',
          name: 'Unit',
          sort: true
        },
        {
          fieldKey: 'rate',
          name: 'Rate',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'net_amount',
          name: 'Net Amount',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'amount',
          name: 'Amount',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        }
      ]
    },

    cancelled: {
      apiUrl: 'sales/sale_invoice_order/?sale_register&register_type=cancelled',
      pkId: "sale_invoice_id",
      showCheckbox: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['invoice_no', 'customer_name', 'date', 'city', 'amount']
      },
      export: { downloadName: 'SaleRegister_Cancelled' },
      defaultSort: { key: 'date', value: 'descend' },
      cols: [
        {
          fieldKey: 's_no',
          name: 'S.No',
          sort: true
        },
        {
          fieldKey: 'voucher_type',
          name: 'Voucher Type',
          sort: true
        },
        {
          fieldKey: 'date',
          name: 'Date',
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
          fieldKey: 'city',
          name: 'City',
          sort: true
        },
        {
          fieldKey: 'amount',
          name: 'Amount',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'status',
          name: 'Status',
          sort: true
        }
      ]
    },

    product_group_wise: {
      apiUrl: 'sales/sale_invoice_order/?sale_register&register_type=product_group_wise',
      pkId: "s_no",
      showCheckbox: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['group_name']
      },
      export: { downloadName: 'SaleRegister_ProductGroupWise' },
      cols: [
        {
          fieldKey: 's_no',
          name: 'S.No',
          sort: true
        },
        {
          fieldKey: 'group_name',
          name: 'Product Group',
          sort: true
        },
        {
          fieldKey: 'item_count',
          name: 'Item Count',
          sort: true
        },
        {
          fieldKey: 'qty_total',
          name: 'Qty Total',
          sort: true
        },
        {
          fieldKey: 'amount_total',
          name: 'Amount Total',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        }
      ]
    },

    product_category_wise: {
      apiUrl: 'sales/sale_invoice_order/?sale_register&register_type=product_category_wise',
      pkId: "s_no",
      showCheckbox: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['group_name']
      },
      export: { downloadName: 'SaleRegister_ProductCategoryWise' },
      cols: [
        {
          fieldKey: 's_no',
          name: 'S.No',
          sort: true
        },
        {
          fieldKey: 'group_name',
          name: 'Product Category',
          sort: true
        },
        {
          fieldKey: 'item_count',
          name: 'Item Count',
          sort: true
        },
        {
          fieldKey: 'qty_total',
          name: 'Qty Total',
          sort: true
        },
        {
          fieldKey: 'amount_total',
          name: 'Amount Total',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        }
      ]
    },

    product_brand_wise: {
      apiUrl: 'sales/sale_invoice_order/?sale_register&register_type=product_brand_wise',
      pkId: "s_no",
      showCheckbox: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['group_name']
      },
      export: { downloadName: 'SaleRegister_ProductBrandWise' },
      cols: [
        {
          fieldKey: 's_no',
          name: 'S.No',
          sort: true
        },
        {
          fieldKey: 'group_name',
          name: 'Product Brand',
          sort: true
        },
        {
          fieldKey: 'item_count',
          name: 'Item Count',
          sort: true
        },
        {
          fieldKey: 'qty_total',
          name: 'Qty Total',
          sort: true
        },
        {
          fieldKey: 'amount_total',
          name: 'Amount Total',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        }
      ]
    },

    hsn_wise: {
      apiUrl: 'sales/sale_invoice_order/?sale_register&register_type=hsn_wise',
      pkId: "s_no",
      showCheckbox: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['group_name']
      },
      export: { downloadName: 'SaleRegister_HSNWise' },
      cols: [
        {
          fieldKey: 's_no',
          name: 'S.No',
          sort: true
        },
        {
          fieldKey: 'group_name',
          name: 'HSN Code',
          sort: true
        },
        {
          fieldKey: 'item_count',
          name: 'Item Count',
          sort: true
        },
        {
          fieldKey: 'qty_total',
          name: 'Qty Total',
          sort: true
        },
        {
          fieldKey: 'amount_total',
          name: 'Amount Total',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        }
      ]
    },

    daily_sales_summary: {
      apiUrl: 'sales/sale_invoice_order/?sale_register&register_type=daily_sales_summary',
      pkId: "s_no",
      showCheckbox: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['date']
      },
      export: { downloadName: 'SaleRegister_DailySummary' },
      defaultSort: { key: 'date', value: 'descend' },
      cols: [
        {
          fieldKey: 's_no',
          name: 'S.No',
          sort: true
        },
        {
          fieldKey: 'date',
          name: 'Date',
          sort: true
        },
        {
          fieldKey: 'invoice_count',
          name: 'Invoice Count',
          sort: true
        },
        {
          fieldKey: 'gross_total',
          name: 'Gross Total',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'discount_total',
          name: 'Discount',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'tax_total',
          name: 'Tax',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'amount_total',
          name: 'Amount',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        }
      ]
    },

    monthly_sales_summary: {
      apiUrl: 'sales/sale_invoice_order/?sale_register&register_type=monthly_sales_summary',
      pkId: "s_no",
      showCheckbox: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['month']
      },
      export: { downloadName: 'SaleRegister_MonthlySummary' },
      cols: [
        {
          fieldKey: 's_no',
          name: 'S.No',
          sort: true
        },
        {
          fieldKey: 'month',
          name: 'Month',
          sort: true
        },
        {
          fieldKey: 'invoice_count',
          name: 'Invoice Count',
          sort: true
        },
        {
          fieldKey: 'gross_total',
          name: 'Gross Total',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'discount_total',
          name: 'Discount',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'tax_total',
          name: 'Tax',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        },
        {
          fieldKey: 'amount_total',
          name: 'Amount',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any) => {
            return currentValue ? `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
          }
        }
      ]
    }
  };

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
    this.loading = true;
    this.error = null;
    this.selectedReportKey = null;
    this.tableConfig = null;
    this.isAccordionOpen = true;
    this.isSaleRegister = false; // Reset sale register flag

    if (reportKey) {
      this.selectedReportKey = reportKey;
      this.tableConfig = this.reportsConfig[reportKey];
      this.isAccordionOpen = false;
    }

    setTimeout(() => {
      this.loading = false;
    },);
  }

  // Select Sale Register with dropdown
  selectSaleRegister() {
    this.loading = true;
    this.error = null;
    this.selectedReportKey = 'saleRegister';
    this.isSaleRegister = true;
    this.isAccordionOpen = false;
    
    // Load the selected register type config
    this.loadSaleRegisterConfig();
    
    setTimeout(() => {
      this.loading = false;
    },);
  }

  // Load Sale Register config based on selected type
  loadSaleRegisterConfig() {
    const configKey = `saleRegister_${this.selectedRegisterType}`;
    this.tableConfig = this.saleRegisterConfigs[this.selectedRegisterType];
  }

  // On Register Type dropdown change
  onRegisterTypeChange() {
    // Set tableConfig to null to destroy the table component
    this.tableConfig = null;
    
    // Use setTimeout to allow Angular to destroy the old component first
    setTimeout(() => {
      this.loadSaleRegisterConfig();
    }, 0);
  }

  onDataLoaded(data: any[]) {
    if (!data || data.length === 0) {
      this.error = 'No data available for this report.';
    }
    this.loading = false;
  }

  // ============== Document Attachment Methods ==============
  
  // Open attachment modal
  openAttachmentModal(row: any) {
    this.selectedInvoiceForAttachment = row;
    this.isAttachmentModalVisible = true;
    this.loadAttachments();
  }

  // Close attachment modal
  closeAttachmentModal() {
    this.isAttachmentModalVisible = false;
    this.selectedInvoiceForAttachment = null;
    this.attachmentList = [];
  }

  // Load attachments for the selected invoice
  loadAttachments() {
    if (!this.selectedInvoiceForAttachment) return;
    
    this.attachmentLoading = true;
    const orderId = this.selectedInvoiceForAttachment.sale_invoice_id;
    
    this.http.get<any>(`sales/order_attachements/?order_id=${orderId}`).subscribe({
      next: (response) => {
        this.attachmentList = response.data || response || [];
        this.attachmentLoading = false;
      },
      error: (err) => {
        console.error('Error loading attachments:', err);
        this.message.error('Failed to load attachments');
        this.attachmentLoading = false;
      }
    });
  }

  // Handle file upload via file input
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadAttachment(file);
    }
  }

  // Handle paste from clipboard
  onPasteAttachment(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            this.uploadAttachment(blob, 'pasted_image.png');
          }
        }
      }
    }
  }

  // Upload attachment to server
  uploadAttachment(file: File, fileName?: string) {
    if (!this.selectedInvoiceForAttachment) return;

    const formData = new FormData();
    formData.append('file', file, fileName || file.name);
    formData.append('order_id', this.selectedInvoiceForAttachment.sale_invoice_id);
    formData.append('attachment_name', fileName || file.name);
    
    this.attachmentLoading = true;
    
    this.http.post<any>(`sales/order_attachements/`, formData).subscribe({
      next: (response) => {
        this.message.success('File uploaded successfully');
        this.loadAttachments();
      },
      error: (err) => {
        console.error('Error uploading attachment:', err);
        this.message.error('Failed to upload file');
        this.attachmentLoading = false;
      }
    });
  }

  // Delete attachment
  deleteAttachment(attachment: any) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this attachment?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzOnOk: () => {
        this.http.delete(`sales/order_attachements/${attachment.attachment_id}/`).subscribe({
          next: () => {
            this.message.success('Attachment deleted');
            this.loadAttachments();
          },
          error: (err) => {
            console.error('Error deleting attachment:', err);
            this.message.error('Failed to delete attachment');
          }
        });
      }
    });
  }

  // Capture from camera (screenshot)
  captureAttachment() {
    // This would typically open a camera or screen capture
    // For now, we'll show a message
    this.message.info('Camera capture feature coming soon');
  }

  // //  Function to get total records from the table data
  // onDataLoaded(data: any[]) {
  //   this.totalRecords = data.length; //  Update total records dynamically
  // }
}



