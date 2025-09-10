import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { WarehousesListComponent } from './warehouses-list/warehouses-list.component';

@Component({
  standalone: true,
  imports: [CommonModule,AdminCommmonModule,WarehousesListComponent],
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent {
  showWarehousesList: boolean = false;
  showForm: boolean = false;
  WarehousesEditID: any;
  @ViewChild(WarehousesListComponent) WarehousesListComponent!: WarehousesListComponent;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showWarehousesList = false;
    this.showForm = true;
    this.WarehousesEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editWarehouses(event) {
    console.log('event', event);
    this.WarehousesEditID = event;
    this.http.get('inventory/warehouses/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'warehouse_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };


  showWarehousesListFn() {
    this.showWarehousesList = true;
    this.WarehousesListComponent?.refreshTable();
  };

  setFormConfig() {
    this.WarehousesEditID = null;
    this.formConfig = {
      url: "inventory/warehouses/",
      // title: 'warehouses',
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'item_type_id',
          type: 'script',
          value: 'data.item_type.item_type_id'
        },
        {
          key: 'city_id',
          type: 'script',
          value: 'data.city.city_id'
        },
        {
          key: 'state_id',
          type: 'script',
          value: 'data.state.state_id'
        },
        {
          key: 'country_id',
          type: 'script',
          value: 'data.country.country_id'
        },
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
              key: 'name',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code',
                required: false,
              }
            },
            {
              key: 'phone',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Phone',
                placeholder: 'Enter Phone Number',
                required: false,
              }
            },
            {
              key: 'email',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Email',
                placeholder: 'Enter Email',
                required: false,
              }
            },
            {
              key: 'address',
              type: 'textarea',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Address',
                placeholder: 'Enter Address',
                required: false,
              },
            },
            {
              key: 'city',
              type: 'city-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'City',
                dataKey: 'city_id',
                dataLabel: "city_name",
                options: [],
                lazy: {
                  url: 'masters/city/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'state',
              type: 'state-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'State',
                dataKey: 'state_id',
                dataLabel: "state_name",
                options: [],
                lazy: {
                  url: 'masters/state/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'country',
              type: 'country-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Country',
                dataKey: 'country_id',
                dataLabel: "country_name",
                options: [],
                lazy: {
                  url: 'masters/country/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'pin_code',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Pin Code',
                placeholder: 'Enter Pin Code',
                required: false,
              },
            },
            {
              key: 'item_type',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Item Type',
                dataKey: 'item_type_id',
                dataLabel: "item_name",
                options: [],
                lazy: {
                  url: 'masters/product_item_type/',
                  lazyOneTime: true
                },
                required: false
              },
              // hooks: {
              //   onInit: (field: any) => {
              //     //field.templateOptions.options = this.cs.getRole();
              //   }
              // }
              hooks: {
                onInit: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['item_type_id']) {
                      this.formConfig.model['item_type_id'] = data.item_type_id
                    } else {
                      console.error('Form config or item type data model is not defined.');
                    }
                  });
                },
              }
            },
            {
              key: 'longitude',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Longitude',
                required: false,
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'latitude',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Latitude',
                required: false,
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
          ]
        }
      ]
    }
  }
}
