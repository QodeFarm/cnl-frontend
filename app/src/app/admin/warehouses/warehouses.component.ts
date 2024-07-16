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
          fieldKey: 'customer_id',
          name: 'Customer',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.customer.name}`;
          },
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
          key: 'customer_id',
          type: 'script',
          value: 'data.customer.customer_id'
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
          key: 'name',
          type: 'input',
          className: 'ta-cell pr-md col-md-6',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter Name',
            required: true,
          }
        },
        {
          key: 'code',
          type: 'input',
          className: 'ta-cell pr-md col-md-6',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter Code',
            required: false,
          }
        },
        {
          key: 'address',
          type: 'textarea',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Address',
            required: false,
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
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Pin Code',
            required: false,
          },
          hooks: {
            onInit: (field: any) => {
              //field.templateOptions.options = this.cs.getRole();
            }
          }
        },
        {
          key: 'phone',
          type: 'input',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Phone',
            required: false,
          },
          hooks: {
            onInit: (field: any) => {
              //field.templateOptions.options = this.cs.getRole();
            }
          }
        },
        {
          key: 'email',
          type: 'input',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Email',
            required: false,
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
          className: 'ta-cell pr-md col-md-6 col-12',
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
          className: 'ta-cell pr-md col-md-6 col-12',
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
        {
          key: 'item_type',
          type: 'select',
          className: 'ta-cell pr-md col-md-6 col-12',
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
          key: 'customer',
          type: 'select',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Customer',
            dataKey: 'customer_id',
            dataLabel: "name",
            options: [],
            lazy: {
              url: 'customers/customer/',
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
          key: 'city',
          type: 'select',
          className: 'ta-cell pr-md col-md-6 col-12',
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
          className: 'ta-cell pr-md col-md-6 col-12',
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
          className: 'ta-cell pr-md col-md-6 col-12',
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
      ]
    }
  }
}
