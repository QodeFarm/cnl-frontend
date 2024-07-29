import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-gst-categories',
  templateUrl: './gst-categories.component.html',
  styleUrls: ['./gst-categories.component.scss']
})
export class GstCategoriesComponent {
    curdConfig: TaCurdConfig = {
      drawerSize: 500,
      drawerPlacement: 'top',
      tableConfig: {
        apiUrl: 'masters/gst_categories/',
        title: 'Gst Categories',
        pkId: "gst_category_id",
        pageSize: 10,
        "globalSearch": {
          keys: ['gst_category_id', 'name']
        },
        cols: [
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
                apiUrl: 'masters/gst_categories'
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
        url: 'masters/gst_categories/',
        title: 'Gst Categories',
        pkId: "gst_category_id",
        exParams: [
        ],
        fields: [
          {
            fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
            fieldGroup: [
      {
            key: 'name',
            type: 'textarea',
            className: 'col-12 p-0',
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
