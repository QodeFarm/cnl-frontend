import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'http://195.35.20.172:8000/api/v1/assets/locations/',
      title: 'Locations',
      pkId: "location_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['location_id', 'location_name']
      },
      cols: [
        {
          fieldKey: 'location_name',
          name: 'Location Name',
          sort: true
        },
        {
          fieldKey: 'address', 
          name: 'Address',
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
              apiUrl: 'http://195.35.20.172:8000/api/v1/assets/locations'
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
      url: 'http://195.35.20.172:8000/api/v1/assets/locations/',
      title: 'Locations',
      pkId: "location_id",
      fields: [
        {
          key: 'location_name',
          type: 'input',
          className: 'ta-cell pr-md col-md-6',
          templateOptions: {
            label: 'Location Name',
            placeholder: 'Enter Location Name',
            required: true,
          }
        },
        {
          key: 'address',
          type: 'textarea',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Address',
            placeholder: 'Enter Address',
            required: false,
          },
        },
      ]
    }
  }
}
