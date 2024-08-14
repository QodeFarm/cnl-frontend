import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-product-item-balance',
  templateUrl: './product-item-balance.component.html',
  styleUrls: ['./product-item-balance.component.scss']
})
export class ProductItemBalanceComponent {
  baseUrl: string = 'http://195.35.20.172:8000/api/v1/';

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
        // {
        //   fieldKey: 'location',
        //   name: 'Location',
        //   sort: true,
        //   displayType: "map",
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return `${row.location.name}`;
        //   },
        // },
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
            label: 'Balance',
            type: 'number',
            placeholder: 'Enter Balance',
            required: true,
          }
        },
        // {
        //   key: 'location',
        //   type: 'select',
        //   className: 'col-6 pb-3 ps-0',
        //   templateOptions: {
        //     label: 'Location',
        //     placeholder: 'Enter Location',
        //     datakey : 'location_name',
        //     datalabel : 'location_name',
        //     required: false,
        //     lazy: {
        //       url: this.baseUrl +'inventory/warehouse_locations/',
        //       lazyOneTime: true
        //     },
        //   },
        //   hooks: {
        //     onInit: (field: any) => {
        //       field.formControl.valueChanges.subscribe((data: any) => {
        //         if (form.field && this.formConfig.model && this.formConfig.model['location_id']) {
        //           this.formConfig.model['location_id'] = data.location_id
        //         } else {
        //           console.error('Form config or location data model is not defined.');
        //         }
        //       });
        //   },
        // }
        // },
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
 