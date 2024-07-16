import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'inventory/warehouses/',
      title: 'Warehouses',
      pkId: "warehouse_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['warehouse_id', 'name']
      },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'code',
          name: 'Code',
          sort: true
        },
        {
          fieldKey: 'phone', 
          name: 'Phone',
          sort: false
        },
        {
          fieldKey: 'city_id',
          name: 'City',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.city.city_name}`;
          },
        },
        {
          fieldKey: 'state_id',
          name: 'State',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.state.state_name}`;
          },
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'inventory/warehouses'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'inventory/warehouses/',
      title: 'Warehouses',
      pkId: "warehouse_id",
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
      fields: [
        {
          fieldGroupClassName: "ant-row",
          fieldGroup: [ 
            {
              key: 'name',
              type: 'input',
              className: 'ant-col-7 pr-md m-3',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'ant-col-7 pr-md m-3',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code',
                required: false,
              }
            },
            {
              key: 'phone',
              type: 'input',
              className: 'ant-col-7 pr-md m-3',
              templateOptions: {
                label: 'Phone',
                placeholder: 'Enter Phone Number',
                required: false,
              }
            },
            {
              key: 'email',
              type: 'input',
              className: 'ant-col-7 pr-md m-3',
              templateOptions: {
                label: 'Email',
                placeholder: 'Enter Email',
                required: false,
              }
            },
            {
              key: 'address',
              type: 'textarea',
              className: 'ant-col-7 pr-md m-3',
              templateOptions: {
                label: 'Address',
                placeholder: 'Enter Address',
                required: false,
              },
            },
            {
              key: 'city',
              type: 'select',
              className: 'ant-col-7 pr-md m-3',
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
              type: 'select',
              className: 'ant-col-7 pr-md m-3',
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
              type: 'select',
              className: 'ant-col-7 pr-md m-3',
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
              className: 'ant-col-7 pr-md m-3',
              templateOptions: {
                label: 'Pin Code',
                placeholder: 'Enter Pin Code',
                required: false,
              },
            },
            {
              key: 'item_type',
              type: 'select',
              className: 'ant-col-7 pr-md m-3',
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
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'longitude',
              type: 'input',
              className: 'ant-col-7 pr-md m-3',
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
              className: 'ant-col-7 pr-md m-3',
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
