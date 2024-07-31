import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-hrms',
  templateUrl: './hrms.component.html',
  styleUrls: ['./hrms.component.scss']
})
export class EmployeesComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'hrms/employees/',
      title: 'Employees',
      pkId: "employee_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['employee_id', 'name']
      },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name'
        },
        {
          fieldKey: 'email',
          name: 'Email'
        },
        {
          fieldKey: 'phone',
          name: 'Phone'
        },
        {
          fieldKey: 'designation',
          name: 'Designation',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.designation.designation_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'department',
          name: 'Department',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.department.department_name}`;
          },
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'hrms/employees'
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
      url: 'hrms/employees/',
      title: 'Employee',
      pkId: "employee_id",
      exParams: [
        {
          key: 'designation',
          type: 'script',
          value: 'data.designation.designation_id'
        },
        {
          key: 'department',
          type: 'script',
          value: 'data.department.department_id'
        }
      ],
      fields: [
        {
          fieldGroupClassName: 'row col-12 p-0 m-0 custom-form field-no-bottom-space',
          fieldGroup: [
            {
              key: 'name',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'email',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Email',
                placeholder: 'Enter Email',
                required: false,
              }
            },
            {
              key: 'phone',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Phone',
                placeholder: 'Enter Number',
                required: false,
              }
            },
            {
              key: 'department',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Department',
                dataKey: 'department_id',
                dataLabel: "department_name",
                options: [],
                lazy: {
                  url: 'hrms/departments/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  
                }
              }
            },
            {
              key: 'designation',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Designation',
                dataKey: 'designation_id',
                dataLabel: "designation_name",
                options: [],
                lazy: {
                  url: 'hrms/designations/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => { 
                }
              }
            },
          ]
        }
      ]
    }
 
  }
};

