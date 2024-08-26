import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.component.html',
  styleUrls: ['./work-orders.component.scss']
})
export class WorkOrdersComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'production/work_orders/',
      title: 'Work Orders',
      pkId: "work_order_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['work_order_id', 'status_id','product_id']
      },
      cols: [
        {
          fieldKey: 'status_id',
          name: 'Status',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.status.status_name}`;
          },
        },
        {
          fieldKey: 'product_id',
          name: 'Work Order',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.name}`;
          },
        },
        {
          fieldKey: 'start_date',
          name: 'Start Date',
        },
        {
          fieldKey: 'end_date',
          name: 'End Date',
        },
        {
          fieldKey: 'quantity',
          name: 'Quantity'
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
              apiUrl: 'production/work_orders'
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
      url: 'production/work_orders/',
      title: 'Work Order',
      pkId: "work_order_id",
      exParams: [
        {
          key: 'status_id',
          type: 'script',
          value: 'data.status.status_id'
        },
        {
          key: 'product_id',
          type: 'script',
          value: 'data.product.product_id'
        },
      ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'status',
              type: 'select',
              className: 'col-6',
              templateOptions: {
                label: 'Status',
                dataKey: 'status_id',
                dataLabel: "status_name",
                options: [],
                lazy: {
                  url: 'production/production_statuses/',
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
              key: 'product',
              type: 'select',
              className: 'col-6',
              templateOptions: {
                label: 'Product',
                dataKey: 'product_id',
                dataLabel: `name`,
                options: [],
                lazy: {
                  url: 'products/products_get/',
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
              key: 'start_date',
              type: 'date',
              className: 'col-6 p-2',
              templateOptions: {
                label: 'Start Date',
                placeholder: 'Start Date',
                required: false,
              }
            },
            {
              key: 'end_date',
              type: 'date',
              className: 'col-6 p-2',
              templateOptions: {
                label: 'End Date',
                placeholder: 'End Date',
                required: false,
              }
            },
            {
              key: 'quantity',
              type: 'input',
              className: 'col-6',
              templateOptions: {
                label: 'End Quantity',
                placeholder: 'Quantity',
                required: false,
              }
            }
          ]
        }
      ]
    }
  }
}
