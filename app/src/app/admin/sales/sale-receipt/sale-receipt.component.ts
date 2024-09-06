import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { tap } from 'rxjs';

@Component({
  selector: 'app-sale-receipt',
  templateUrl: './sale-receipt.component.html',
  styleUrls: ['./sale-receipt.component.scss']
})
export class SaleReceiptComponent {
  showreceiptList: boolean = false;
  showForm: boolean = false;
  receiptEditID: any;
  invoiceOptions: any[] = []; // Store sale invoice options

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.showreceiptList = false;
    this.showForm = false;
    this.receiptEditID = null;
    // set form config
    this.setFormConfig();
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editReceipt(event) {
    console.log("receiptEditID : ", event);
    this.receiptEditID = event;
  
    this.http.get('sales/sale_receipts/' + event).subscribe((res: any) => {
      console.log("Result edit : ", res);
  
      if (res) {
        // Set the form model with the received data
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'sale_receipt_id';
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['sale_receipt_id'] = this.receiptEditID;
  
        // Extract the customer data from the sale invoice and prepopulate the form
        const customer = res.sale_invoice?.customer;
        const customerId = customer?.customer_id;
        const customerName = customer?.name;
        console.log("Customer_id : ", customerId, "Customer_name: ", customerName);
  
        if (customerId && customerName) {
          // Prepopulate the customer select field with both id and label
          this.formConfig.model['customer'] = { customer_id: customerId, name: customerName };
  
          this.loadSaleInvoices(customerId); // Load invoices for the customer
  
          // Set the selected sale invoice
          this.formConfig.model['sale_invoice_id'] = res.sale_invoice_id;
        } else {
          console.warn('No customer data found in the sale invoice');
        }
  
        this.showForm = true;
      }
    });
  
    this.hide();
  }
  
  showReceiptListFn() {
    this.showreceiptList = true;
  };

  setFormConfig() {
    this.receiptEditID = null;
    this.formConfig = {
      url: "sales/sale_receipts/",
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
      exParams: [],
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'customer',
              type: 'select',
              className: 'col-3',
              templateOptions: {
                label: 'Select Customer',
                placeholder: 'Select Customer',
                dataKey: 'customer_id',
                dataLabel: 'name',
                required: true,
                lazy: {
                  url: 'customers/customers/?summary=true',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (data && data.customer_id) {
                      this.loadSaleInvoices(data.customer_id);
                    }
                  });
                }
              }
            },
            {
              key: 'sale_invoice_id',
              type: 'select',
              className: 'col-3',
              templateOptions: {
                label: 'Sale Invoice',
                placeholder: 'Select Sale Invoice',
                dataKey: 'sale_invoice_id',
                dataLabel: 'invoice_no',
                required: true,
                options: [] // Initialize with empty options
              }
            },
            {
              key: 'receipt_name',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                label: 'Sale Receipt',
                placeholder: 'Enter receipt name',
              },
            },
            {
              key: 'description',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter description',
              },
            },
            {
              template: '<div class="custom-form-card-title"> Upload Receipt </div>',
              fieldGroupClassName: "ant-row",
            },
            {
              key: 'receipt_path',
              type: 'file',
              className: 'ta-cell col-4 custom-file-attachement',
              props: {
                "displayStyle": "files",
                "multiple": true
              }
            }
          ]
        }
      ]
    }
  }

  loadSaleInvoices(customerId: string) {
    this.http.get(`sales/sale_invoice_order/?customer_id=${customerId}`).subscribe((res: any) => {
      console.log("Customer in Sale invoice : ", res);
      if (res && Array.isArray(res.data)) {
        this.invoiceOptions = res.data.map((invoice: any) => ({
          value: invoice.sale_invoice_id,
          label: invoice.invoice_no
        }));
        console.log("Updated invoiceOptions: ", this.invoiceOptions);
  
        // Ensure formConfig is defined and fields are set
        console.log("FormConfig Fields: ", this.formConfig.fields);
  
        const invoiceField = this.formConfig.fields.flatMap(field => field.fieldGroup || []).find(field => field.key === 'sale_invoice_id');
        console.log("Invoice Field: ", invoiceField);
  
        if (invoiceField) {
          invoiceField.templateOptions.options = this.invoiceOptions;
          console.log("Updated Invoice Field Options: ", invoiceField.templateOptions.options);
          this.cdr.detectChanges();
        } else {
          console.error('Sale invoice field not found');
        }
      } else {
        console.error('Unexpected response structure or empty data');
      }
    });
  }
}
