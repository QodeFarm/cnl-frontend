import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-employee-salary-components',
  templateUrl: './employee-salary-components.component.html',
  styleUrls: ['./employee-salary-components.component.scss']
})
export class EmployeeSalaryComponentsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'hrms/employee_salary_components/',
      title: 'Employee Salary Components',
      pkId: "employee_component_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['employee_component_id', 'component_id','component_amount','salary_id']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'component_id',
          name: 'salary Component',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.component.component_name}`;
          },
        },
        {
          fieldKey: 'component_amount', 
          name: 'Component Amount',
          sort: true
        }, 
        {
          fieldKey: 'salary_id',
          name: 'Salary',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.salary.salary_amount}`;
          },
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
              apiUrl: 'hrms/employee_salary_components'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'hrms/employee_salary_components'
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
      url: 'hrms/employee_salary_components/',
      title: 'Employee Salary Components',
      pkId: "employee_component_id",
      exParams: [
        {
          key: 'component_id',
          type: 'script',
          value: 'data.component.component_id'
        },
        {
          key: 'salary_id',
          type: 'script',
          value: 'data.salary.salary_id'
        }
      ],
      fields: [{
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: [
          {
            key: 'component',
            type: 'select',
            className: 'col-md-6 col-12 px-1 mb-3',
            templateOptions: {
              label: 'Component',
              dataKey: 'component_id',
              dataLabel: "component_name",
              options: [],
              lazy: {
                url: 'hrms/salary_components/',
                lazyOneTime: true
              },
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          },
          {
            key: 'component_amount',
            type: 'input',
            className: 'col-md-6 col-12 px-1 mb-3',
            templateOptions: {
              label: 'Component Amount',
              placeholder: 'Enter Component Amount',
              type: 'number',
            }
          },
          {
            key: 'salary',
            type: 'select',
            className: 'col-md-6 col-12 px-1',
            templateOptions: {
              label: 'Salary',
              dataKey: 'salary_id',
              dataLabel: "salary_amount",
              options: [],
              lazy: {
                url: 'hrms/employee_salary/',
                lazyOneTime: true
              },
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          }
        ]
      }]
    }
  }
}