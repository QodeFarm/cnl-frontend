import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-purchase-types',
  templateUrl: './purchase-types.component.html',
  styleUrls: ['./purchase-types.component.scss']
})
export class PurchaseTypesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/purchase_types/',
      title: 'Purchase types',
      
      pkId: "purchase_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['purchase_type_id', 'name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
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
              apiUrl: 'masters/purchase_types'
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
      url: 'masters/purchase_types/',
      title: 'Purchase types',
      pkId: "purchase_type_id",
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
          className: 'col-md-6 col-12 p-0',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          }
        },
      ]
    }
      ]
    }

  }
}
