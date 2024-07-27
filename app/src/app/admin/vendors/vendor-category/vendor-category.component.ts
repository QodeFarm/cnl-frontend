import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaTableConfig } from '@ta/ta-table';

@Component({
  selector: 'app-vendor-category',
  templateUrl: './vendor-category.component.html',
  styleUrls: ['./vendor-category.component.scss']
})
export class VendorCategoryComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'vendors/vendor_category/',
      title: 'Vendor Category List',
      pkId: "vendor_category_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['vendor_category_id', 'name']
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
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'vendors/vendor_category'
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
      url: 'vendors/vendor_category/',
      title: 'Vendor Category List',
      pkId: "vendor_category_id",
      exParams: [
      ],
      fields: [
        {
          key: 'code',
          type: 'textarea',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter Code',
            required: true,
          }
        },
		    {
          key: 'name',
          type: 'textarea',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter Name',
            required: true,
          }
        },
      ]
    }

  }

}