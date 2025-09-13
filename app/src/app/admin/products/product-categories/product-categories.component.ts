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
  drawerPlacement: 'top',
  tableConfig: {
    apiUrl: 'products/product_categories/',
    title: 'Product Categories',
    
    pkId: "category_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['category_name','code']
    },
    // defaultSort: { key: 'created_at', value: 'descend' },
    defaultSort: { key: 'is_deleted', value: 'ascend' },
    cols: [
      {
        fieldKey: 'category_name',
        name: 'Name',
        sort: true
      },		
      {
        fieldKey: 'code', 
        name: 'Code',
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
            apiUrl: 'products/product_categories'
          },
          {
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
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
    fields: 
      [ 
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: 
        [
	       {
            key: 'category_name',
            type: 'input',
            className: 'col-md-6 col-12 px-1 pb-md-0 pb-3',
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
            className: 'col-md-6 col-12 px-1',
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