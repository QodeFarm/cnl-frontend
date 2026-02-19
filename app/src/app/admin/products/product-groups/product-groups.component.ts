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
    // defaultSort: { key: 'created_at', value: 'descend' },
    defaultSort: { key: 'is_deleted', value: 'ascend' },
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
            className: 'col-md-6 col-12 px-1 pb-md-0 pb-3',
            key: 'code',
            type: 'input',
            templateOptions: {
              label: 'Group Code',
              readonly: false,
            }
          },
          {
            className: 'col-md-6 col-12 px-1 pb-md-0 pb-3',
            key: 'product_mode_id',
            type: 'select',
            templateOptions: {
              label: 'Product group Mode',
              dataKey: 'item_master_id',
              dataLabel: 'mode_name',
              options: [],
              required: false,
              lazy: {
                url: 'products/item-master/',
                lazyOneTime: true
              }
            },
            // hooks: {
            //   onChanges: (field: any) => {
            //     field.formControl.valueChanges.subscribe((data: any) => {
            //       if (this.curdConfig.formConfig?.model?.products) {
            //         this.curdConfig.formConfig.model['product_mode_id'] = data?.item_master_id;
            //       }
            //     });
            //   }
            // }
          },
          {
            className: 'col-md-6 col-12 px-1 pb-md-0 pb-3',
            key: 'under_group_id',
            type: 'productGroups-dropdown',
            templateOptions: {
              label: 'Under Group',
              dataKey: 'product_group_id',
              dataLabel: "group_name",
              options: [],
              required: true,
              lazy: {
                url: 'products/product_groups/',
                lazyOneTime: true
              }
            },
            hooks: {
              onChanges: (field: any) => {
                field.formControl.valueChanges.subscribe((data: any) => {
                  if (this.curdConfig.formConfig && this.curdConfig.formConfig.model && this.curdConfig.formConfig.model['products']) {
                    this.curdConfig.formConfig.model['products']['product_group_id'] = data?.product_group_id;
                  } else {
                    console.error('Form config or lead_status data model is not defined.');
                  }
                });
              }
            }
          },
          {
            key: 'description',
            type: 'textarea',
            className: 'col-md-6 col-12 px-1 pb-md-0 pb-3',
            templateOptions: {
              label: 'Description',
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          }
        ]
      }
    ]
  }
}
}