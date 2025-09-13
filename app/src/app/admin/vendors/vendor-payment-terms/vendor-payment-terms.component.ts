import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-vendor-payment-terms',
  templateUrl: './vendor-payment-terms.component.html',
  styleUrls: ['./vendor-payment-terms.component.scss']
})
export class VendorPaymentTermsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'vendors/vendor_payment_terms/',
      title: 'Vendor Payment Terms List',
      
      pkId: "payment_term_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['payment_term_id', 'name', 'code','fixed_days','no_of_fixed_days','payment_cycle','run_on']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
      defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
	      {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'code',
          name: 'code',
          sort: true
        },
		    {
          fieldKey: 'fixed_days',
          name: 'Fixed Days',
          sort: true
        },
		    {
          fieldKey: 'no_of_fixed_days',
          name: 'No of fixed days',
          sort: true
        },
        {
          fieldKey: 'payment_cycle',
          name: 'Payment Cycle',
          sort: true
        },
		    {
          fieldKey: 'run_on',
          name: 'Run On',
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
              apiUrl: 'vendors/vendor_payment_terms'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'vendors/vendor_payment_terms'
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
      url: 'vendors/vendor_payment_terms/',
      title: 'Vendor Payment Terms List',
      pkId: "payment_term_id",
      exParams: [
      ],
      fields: [ 
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
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
            label: 'Fixed Days',
            placeholder: 'Enter fixed days',
            required: true,
          }
        },
		    {
          key: 'no_of_fixed_days',
          type: 'input',
          className: 'col-md-6 col-12 pb-3 px-1',
          templateOptions: {
            label: 'No of fixed days',
            placeholder: 'Enter no of fixed days',
            required: true,
          }
        },
		    {
          key: 'payment_cycle',
          type: 'input',
          className: 'col-md-6 col-12 pb-md-0 pb-3 px-1',
          templateOptions: {
            label: 'Payment Cycle',
            placeholder: 'Enter payment cycle',
            required: true,
          }
        },
		    {
          key: 'run_on',
          type: 'input',
          className: 'col-md-6 col-12  px-1',
          templateOptions: {
            label: 'Run on',
            placeholder: 'Enter run on',
            required: true,
          }
        }
      ]
    }
      ]
    }

  }

}
