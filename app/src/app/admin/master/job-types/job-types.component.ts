import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-job-types',
  templateUrl: './job-types.component.html',
  styleUrls: ['./job-types.component.scss']
})
export class JobTypesComponent {
  curdConfig: TaCurdConfig = {
    tableConfig: {
      pkId: "job_type_id",
      apiUrl: "employees/job_types",
      title: "Job Type",
      globalSearch: {
        keys: ['job_type_name']
      },
      cols: [
        {
          fieldKey: "job_type_name",
          name: "Job Type",
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
              apiUrl: 'employees/job_types'
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
      url: "employees/job_types/",
      pkId: "job_type_id",
      title: "Job Type",
      fields: [
        {
          key: 'job_type_name',
          type: 'input',
          templateOptions: {
            label: 'Job Type',
            placeholder: 'Enter Job Type',
            required: true,
          }
        }
      ],
      submit: {}
    },
    displayStyle: "inlineform"
  }
}
