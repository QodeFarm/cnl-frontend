import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaTableConfig } from '@ta/ta-table';
 
@Component({
  selector: 'app-product-brands',
  templateUrl: './product-brands.component.html',
  styleUrls: ['./product-brands.component.scss']
})
export class ProductBrandsComponent {
 
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/product_brands/',
      title: 'Product Brands',
      
      pkId: "brand_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['brand_id', 'brand_name','code','brand_salesman']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'brand_name',
          name: 'Brand Name',
          sort: true
        },
        {
          fieldKey: 'code',
          name: 'Code',
          sort: true
        },
        // {
        //   fieldKey: 'picture',
        //   name: 'Picture',
        //   sort: true
        // },
        {
          fieldKey: 'brand_salesman_name',
          name: 'Brand Salesman',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.brand_salesman.name}`;
          },
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
              apiUrl: 'masters/product_brands'
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
      url: 'masters/product_brands/',
      title: 'Product Brands',
      pkId: "brand_id",
      exParams: [
        {
          key: 'brand_salesman_id',
          type: 'script',
          value: 'data.brand_salesman.brand_salesman_id'
        },
      ],
      fields: 
      [ 
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: 
        [
	       {
          key: 'brand_name',
          type: 'text',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Brand Name',
            placeholder: 'Enter Brand Name',
            required: true,
          }
        },
        {
          key: 'code',
          type: 'text',
          className: 'col-6 pb-3 pe-0',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter Code',
            required: true,
          }
        },
        // {
        //   key: 'picture',
        //   type: 'file',
        //   className: 'ta-cell pr-md col-md-6',
        //   templateOptions: {
        //     label: 'Upload picture',
        //     placeholder: 'Choose picture',
        //     required: true,
        //   }
        // },
        {
          key: 'brand_salesman',
          type: 'select',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Brand Salesman Id',
            dataKey: 'name',
            dataLabel: "name",
            options: [],
            lazy: {
              url: 'masters/brand_salesman/',
              lazyOneTime: true
            },
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
tableConfig: TaTableConfig = {
    apiUrl: 'masters/product_brands/',
    title: 'Product Brands',
    pkId: "brand_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['brand_id', 'name']
    },
    cols: [
      {
        fieldKey: 'code',
        name: 'Code'
      },
      {
          fieldKey: 'name',
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
            apiUrl: 'api/masters/brand_salesman/'
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
 