import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaTableConfig } from '@ta/ta-table';

@Component({
  selector: 'app-product-unique-quantity-codes',
  templateUrl: './product-unique-quantity-codes.component.html',
  styleUrls: ['./product-unique-quantity-codes.component.scss']
})
export class ProductUniqueQuantityCodesComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/product_unique_quantity_codes/',
      title: 'Product Unique Quantity Codes',
      showCheckbox: true,
      pkId: "quantity_code_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['quantity_code_id', 'quantity_code_name']
      },
      cols: [
        {
          fieldKey: 'quantity_code_name',
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
              confirmMsg: "are you Sure to delete?",
              apiUrl: 'masters/product_unique_quantity_codes'
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
      url: 'masters/product_unique_quantity_codes/',
      title: 'Product Unique Quantity Codes',
      pkId: "quantity_code_id",
      exParams: [
      ],
      fields: 
    [ 
      {
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: 
      [
       {
          key: 'quantity_code_name',
          type: 'text',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Quantity Code Name',
            placeholder: 'Enter Quantity Code Name',
            required: true,
          }
        },
      ]
    }
      ]
    }

  }


  tableConfig: TaTableConfig = {
    apiUrl: 'masters/product_unique_quantity_codes/',
    title: 'Product Unique Quantity Codes',
    pkId: "quantity_code_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['quantity_code_id', 'quantity_code_name']
    },
    cols: [
      {
        fieldKey: 'quantity_code_name',
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


