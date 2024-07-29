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
    drawerPlacement: 'right',
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
          fieldKey: 'designation_id',
          name: 'Designation',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.designation_id}`;
          },
          sort: true
        },
        {
          fieldKey: 'department_id',
          name: 'Department',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.department_id}`;
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
          key: 'designation_id',
          type: 'script',
          value: 'data.designation.designation_id'
        },
        {
          key: 'department_id',
          type: 'script',
          value: 'data.department.department_id'
        }
      ],
      fields: [
        {
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'name',
              type: 'input',
              className: 'ant-col-5 pr-md m-3',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'email',
              type: 'input',
              className: 'ant-col-5 pr-md m-3',
              templateOptions: {
                label: 'Email',
                placeholder: 'Enter Email',
                required: false,
              }
            },
            {
              key: 'phone',
              type: 'input',
              className: 'ant-col-5 pr-md m-3',
              templateOptions: {
                label: 'Phone',
                placeholder: 'Enter Number',
                required: false,
              }
            },
            {
              key: 'department',
              type: 'select',
              className: 'ant-col-5 pr-md m-3',
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
              className: 'ant-col-5 pr-md m-3',
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

