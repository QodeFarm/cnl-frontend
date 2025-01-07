import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { BomListComponent } from './bom-list/bom-list.component';

@Component({
  selector: 'app-bom',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, BomListComponent],
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss']
})
export class BomComponent {
  showBomList: boolean = false;
  showForm: boolean = false;
  BomEditID: any;
  @ViewChild(BomListComponent) BomListComponent!: BomListComponent;

  constructor(private http: HttpClient) {};

  ngOnInit() {
    this.showBomList = false;
    this.showForm = false;
    this.BomEditID = null;
    // set form config
    this.setFormConfig();
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editBom(event) {
    this.BomEditID = event;
    this.http.get('production/bom/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'bom_id';
        // set labels for update
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['bom_id'] = this.BomEditID;
        this.showForm = true;
      }
    })
    this.hide();
  };


  showBomListFn() {
    this.showBomList = true;
    this.BomListComponent?.refreshTable();
  };

  setFormConfig() {
    this.BomEditID =null
    this.formConfig = {
      url: "production/bom/",
      // title: 'bom',
      formState: {
        viewMode: false,
        // isEdit: false,
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
        bom: {},
        bill_of_material: [{}],
      },
      fields: [
        //-----------------------------------------B O M -----------------------------------//
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'bom',
          fieldGroup: [
            {
              key: 'bom_name',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                label: 'BOM Name',
                placeholder: 'Enter BOM Name',
                required: true,
              },
              hooks: {
                onInit: (field: any) => {}
              },
            },
            {
              key: 'product',
              type: 'select',
              className: 'col-3',
              templateOptions: {
                label: 'Product',
                dataKey: 'product_id',
                dataLabel: "name",
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
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['bom']) {
                      this.formConfig.model['bom']['product_id'] = data.product_id;
                    } else {
                      console.error('Form config or product data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'notes',
              type: 'textarea',
              className: 'col-3',
              templateOptions: {
                type: 'input',
                label: 'Notes',
                placeholder: 'Enter Notes',
                required: false
              },
              hooks: {
                onInit: (field: any) => {}
              }
            }
          ]
        },
        // end of BOM
        //----------------------------------------- B I L L  O F  M A T E R I A L  -----------------------------------//
        {
          key: 'bill_of_material',
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
                      if (!this.formConfig.model['bill_of_material'][index]) {
                        console.error(`Products at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['bill_of_material'][index] = {};
                      }
                      this.formConfig.model['bill_of_material'][index]['product_id'] = data.product_id;
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
                      if (!this.formConfig.model['bill_of_material'][index]) {
                        console.error(`Products at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['bill_of_material'][index] = {};
                      }
                      this.formConfig.model['bill_of_material'][index]['size_id'] = data.size_id;
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
                      if (!this.formConfig.model['bill_of_material'][index]) {
                        console.error(`Products at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['bill_of_material'][index] = {};
                      }
                      this.formConfig.model['bill_of_material'][index]['color_id'] = data.color_id;
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
                          field.form.controls.total_cost.setValue(parseInt(quantity) * parseInt(unit_cost));
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
                  placeholder: 'Enter Total Cost',
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
     ]
    }
  }
}