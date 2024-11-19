import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { WorkOrderListComponent } from './work-order-list/work-order-list.component';


@Component({
  selector: 'app-production',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, WorkOrderListComponent],
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss']
})
export class ProductionComponent implements OnInit {

  showWorkorderList: boolean = false;
  showForm: boolean = true;
  WorkOrdrEditID: any;
  WorkOrderBoardView: any; //
  formConfig: TaFormConfig = {};

  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.setFormConfig();
  
    // Check if navigation state contains work order data for editing
    if (history.state && (history.state.productDetails || history.state.saleOrderDetails)) {
      console.log('Received work order data from navigation:', history.state);
      this.populateFormWithData(history.state);
      this.showForm = true; // Ensure the form is displayed
    }
  
    console.log('FormConfig after population:', this.formConfig);

  }

  private isInitialized = false; // Flag to ensure ngOnInit runs only once

// ngOnInit() {
//   if (this.isInitialized) {
//     return; // Prevent reinitialization
//   }

//   this.isInitialized = true;
//   this.setFormConfig();

//   // Check if navigation state contains work order data for editing
//   if (history.state && (history.state.productDetails || history.state.saleOrderDetails)) {
//     console.log('Received work order data from navigation:', history.state);
//     this.populateFormWithData(history.state);
//     this.showForm = true; // Ensure the form is displayed
//   }

//   console.log('FormConfig after population:', this.formConfig);
// }


  hide() {
    const modalCloseButton = document.getElementById('modalClose');
    if (modalCloseButton) {
      modalCloseButton.click();
    }
  }

  editWorkorder(event: any) {
    console.log('event', event);
    this.WorkOrdrEditID = event;
    this.http.get('production/work_order/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res.data;
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
  }

// Method to populate the form with data (when admin wants to create a work order from sale order)
populateFormWithData(data: any) {
  if (data.productDetails && data.productDetails.length > 0) {
    const mainProduct = data.productDetails[0]; // First item as the main product
    this.formConfig.model['work_order'] = {
      product_id: mainProduct.product_id || null,
      quantity: mainProduct.quantity || 0,
      start_date: data.saleOrderDetails?.order_date || null,
      end_date: data.saleOrderDetails?.delivery_date || null,
      sale_order_id: data.saleOrderDetails?.sale_order_id || null,
    };
  }

  // Initialize other arrays if missing
  this.formConfig.model['bom'] = this.formConfig.model['bom'] || [{}]; // Default to an empty material row
  this.formConfig.model['work_order_machines'] = this.formConfig.model['work_order_machines'] || [{}];
  this.formConfig.model['work_order_stages'] = this.formConfig.model['work_order_stages'] || [{}];
  this.formConfig.model['workers'] = this.formConfig.model['workers'] || [{}];

  console.log('Form model after population:', this.formConfig.model);
}




submitWorkOrder() {
  const payload = {
    ...this.formConfig.model,
    sale_order_id: this.formConfig.model['work_order']['sale_order_id'], // Include sale_order_id
  };

  this.http.post('production/work_order/', payload).subscribe({
    next: (response) => {
      console.log('Work order submitted successfully:', response);

      // Trigger the move_next_stage API call after successful submission
      const saleOrderId = this.formConfig.model['work_order']['sale_order_id'];
      if (saleOrderId) {
        const nextStageUrl = `sales/SaleOrder/${saleOrderId}/move_next_stage/`;

        this.http.post(nextStageUrl, {}).subscribe({
          next: (res) => {
            console.log('Moved to the next stage successfully:', res);
            alert('Work Order created and moved to the next stage successfully!');
          },
          error: (err) => {
            console.error('Error moving to the next stage:', err);

            // Optional: Show a user-friendly message
            alert('Work Order created, but failed to move to the next stage.');
          },
        });
      } else {
        console.warn('Sale order ID is missing. Cannot trigger move to next stage.');
      }
    },
    error: (err) => {
      console.error('Error submitting work order:', err);

      // Optional: Show a user-friendly message
      alert('Failed to create the work order. Please try again.');
    },
  });
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
        submittedFn: () => this.submitWorkOrder()
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
                  // url: 'products/products_get/?type_name=Finished',
                  url: 'products/products_get/',
                  lazyOneTime: true
                }
              },
            },
            {
              key: 'quantity',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                label: 'Quantity',
                required: true,
                placeholder: 'Enter Quantity',
                // type: 'number',
                // min: 0,
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
              templateOptions: {
                type: 'date',
                label: 'Start date',
                required: false
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
            
          ]
        },
		    //-----------------------------------Bill of material-------------------------------------
        {
          key: 'bom',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Material',
            addText: 'Add Material',
            tableCols: [
              { name: 'product_id', label: 'Material' },
              { name: 'quantity_required', label: 'Quantity Required' },
              { name: 'component_name', label: 'Component Name' },
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'product_id',
                type: 'select',
                className: 'col',
                templateOptions: {
                  label: 'Product',
                  placeholder: 'Select Product',
                  dataKey: 'product_id',
                  dataLabel: 'name',
                  hideLabel: true,
                  required: true,
                  bindId: true,
                  lazy: {
                    // url: 'products/products_get/?type_name=Unfinished',
                    url: 'products/products_get/',
                    lazyOneTime: true
                  }
                },
              },
              {
                key: 'component_name',
                type: 'input',
                className: 'col',
                templateOptions: {
                  label: 'Component',
                  placeholder: 'Enter Component Name',
                  hideLabel: true,
                  multiple: true,
                  required: true
                }
              },
              {
                key: 'quantity_required',
                type: 'input',
                className: 'col',
                templateOptions: {
                  label: 'Quantity',
                  placeholder: 'Enter Quantity',
                  hideLabel: true,
                  multiple: true,
                  required: true
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
                    required: true,
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
                          console.error(`Task comments at index ${index} is not defined. Initializing...`);
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
                  dataLabel: "name",
                  options: [],
                  hideLabel: true,
                  required: true,
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
                        console.error(`Task comments at index ${index} is not defined. Initializing...`);
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
                  required: true
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
                  required: true
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
                  required: true
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
