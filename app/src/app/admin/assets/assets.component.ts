import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'http://195.35.20.172:8000/api/v1/assets/assets/',
      title: 'Assets',
      pkId: "asset_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['asset_id', 'name']
      },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'purchase_date', 
          name: 'Purchase Date',
          sort: false
        },
        {
          fieldKey: 'price', 
          name: 'Price',
          sort: false
        },
        {
          fieldKey: 'asset_category_id',
          name: 'Asset Category',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.asset_category.category_name}`;
          },
        },
        {
          fieldKey: 'asset_status_id',
          name: 'Asset Status',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.asset_status.status_name}`;
          },
        },
        {
          fieldKey: 'unit_options_id',
          name: 'Unit Options',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.unit_options.unit_name}`;
          },
        },
        {
          fieldKey: 'location_id',
          name: 'Location',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.location.location_name}`;
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
              apiUrl: 'http://195.35.20.172:8000/api/v1/assets/assets'
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
      url: 'http://195.35.20.172:8000/api/v1/assets/assets/',
      title: 'Assets',
      pkId: "asset_id",
      exParams: [
        {
          key: 'asset_category_id',
          type: 'script',
          value: 'data.asset_category.asset_category_id'
        },
        {
          key: 'asset_status_id',
          type: 'script',
          value: 'data.asset_status.asset_status_id'
        },
        {
          key: 'location_id',
          type: 'script',
          value: 'data.location.location_id'
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
          key: 'purchase_date',
          type: 'date',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Purchase Date',
            required: false,
          },
          hooks: {
            onInit: (field: any) => {
              //field.templateOptions.options = this.cs.getRole();
            }
          }
        },
        {
          key: 'price',
          type: 'input',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Price',
            required: false,
          },
          hooks: {
            onInit: (field: any) => {
              //field.templateOptions.options = this.cs.getRole();
            }
          }
        },
        {
          key: 'asset_category',
          type: 'select',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Asset Category',
            dataKey: 'asset_category_id',
            dataLabel: "category_name",
            options: [],
            lazy: {
              url: 'http://195.35.20.172:8000/api/v1/assets/asset_categories/',
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
          key: 'asset_status',
          type: 'select',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Asset Status',
            dataKey: 'asset_status_id',
            dataLabel: "status_name",
            options: [],
            lazy: {
              url: 'http://195.35.20.172:8000/api/v1/assets/asset_statuses/',
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
          key: 'unit_options',
          type: 'select',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Unit Options',
            dataKey: 'unit_options_id',
            dataLabel: "unit_name",
            options: [],
            lazy: {
              url: 'http://195.35.20.172:8000/api/v1/masters/unit_options/',
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
          key: 'location',
          type: 'select',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Location',
            dataKey: 'location_id',
            dataLabel: "location_name",
            options: [],
            lazy: {
              url: 'http://195.35.20.172:8000/api/v1/assets/locations/',
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
      ]
    }
  }
}
