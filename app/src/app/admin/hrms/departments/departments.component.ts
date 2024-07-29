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
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'hrms/departments/',
      title: 'Departments',
      pkId: "department_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['department_id','designation_name']
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
        fieldGroupClassName: "ant-row",
        fieldGroup: [{
          key: 'department_name',
          type: 'input',
          className: 'ant-col-5 pr-md m-3',
          templateOptions: {
            label: 'Department Name',
            placeholder: 'Enter Department Name',
            required: true,
          }
        }]
      }]
    }
  }
};

