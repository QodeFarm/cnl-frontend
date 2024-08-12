import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-shipping-companies',
  templateUrl: './shipping-companies.component.html',
  styleUrls: ['./shipping-companies.component.scss']
})
export class ShippingCompaniesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/shipping_companies/',
      title: 'Shipping companies',
      // showCheckbox: true,
      pkId: "shipping_company_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['shipping_company_id', 'name']
      },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'code', 
          name: 'Code',
          sort: true
        },
        {
          fieldKey: 'gst_no', 
          name: 'GST',
          sort: false
        },
        {
          fieldKey: 'website_url', 
          name: 'Website URL',
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
              apiUrl: 'masters/shipping_companies'
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
      url: 'masters/shipping_companies/',
      title: 'Shipping companies',
      pkId: "shipping_company_id",
      fields: [
        {
          className: 'col-9 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup:[
            {
              key: 'name',
              type: 'input',
              className: 'col-6',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-6',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code',
                required: true,
              }
            },
            {
              key: 'gst_no',
              type: 'input',
              className: 'col-6',
              templateOptions: {
                label: 'GST',
                placeholder: 'Enter GST',
                required: false,
              }
            },
            {
              className: 'col-6',
              key: 'website_url',
              type: 'input',
              templateOptions: {
                label: 'Website',
                placeholder: 'Enter Website URL',
              }
            },
          ]
        }
      ]
    }

  }
}
