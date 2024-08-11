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
        fieldKey: 'code',
        name: 'Code',
        sort: true
      },
      {
        fieldKey: 'category',
        name: 'Category',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.category.category_name}`;
        },
      },
      {
        fieldKey: 'barcode',
        name: 'Barcode',
        sort: true
      },
      {
        fieldKey: 'stock_unit',
        name: 'Stock Unit Name',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.stock_unit.stock_unit_name}`;
        },
      },
      {
        fieldKey: 'mrp',
        name: 'MRP',
        sort: true
      },
      {
        fieldKey: 'product_group_id',
        name: 'Product Group',
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
        fieldKey: 'purchase_rate',
        name: 'Purchase Rate',
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
        fieldKey: 'dealer_rate',
        name: 'Dealer Rate',
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
    fields: [ ]
  }
}
}