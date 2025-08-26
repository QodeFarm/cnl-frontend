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
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'leads/lead_statuses/',
      title: 'Lead statuses',
      pkId: "lead_status_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['lead_status_id', 'status_name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [{
          fieldKey: 'status_name',
          name: 'Status Name',
          sort: true
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
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
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
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'status_name',
              type: 'input',
              className: 'col-md-6 col-12 px-0',
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