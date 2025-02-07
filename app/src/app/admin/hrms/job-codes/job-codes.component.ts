import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-job-codes',
  templateUrl: './job-codes.component.html',
  styleUrls: ['./job-codes.component.scss']
})
export class JobCodesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'hrms/job_codes/',
      title: 'Job Codes',
      pkId: "job_code_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['job_code_id', 'job_code']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [{
          fieldKey: 'job_code',
          name: 'Job Code',
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
              apiUrl: 'hrms/job_codes'
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
      url: 'hrms/job_codes/',
      title: 'Job Codes',
      pkId: "job_code_id",
      exParams: [],
      fields: [{
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: [{
          key: 'job_code',
          type: 'input',
          className: 'col-6 p-0',
          templateOptions: {
            label: 'Job Code',
            placeholder: 'Enter Job Code',
            required: true,
          }
        }, ]
      }]
    }
  }
};
