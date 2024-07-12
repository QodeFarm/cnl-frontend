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
  drawerPlacement: 'right',
  tableConfig: {
    apiUrl: 'products/product_groups/',
    title: 'Product Groups',
    pkId: "product_group_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['id', 'name']
    },
    cols: [
      {
        fieldKey: 'group_name',
        name: 'Name',
        sort: true
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
            confirmMsg: "are you Sure to delete?",
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
    fields: [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'group_name',
            type: 'input',
            className: 'ta-cell pr-md col-md-6 col-12',
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
            type: 'text',
            className: 'ta-cell pr-md col-md-6 col-12',
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