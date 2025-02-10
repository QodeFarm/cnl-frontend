import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'hrms/departments/',
      title: 'Departments',
      pkId: "department_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['department_id','department_name','designation_name']
      },
      cols: [{
          fieldKey: 'department_name',
          name: 'Department Name'
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
              apiUrl: 'hrms/departments'
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
      url: 'hrms/departments/',
      title: 'Department',
      pkId: "department_id",
      exParams: [],
      fields: [{
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: [{
          key: 'department_name',
          type: 'input',
          className: 'col-6 p-0',
          templateOptions: {
            label: 'Department Name',
            placeholder: 'Enter Department Name',
            required: true,
          }
        }, ]
      }]
    }
  }
};