import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-labor',
  templateUrl: './labor.component.html',
  styleUrls: ['./labor.component.scss']
})
export class LaborComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'production/labor/',
      title: 'Labor',
      pkId: "labor_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['labor_id', 'employee_id']
      },
      cols: [
        {
          fieldKey: 'employee_id',
          name: 'Employee',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.employee.name}`;
          },
        },
        {
          fieldKey: 'work_order_id',
          name: 'Work Order',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `Product: ${row.work_order.product.name} (Status: ${row.work_order.status.status_name})`;
          },
        },
        {
          fieldKey: 'hours_worked',
          name: 'Hours Worked'
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
              apiUrl: 'production/labor'
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
      url: 'production/labor/',
      title: 'Labor',
      pkId: "labor_id",
      exParams: [
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
        },
        {
          key: 'work_order_id',
          type: 'script',
          value: 'data.work_order.work_order_id'
        },
      ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'employee',
              type: 'select',
              className: 'col-6',
              templateOptions: {
                label: 'Employee',
                dataKey: 'employee_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'hrms/employees/',
                  lazyOneTime: true
                },
                required: true,
              },
              hooks: {
                onInit: (field: any) => {
                }
              }
            },                    
            {
              key: 'work_order',
              type: 'select',
              className: 'col-6',
              templateOptions: {
                label: 'Work Order',
                dataKey: 'work_order_id',
                dataLabel: `work_order_id`,
                options: [],
                lazy: {
                  url: 'production/work_orders/',
                  lazyOneTime: true,
                },
                required: true,
                displayType: "mapFn",
              },
              hooks: {
                onInit: (field: any) => {
                }
              }
            },
            {
              key: 'hours_worked',
              type: 'input',
              className: 'col-6 p-2',
              templateOptions: {
                label: 'Hours Worked',
                placeholder: 'Enter Hours Worked',
                required: true,
              }
            }
          ]
        }
      ]
    }
  }
}