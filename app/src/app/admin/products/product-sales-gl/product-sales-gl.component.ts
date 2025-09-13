import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-product-sales-gl',
  templateUrl: './product-sales-gl.component.html',
  styleUrls: ['./product-sales-gl.component.scss']
})
export class ProductSalesGlComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'products/product_sales_gl/',
      title: 'Product Sales GL',
      
      pkId: "sales_gl_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['name','sales_accounts','code','inactive','type','account_no','is_loan_account','address','employee','pan']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
      defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          // sort: true
        },
        {
          fieldKey: 'sales_accounts',
          name: 'Sales Accounts',
          sort: true,
        },
        {
          fieldKey: 'code',
          name: 'Code',
          sort: true,
        },
        // {
        //   fieldKey: 'is_subledger',
        //   name: 'Is Subledger',
        //   sort: false,
        //   type: 'boolean'
        // },
        {
          fieldKey: 'inactive',
          name: 'Inactive',
          sort: true,
          type: 'boolean'
        },
        {
          fieldKey: 'type', 
          name: 'Type',
          sort: true
        },
		{
		  fieldKey: 'account_no',
		  name: 'Account No',
		  sort: true,
		  isEncrypted: true
		},
        // {
        //   fieldKey: 'rtgs_ifsc_code', 
        //   name: 'RTGS IFSC Code',
        //   sort: false
        // },
        // {
        //   fieldKey: 'classification', 
        //   name: 'Classification',
        //   sort: false
        // },
        {
          fieldKey: 'is_loan_account', 
          name: 'Is Loan Account',
          sort: true,
		      type: 'boolean'
        },
        // {
        //   fieldKey: 'tds_applicable', 
        //   name: 'TDS Applicable',
        //   sort: false,
		    //   type: 'boolean'
        // },
        {
          fieldKey: 'address', 
          name: 'Address',
          sort: true
        },
        {
          fieldKey: 'employee', 
          name: 'Employee',
          sort: true,
		      type: 'boolean'
        },
        {
          fieldKey: 'pan', 
          name: 'PAN',
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
              apiUrl: 'products/product_sales_gl'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'products/product_sales_gl'
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
      url: 'products/product_sales_gl/',
      title: 'Product Sales GL',
      pkId: "sales_gl_id",
      exParams: [],
      fields: 
      [ 
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: 
        [
	       {
            
              key: 'name',
              type: 'input',
              className: 'col-md-6 col-12 px-1 pb-3',
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
              key: 'sales_accounts',
              type: 'input',
              className: 'col-md-6 col-12 px-1 pb-3',
              templateOptions: {
                label: 'Sales Accounts',
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
              className: 'col-md-6 col-12 px-1 pb-3',
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
              key: 'type',
              type: 'input',
              className: 'col-md-6 col-12 px-1 pb-3',
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
              key: 'is_subledger',
              type: 'checkbox',
              className: 'col-md-6 col-12 px-1 pb-3',
              templateOptions: {
                label: 'Is Subledger'
              }
            },
            {
              key: 'inactive',
              type: 'checkbox',
              className: 'col-md-6 col-12 px-1 pb-3',
              templateOptions: {
                label: 'Inactive'
              }
            },
            {
              key: 'account_no',
              type: 'input',
              className: 'col-md-6 col-12 px-1 pb-3',
              templateOptions: {
                label: 'Account No',
                type: 'password'
              }
            },
            {
              key: 'rtgs_ifsc_code',
              type: 'input',
              className: 'col-md-6 col-12 px-1 pb-3',
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
              className: 'col-md-6 col-12 px-1 pb-3',
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
              key: 'pan',
              type: 'input',
              className: 'col-md-6 col-12 px-1 pb-3',
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
              key: 'is_loan_account',
              type: 'checkbox',
              className: 'col-md-6 col-12 px-1 pb-3',
              templateOptions: {
                label: 'Is Loan Account'
              }
            },
            {
              key: 'tds_applicable',
              type: 'checkbox',
              className: 'col-md-6 col-12 px-1 pb-3',
              templateOptions: {
                label: 'TDS Applicable'
              }
            },
			      {
              key: 'employee',
              type: 'checkbox',
              className: 'col-md-6 col-12 px-1 pb-3 pb-md-0',
              templateOptions: {
                label: 'Employee'
              }
            },
            {
              key: 'address',
              type: 'textarea',
              className: 'col-md-6 col-12 px-1 pb-0',
              templateOptions: {
                label: 'Address',
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