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
      
      pkId: "product_item_balance_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['product','warehouse_location_id','quantity']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
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
          fieldKey: 'warehouse_location_id',
          name: 'Warehouse Locations',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.warehouse_location.location_name}`;
          },
        },
        {
          fieldKey: 'quantity',
          name: 'Quantity',
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
      pkId: "product_item_balance_id",
      exParams: [
        {
          key: 'product_id',
          type: 'script',
          value: 'data.product.product_id'
        },
        {
          key: 'warehouse_location_id',
          type: 'script',
          value: 'data.warehouse_location.location_id'
        },
      ],
      fields: 
      [ 
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: 
        [
          {
            key: 'product',
            type: 'select',
            className: 'col-md-6 col-12 px-1 pb-3',
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
            key: 'warehouse_location',
            type: 'warehouseLocations-dropdown',
            className: 'col-md-6 col-12 px-1 pb-3',
            templateOptions: {
              label: 'Warehouse Location',
              placeholder: 'Enter Location',
              dataKey: 'location_id',
              dataLabel: 'location_name',
              required: true, // Consider setting required to true if necessary
              lazy: {
                url: 'inventory/warehouse_locations/',
                lazyOneTime: true
              },
            },
            hooks: {
              onInit: (field: any) => {
                field.templateOptions.options = []; // Initialize options as empty
          
                // Subscribe to formControl value changes if needed, or simply set the options once
                field.formControl.valueChanges.subscribe(data => {
                  console.log("Location data:", data); // Debug log
                });
              }
            }
          },
          {
            key: 'quantity',
            type: 'input',
            className: 'col-md-6 col-12 px-1',
            templateOptions: {
              label: 'Quantity',
              type: 'number',
              placeholder: 'Enter Quantity',
              required: true,
            }
          },
      ]
    }]
  }}
}
