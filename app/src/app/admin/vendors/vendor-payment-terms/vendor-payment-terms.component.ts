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
        keys: ['payment_term_id', 'name']
      },
      cols: [
	      {
          fieldKey: 'name',
          name: 'Name'
        },
        {
          fieldKey: 'code',
          name: 'code'
        },
		    {
          fieldKey: 'fixed_days',
          name: 'Fixed Days'
        },
		    {
          fieldKey: 'no_of_fixed_days',
          name: 'No of fixed days'
        },
        {
          fieldKey: 'payment_cycle',
          name: 'Payment Cycle'
        },
		    {
          fieldKey: 'run_on',
          name: 'Run On'
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
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter Name',
            required: true,
          }
        },
        {
          key: 'code',
          type: 'input',
          className: 'col-6 pb-3 pe-0',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter Code',
            required: true,
          }
        },
		    {
          key: 'fixed_days',
          type: 'input',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Fixed Days',
            placeholder: 'Enter fixed days',
            required: true,
          }
        },
		    {
          key: 'no_of_fixed_days',
          type: 'input',
          className: 'col-6 pb-3 pe-0',
          templateOptions: {
            label: 'No of fixed days',
            placeholder: 'Enter no of fixed days',
            required: true,
          }
        },
		    {
          key: 'payment_cycle',
          type: 'input',
          className: 'col-6 ps-0',
          templateOptions: {
            label: 'Payment Cycle',
            placeholder: 'Enter payment cycle',
            required: true,
          }
        },
		    {
          key: 'run_on',
          type: 'input',
          className: 'col-6 pe-0',
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
