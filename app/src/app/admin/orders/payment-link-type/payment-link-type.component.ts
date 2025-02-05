import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-payment-link-type',
  templateUrl: './payment-link-type.component.html',
  styleUrls: ['./payment-link-type.component.scss']
})
export class PaymentLinkTypeComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/payment_link_type/',
      title: 'Payment link type',
      pkId: "payment_link_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['payment_link_type_id', 'name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name'
        },
		{
          fieldKey: 'description',
          name: 'Description'
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
              apiUrl: 'masters/payment_link_type'
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
      url: 'masters/payment_link_type/',
      title: 'Payment link type',
      pkId: "payment_link_type_id",
      exParams: [
      ],
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
            placeholder: 'Enter name',
            required: true,
          }
        },
        {
          key: 'description',
          type: 'textarea',
          className: 'col-6 pb-3 pe-0',
          templateOptions: {
            label: 'Description',
            placeholder: 'Enter Description',
            required: true,
          }
        }
      ]
    }
      ]
    }

  }
}
