import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaTableConfig } from '@ta/ta-table';

@Component({
  selector: 'app-brand-salesman',
  templateUrl: './brand-salesman.component.html',
  styleUrls: ['./brand-salesman.component.scss']
})
export class BrandSalesmanComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/brand_salesman/',
      title: 'Brand Salesman',
      
      pkId: "brand_salesman_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['brand_salesman_id', 'name']
      },
      cols: [
        {
          fieldKey: 'code',
          name: 'code'
        },
		    {
          fieldKey: 'name',
          name: 'Name'
        },
		    {
          fieldKey: 'commission_rate',
          name: 'Commission Rate'
        },
		    {
          fieldKey: 'rate_on',
          name: 'Rate On'
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
              apiUrl: 'masters/brand_salesman'
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
    formConfig: 
    {
      url: 'masters/brand_salesman/',
      title: 'Brand Salesman',
      pkId: "brand_salesman_id",
      exParams: [
      ],
      fields: 
      [ 
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: 
        [
	       {
          key: 'code',
          type: 'text',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter Code',
            required: true,
          }
          },
		     {
          key: 'name',
          type: 'text',
          className: 'col-6 pb-3 pe-0',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter Name',
            required: true,
          }
         },
        
		     {
          key: 'commission_rate',
          type: 'text',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Commission Rate',
            placeholder: 'Enter Commission Rate',
            required: true,
          }
          },
		     {
          key: 'rate_on',
          type: 'select',
          className: 'col-6 pb-3 pe-0',
          templateOptions: {
            label: 'Rate On',
            placeholder: 'Enter Rate On',
            required: true,
            options: [
              { 'label': "Qty", value: 'Qty' },
              { 'label': "Amount", value: 'Amount' },
              { 'label': "Both", value: 'Both' }
            ]
          }
        },
      ]
    }
      
      ]
    }
  }


  tableConfig: TaTableConfig = {
    apiUrl: 'masters/brand_salesman/',
    title: 'Brand Salesman',
    pkId: "brand_salesman_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['brand_salesman_id', 'name']
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
        fieldKey: 'commission_rate',
        name: 'Commission Rate'
      },
	   {
        fieldKey: 'rate_on',
        name: 'Rate On'
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