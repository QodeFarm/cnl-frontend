import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss']
})
export class ProductCategoriesComponent  {
  curdConfig: TaCurdConfig = {
  drawerSize: 500,
  drawerPlacement: 'right',
  tableConfig: {
    apiUrl: 'products/product_categories/',
    title: 'Product Categories',
    pkId: "category_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['id']
    },
    cols: [
      {
        fieldKey: 'category_name',
        name: 'Name',
        sort: true
      },		
      {
        fieldKey: 'code', 
        name: 'Code',
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
            apiUrl: 'products/product_categories'
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
    url: 'products/product_categories/',
    title: 'Product Categories',
    pkId: "category_id",
    exParams: [],
    fields: [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'category_name',
            type: 'input',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Category Name',
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          },
          {
            key: 'code',
            type: 'input',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Code',
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