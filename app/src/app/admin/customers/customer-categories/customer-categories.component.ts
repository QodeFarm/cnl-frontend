import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-customer-categories',
  templateUrl: './customer-categories.component.html',
  styleUrls: ['./customer-categories.component.scss']
})
export class CustomerCategoriesComponent {
curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/customer_categories/',
      title: 'Customer Categories',
      pkId: "customer_category_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['customer_category_id', 'name','code']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/customer_categories'
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
      url: 'masters/customer_categories/',
      title: 'Customer  Categories',
      pkId: "customer_category_id",
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup:[
            {
              key: 'name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code'
              }
            },
          ]
        }
      ]
    }

  }
}
