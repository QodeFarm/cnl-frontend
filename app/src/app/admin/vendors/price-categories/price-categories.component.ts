import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-price-categories',
  templateUrl: './price-categories.component.html',
  styleUrls: ['./price-categories.component.scss']
})
export class PriceCategoriesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/price_categories/',
      title: 'Price Categories',
      pkId: "price_category_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['price_category_id', 'name']
      },
      cols: [
		    {
          fieldKey: 'name',
          name: 'Name'
        },
		    {
          fieldKey: 'code',
          name: 'Code'
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
              apiUrl: 'masters/price_categories'
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
      url: 'masters/price_categories/',
      title: 'Price Categories',
      pkId: "price_category_id",
      exParams: [
      ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
		    {
          key: 'name',
          type: 'textarea',
          className: 'col-6 ps-0',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          }
        },
		    {
          key: 'code',
          type: 'textarea',
          className: 'col-6 pe-0',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter code',
            required: true,
          }
        }
      ]
    }
      ]
    }

  }
}
