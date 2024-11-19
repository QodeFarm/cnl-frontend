import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-salary-components',
  templateUrl: './salary-components.component.html',
  styleUrls: ['./salary-components.component.scss']
})
export class SalaryComponentsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'hrms/salary_components/',
      title: 'Salary Components',
      pkId: "component_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['component_id', 'component_name']
      },
      cols: [{
          fieldKey: 'component_name',
          name: 'Component Name'
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
              apiUrl: 'hrms/salary_components'
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
      url: 'hrms/salary_components/',
      title: 'Salary Components',
      pkId: "component_id",
      exParams: [],
      fields: [{
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: [{
          key: 'component_name',
          type: 'input',
          className: 'col-6 p-0',
          templateOptions: {
            label: 'Component Name',
            placeholder: 'Enter Component Name',
            required: true,
          }
        }, ]
      }]
    }
  }
};