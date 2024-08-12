import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-shipping-modes',
  templateUrl: './shipping-modes.component.html',
  styleUrls: ['./shipping-modes.component.scss']
})
export class ShippingModesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/shipping_modes/',
      title: 'Shipping mode',
      // showCheckbox: true,
      pkId: "shipping_mode_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['shipping_mode_id', 'name']
      },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        // {
        //   fieldKey: 'code', 
        //   name: 'Code',
        //   sort: true
        // },
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
              apiUrl: 'masters/shipping_modes'
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
      url: 'masters/shipping_modes/',
      title: 'Shipping mode',
      pkId: "shipping_mode_id",
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
            // {
            //   key: 'code',
            //   type: 'input',
            //   className: 'col-6',
            //   templateOptions: {
            //     label: 'Code',
            //     placeholder: 'Enter Code',
            //     required: true,
            //   }
            // },
          ]
        }
      ]
    }

  }
}
