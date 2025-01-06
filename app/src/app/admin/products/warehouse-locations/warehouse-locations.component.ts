import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-warehouse-locations',
  templateUrl: './warehouse-locations.component.html',
  styleUrls: ['./warehouse-locations.component.scss']
})
export class WarehouseLocationsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'inventory/warehouse_locations/',
      title: 'Warehouse Locations',
      pkId: "location_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['location_id','location_name']
      },
      cols: [
        {
          fieldKey: 'location_name',
          name: 'Location Name'
        },
        {
          fieldKey: 'description',
          name: 'Description'
        },
        {
          fieldKey: 'warehouse',
          name: 'Ware house',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.warehouse.name}`;
          },
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [{
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'inventory/warehouse_locations'
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
      url: 'inventory/warehouse_locations/',
      title: 'Warehouse Locations',
      pkId: "location_id",
      exParams: [
        {
          key: 'warehouse_id',
          type: 'script',
          value: 'data.warehouse.warehouse_id'
        },
      ],
      fields: [{
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: [
          {
          key: 'location_name',
          type: 'input',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Location Name',
            placeholder: 'Enter Location Name',
            required: true,
          }
        },
        {
          key: 'description',
          type: 'input',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Description',
            placeholder: 'Enter Location Description',
            required: true,
          }
        },
        {
          key: 'warehouse',
          type: 'select',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Warehouse',
            dataKey: 'warehouse_id',
            dataLabel: "name",
            options: [],
            lazy: {
              url: 'inventory/warehouses/',
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
      }]
    }
  }
};
