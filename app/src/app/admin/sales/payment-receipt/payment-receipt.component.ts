import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TaFormComponent } from '@ta/ta-form';
import { TaTableComponent } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { PaymentReceiptListComponent } from './payment-receipt-list/payment-receipt-list.component';
 

@Component({
  selector: 'app-payment-receipt',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, PaymentReceiptListComponent],
  templateUrl: './payment-receipt.component.html',
  styleUrls: ['./payment-receipt.component.scss']
})
export class PaymentReceiptComponent implements OnInit {
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;
  @ViewChild('paymentreceiptForm', { static: false }) paymentreceiptForm: TaFormComponent | undefined;
  @ViewChild(PaymentReceiptListComponent) paymentReceiptListComponent!: PaymentReceiptListComponent;

  showPaymentReceiptList: boolean = false;
  SaleOrderEditID: any = null;
  showSuccessToast = false;
  showErrorToast = false;
  toastMessage = '';
  errorMessage = '';
  paymentReceiptData: any[] = [];
  
  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  voucherNumber: string | null = null;
  apiEndpoint = 'sales/payment_transactions/';
  
  // Store selected customer and account IDs
  selectedCustomerId: string | null = null;
  selectedAccountId: string | null = null;

  // Table configuration for payment receipt data
  curdConfig: any = {
    drawerSize: 500,
    drawerPlacement: 'right',
    hideAddBtn: true,
    tableConfig: {
      apiUrl: '', // We'll update this dynamically based on customer selection
      title: 'Payment Receipt',
      pkId: 'voucher_no',
      pageSize: 10,
      globalSearch: { keys: ['invoice_no', 'invoice_date', 'total_amount'] },
      export: { downloadName: 'PaymentReceiptList' },
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
          fieldKey: 'total_amount', 
          name: 'Total Amount', 
          sort: true,
          displayType: 'map',
          mapFn: (val: any) => val || '0.00'
        },
        { 
          fieldKey: 'pending_amount', 
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
          fieldKey: 'ref_date', 
          name: 'Ref Date', 
          sort: true,
          displayType: 'map',
          mapFn: (val: any) => val || 'No date'
        }
      ]
    }
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getVoucherNo();
    this.setFormConfig();
  }

  // Get the next voucher number from the API
  getVoucherNo() {
    console.log('Getting voucher number...');
    this.voucherNumber = null;

    // Use a more specific type parameter (PR-NEW) to force the backend to generate a unique new number
    this.http.get(`masters/generate_order_no/?type=PR`).subscribe(
      (res: any) => {
        console.log('Voucher API response:', res);
        if (res?.data?.order_number) {
          this.voucherNumber = res.data.order_number;
          console.log('New voucher number:', this.voucherNumber);
          
          // Update the model
          this.formConfig.model = this.formConfig.model || {};
          this.formConfig.model['payment_receipt_no'] = this.voucherNumber;
          
          // Update the form control if it exists
          if (this.paymentreceiptForm?.form) {
            const voucherControl = this.paymentreceiptForm.form.get('payment_receipt_no');
            if (voucherControl) {
              console.log('Setting voucher control value to:', this.voucherNumber);
              voucherControl.setValue(this.voucherNumber);
              this.cdr.detectChanges();
            } else {
              console.error('Voucher control not found in form');
            }
          }
        }
      },
      error => {
        console.error('Error getting voucher number:', error);
        this.showErrorToastMessage('Error generating voucher number. Please refresh the page and try again.');
      }
    );
  }

  // Fetch payment data for the selected customer
  fetchCustomerPaymentData(customerId: string) {
    console.log('Fetching payment data for customer:', customerId);
    
    // Update the API URL with the customer ID
    this.curdConfig.tableConfig.apiUrl = `sales/data_for_payment_receipt_table/${customerId}/`;
    
    // Make an HTTP request to check if data exists for this customer
    this.http.get(this.curdConfig.tableConfig.apiUrl).subscribe(
      (response: any) => {
        console.log('Customer payment data:', response);
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

  showDialog() {
    this.showSuccessToast = true;
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 3000);
  }

  // Shows a success toast message and automatically hides it after 3 seconds
  showSuccessToastMessage(message: string) {
    this.toastMessage = message;
    this.showSuccessToast = true;
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 3000);
  }

  // Shows an error toast message and automatically hides it after 4 seconds
  showErrorToastMessage(message: string) {
    this.errorMessage = message;
    this.showErrorToast = true;
    setTimeout(() => {
      this.showErrorToast = false;
    }, 4000);
  }

  // Form configuration
  formConfig: any = {
    url: 'sales/payment_transactions/',
    showActionBtn: true,
    submit: {
      label: 'Submit',
      beforeSubmitFn: (model: any) => {
        // Validation checks
        if (!this.selectedCustomerId) {
          this.showErrorToastMessage('Please select a customer');
          return false; // Prevent submission
        }
    
        if (!this.selectedAccountId) {
          this.showErrorToastMessage('Please select an account');
          return false; // Prevent submission
        }
    
        const payload = {
          payment_receipt_no: model.payment_receipt_no || this.voucherNumber,
          payment_method: model.payment_method || 'Credit Card',
          cheque_no: model.cheque_no || null,
          date: model.date,
          amount: parseFloat(model.amount),
          payment_status: model.payment_status || 'PENDING',
          customer: this.selectedCustomerId, // Already storing just the ID string
          account: this.selectedAccountId,   // Already storing just the ID string
          description: model.description 
        };
        
        console.log('Final payload:', payload);
        return payload;
      },
      submittedFn: (response: any) => {
        console.log('API response:', response);
        
        if (response && response.message === "Payment transactions processed successfully") {
          console.log('Payment transaction created:', response);
          
          // Display success notification
          this.showSuccessToastMessage('Payment transaction processed successfully!');
          
          // Clear the table data by resetting the API URL and clearing the table
          this.curdConfig.tableConfig.apiUrl = '';
          if (this.taTableComponent) {
            this.taTableComponent.rows = [];
            this.taTableComponent.total = 0;
            this.taTableComponent.loading = false;
          }
          
          // Reset the form and stored values
          this.paymentreceiptForm?.form.reset();
          this.selectedCustomerId = null;
          this.selectedAccountId = null;
          
          // Get a new voucher number
          this.getVoucherNo();
          
          // Force Angular change detection to update the UI
          this.cdr.detectChanges();
        } else {
          console.error('Error processing payment:', response);
          this.showErrorToastMessage('Error processing payment: ' + (response.message || 'Unknown error'));
        }
      }
    },
    errorFn: (error: any) => {
      console.error('API error:', error);
      let errorMessage = 'Error submitting payment.';
      if (error && error.error && error.error.message) {
        errorMessage += ' ' + error.error.message;
      }
      this.showErrorToastMessage(errorMessage);
    }
  };

  setFormConfig() {
    this.formConfig.fields = [
      {
        fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
        fieldGroup: [
          {
            key: 'date',
            type: 'date',
            className: 'col-md-4 col-sm-6 col-12',
            defaultValue: this.nowDate(),
            templateOptions: {
              label: 'Date',
              disabled: true,
              required: true,
            }
          },
          {
            key: 'payment_receipt_no',
            type: 'input',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Voucher No',
              required: true,
              disabled: true
            },
            hooks: {
              onInit: (field: any) => {
                if (field.formControl && this.voucherNumber) {
                  field.formControl.setValue(this.voucherNumber);
                }
              }
            }
          },
          {
            key: 'customer',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Customer',
              required: true,
              placeholder: 'Select Customer',
              dataKey: 'customer_id',
              dataLabel: 'name',
              lazy: {
                url: 'customers/customers/',
                lazyOneTime: true
              }
            },
            hooks: {
              onInit: (field: any) => {
                field.formControl.valueChanges.subscribe((data: any) => {
                  if (data && data.customer_id) {
                    console.log('Selected customer:', data);
                    // Store the customer ID for later use in API submission
                    this.selectedCustomerId = data.customer_id;
                    // Fetch customer payment data for the table
                    this.fetchCustomerPaymentData(data.customer_id);
                  }
                });
              }
            }
          },
          {
            key: 'account',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Cash/Bank A/c',
              required: true,
              placeholder: 'Select Account',
              dataKey: 'account_id',
              dataLabel: 'account_name',
              lazy: {
                url: 'finance/chart_of_accounts/',
                lazyOneTime: true
              }
            },
            hooks: {
              onInit: (field: any) => {
                field.formControl.valueChanges.subscribe((data: any) => {
                  if (data && data.account_id) {
                    console.log('Selected account:', data);
                    // Store the account ID for later use in API submission
                    this.selectedAccountId = data.account_id;
                  }
                });
              }
            }
          },
          {
            key: 'amount',
            type: 'number',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Amount',
              required: true,
              placeholder: 'Enter Amount'
            }
          },
          {
            key: 'cheque_no',
            type: 'input',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Cheque No',
              placeholder: 'Enter Cheque No'
            },
            // expressionProperties: {
            //   'templateOptions.required': 'model.payment_method === "Check"'
            // }
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
            key: 'salesman',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Salesman',
              options: [],
              lazy: {}
            }
          },
          {
            key: 'payment_method',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            defaultValue: 'Credit Card',
            templateOptions: {
              label: 'Payment Method',
              required: true,
              options: [
                { value: 'Credit Card', label: 'Credit Card' },
                { value: 'Cash', label: 'Cash' },
                { value: 'Bank Transfer', label: 'Bank Transfer' },
                { value: 'Check', label: 'Check' }
              ]
            }
          },
          {
            key: 'payment_status',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            defaultValue: 'PENDING',
            templateOptions: {
              label: 'Payment Status',
              required: true,
              options: [
                { value: 'PENDING', label: 'Pending' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'FAILED', label: 'Failed' }
              ]
            }
          },
          {
            key: 'description',
            type: 'textarea',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Description',
              placeholder: 'Enter Description',
              rows: 3
            },          }
        ]
      }
    ];
  }

  showPaymentReceiptListFn() {
    this.showPaymentReceiptList = true;
    this.paymentReceiptListComponent?.refreshTable();
  }

  editPaymentReceipt(event) {
    console.log('event', event);
    // Add logic to edit a payment receipt here
    this.SaleOrderEditID = event;
    this.http.get(`sales/payment_transactions/${event}`).subscribe((res: any) => {
      console.log('Payment receipt data:', res);
      if (res && res.data) {
        // Populate the form with the data
        this.formConfig.model = res.data;
        this.selectedCustomerId = res.data.customer;
        this.selectedAccountId = res.data.account;
        
        // Update form action to update
        this.formConfig.showActionBtn = true;
        this.formConfig.submit.label = 'Update';
        
        // Close the modal
        this.hide();
      }
    });
  }

  hide() {
    document.getElementById('modalClose')?.click();
  }
}