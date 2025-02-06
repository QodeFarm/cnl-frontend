import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-vendor-agent',
  templateUrl: './vendor-agent.component.html',
  styleUrls: ['./vendor-agent.component.scss']
})
export class VendorAgentComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'vendors/vendor_agent/',
      title: 'Vendor Agent List',
      
      pkId: "vendor_agent_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['vendor_agent_id', 'name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
          fieldKey: 'amount_type',
          name: 'Amount Type'
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
              apiUrl: 'vendors/vendor_agent'
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
      url: 'vendors/vendor_agent/',
      title: 'Vendor Agent List',
      pkId: "vendor_agent_id",
      exParams: [
      ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
        {
          key: 'code',
          type: 'input',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter code',
            required: true,
          }
        },
		    {
          key: 'name',
          type: 'input',
          className: 'col-6 pb-3 pe-0',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          }
        },
		    {
          key: 'commission_rate',
          type: 'input',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Commission rate',
            placeholder: 'Enter commission rate',
            required: true,
          }        
        },
        {
          key: 'rate_on',
          type: 'select',
          className: 'col-6 pb-3 pe-0',
          templateOptions: {
            label: 'Rate On',
            placeholder: 'Enter rate on',
            required: true,
            options: [
              { 'label': "Qty", value: 'Qty' },
              { 'label': "Amount", value: 'Amount' }
            ]
          }
        },
        {
          key: 'amount_type',
          type: 'select',
          className: 'col-6 ps-0',
          templateOptions: {
            label: 'Amount Type',
            placeholder: 'Enter amount type',
            required: true,
            options: [
              { 'label': "Taxable", value: 'Taxable' },
              { 'label': "BillAmount", value: 'BillAmount' }
            ]
          }
        },]
      }
      ]
    }

  }
}