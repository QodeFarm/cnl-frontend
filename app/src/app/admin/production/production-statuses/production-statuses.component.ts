import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-production-statuses',
  templateUrl: './production-statuses.component.html',
  styleUrls: ['./production-statuses.component.scss']
})
export class ProductionStatusesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'production/production_statuses/',
      title: 'Production Statuses',
      pkId: "status_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['status_id', 'status_name']
      },
      cols: [
        {
          fieldKey: 'status_name',
          name: 'Status Name'
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
              apiUrl: 'production/production_statuses'
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
      url: 'production/production_statuses/',
      title: 'Production Statuses',
      pkId: "status_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [                  
            {
              key: 'status_name',
              type: 'input',
              className: 'col-6',
              templateOptions: {
                label: 'Status Name',
                placeholder: 'Enter Status Name',
                required: true,
              }
            }
          ]
        }
      ]
    }
  }
}
