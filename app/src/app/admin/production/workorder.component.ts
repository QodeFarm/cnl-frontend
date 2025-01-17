import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { WorkOrderListComponent } from './work-order-list/work-order-list.component';
import { TaCurdConfig } from '@ta/ta-curd';


@Component({
  selector: 'app-production',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, WorkOrderListComponent],
  templateUrl: './workorder.component.html',
  styleUrls: ['./workorder.component.scss']
})
export class WorkorderComponent implements OnInit {
  showCreateBomButton = false
  isBomButtonDisabled = false
  showWorkorderList: boolean = false;
  showForm: boolean = true;
  WorkOrdrEditID: any;
  WorkOrderBoardView: any; //
  formConfig: TaFormConfig = {};
  @ViewChild(WorkOrderListComponent) WorkOrderListComponent!: WorkOrderListComponent;

  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.setFormConfig();
  
    // Check if navigation state contains work order data for editing
    if (history.state && (history.state.productDetails || history.state.saleOrderDetails)) {
      // console.log('Received work order data from navigation:', history.state);
      this.populateFormWithData(history.state);
      this.showForm = true; // Ensure the form is displayed
    }
    this.hideFields(true); // Hides fields at indexes 5, 4, and 9
  }

  hideFields(hide: boolean): void {
    // Array of indexes to hide or show
    const fieldsToToggle = [5, 6, 4, 9];
  
    // Loop through the array and toggle the `hide` property based on the argument
    fieldsToToggle.forEach(index => {
      this.formConfig.fields[0].fieldGroup[index].hide = hide;
    });
  };  

  hide() {
    const modalCloseButton = document.getElementById('modalClose');
    if (modalCloseButton) {
      modalCloseButton.click();
    }
  }

  editWorkorder(event: any) {
    this.showCreateBomButton = false
    this.hideFields(false); // Shows fields at indexes 5, 4, and 9
    console.log('event', event);
    this.WorkOrdrEditID = event;
    this.http.get('production/work_order/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res.data;
        this.formConfig.model.work_order['completed_qty'] = 0
        this.formConfig.showActionBtn = true;
        // Set labels for update
        this.formConfig.pkId = 'work_order_id';
        this.formConfig.submit.label = 'Update';
        // Show form after setting form values
        this.formConfig.model['work_order_id'] = this.WorkOrdrEditID;
        this.showForm = true;
        // this.formConfig.fields[0].fieldGroup[2].hide = false
      }
    });
    this.hide();
  }

  showWorkorderListFn() {
    this.showWorkorderList = true;
    this.WorkOrderListComponent?.refreshTable();
  }

   // Method to populate the form with data (when admin wants to create a work order from sale order)
   populateFormWithData(data: any) {
    if (data.productDetails && data.productDetails.length > 0) {
        // Map the Material section (already working as expected)
        this.formConfig.model['bom'] = data.productDetails.map((product: any) => ({
            product_id: product.product_id,
            quantity_required: product.quantity || 0
        }));

        // Map the main Product and Quantity fields
        const mainProduct = data.productDetails[0]; // Assuming the first item is the main product
        this.formConfig.model['work_order']['product_id'] = mainProduct.product_id || null;
        this.formConfig.model['work_order']['quantity'] = mainProduct.quantity || 0;
    }

    if (data.saleOrderDetails) {
        // Map additional details if present
        this.formConfig.model['work_order'] = {
            ...this.formConfig.model['work_order'],
            sale_order_id: data.saleOrderDetails.sale_order_id || null, // Capture sale_order_id
            product_id: data.saleOrderDetails.product?.product_id || data.saleOrderDetails.product_id || this.formConfig.model['work_order']['product_id'],
            quantity: data.saleOrderDetails.quantity || this.formConfig.model['work_order']['quantity'],
            start_date: data.saleOrderDetails.order_date || null,
            end_date: data.saleOrderDetails.delivery_date || null
        };
    }

    // console.log('Form model after population:', this.formConfig.model);
}


submitWorkOrder() {
  // Add the sale_order_id to the payload if available
  const payload = {
      ...this.formConfig.model,
      sale_order_id: this.formConfig.model['work_order']['sale_order_id']
  };

  this.http.post('production/work_order/', payload).subscribe(response => {
      // console.log('Work order submitted successfully:', response);
  });
}

populateBom(product_id:any){
  if (this.formConfig.model.work_order && !this.formConfig.model.work_order.work_order_id) {
    const url = `production/bom/?product_id=${product_id}` // To get 'bom_id', filter by  selected product_id
    let bom_data = {}
    this.http.get(url).subscribe((response: any) => {
      let bom_id = null
      if (response.data[0]){
        bom_id  = response.data[0].bom_id // fetch 'bom_id'
        this.http.get(`production/bom/${bom_id}`).subscribe((data: any) => { // go to the URL with fetched 'bom_id' and get the 'data'.
          const bom = {
            'work_order':this.formConfig.model.work_order,
            'bom': data.data.bill_of_material, // asign fetched 'bill_of_material' to BOM
            'work_order_machines': this.formConfig.model.work_order_machines,
            'workers': this.formConfig.model.workers,
            'work_order_stages': this.formConfig.model.work_order_stages,
          }
          this.showCreateBomButton = false; 
          // this.isBomButtonDisabled = true;
          this.formConfig.model = bom // fill the form with data.
        });
      } else { // "If a user selects products that do not contain a BOM, the BOM will be refreshed with an empty form."
        const bom = {
          'work_order': this.formConfig.model.work_order,
          'bom': [{}],
          'work_order_machines': this.formConfig.model.work_order_machines,
          'workers': this.formConfig.model.workers,
          'work_order_stages': this.formConfig.model.work_order_stages,
        }
        this.formConfig.model = bom // fill the form with data.
        
        this.isBomButtonDisabled = false;
        if (!this.formConfig.model.work_order.product_id){
          this.showCreateBomButton = false
        } else {
          this.showCreateBomButton = true // No BOM for selected product - show the 'Create BOM' Button.
        }
      }
    })
  }
};


createBom(){
  const now = new Date();
  const json_data = {
    'bom' : {
        "bom_name": "Created from Work Order",
        "notes": `This BOM Created from WorkOrder on ${formatDate(now, 'dd-MM-yyyy HH:mm', 'en-US')}`,
        "product_id": this.formConfig.model.work_order.product_id
    },
    'bill_of_material':
      this.formConfig.model.bom
  }

  this.http.post('production/bom/', json_data)
  .subscribe({
    next: (response) => {
      this.showCreateBomButton = true;  // Ensure the button is still visible
      this.isBomButtonDisabled = true;  // Disable the button after success
      alert('BOM created successfully!');
    },
    error: (error) => {
      console.error('Error creating BOM:', error);
      this.showCreateBomButton = true;  // Ensure the button is still visible
      this.isBomButtonDisabled = false; // Keep the button enabled if there's an error
      alert('Error creating BOM. Main Product and Bill of material should be selected.');
    }
  });

};

updateInventory() {
  const data = this.formConfig.model.work_order
  data['work_order_id'] = this.WorkOrdrEditID
  // update the work order
  this.http.put(`production/work_orders_get/${this.WorkOrdrEditID}/`, data || {})
  .subscribe({
    next: (response) => {
      alert('Inventory Updated successfully!');
    },
    error: (error) => {
      console.error('Error Updating the Inventory:', error);
      alert('Error Updating the Inventory.');
    }
  });

  // update the product balance
  const product = this.formConfig.model.work_order.product_id
  const color = this.formConfig.model.work_order.color_id || null
  const size = this.formConfig.model.work_order.size_id || null
  const completed_qty = this.formConfig.model.work_order.completed_qty

  // Fetch existing product balance from Products table
  const product_url = `products/products_get/${product}/`
  this.http.get(product_url).subscribe((data: any) => {
    if (data) {
      const existing_product_balance = data.balance

      // sum the balance by adding existing balance with completed quantity.
      const total = parseInt(existing_product_balance, 10) + parseInt(completed_qty, 10);  // this.formConfig.model.work_order?.completed_qty
      console.log('Total product bal :', total)
      const new_product_balance = { 'balance': total}
      console.log({'old balance':existing_product_balance, 'new bal': total})

      // Update new product balance
      this.http.patch(product_url, new_product_balance).subscribe({
        next: (response) => {
          console.log('response :', response)
          alert('Product Balance Updated successfully!');
        },
        error: (error) => {
          console.error('Error Fetching Products:', error);
          alert('Error Fetching Products.');
        }
      });
    }
  })

  let variation_url = `products/product_variations/?product_id=${product}&color_id=${color}&size_id=${size}`;
  this.http.get(variation_url).subscribe((data: any) => {
    if (data && Array.isArray(data.data) && data.data.length == 1) {
      const variation_id = data.data[0].product_variation_id
      const existing_qty = data.data[0].quantity || 0
      const new_qty = { 'quantity': parseInt(existing_qty, 10) + parseInt(completed_qty, 10)}

      console.log('var-url : ', variation_url)

      this.http.patch(`products/product_variations/${variation_id}/`, new_qty).subscribe({
        next: (response) => {
          alert('Product Variation Balance Updated successfully!');
          console.log('Variation updated : ', response)
        },
        error: (error) => {
          console.error('Error Fetching Product Variation:', error);
          alert('Error Fetching Product Variation.');
        }
      });
    } else {
      console.log('NO variations . it is Direct Product ***')
    }
  });
}

curdConfig: TaCurdConfig = {
  drawerSize: 500,
  drawerPlacement: 'top',
  tableConfig: {
    apiUrl: 'products/colors/',
    // title: 'Color',
    pageSize: 10,
  },
  formConfig: {
    url: 'products/colors/',
    title: 'BOM',
    pkId: "bom_id",
    exParams: [],
    fields: [{
      fieldGroupClassName: "row",
      fieldGroup: [
        {
        key: 'bom_name',
        type: 'input',
        className: '',
        templateOptions: {
          label: 'BOM Name',
          placeholder: 'Enter BOM Name',
          required: true,
        }
      },
      {
        key: 'notes',
        type: 'textarea',
        className: '',
        templateOptions: {
          label: 'Notes',
          placeholder: 'Enter Notes',
          required: true,
        }
      }
    ]
    }]
  }
}

  setFormConfig() {
    this.WorkOrdrEditID =null
    this.formConfig = {
      url: "production/work_order/",
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
      model: {
        work_order: {},
		    bom:[{}],
        work_order_machines: [{}],
        workers:[{}],
        work_order_stages:[{}]
      },
      fields: [
        //-----------------------------------------work_order -----------------------------------//
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'work_order',
          fieldGroup: [
            {
              key: 'product_id',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Product',
                placeholder: 'Select Product',
                dataKey: 'product_id',
                dataLabel: 'name',
                required: true,
                bindId: true,
                lazy: {
                  url: 'products/products/',
                  lazyOneTime: true
                },
              },
              hooks: {
                onInit: (field: any) => {
                  // Subscribe to changes in product_id field
                  field.formControl.valueChanges.subscribe((selectedProductId) => {
                    const product = field.formControl.value;
                    this.populateBom(product)
            
                    // Clear previous size and color fields and their values
                    const workOrderGroup = this.formConfig.fields.find((f: any) => f.key === 'work_order');
                    if (workOrderGroup && workOrderGroup.fieldGroup) {
                      const sizeField = workOrderGroup.fieldGroup.find((f: any) => f.key === 'size');
                      const colorField = workOrderGroup.fieldGroup.find((f: any) => f.key === 'color');
            
                      if (sizeField) {
                        sizeField.templateOptions.required = false; // Make the field not required
                        sizeField.formControl.setValue(null); // Clear current value
                        sizeField.templateOptions.options = []; // Clear previous options
                        sizeField.formControl.disable(); // Temporarily disable until new data arrives
                      }
            
                      if (colorField) {
                        colorField.formControl.setValue(null); // Clear current value
                        colorField.templateOptions.options = []; // Clear previous options
                        colorField.formControl.disable(); // Temporarily disable until new data arrives
                      }
            
                      // Fetch size and color options for the selected product
                      if (product) {
                        this.http.get(`products/product_variations/?product_id=${product}`).subscribe((response: any) => {
                          if (response.data.length > 0) {
                            const availableSizes = response.data.map((variation: any) => ({
                              label: variation.size?.size_name || '----',
                              value: {
                                size_id: variation.size?.size_id || null,
                                size_name: variation.size?.size_name || '----'
                              }
                            }));
            
                            const availableColors = response.data.map((variation: any) => ({
                              label: variation.color?.color_name || '----',
                              value: {
                                color_id: variation.color?.color_id || null,
                                color_name: variation.color?.color_name || '----'
                              }
                            }));
            
                            // Update size field
                            if (sizeField) {
                              sizeField.formControl.enable(); // Enable field
                              sizeField.templateOptions.required = true; // Make the field required
                              sizeField.templateOptions.options = availableSizes.filter(
                                (item, index, self) => index === self.findIndex((t) => t.value.size_id === item.value.size_id)
                              ); // Ensure unique options
                            }

                          } else {
                            console.log(`For Product: ${product} - No sizes or colors available.`);
                            if (sizeField) {
                              sizeField.formControl.disable();
                              sizeField.templateOptions.options = [];
                            }
                            if (colorField) {
                              colorField.formControl.disable();
                              colorField.templateOptions.options = [];
                            }
                          }
                        });
                      }
                    } else {
                      console.error('Work Order Group not found.');
                    }
                  });
                }
              }
            },
            {
              key: 'size',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Size',
                dataKey: 'size_id',
                dataLabel: 'size_name',
                options: [],
                disabled: true,
                required: false,
                lazy: {
                  lazyOneTime: true,
                  url: `products/sizes/`
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    const index = field.parent.key;
                    if (!this.formConfig.model['work_order']) {
                      console.error(`Size at index ${index} is not defined. Initializing...`);
                      this.formConfig.model['work_order'] = {};
                    }
                    this.formConfig.model['work_order']['size_id'] = data?.size_id || null;
                  });
                },
                onInit: (field: any) => {
                  // Trigger color field update whenever size changes
                  field.formControl.valueChanges.subscribe(selectedSizeId => {
                    const workOrderGroup = this.formConfig.fields.find((f: any) => f.key === 'work_order');
                    if (workOrderGroup && workOrderGroup.fieldGroup) {
                      const colorField = workOrderGroup.fieldGroup.find((f: any) => f.key === 'color');
                      const size = field.formControl.value;
            
                      if (size) {
                        const work_order = this.formConfig.model.work_order;
            
                        // Determine the API URL based on size
                        let url = `products/product_variations/?product_id=${work_order.product_id}&size_id=${size.size_id}`;
                        if (!size.size_id) {
                          url = `products/product_variations/?product_id=${work_order.product_id}&size_isnull=True`;
                        }
            
                        // Fetch available colors based on selected size
                        this.http.get(url).subscribe((response: any) => {
                          if (response.data && response.data.length > 0) {
                            // Map available colors
                            const availableColors = response.data.map((variation: any) => ({
                              label: variation.color?.color_name || '----',
                              value: {
                                color_id: variation.color?.color_id || null,
                                color_name: variation.color?.color_name || '----'
                              }
                            }));
            
                            // Filter unique colors
                            const uniqueColors = availableColors.filter((item, index, self) => 
                              index === self.findIndex((t) => t.value.color_id === item.value.color_id)
                            );
            
                            // Update and enable the color field
                            if (colorField) {
                              colorField.formControl.setValue(null); // Reset color field value
                              colorField.formControl.enable();
                              colorField.templateOptions.required = true; // Make the field required
                              colorField.templateOptions.options = uniqueColors; // Update options
                            }
                          } else {
                            // No colors available, disable the color field and set its value to null
                            if (colorField) {
                              colorField.templateOptions.required = false; // Make the field not required
                              colorField.formControl.setValue(null); // Reset color field value
                              colorField.formControl.disable();
                              colorField.templateOptions.options = []; // Clear options
                            }
                          }
                        });
                      } else {
                        // If size is null or invalid, disable the color field
                        if (colorField) {
                          colorField.templateOptions.required = false; // Make the field not required
                          colorField.formControl.setValue(null); // Reset color field value
                          colorField.formControl.disable();
                          colorField.templateOptions.options = []; // Clear options
                        }
                      }
                    }
                  });
                }
              }
            },
            {
              key: 'color',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Color',
                dataKey: 'color_id',
                dataLabel: 'color_name',
                options: [],
                required: false,
                disabled: true,
                lazy: {
                  lazyOneTime: true,
                  url : 'products/colors/'
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    const index = field.parent.key;
                    if (!this.formConfig.model['work_order'][index]) {
                      console.error(`Color at index ${index} is not defined. Initializing...`);
                      this.formConfig.model['work_order'][index] = {};
                    }
                    this.formConfig.model['work_order']['color_id'] = data?.color_id || null;
                  });
                }
              }
            },
            {
              key: 'quantity',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                label: 'Quantity',
                required: true,
                placeholder: 'Enter Quantity',
              },
            },
            {
              key: 'completed_qty',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                label: 'Completed Quantity',
                required: false,
                placeholder: 'Enter Completed Quantity'
              },
            },
            {
              key: 'pending_qty',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                label: 'Pending Quantity',
                required: false,
                readonly: true,
                placeholder: 'Pending Quantity'
              },
            },
            {
              key: 'status_id',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Status',
                placeholder: 'Select Status',
                dataKey: 'status_id',
                dataLabel: 'status_name',
                bindId: true,
                lazy: {
                  url: 'production/production_statuses/',
                  lazyOneTime: true
                }
              },
            },
            {
              key: 'start_date',
              type: 'date',
              className: 'col-2',
              defaultValue: new Date().toISOString().split('T')[0],
              templateOptions: {
                type: 'date',
                label: 'Start date',
                required: false,
                readonly: true
              }
            },
            {
              key: 'end_date',
              type: 'date',
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'End date',
                required: false
              }
            },
            {
              key: 'sync_qty',
              type: 'checkbox',
              className: 'col-3 p-3',
              templateOptions: {
                label: 'Sync QTY',
                required: false
              }
            }
          ]
        },
        {
          key: 'bom',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Bill Of Material',
            addText: 'Add Materials',
            tableCols: [
              { name: 'product_id', label: 'Product' },
              { name: 'size_id', label: 'Size' },
              { name: 'color_id', label: 'Color' },
              { name: 'quantity', label: 'Quantity' },
              { name: 'unit_cost', label: 'Unit Cost' },
              { name: 'total_cost', label: 'Total Cost' },
              { name: 'notes', label: 'Notes' },
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'product',
                type: 'select',
                templateOptions: {
                  label: 'Product',
                  dataKey: 'product_id',
                  hideLabel: true,
                  dataLabel: 'name',
                  options: [],
                  required: true,
                  lazy: {
                  url: 'products/products/',
                  lazyOneTime: true
                  }
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['bom'][index]) {
                        console.error(`Products at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['bom'][index] = {};
                      }
                      this.formConfig.model['bom'][index]['product_id'] = data.product_id;
                    });
                  }
                }
              },
              {
                key: 'size',
                type: 'select',
                templateOptions: {
                  label: 'Size',
                  dataKey: 'size_id',
                  hideLabel: true,
                  dataLabel: 'size_name',
                  options: [],
                  required: false,
                  lazy: {
                    lazyOneTime: true,
                    url : 'products/sizes/'
                  }
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['bom'][index]) {
                        console.error(`Products at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['bom'][index] = {};
                      }
                      this.formConfig.model['bom'][index]['size_id'] = data?.size_id;
                    });
                  }
                }
              },
              {
                key: 'color',
                type: 'select',
                templateOptions: {
                  label: 'Color',
                  dataKey: 'color_id',
                  hideLabel: true,
                  dataLabel: 'color_name',
                  options: [],
                  required: false,
                  lazy: {
                    lazyOneTime: true,
                    url : 'products/colors/'
                  }
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['bom'][index]) {
                        console.error(`Products at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['bom'][index] = {};
                      }
                      this.formConfig.model['bom'][index]['color_id'] = data?.color_id || null;
                    });
                  }
                }
              },
              {
                key: 'quantity',
                type: 'input',
                templateOptions: {
                  label: 'Quantity',
                  placeholder: 'Enter Quantity',
                  hideLabel: true,
                  required: true,
                  type: 'number'
                },
                hooks:{
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      if (field.form && field.form.controls && field.form.controls.quantity && field.form.controls.unit_cost && data) {
                        const quantity = field.form.controls.quantity.value;
                        const unit_cost = field.form.controls.unit_cost.value;
                        if (quantity && unit_cost) {
                          field.form.controls.total_cost.setValue((parseFloat(quantity) * parseFloat(unit_cost)).toFixed(2));
                        }
                      } else {
                        field.form.controls.total_cost.setValue(0);
                      }
                    })
                  },
                }
              },
              {
                key: 'unit_cost',
                type: 'input',
                templateOptions: {
                  label: 'Unit Cost',
                  placeholder: 'Enter Unit Cost',
                  hideLabel: true,
                  required: true,
                  type: 'number'
                },
                hooks:{
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      if (field.form && field.form.controls && field.form.controls.quantity && field.form.controls.unit_cost && data) {
                        const quantity = field.form.controls.quantity.value;
                        const unit_cost = field.form.controls.unit_cost.value;
                        if (quantity && unit_cost) {
                          field.form.controls.total_cost.setValue((parseFloat(quantity) * parseFloat(unit_cost)).toFixed(2));

                        }
                      } else {
                        field.form.controls.total_cost.setValue(0);
                      }
                    })
                  },
                }
              },
              {
                key: 'total_cost',
                type: 'input',
                templateOptions: {
                  label: 'Total Cost',
                  // placeholder: 'Enter Total Cost',
                  hideLabel: true,
                  required: true,
                  disabled: true
                },
              },              
              {
                key: 'notes',
                type: 'text',
                templateOptions: {
                  label: 'Notes',
                  placeholder: 'Enter Notes',
                  hideLabel: true,
                  required: false
                }
              }
            ]
          }
        },
        //-----------------------------------work_order_machines-------------------------------------
        {
          key: 'work_order_machines',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Machines',
            addText: 'Add Machine',
            tableCols: [
              { name: 'machine', label: 'Machine' }
            ]
          },
          fieldArray: {
            fieldGroup: [
                {
                  key: 'machine',
                  type: 'select',
                  className: 'col',
                  templateOptions: {
                    label: 'Machine',
                    dataKey: 'machine_id',
                    dataLabel: 'machine_name',
                    options: [],
                    hideLabel: true,
                    required: false,
                    lazy: {
                      url: 'production/machines/',
                      lazyOneTime: true
                    },
                  },
                  hooks: {
                    onChanges: (field: any) => {
                      field.formControl.valueChanges.subscribe((data: any) => {
                        const index = field.parent.key;
                        if (!this.formConfig.model['work_order_machines'][index]) {
                          console.error(`Machine at index ${index} is not defined. Initializing...`);
                          this.formConfig.model['work_order_machines'][index] = {};
                        }
                        this.formConfig.model['work_order_machines'][index]['machine_id'] = data.machine_id;
                      });
                    }
                  }
                }
              ]
         }
        },
        // -----------------------------------workers--------------------------------
        {
          key: 'workers',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Worker',
            addText: 'Add Worker',
            tableCols: [
              { name: 'hours_worked', label: 'Hours' },
              { name: 'employee_id', label: 'Worker' }
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'employee',
                type: 'select',
                className: 'col',
                templateOptions: {
                  label: 'Worker',
                  dataKey: 'employee_id',
                  dataLabel: 'first_name',
                  options: [],
                  hideLabel: true,
                  required: false,
                  lazy: {
                    url: 'hrms/employees/',
                    lazyOneTime: true
                  },
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['workers'][index]) {
                        console.error(`Machine at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['workers'][index] = {};
                      }
                      this.formConfig.model['workers'][index]['employee_id'] = data.employee_id;
                    });
                  }
                }
              },
              {
                key: 'hours_worked',
                type: 'input',
                className: 'col',
                templateOptions: {
                  label: 'Hours Worked',
                  placeholder: 'Enter Hours',
                  hideLabel: true,
                  required: false
                }
              }
            ]
          }
        },
        // -----------------------------------work_order_stages--------------------------------
        {
          key: 'work_order_stages',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Work Stage',
            addText: 'Add Work Level',
            tableCols: [
              { name: 'hours_worked', label: 'Hours' },
              { name: 'employee_id', label: 'Worker' }
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'stage_name',
                type: 'input',
                templateOptions: {
                  label: 'Stage Name',
                  placeholder: 'Enter Stage Name',
                  hideLabel: true,
                  required: false
                }
              },
              {
                key: 'stage_description',
                type: 'input',
                templateOptions: {
                  label: 'Description',
                  placeholder: 'Enter Description',
                  hideLabel: true,
                  required: false
                }
              },
              {
                key: 'stage_start_date',
                type: 'date',
                templateOptions: {
                  label: 'Stage Start Date',
                  placeholder: 'Enter Start Date',
                  hideLabel: true,
                  required: false
                }
              },
              {
                key: 'stage_end_date',
                type: 'date',
                templateOptions: {
                  label: 'Stage End Date',
                  placeholder: 'Enter End Date',
                  hideLabel: true,
                  required: false
                }
              },
              {
                key: 'notes',
                type: 'textarea',
                templateOptions: {
                  label: 'Notes',
                  placeholder: 'Enter Notes',
                  hideLabel: true,
                  required: false
                }
              }
            ]
          }
        }
      ]
    }
  }
}
