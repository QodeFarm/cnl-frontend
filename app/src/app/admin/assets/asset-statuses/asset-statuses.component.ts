import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-asset-statuses',
  templateUrl: './asset-statuses.component.html',
  styleUrls: ['./asset-statuses.component.scss']
})
export class AssetStatusesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'http://195.35.20.172:8000/api/v1/assets/asset_statuses/',
      title: 'Asset Statuses',
      pkId: "asset_status_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['asset_status_id', 'status_name']
      },
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
              apiUrl: 'http://195.35.20.172:8000/api/v1/assets/asset_statuses'
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
      url: 'http://195.35.20.172:8000/api/v1/assets/asset_statuses/',
      title: 'Asset Statuses',
      pkId: "asset_status_id",
      fields: [
        {
          key: 'status_name',
          type: 'input',
          className: 'ta-cell pr-md col-md-6',
          templateOptions: {
            label: 'Status Name',
            placeholder: 'Enter Status Name',
            required: true,
          }
        },
      ]
    }
  }
}
