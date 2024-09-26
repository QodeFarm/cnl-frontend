import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss']
})
export class CreditNoteComponent {
  @ViewChild('salescreditnoteForm', { static: false }) salescreditnoteForm: TaFormComponent | undefined;
  
  sidebarMessage: string = '';
  showSaleCreditnoteList: boolean = false;
  orderNumber: any;
  loading = false;
  showForm: boolean = false;
  SaleCreditnoteEditID: any;
  productOptions: any;
  customerDetails: Object;
  customerOrders: any[] = []; 
  invoiceOptions: any[] = [];
  
  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.showSaleCreditnoteList = false;
    this.showForm = true;
    this.SaleCreditnoteEditID = null;


    this.setFormConfig();
    this.getOrderNo();
    this.formConfig.fields[0].fieldGroup[5].hide = true;

    // Check if there's a message in localStorage
    const message = localStorage.getItem('sidebarMessage');
    if (message) {
      this.sidebarMessage = message; // Set the message
      localStorage.removeItem('sidebarMessage'); // Clear it after displaying
      // Optionally, you can clear the message after a few seconds
      setTimeout(() => {
        this.sidebarMessage = ''; // Clear the message after 3 seconds
      }, 3000);
    }

  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }


  editSaleCreditnote(event) {
    this.SaleCreditnoteEditID = event;
    this.http.get('sales/sale_credit_notes/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;

        this.formConfig.pkId = 'credit_note_id';
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['credit_note_id'] = this.SaleCreditnoteEditID;
        this.formConfig.fields[0].fieldGroup[5].hide = false;

        this.showForm = true;
      }
    });
    this.hide();
  }

  circleSaleCreditnote(event) {
    this.SaleCreditnoteEditID = event;
    this.http.patch('sales/sale_credit_notes/' + event + '/', { order_status_id: '68ea000e-ce95-4145-a3c7-96efe6f9ff53' })
      .subscribe(
        (res: any) => {
          console.log("Result in circle:", res);
          // Check if the response contains credit_note_id
          if (res && res.credit_note_id) {
            console.log("Order status updated successfully:", res);
            // Store the message in localStorage
            localStorage.setItem('sidebarMessage', 'Order status changed to Approve');
            // Reload the page
            window.location.reload();
          } else {
            console.error("Error updating order status:", res);
          }
        },
        (error) => {
          console.error("HTTP error:", error);
        }
      );
  }  

  getOrderNo() {
    this.orderNumber = null;
  
        // Generate Sales Order Number
        this.http.get('masters/generate_order_no/?type=CN').subscribe((res: any) => {
          console.log("RES data in orderno : ", res.data.order_number)
          if (res.data && res.data.order_number) {
            this.orderNumber = res.data.order_number;
            this.formConfig.model['sale_credit_note']['credit_note_number'] = this.orderNumber;
          }
        });
  }

  // Displays the sales order list modal
  showSaleCreditNoteListFn() {
    this.showSaleCreditnoteList = true;
  }


  setFormConfig() {
    this.SaleCreditnoteEditID = null;
    this.formConfig = {
      url: "sales/sale_credit_notes/",
      title: '',
      formState: {
        viewMode: false
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'sale_credit_note_items',
          type: 'script',
          value: 'data.sale_credit_note_items.map(m=> {m.product_id = m.product.product_id;  return m ;})'
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
      model: {
        sale_credit_note: {},
        sale_credit_note_items: [{}]
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'sale_credit_note',
          fieldGroup: [
            {
              key: 'customer',
              type: 'select',
              className: 'col-3',
              templateOptions: {
                label: 'Select Customer',
                placeholder: 'Select Customer',
                dataKey: 'name',
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
                    console.log("Data in customer : ", data);
                    if (data && data.customer_id) {
                      this.formConfig.model['sale_credit_note']['customer_id'] = data.customer_id;
                      console.log("Datacustomer : ", data.customer_id);
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
              key: 'credit_note_number',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                label: 'Credit note no',
                placeholder: 'Enter Credit note no',
                required: true,
                readonly: true
                // disabled: true
              }
            },
            {
              key: 'credit_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-3',
              templateOptions: {
                type: 'date',
                label: 'Credit date',
                readonly: true,
                required: true
              }
            },
            {
              key: 'total_amount',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                type: 'number',
                label: 'Total amount',
                placeholder: 'Enter Total amount'
              }
            },
            {
              key: 'order_status',
              type: 'select',
              defaultValue: '085266c9-5020-41b3-ab58-1e4d88f4ff19',
              className: 'col-3',
              templateOptions: {
              label: 'Order status',
              dataKey: 'order_status_id',
              dataLabel: 'status_name',
              placeholder: 'Select Order status type',
              lazy: {
                url: 'masters/order_status/',
                lazyOneTime: true
              },
              //expressions: {
                //hide: '!model.sale_order_id',
              //},
              },
              hooks: {
              onChanges: (field: any) => {
                field.formControl.valueChanges.subscribe(data => {
                //console.log("ledger_account", data);
                if (data && data.order_status_id) {
                  this.formConfig.model['sale_credit_note']['order_status_id'] = data.order_status_id;
                }
                });
              }
              }
            },           
            {
              key: 'reason',
              type: 'textarea',
              className: 'col-4',
              templateOptions: {
                label: 'Reason',
                placeholder: 'Enter Reason',
              }
            },
          ]
        },
        {
          key: 'sale_credit_note_items',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Products',
            addText: 'Add Product',
            tableCols: [
              {
                name: 'product',
                label: 'Product'
              },
              {
                name: 'quantity',
                label: 'Quantity'
              },
              {
                name: 'total_price',
                label: 'Price'
              },
              {
                name: 'price_per_unit',
                label: 'Rate'
              }
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'product',
                type: 'select',
                templateOptions: {
                  label: 'Select Product',
                  dataKey: 'product_id',
                  hideLabel: true,
                  dataLabel: 'name',
                  options: [],
                  required: true,
                  lazy: {
                    url: 'products/products/?summary=true',
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      // this.productOptions = data;
                      if (field.form && field.form.controls && field.form.controls.price_per_unit && data && data.mrp) {
                        field.form.controls.price_per_unit.setValue(field.form.controls.price_per_unit.value || data.sales_rate)
                      }
                    });
                  }
                }
              },
              {
                type: 'input',
                key: 'quantity',
                templateOptions: {
                  type: 'number',
                  label: 'Qty',
                  placeholder: 'Enter Qty',
                  min: 1,
                  hideLabel: true,
                  required: true
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(quantity => {
                      const price_per_unit = field.form.controls.price_per_unit.value;
                      if (price_per_unit && quantity) {
                        const total_price = parseFloat(price_per_unit) * parseFloat(quantity);
                        field.form.controls.total_price.setValue(total_price);
                      }
                    });
                  }
                }
              },              
              {
                type: 'input',
                key: 'price_per_unit',
                templateOptions: {
                  type: 'number',
                  label: 'Rate',
                  placeholder: 'Enter Rate',
                  hideLabel: true,
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(price_per_unit => {
                      const quantity = field.form.controls.quantity.value;
                      if (price_per_unit && quantity) {
                        const total_price = parseFloat(price_per_unit) * parseFloat(quantity);
                        field.form.controls.total_price.setValue(total_price);
                      }
                    });
                  }
                }
              },              
              {
                key: 'total_price',
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: 'Amount',
                  placeholder: 'Enter Amount',
                  hideLabel: true,
                  disabled: true
                },
              },
            ]
          },
        },
      ]
    }
  }  
  

  // loadSaleInvoices(customerId: string) {
  //   console.log("Loading sale invoices for customer ID:", customerId);
  //   this.http.get(`sales/sale_invoice_order/?customer_id=${customerId}`).subscribe(
  //     (res: any) => {
  //       console.log("Response from API:", res);
  //       if (res && Array.isArray(res.data)) {
  //         this.invoiceOptions = res.data.map((invoice: any) => ({
  //           value: invoice.sale_invoice_id,
  //           label: invoice.invoice_no
  //         }));
  //         console.log("Updated invoiceOptions: ", this.invoiceOptions);
  
  //         const invoiceField = this.formConfig.fields.flatMap(field => field.fieldGroup || []).find(field => field.key === 'sale_invoice_id');
  //         console.log("Invoice Field: ", invoiceField);
  
  //         if (invoiceField) {
  //           invoiceField.templateOptions.options = this.invoiceOptions;
  //           console.log("Updated Invoice Field Options: ", invoiceField.templateOptions.options);
  //           this.cdr.detectChanges(); // Trigger change detection if necessary
  //         } else {
  //           console.error('Sale invoice field not found in formConfig');
  //         }
  //       } else {
  //         console.error('Unexpected response structure or empty data', res);
  //       }
  //     },
  //     error => {
  //       console.error('Error fetching sale invoices:', error);
  //     }
  //   );
  // }
  loadSaleInvoices(customerId: string) {
    console.log("Loading sale invoices for customer ID:", customerId);
    this.http.get(`sales/sale_invoice_order/?customer_id=${customerId}`).subscribe(
      (res: any) => {
        console.log("Response from API:", res);
        if (res && Array.isArray(res.data)) {
          this.invoiceOptions = res.data.map((invoice: any) => ({
            value: invoice.sale_invoice_id,
            label: invoice.invoice_no
          }));
          console.log("Updated invoiceOptions: ", this.invoiceOptions);
  
          // Find the invoice field in the formConfig and update its options
          const invoiceField = this.formConfig.fields.flatMap(field => field.fieldGroup || []).find(field => field.key === 'sale_invoice_id');
          console.log("Invoice Field: ", invoiceField);
  
          if (invoiceField) {
            // Update the options in the sale_invoice_id select field
            invoiceField.templateOptions.options = this.invoiceOptions;
  
            // Force the form control to reset the value to ensure the UI updates
            const saleInvoiceFormControl = this.formConfig.model.fields.get('sale_invoice_id');
            if (saleInvoiceFormControl) {
              // Reset the form control value to null to ensure the selection is updated properly
              saleInvoiceFormControl.reset();
  
              // Detect changes in case it's not reflecting immediately
              this.cdr.detectChanges();
  
              console.log("Updated Invoice Field Options: ", invoiceField.templateOptions.options);
            } else {
              console.error('Form control for sale_invoice_id not found');
            }
          } else {
            console.error('Sale invoice field not found in formConfig');
          }
        } else {
          console.error('Unexpected response structure or empty data', res);
        }
      },
      error => {
        console.error('Error fetching sale invoices:', error);
      }
    );
  }
  
}