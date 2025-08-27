import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-product-types',
  templateUrl: './product-types.component.html',
  styleUrls: ['./product-types.component.scss']
})
export class ProductTypesComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/product_types/',
      title: 'Product Types',
      pkId: "type_id",
      pageSize: 10,
      globalSearch: {
        keys: ['type_id', 'type_name', 'mode_type']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'type_name',
          name: 'Type Name',
          sort: true
        },
        {
          fieldKey: 'mode_type',
          name: 'Mode Type',
          sort: true
        },
        // {
        //   fieldKey: 'created_at',
        //   name: 'Created At',
        //   type: 'date',
        //   sort: true
        // },
        {
          fieldKey: 'type_id', // fixed: use pkId here
          name: 'Action',
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/product_types'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/product_types'
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
      url: 'masters/product_types/',
      title: 'Product Types',
      pkId: "type_id",
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'type_name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Type Name',
                placeholder: 'Enter Type Name',
                required: true,
              }
            },
            {
              key: 'mode_type',
              type: 'select',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Mode Type',
                placeholder: 'Select Mode Type',
                required: true,
                options: [
                  { label: 'Inventory', value: 'Inventory' },
                  { label: 'Non Inventory', value: 'Non Inventory' },
                  { label: 'Service', value: 'Service' },
                  { label: 'All', value: 'all' }
                ]
              }
            },
          ]
        }
      ]
    }
  };
}

