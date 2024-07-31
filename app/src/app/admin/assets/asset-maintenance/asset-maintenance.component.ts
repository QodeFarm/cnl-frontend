import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-asset-maintenance',
  templateUrl: './asset-maintenance.component.html',
  styleUrls: ['./asset-maintenance.component.scss']
})
export class AssetMaintenanceComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'http://195.35.20.172:8000/api/v1/assets/asset_maintenance/',
      title: 'Asset Maintenance',
      pkId: "asset_maintenance_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['asset_maintenance_id']
      },
      cols: [
        {
          fieldKey: 'asset_id',
          name: 'Asset',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.asset.name}`;
          },
        },
        {
          fieldKey: 'cost', 
          name: 'Cost',
          sort: true
        },
        {
          fieldKey: 'maintenance_date',
          name: 'Maintenance Date',
          sort: true
        },
        {
          fieldKey: 'maintenance_description',
          name: 'Maintenance Description',
          sort: false
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
              apiUrl: 'http://195.35.20.172:8000/api/v1/assets/asset_maintenance'
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
      url: 'http://195.35.20.172:8000/api/v1/assets/asset_maintenance/',
      title: 'Asset Maintenance',
      pkId: "asset_maintenance_id",
      exParams: [
        {
          key: 'asset_id',
          type: 'script',
          value: 'data.asset.asset_id'
        },
      ],
      fields: [
        {
          fieldGroupClassName: 'row col-12 p-0 m-0 custom-form field-no-bottom-space',
          fieldGroup: [
            {
              key: 'asset',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Asset',
                dataKey: 'asset_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'http://195.35.20.172:8000/api/v1/assets/assets/',
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
              key: 'cost',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Cost',
                required: true,
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'maintenance_date',
              type: 'date',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Maintenance Date',
                required: true,
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'maintenance_description',
              type: 'textarea',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Maintenance Description',
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