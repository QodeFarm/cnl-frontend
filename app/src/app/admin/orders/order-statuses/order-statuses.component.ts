import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-order-statuses',
  templateUrl: './order-statuses.component.html',
  styleUrls: ['./order-statuses.component.scss']
})
export class OrderStatusesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/order_status/',
      title: 'Order Statuses',
      
      pkId: "order_status_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['order_status_id', 'name']
      },
      cols: [
        {
          fieldKey: 'status_name',
          name: 'Status name'
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
              apiUrl: 'masters/order_status'
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
      url: 'masters/order_status/',
      title: 'Order statuses',
      pkId: "order_status_id",
      exParams: [
      ],
      fields: 
    [ 
      {
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: 
      [
       {
          key: 'status_name',
          type: 'input',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Status name',
            placeholder: 'Enter status name',
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