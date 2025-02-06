import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-product-stock-units',
  templateUrl: './product-stock-units.component.html',
  styleUrls: ['./product-stock-units.component.scss']
})
export class ProductStockUnitsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'products/product_stock_units/',
      title: 'Product Stock Units',
      
      pkId: "stock_unit_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['id']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'stock_unit_name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'quantity_code_id',
          name: 'Quantity Code',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.quantity_code.quantity_code_name}`;
          },
        },
        {
          fieldKey: 'description', 
          name: 'Description',
          sort: false
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
              apiUrl: 'products/product_stock_units'
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
      url: 'products/product_stock_units/',
      title: 'Product Stock Units',
      pkId: "stock_unit_id",
      exParams: [
        {
          key: 'quantity_code_id',
          type: 'script',
          value: 'data.quantity_code.quantity_code_id'
        },
	  ],
    fields: 
    [ 
      {
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: 
      [
       {
              key: 'stock_unit_name',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Stock Unit Name',
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
			{
              key: 'quantity_code',
              type: 'select',
              className: 'col-6 pb-3 pe-0',
              templateOptions: {
                label: 'Quantity Code',
                dataKey: 'quantity_code_id',
                dataLabel: "quantity_code_name",
                options: [],
                lazy: {
                  url: 'masters/product_unique_quantity_codes/',
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
            {
              key: 'description',
              type: 'textarea',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Description',
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