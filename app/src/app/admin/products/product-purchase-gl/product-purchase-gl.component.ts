import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-product-purchase-gl',
  templateUrl: './product-purchase-gl.component.html',
  styleUrls: ['./product-purchase-gl.component.scss']
})
export class ProductPurchaseGlComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'products/product_purchase_gl/',
      title: 'Product Purchase GL',
      pkId: "purchase_gl_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['id']
      },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'purchase_accounts',
          name: 'Purchase Accounts',
          sort: false,
        },
        {
          fieldKey: 'code',
          name: 'Code',
          sort: true,
        },
        {
          fieldKey: 'is_subledger',
          name: 'Is Subledger',
          sort: false,
          type: 'boolean'
        },
        {
          fieldKey: 'inactive',
          name: 'Inactive',
          sort: false,
          type: 'boolean'
        },
        {
          fieldKey: 'type', 
          name: 'Type',
          sort: false
        },
        {
          fieldKey: 'account_no',
          name: 'Account No',
          sort: false,
          isEncrypted: true
        },
        {
          fieldKey: 'rtgs_ifsc_code', 
          name: 'RTGS IFSC Code',
          sort: false
        },
        {
          fieldKey: 'classification', 
          name: 'Classification',
          sort: false
        },
        {
          fieldKey: 'is_loan_account', 
          name: 'Is Loan Account',
          sort: false,
		      type: 'boolean'
        },
        {
          fieldKey: 'tds_applicable', 
          name: 'TDS Applicable',
          sort: false,
		      type: 'boolean'
        },
        {
          fieldKey: 'address', 
          name: 'Address',
          sort: false
        },
        {
          fieldKey: 'employee', 
          name: 'Employee',
          sort: false,
		      type: 'boolean'
        },
        {
          fieldKey: 'pan', 
          name: 'PAN',
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
              apiUrl: 'products/product_purchase_gl'
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
      url: 'products/product_purchase_gl/',
      title: 'Product Purchase GL',
      pkId: "purchase_gl_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'name',
              type: 'input',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Name',
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
			{
              key: 'purchase_accounts',
              type: 'input',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Purchase Accounts',
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
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'is_subledger',
              type: 'checkbox',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Is Subledger'
              }
            },
            {
              key: 'inactive',
              type: 'checkbox',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Inactive'
              }
            },
			{
              key: 'type',
              type: 'input',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Type',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'account_no',
              type: 'input',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Account No',
                type: 'password'
              }
            },
            {
              key: 'rtgs_ifsc_code',
              type: 'input',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'RTGS IFSC Code',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'classification',
              type: 'input',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Classification',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'is_loan_account',
              type: 'checkbox',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Is Loan Account'
              }
            },
            {
              key: 'tds_applicable',
              type: 'checkbox',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'TDS Applicable'
              }
            },
			{
              key: 'address',
              type: 'text',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Address',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
			{
              key: 'pan',
              type: 'input',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'PAN',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
			{
              key: 'employee',
              type: 'checkbox',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Employee'
              }
            },
          ]
        }
      ]
    }
  }
}