import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent {

  baseUrl: string = 'http://195.35.20.172:8000/api/v1/';
  
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: this.baseUrl + 'assets/locations/',
      title: 'Locations',
      pkId: "location_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['location_id', 'location_name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
              apiUrl: this.baseUrl + 'assets/locations'
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
      url: this.baseUrl + 'assets/locations/',
      title: 'Locations',
      pkId: "location_id",
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'location_name',
              type: 'input',
              className: 'col-6 pe-0',
              templateOptions: {
                label: 'Location Name',
                placeholder: 'Enter Location Name',
                required: true,
              }
            },
            {
              key: 'address',
              type: 'textarea',
              className: 'col-6 pe-0',
              templateOptions: {
                label: 'Address',
                placeholder: 'Enter Address',
                required: false,
              },
            },
          ]
        }
      ]
    }
  }
}
