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
          name: 'Balance',
          sort: true
        },     
        {
          fieldKey: 'location',
          name: 'Location',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.location.location_name}`;
          },
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
          key: 'location_id',
          type: 'script',
          value: 'data.location.location_id'
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
            label: 'Balance',
            type: 'number',
            placeholder: 'Enter Balance',
            required: true,
          }
        },
        {
          key: 'location',
          type: 'select',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Location',
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
        
              // Fetch and bind the options manually (optional)
              // this.http.get('inventory/warehouse_locations/').subscribe((response: any) => {
              //   field.templateOptions.options = response.data; // Adjust based on your API response structure
              // });
            }
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
      ]
    }]
  }}
}
 