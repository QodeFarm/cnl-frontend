import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaTableConfig } from '@ta/ta-table';

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
      "globalSearch": {
        keys: ['type_id', 'type_name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'type_name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'mode_type',
          name: 'Mode Type',
          sort: true,
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
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/product_types/',
      title: 'Product Types',
      pkId: "type_id",
      exParams: [
      ],
      fields:
        [
          {
            fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
            fieldGroup:
              [
                {
                  key: 'type_name',
                  type: 'input',
                  className: 'col-md-6 col-12 p-0',
                  templateOptions: {
                    label: 'Type Name',
                    placeholder: 'Enter Type Name',
                    required: true,
                  }
                },
                {
                  key: 'mode_type',
                  type: 'select',
                  className: 'col-md-6 col-12 p-0',
                  templateOptions: {
                    label: 'Mode Type',
                    options: [
                      { value: 'Inventory', label: 'Inventory' },
                      { value: 'Non Inventory', label: 'Non Inventory' },
                      { value: 'Service', label: 'Service' },
                      { value: 'All', label: 'All' }
                    ],
                    required: true
                  }
                }



              ]
          }
        ]
    }

  }


  tableConfig: TaTableConfig = {
    apiUrl: 'masters/product_types/',
    title: 'Product Types',
    pkId: "type_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['type_id', 'type_name']
    },
    cols: [
      {
        fieldKey: 'type_name',
        name: 'Name'
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
            apiUrl: 'api/masters/product_types'
          },
          {
            type: 'callBackFn',
            label: 'Edit',
            // callBackFn: (row, action) => {
            //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            // }
          }
        ]
      }
    ]
  };
}
