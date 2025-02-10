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
        keys: ['id','name','sales_accounts','code','inactive','type','account_no','is_loan_account','address','employee','pan']
      },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          // sort: true
        },
        {
          fieldKey: 'sales_accounts',
          name: 'Sales Accounts',
          sort: false,
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
          sort: false,
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
              className: 'col-6 pb-3 ps-0',
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
              className: 'col-6 pb-3 pe-0',
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
              className: 'col-6 pb-3 ps-0',
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
              className: 'col-6 pb-3 pe-0',
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
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Is Subledger'
              }
            },
            {
              key: 'inactive',
              type: 'checkbox',
              className: 'col-6 pb-3 pe-0',
              templateOptions: {
                label: 'Inactive'
              }
            },
            {
              key: 'account_no',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Account No',
                type: 'password'
              }
            },
            {
              key: 'rtgs_ifsc_code',
              type: 'input',
              className: 'col-6 pb-3 pe-0',
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
              className: 'col-6 pb-3 ps-0',
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
              className: 'col-6 pb-3 pe-0',
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
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Is Loan Account'
              }
            },
            {
              key: 'tds_applicable',
              type: 'checkbox',
              className: 'col-6 pb-3 pe-0',
              templateOptions: {
                label: 'TDS Applicable'
              }
            },
			      {
              key: 'employee',
              type: 'checkbox',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Employee'
              }
            },
            {
              key: 'address',
              type: 'textarea',
              className: 'col-6 pb-3 pe-0',
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