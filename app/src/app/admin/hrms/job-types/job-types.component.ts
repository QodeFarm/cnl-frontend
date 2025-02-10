import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-job-types',
  templateUrl: './job-types.component.html',
  styleUrls: ['./job-types.component.scss']
})
export class JobTypesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'hrms/job_types/',
      title: 'Job Types',
      pkId: "job_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['job_type_id', 'job_type_name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [{
          fieldKey: 'job_type_name',
          name: 'Job Type Name',
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
              apiUrl: 'hrms/job_types'
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
      url: 'hrms/job_types/',
      title: 'Job Types',
      pkId: "job_type_id",
      exParams: [],
      fields: [{
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: [{
          key: 'job_type_name',
          type: 'input',
          className: 'col-6 p-0',
          templateOptions: {
            label: 'Job Type Name',
            placeholder: 'Enter Job Type Name',
            required: true,
          }
        }, ]
      }]
    }
  }
};
