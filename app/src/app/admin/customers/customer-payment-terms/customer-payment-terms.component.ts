import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-customer-payment-terms',
  templateUrl: './customer-payment-terms.component.html',
  styleUrls: ['./customer-payment-terms.component.scss']
})
export class CustomerPaymentTermsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/customer_payment_terms/',
      title: 'Customer Payment Terms',
      // 
      pkId: "payment_term_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['payment_term_id', 'name','code','fixed_days','no_of_fixed_days','payment_cycle', 'run_on']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          // sort: true
        },
        {
          fieldKey: 'code', 
          name: 'Code',
          // sort: true
        },
        {
          fieldKey: 'fixed_days', 
          name: 'Fixed days',
          type: 'number',
          sort: true
        },
        {
          fieldKey: 'no_of_fixed_days', 
          name: 'No.of.fixed days',
          sort: true
        },
        {
          fieldKey: 'payment_cycle', 
          name: 'Payment Cycle',
          sort: true
        },
        {
          fieldKey: 'run_on', 
          name: 'Run on',
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
              apiUrl: 'masters/customer_payment_terms'
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
      url: 'masters/customer_payment_terms/',
      title: 'Customer Payment Terms',
      pkId: "payment_term_id",
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup:[
            {
              key: 'name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code',
                required: true,
              }
            },
            {
              key: 'fixed_days',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Fixed days',
                type: 'number',
                placeholder: 'Enter Fixed days',
                required: false,
              }
            },
            {
              key: 'no_of_fixed_days',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'no.of.Fixed days',
                type: 'number',
                placeholder: 'Enter no.of.Fixed days',
                required: false,
              }
            },
            {
              className: 'col-md-6 col-12 pb-3 pb-md-0 px-1',
              key: 'payment_cycle',
              type: 'input',
              templateOptions: {
                label: 'Payment cycle',
                placeholder: 'Enter payment cycle',
              }
            },
            {
              className: 'col-md-6 col-12 px-1',
              key: 'run_on',
              type: 'input',
              templateOptions: {
                label: 'Run on',
                placeholder: 'Enter Run on',
              }
            },
          ]
        }
      ]
    }

  }
}
