import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent {
  curdConfig: TaCurdConfig = {
    tableConfig: {
      pkId: "department_id",
      apiUrl: "employees/departments",
      title: "Departments",
      globalSearch: {
        keys: ['department_id']
      },
      cols: [
        {
          fieldKey: "department_name",
          name: "Department",
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
              apiUrl: 'employees/departments'
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
      url: "employees/departments/",
      pkId: "department_id",
      title: "Department Code",
      fields: [
        {
          key: 'department_name',
          type: 'input',
          templateOptions: {
            label: 'Department Name',
            placeholder: 'Enter Department Name',
            required: true,
          }
        }
      ],
      submit: {}
    },
    displayStyle: "inlineform"
  }
}
