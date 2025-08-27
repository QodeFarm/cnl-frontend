import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-product-groups',
  templateUrl: './product-groups.component.html',
  styleUrls: ['./product-groups.component.scss']
})
export class ProductGroupsComponent   {
  curdConfig: TaCurdConfig = {
  drawerSize: 500,
  drawerPlacement: 'top',
  tableConfig: {
    apiUrl: 'products/product_groups/',
    title: 'Product Groups',
    
    pkId: "product_group_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['group_name', 'description']
    },
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'group_name',
        name: 'Name',
        sort: true
      },		
      {
        fieldKey: 'description', 
        name: 'Description',
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
            apiUrl: 'products/product_groups'
          },
          {
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
            apiUrl: 'products/product_groups'
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
    url: 'products/product_groups/',
    title: 'Product Groups',
    pkId: "product_group_id",
    exParams: [],
    fields: 
      [ 
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: 
        [
	       {
            key: 'group_name',
            type: 'text',
            className: 'col-md-6 col-12 px-1 pb-md-0 pb-3',
            templateOptions: {
              label: 'Group Name',
              required: true
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
            className: 'col-md-6 col-12 px-1',
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