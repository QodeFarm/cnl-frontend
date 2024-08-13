import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-product-item-balance',
  templateUrl: './product-item-balance.component.html',
  styleUrls: ['./product-item-balance.component.scss']
})
export class ProductItemBalanceComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'products/product_item_balance/',
      title: 'Product Item Balences',
      
      pkId: "product_balance_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['product_balance_id']
      },
      cols: [
        {
          fieldKey: 'balance',
          name: 'Balence',
          sort: true
        },
        {
          fieldKey: 'location_id',
          name: 'Location',
          sort: true
        },
        {
          fieldKey: 'product',
          name: 'Product',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.name}`;
          },
        },
        {
          fieldKey: 'warehouse',
          name: 'Warehouse',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.warehouse.name}`;
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
              apiUrl: 'products/product_item_balance'
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
      url: 'products/product_item_balance/',
      title: 'Product Item Balence',
      pkId: "product_balance_id",
      exParams: [
        {
          key: 'product_id',
          type: 'script',
          value: 'data.product.product_id'
        },
        {
          key: 'warehouse_id',
          type: 'script',
          value: 'data.warehouse.warehouse_id'
        },
      ],
      fields: 
      [ 
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: 
        [
	       {
          key: 'balance',
          type: 'input',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Balence',
            type: 'number',
            placeholder: 'Enter Balence',
            required: true,
          }
        },
        {
          key: 'location_id',
          type: 'input',
          className: 'col-6 pb-3 pe-0',
          templateOptions: {
            label: 'Location',
            placeholder: 'Enter Location',
            required: true,
          }
        },
        {
          key: 'product',
          type: 'select',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Products',
            dataKey: 'product_id',
            dataLabel: "name",
            options: [],
            lazy: {
              url: 'products/products/',
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
          key: 'warehouse',
          type: 'select',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Warehouses',
            dataKey: 'warehouse_id',
            dataLabel: "name",
            options: [],
            lazy: {
              url: 'inventory/warehouses/',
              lazyOneTime: true
            },
            // required: true
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
 