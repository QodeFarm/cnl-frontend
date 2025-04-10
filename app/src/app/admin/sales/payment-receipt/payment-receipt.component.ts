import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component';

@Component({
  selector: 'app-payment-receipt',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './payment-receipt.component.html',
  styleUrls: ['./payment-receipt.component.scss']
})
export class PaymentReceiptComponent implements OnInit {
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  formConfig: any = {
    fields: [
      {
        fieldGroupClassName: 'ant-row custom-form-block px-0 mx-0',
        fieldGroup: [
          {
            key: 'date',
            type: 'date',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Date',
              required: true
            }
          },
          {
            key: 'voucher_no',
            type: 'input',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Voucher No',
              required: true,
              disabled: true
            }
          },
          {
            key: 'customer',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            props: {
              label: 'Customer',
              dataKey: 'customer_id', // Dropdown value as customer_id
              dataLabel: 'name',
              options: [],
              lazy: {
                url: 'customers/customers/?summary=true', // Full URL
                lazyOneTime: true
              },
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                console.log('Hook initialized for customer field');
                field.formControl.valueChanges.subscribe((customer: any) => {
                  console.log('Value changed - Selected Customer Value:', customer);
                  let customerId = '';
                  
                  if (customer && typeof customer === 'object' && customer.customer_id) {
                    customerId = customer.customer_id;
                  } else if (typeof customer === 'string') {
                    customerId = customer;
                  } else {
                    console.log('Invalid customer selection:', customer);
                    
                    // Clear the API URL
                    this.curdConfig.tableConfig.apiUrl = '';
                    
                    // Clear local data array
                    this.paymentReceiptData = [];
                    
                    // Clear the table if taTableComponent is available
                    if (this.taTableComponent) {
                      this.taTableComponent.rows = [];
                      this.taTableComponent.total = 0;
                      this.taTableComponent.loading = false;
                    }
                    return;
                  }
                  
                  console.log('Extracted Customer ID:', customerId);
                  this.fetchCustomerPaymentData(customerId);
                });
              }
            }
          },
          {
            key: 'email',
            type: 'input',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Email',
              placeholder: 'Enter Email'
            }
          },
          {
            key: 'cash_bank',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Cash/Bank A/c',
              options: [
                { label: 'Cash', value: 'cash' },
                { label: 'Bank', value: 'bank' }
              ],
              required: true
            }
          },
          {
            key: 'amount',
            type: 'input',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Amount',
              type: 'number',
              required: true
            }
          },
          {
            key: 'cheque_no',
            type: 'input',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Cheque No',
              placeholder: 'Enter Cheque No'
            }
          },
          {
            key: 'party_bank_ref',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Party Bank Ref.',
              options: []
            }
          },
          {
            key: 'dated',
            type: 'date',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Dated',
              required: true
            }
          },
          {
            key: 'salesman',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Salesman',
              options: [],
              lazy: {}
            }
          },
        ]
      }
    ]
  };

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    hideAddBtn: true,
    tableConfig: {
      apiUrl: '', // We'll update this dynamically based on customer selection
      title: 'Payment Receipt',
      pkId: 'voucher_no',
      pageSize: 10,
      globalSearch: { keys: ['invoice_no', 'invoice_date', 'total_amount'] },
      export: { downloadName: 'PaymentRecepitList' },
      // defaultSort: { key: 'created_at', value: 'ascend' },
      cols: [
        { 
          fieldKey: 'invoice_no', 
          name: 'Sale Invoice', 
          sort: true,
          displayType: 'map',
          mapFn: (val: any) => val || 'No invoice number'
        },
        { 
          fieldKey: 'invoice_date', 
          name: 'Bill Date', 
          sort: true,
          displayType: 'map',
          mapFn: (val: any) => val || 'No date available'
        },
        { 
          fieldKey: 'due_date', 
          name: 'Due Date', 
          sort: true,
          displayType: 'map',
          mapFn: (val: any) => val || 'No due date'
        },
        { 
          fieldKey: 'bill_type', 
          name: 'Bill Type', 
          sort: true,
          displayType: 'map',
          mapFn: (val: any) => val || 'N/A'
        },
        { 
          fieldKey: 'total_amount', 
          name: 'Cash/Credit Amount (₹)', 
          sort: true,
          displayType: 'map',
          mapFn: (val: any) => val || '0.00'
        },
        { 
          fieldKey: 'outstanding', 
          name: 'Outstanding (₹)', 
          sort: true,
          displayType: 'map',
          mapFn: (val: any) => val || '0.00'
        },
        { 
          fieldKey: 'adjust_now', 
          name: 'Adjust Now (₹)', 
          sort: true,
          displayType: 'map',
          mapFn: (val: any) => val || '0.00'
        },
        { 
          fieldKey: 'dis_amt', 
          name: 'Cash Discount (₹)', 
          sort: true,
          displayType: 'map',
          mapFn: (val: any) => val || '0.00'
        },
        { 
          fieldKey: 'item_value', 
          name: 'Taxable (₹)', 
          sort: true,
          displayType: 'map',
          mapFn: (val: any) => val || '0.00'
        },
        { 
          fieldKey: 'ref_no', 
          name: 'Ref No', 
          sort: true,
          displayType: 'map',
          mapFn: (val: any) => val || 'No reference'
        },
        { 
          fieldKey: 'ref_date', 
          name: 'Ref Date', 
          sort: true,
          displayType: 'map',
          mapFn: (val: any) => val || 'No date'
        }
      ]
    },
    formConfig: this.formConfig
  };

  SaleOrderEditID: any;
  paymentReceiptData: any[] = []; // Table lo show cheyyali ani data store cheyyali
  customerPaymentData: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('Component initialized'); // Debug: Component load
  }

  fetchCustomerPaymentData(customerId: string) {
    // Update the API URL with the customer ID
    this.curdConfig.tableConfig.apiUrl = `sales/data_for_payment_receipt_table/${customerId}/`;
    
    // Make an HTTP request to check if data exists for this customer
    this.http.get(this.curdConfig.tableConfig.apiUrl).subscribe(
      (response: any) => {
        // If the response has data, refresh the table
        if (this.taTableComponent) {
          this.taTableComponent.refresh();
        }
      },
      (error) => {
        console.error('Error fetching customer payment data:', error);
        // Error indicates no data for this customer
        // Clear the table data
        this.paymentReceiptData = [];
        
        // Set empty data to the table
        if (this.taTableComponent) {
          // Since there's no clearData method, we'll set empty rows
          this.taTableComponent.rows = [];
          this.taTableComponent.total = 0;
          
          // This will trigger change detection in the table component
          this.taTableComponent.loading = false;
        }
      }
    );
  }
}