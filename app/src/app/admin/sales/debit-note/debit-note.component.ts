import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { DebitNoteListComponent } from './debit-note-list/debit-note-list.component';
@Component({
  selector: 'app-debit-note',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule,DebitNoteListComponent],
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.scss']
})
export class DebitNoteComponent {
  @ViewChild('salesdebitnoteForm', { static: false }) salesdebitnoteForm: TaFormComponent | undefined;
  @ViewChild(DebitNoteListComponent) DebitNoteListComponent!: DebitNoteListComponent;

  sidebarMessage: string = '';
  showSaleDebitnoteList: boolean = false;
  orderNumber: any;
  showForm: boolean = false;
  SaleDebitnoteEditID: any;
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

    this.showSaleDebitnoteList = false;
    this.showForm = true;
    this.SaleDebitnoteEditID = null;


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

  updateSaleDebitNote() {
    const saleDebitId = this.formConfig.model.sale_debit_note.debit_note_id;
    console.log("Sale return id in edit : ", saleDebitId);
    const saleCreditPayload = {
      sale_debit_note: this.formConfig.model.sale_debit_note,
      sale_debit_note_items: this.formConfig.model.sale_debit_note_items
    };

    // PUT request to update Sale Return Order
    this.http.put(`sales/sale_debit_notes/${saleDebitId}/`, saleCreditPayload).subscribe(
      (response) => {
        this.showSuccessToast = true;
        this.toastMessage = 'Record Updated successfully';
        this.ngOnInit();  // Optionally reset the form after successful submission
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 3000);
      },
      (error) => {
        console.error('Error updating Sale Debit Note:', error);
        // Optionally handle error
      }
    );
  }

  editSaleDebitnote(event) {
    this.SaleDebitnoteEditID = event;
    this.http.get('sales/sale_debit_notes/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;

        this.formConfig.pkId = 'debit_note_id';
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['debit_note_id'] = this.SaleDebitnoteEditID;
        this.formConfig.fields[0].fieldGroup[5].hide = false;

        this.showForm = true;
      }
    });
    this.hide();
  }

  // Example for how the form submission might trigger the update
  onSubmit() {
    if (this.formConfig.submit.label === 'Update') {
      this.updateSaleDebitNote(); // Call update on submission
    } else {
      this.handleSubmission(); // Otherwise, create a new record
    }
  }

  circleSaleDebitnote(event) {
    this.SaleDebitnoteEditID = event;
    this.http.patch('sales/sale_debit_notes/' + event + '/', { order_status_id: '68ea000e-ce95-4145-a3c7-96efe6f9ff53' })
      .subscribe(
        (res: any) => {
          // Check if the response contains credit_note_id
          if (res && res.debit_note_id) {
            // Store the message in localStorage
            localStorage.setItem('sidebarMessage', 'Order status Approved');
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
        this.http.get('masters/generate_order_no/?type=DN').subscribe((res: any) => {
          console.log("RES data in orderno : ", res.data.order_number)
          if (res.data && res.data.order_number) {
            this.orderNumber = res.data.order_number;
            this.formConfig.model['sale_debit_note']['debit_note_number'] = this.orderNumber;
          }
        });
  }
  
  // Displays the sales order list modal
  showSaleDebitNoteListFn() {
    this.showSaleDebitnoteList = true;
    this.DebitNoteListComponent?.refreshTable();
  }

  setFormConfig() {
    this.SaleDebitnoteEditID = null;
    this.formConfig = {
      // url: "sales/sale_debit_notes/",
      title: '',
      formState: {
        viewMode: false
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'sale_debit_note_items',
          type: 'script',
          value: 'data.sale_debit_note_items.map(m=> {m.product_id = m.product.product_id;  return m ;})'
        }
      ],
      submit: {
        label: 'Submit',
        submittedFn: () =>  this.onSubmit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model: {
        sale_debit_note: {},
        sale_debit_note_items: [{}]
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          key: 'sale_debit_note',
          fieldGroup: [
            {
              key: 'customer',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
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
                      this.formConfig.model['sale_debit_note']['customer_id'] = data.customer_id;
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
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Sale Invoice',
                placeholder: 'Select Sale Invoice',
                // dataKey: 'sale_invoice_id',
                // dataLabel: 'invoice_no',
                valueProp: 'sale_invoice_id',  // Important - specify the value field
                labelProp: 'invoice_no',   
                required: true,
                options: [] // Initialize with empty options
              }
            },
            {
              key: 'debit_note_number',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Credit note no',
                placeholder: 'Enter Credit note no',
                required: true,
                readonly: true
                // disabled: true
              }
            },
            {
              key: 'debit_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                type: 'date',
                label: 'Debit date',
                readonly: true,
                required: true
              }
            },
            {
              key: 'total_amount',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                type: 'number',
                label: 'Total amount',
                placeholder: 'Enter Total amount'
              }
            },
            {
              key: 'order_status',
              type: 'order-status-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
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
                  this.formConfig.model['sale_debit_note']['order_status_id'] = data.order_status_id;
                }
                });
              }
              }
            },           
            {
              key: 'reason',
              type: 'textarea',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Reason',
                placeholder: 'Enter Reason',
              }
            },
          ]
        },
        {
          key: 'sale_debit_note_items',
          type: 'table',
          className: 'custom-form-list product-table',
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
                      this.productOptions = data;
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
                // defaultValue: 1,
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
                    field.formControl.valueChanges.subscribe(data => {
                      if (field.form && field.form.controls && field.form.controls.price_per_unit && data) {
                        const price_per_unit = field.form.controls.price_per_unit.value;
                        console.log("per unit price : ", price_per_unit)
                        const quantity = data;
                        console.log("quantity : ", quantity)
                        if (price_per_unit && quantity) {
                          field.form.controls.total_price.setValue(price_per_unit * quantity);
                        }

                      }
                    })
                  },
                  onChanges: (field: any) => {

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
                    field.formControl.valueChanges.subscribe(data => {

                      if (field.form && field.form.controls && field.form.controls.quantity && data) {
                        const quantity = field.form.controls.quantity.value;
                        const rate = data;
                        if (rate && quantity) {
                          field.form.controls.total_price.setValue(parseInt(rate) * parseInt(quantity));
                        }
                      }
                    })
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
  
  // Method to calculate total price from sale_credit_note_items
  calculateTotalPrice(): number {
    return this.formConfig.model.sale_debit_note_items.reduce((total: number, item: any) => {
      return total + (item.total_price || 0);
    }, 0);
  }

  showDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'flex'; // Show the dialog
    }
  }

  // Function to close the custom dialog
  closeDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'none'; // Hide the dialog
    }
  }

  // Method to handle form submission and show disclaimer
  handleSubmission() {
    const total_price = this.calculateTotalPrice();
    const total_amount = this.formConfig.model.sale_debit_note.total_amount || 0;

    // Check if there's a mismatch
    if (total_amount !== total_price) {
      this.showDialog();
    } else {
      // If total amounts match, create the record directly
      this.createRecord();
    }
  }

  toastMessage = '';
  showSuccessToast = false;
  // Method to create the record
  createRecord() {
    const recordData = {
      sale_debit_note: this.formConfig.model.sale_debit_note,
      sale_debit_note_items: this.formConfig.model.sale_debit_note_items.map(item => ({
        quantity: item.quantity,
        price_per_unit: item.price_per_unit,
        total_price: item.total_price,
        product_id: item.product?.product_id
      })),
    }
    
    // Example of using Angular's HttpClient to post data
    this.http.post('sales/sale_debit_notes/', recordData)
      .subscribe({
        next: (response) => {
          this.showSuccessToast = true;
          this.toastMessage = 'Record Created successfully';
          this.ngOnInit();  // Optionally reset the form after successful submission
          setTimeout(() => {
            this.showSuccessToast = false;
          }, 3000);
        },
        error: (error) => {
          console.error('Error creating record:', error);
          alert('An error occurred while creating the record.');
        }
      });
  }

  loadSaleInvoices(customerId: string) {
    this.http.get(`sales/sale_invoice_order/?customer_id=${customerId}`).subscribe((res: any) => {
      if (res && Array.isArray(res.data)) {
        // this.invoiceOptions = res.data.map((invoice: any) => ({
        //   value: invoice.sale_invoice_id,
        //   label: invoice.invoice_no
        // }));
        this.invoiceOptions = res.data;
  
        const invoiceField = this.formConfig.fields.flatMap(field => field.fieldGroup || []).find(field => field.key === 'sale_invoice_id');
        console.log("Invoice Field: ", invoiceField);
  
        if (invoiceField) {
          invoiceField.templateOptions.options = this.invoiceOptions;
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