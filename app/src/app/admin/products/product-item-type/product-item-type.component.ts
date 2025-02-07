import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaTableConfig } from '@ta/ta-table';

@Component({
  selector: 'app-product-item-type',
  templateUrl: './product-item-type.component.html',
  styleUrls: ['./product-item-type.component.scss']
})
export class ProductItemTypeComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/product_item_type/',
      title: 'Product Item Type',
      
      pkId: "item_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['item_type_id', 'item_name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'item_name',
          name: 'Name',
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
              apiUrl: 'masters/product_item_type'
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
      url: 'masters/product_item_type/',
      title: 'Product Item Type',
      pkId: "item_type_id",
      exParams: [
      ],
      fields: 
      [ 
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: 
        [
	       {
          key: 'item_name',
          type: 'text',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Item Name',
            placeholder: 'Enter Item Name',
            required: true,
          }
        },
      ]
    }
      ]
    }

  }


  tableConfig: TaTableConfig = {
    apiUrl: 'masters/product_item_type/',
    title: 'Product Item Type',
    pkId: "item_type_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['item_type_id', 'item_name']
    },
    cols: [
      {
        fieldKey: 'item_name',
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
            apiUrl: 'api/masters'
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
