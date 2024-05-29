import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'leaves/employeeleaves/',
      title: 'Sales Price List',
      pkId: "leave_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['id', 'name']
      },
      cols: [
        {
          fieldKey: 'leave_id',
          name: 'ID',
          sort: true
        },
        {
          fieldKey: 'employee',
          name: 'Employee',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.employee.first_name} ${row.employee.last_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'leave_type',
          name: 'Leave Type',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.leave_type.leave_type_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'comments',
          name: 'Comments',
          sort: true
        },
        {
          fieldKey: 'start_date',
          name: 'Start Date',
          type: 'date',
          sort: true
        },
        {
          fieldKey: 'end_date',
          name: 'End Date',
          type: 'date',
          sort: true
        },
        {
          fieldKey: 'status',
          name: 'Status',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.status.status_name}`;
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
              apiUrl: 'leaves/employeeleaves'
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
      url: 'leaves/employeeleaves/',
      title: 'Sales',
      pkId: "leave_id",
      exParams: [
        {
          key: 'status_id',
          type: 'script',
          value: 'data.status.status_id'
        },
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
        },
        {
          key: 'leave_type_id',
          type: 'script',
          value: 'data.leave_type.leave_type_id'
        }
      ],
      fields: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
        {
          key: 'employee',
          type: 'select',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Empployee',
            dataKey: 'employee_id',
            dataLabel: "first_name",
            options: [],
            lazy: {
              url: 'employees/employees/',
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
          key: 'start_date',
          type: 'date',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Start Date',
            placeholder: 'Enter Start Date',
            required: true,
          }
        },
        {
          key: 'end_date',
          type: 'date',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'End Date',
            placeholder: 'Enter End Date',
            required: true,
          }
        },
        {
          key: 'comments',
          type: 'textarea',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Comments',
            placeholder: 'Enter comments',
            required: true,
          }
        },
        {
          key: 'status',
          type: 'select',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Status',
            dataKey: 'status_id',
            dataLabel: "status_name",
            options: [],
            lazy: {
              url: 'leaves/status/',
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
          key: 'leave_type',
          type: 'select',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Status',
            dataKey: 'leave_type_id',
            dataLabel: "leave_type_name",
            options: [],
            lazy: {
              url: 'leaves/leavetypes/',
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
      ]}
      ]
    }

  }
}
