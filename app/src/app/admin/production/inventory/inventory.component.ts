import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'production/inventory/',
      title: 'Inventory',
      pkId: "inventory_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['inventory_id', 'product_id']
      },
      cols: [
        {
          fieldKey: 'product_id',
          name: 'Product',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.name}`;
          },
        },
        {
          fieldKey: 'quantity',
          name: 'Quantity'
        },
        {
          fieldKey: 'location',
          name: 'Location'
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
              apiUrl: 'production/inventory'
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
      url: 'production/inventory/',
      title: 'Inventory',
      pkId: "inventory_id",
      exParams: [
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
              key: 'product',
              type: 'select',
              className: 'col-6',
              templateOptions: {
                label: 'Product',
                dataKey: 'product_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'products/products_get/',
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
              key: 'location',
              type: 'input',
              className: 'col-6',
              templateOptions: {
                label: 'Location',
                placeholder: 'Enter Location',
                required: true,
              }
            },
            {
              key: 'quantity',
              type: 'input',
              className: 'col-6 p-2',
              templateOptions: {
                label: 'Quantity',
                placeholder: 'Enter Quantity',
                required: true,
              }
            }
          ]
        }
      ]
    }
  }
  formConfig: any;
}