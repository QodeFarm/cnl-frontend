import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-lead-statuses',
  templateUrl: './lead-statuses.component.html',
  styleUrls: ['./lead-statuses.component.scss']
})
export class LeadStatusesComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'leads/lead_statuses/',
      title: 'Lead statuses',
      pkId: "lead_status_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['lead_status_id', 'status_name']
      },
      cols: [{
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
              apiUrl: 'leads/lead_statuses'
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
      url: 'leads/lead_statuses/',
      title: 'Lead status',
      pkId: "lead_status_id",
      exParams: [],
      fields: [{
        fieldGroupClassName: "ant-row",
        fieldGroup: [{
          key: 'status_name',
          type: 'input',
          className: 'ant-col-4 pr-md m-3',
          templateOptions: {
            label: 'Status Name',
            placeholder: 'Enter Status Name',
            required: true,
          }
        }]
      }]
    }
  }
};