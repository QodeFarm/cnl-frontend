import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-job-codes',
  templateUrl: './job-codes.component.html',
  styleUrls: ['./job-codes.component.scss']
})
export class JobCodesComponent {
  curdConfig: TaCurdConfig = {
    tableConfig: {
      pkId: "job_code_id",
      apiUrl: "employees/job_codes",
      title: "Job Code",
      globalSearch: {
        keys: ['job_code']
      },
      cols: [
        {
          fieldKey: "job_code",
          name: "Job Code",
          filter: true,
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          sort: false,
          type: 'action',
          filter: false,
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'employees/job_codes'
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
      url: "employees/job_codes/",
      pkId: "job_code_id",
      title: "Job Code",
      fields: [
        {
          key: 'job_code',
          type: 'input',
          templateOptions: {
            label: 'Job Code',
            placeholder: 'Enter Job Code',
            required: true,
          }
        }
      ],
      submit: {}
    },
    displayStyle: "inlineform"
  }
}
