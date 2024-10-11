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
      exParams: [],
      fields: [{
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: [
          {
          key: 'location_name',
          type: 'input',
          className: 'col-6 p-0',
          templateOptions: {
            label: 'Location Name',
            placeholder: 'Enter Location Name',
            required: true,
          }
        },
        {
          key: 'description',
          type: 'input',
          className: 'col-6 p-0',
          templateOptions: {
            label: 'Description',
            placeholder: 'Enter Location Description',
            required: true,
          }
        }
      ]
      }]
    }
  }
};
