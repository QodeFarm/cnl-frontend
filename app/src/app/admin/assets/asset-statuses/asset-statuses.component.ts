import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-asset-statuses',
  templateUrl: './asset-statuses.component.html',
  styleUrls: ['./asset-statuses.component.scss']
})
export class AssetStatusesComponent {

  baseUrl: string = 'http://195.35.20.172:8000/api/v1/';
  
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: this.baseUrl + 'assets/asset_statuses/',
      title: 'Asset Statuses',
      pkId: "asset_status_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['asset_status_id', 'status_name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'status_name',
          name: 'Status Name',
          sort: true
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
              apiUrl: this.baseUrl + 'assets/asset_statuses'
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
      url: this.baseUrl + 'assets/asset_statuses/',
      title: 'Asset Statuses',
      pkId: "asset_status_id",
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'status_name',
              type: 'input',
              className: 'col-md-6 col-12 p-0',
              templateOptions: {
                label: 'Status Name',
                placeholder: 'Enter Status Name',
                required: true,
              }
            },
          ]
        }
      ]
    }
  }
}