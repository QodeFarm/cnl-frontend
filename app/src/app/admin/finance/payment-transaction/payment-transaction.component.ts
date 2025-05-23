import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { PaymentTransactionListComponent } from './payment-transaction-list/payment-transaction-list.component';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@Component({
  selector: 'app-payment-transaction',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, PaymentTransactionListComponent],
  templateUrl: './payment-transaction.component.html',
  styleUrls: ['./payment-transaction.component.scss']
})
export class PaymentTransactionComponent {
  showPaymentTransactionList: boolean = false;
  showForm: boolean = false;
  PaymentTransactionEditID: any;
  invoiceOptions: any[] = []; 
  @ViewChild(PaymentTransactionListComponent) PaymentTransactionListComponent!: PaymentTransactionListComponent;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  loadInvoices(order_type: string) {
    // Determine the URL based on the order_type
    let url = '';
    if (order_type === 'Sale') {
      url = 'sales/sale_invoice_order_get/';
    } else if (order_type === 'Purchase') {
      url = 'purchase/purchase_invoice_orders_get/';
    } else {
      console.error('Invalid order_type provided');
      return;
    }
  
    // Make the HTTP request to the determined URL
    this.http.get<any>(url).subscribe(response => {
      // Access the 'data' array from the response
      const invoices = response.data;  
      // Find the invoice field
      const invoiceField = this.formConfig.fields[0].fieldGroup.find(f => f.key === 'invoice');
      if (invoiceField) {
        // Update options with the fetched invoice data
        this.invoiceOptions = invoices.map(invoice => ({
          value: {invoice_id : invoice.invoice_no, invoice_no : invoice.invoice_no},
          label: invoice.invoice_no
        }));
  
        // Trigger change detection to refresh the dropdown
        invoiceField.templateOptions.options = this.invoiceOptions;
        this.cd.detectChanges();
      }
    }, error => {
      console.log('Error fetching invoices:', error);
    });
  };

  ngOnInit() {
    this.showPaymentTransactionList = false;
    this.showForm = true;
    this.PaymentTransactionEditID = null;
    // set form config
    this.setFormConfig();
  };
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editPaymentTransaction(event) {
    this.PaymentTransactionEditID = event;
    this.http.get('finance/payment_transactions/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'payment_id';
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };


  showPaymentTransactionListFn() {
    this.showPaymentTransactionList = true;
    this.PaymentTransactionListComponent?.refreshTable();
  };


  setFormConfig() {
    this.PaymentTransactionEditID = null;
    this.formConfig = {
      url: "finance/payment_transactions/",
      // title: 'payment transactions',
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'invoice',
          type: 'script',
          value: 'data.invoice.invoice_id'
        }
      ],	  
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model:{},	  
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          fieldGroup: [
            {
              key: 'order_type',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Order Type',
                placeholder: 'Select Order Type',
                required: true,
                options: [
                  { value: 'Sale', label: 'Sale' },
                  { value: 'Purchase', label: 'Purchase' }
                ]
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((OrderType: any) => {
                    if (OrderType) {
                      this.loadInvoices(OrderType);
                    }
                  });
                }
              }
            },
            {
              key: 'invoice',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Invoice',
                dataKey: 'invoice_id',
                dataLabel: "invoice_no",
                options: [],
                lazy: {
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['invoice']) {
                      this.formConfig.model['invoice_id'] = data.invoice_id;
                    } else {
                      console.error('Form config or invoice_id data model is not defined.');
                    }
                  });
                }
              }
            },                                     
            {
              key: 'payment_date',
              type: 'date',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Payment Date',
                placeholder: 'Select Payment Date',
                required: true,
              }
            },
            {
              key: 'payment_method',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Payment Method',
                placeholder: 'Select Payment Method',
                required: true,
                options: [
                  { value: 'Cash', label: 'Cash' },
                  { value: 'Bank Transfer', label: 'Bank Transfer' },
                  { value: 'Credit Card', label: 'Credit Card' },
                  { value: 'Cheque', label: 'Cheque' }
                ]
              }
            }, 
            {
              key: 'payment_status',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              defaultValue:  'Pending',
              templateOptions: {
                label: 'Payment Status',
                placeholder: 'Select Payment Status',
                required: true,  // Assuming it's a required field
                options: [
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'Failed', label: 'Failed' }
                ],
              }
            },                       
            {
              key: 'amount',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Amount',
                placeholder: 'Enter Amount',
                required: true,
              }
            },
            {
              key: 'reference_number',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Reference Number',
                placeholder: 'Enter Reference Number',
                required: false,
              },
            },
            {
              key: 'currency',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Currency',
                placeholder: 'Enter Currency',
                required: false,
              }
            },
            {
              key: 'transaction_type',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              defaultValue:  'Credit',
              templateOptions: {
                label: 'Transaction Type',
                placeholder: 'Select Transaction Type',
                required: true,
                options: [
                  { value: 'Credit', label: 'Credit' },
                  { value: 'Debit', label: 'Debit' }
                ],
              }
            },
            {
              key: 'notes',
              type: 'textarea',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Notes',
                placeholder: 'Enter Notes',
                required: false,
              }
            }
          ]
        }
      ]
    }
  }
}
