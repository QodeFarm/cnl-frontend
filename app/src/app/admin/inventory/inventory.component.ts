import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent   {
  curdConfig: TaCurdConfig = {
  drawerSize: 500,
  drawerPlacement: 'right',
  tableConfig: {
    apiUrl: 'products/products/',
    title: 'Inventory',
    pkId: "product_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['id', 'name']
    },
    cols: [
      {
        fieldKey: 'name',
        name: 'Name',
        sort: true
      },
      {
        fieldKey: 'product_group_id',
        name: 'Product_group',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.product_group.group_name}`;
        },
      },
  
      {
        fieldKey: 'sales_description', 
        name: 'Sales Description',
        sort: true
      },
  
      {
        fieldKey: 'mrp', 
        name: 'MRP',
        sort: true
      },
  
      {
        fieldKey: 'sales_rate',
        name: 'Sales Rate',
        sort: true
      },
  
      {
        fieldKey: 'wholesale_rate',
        name: 'Wholesale Rate',
        sort: true
      },
  
      {
        fieldKey: 'stock_unit_id',
        name: 'Stock Unit',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.stock_unit.stock_unit_name}`;
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
            apiUrl: 'products/products'
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
    url: 'products/products/',
    title: 'Inventory',
    pkId: "product_id",
    exParams: [
      {
        key: 'product_group_id',
        type: 'script',
        value: 'data.product_group.product_group_id'
      },
      {
        key: 'stock_unit_id',
        type: 'script',
        value: 'data.stock_unit.stock_unit_id'
      }
    ],
    fields: [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'name',
            type: 'input',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Name',
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          },
          {
            key: 'product_group_id',
            type: 'select',
            className: 'ta-cell pr-md',
            templateOptions: {
              label: 'Product Group',
              dataKey: 'product_group_id',
              dataLabel: "group_name",
              options: [],
              lazy: {
                url: 'products/product_groups/',
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
            key: 'sales_description',
            type: 'text',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Sales Description',
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          },
          {
            key: 'mrp',
            type: 'input',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'MRP',
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          },
          {
            key: 'sales_rate',
            type: 'input',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Sales Rate',
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          },
          {
            key: 'wholesale_rate',
            type: 'input',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Wholesale Rate',
            }
          },
          {
            key: 'stock_unit_id',
            type: 'select',
            className: 'ta-cell pr-md',
            templateOptions: {
              label: 'Stock Unit',
              dataKey: 'stock_unit_id',
              dataLabel: "stock_unit_name",
              options: [],
              lazy: {
                url: 'products/product_stock_units/',
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
        ]
      }
    ]
  }
}
}