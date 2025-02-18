import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaTableConfig } from '@ta/ta-table';

@Component({
  selector: 'app-unit-options',
  templateUrl: './unit-options.component.html',
  styleUrls: ['./unit-options.component.scss']
})
export class UnitOptionsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/unit_options/',
      title: 'Unit Options',
      
      pkId: "unit_options_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['unit_options_id', 'unit_name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'unit_name',
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
              apiUrl: 'masters/unit_options'
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
      url: 'masters/unit_options/',
      title: 'Unit Options',
      pkId: "unit_options_id",
      exParams: [
      ],
      fields: 
    [ 
      {
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: 
      [
       {
          key: 'unit_name',
          type: 'text',
          className: 'col-md-6 col-12 p-0',
          templateOptions: {
            label: 'Unit Name',
            placeholder: 'Enter Unit Name',
            required: true,
          }
        },
      ]
    }
      ]
    }

  }


  tableConfig: TaTableConfig = {
    apiUrl: 'masters/unit_options/',
    title: 'Unit Options',
    pkId: "unit_options_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['unit_options_id', 'unit_name']
    },
    cols: [
      {
        fieldKey: 'unit_name',
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
            apiUrl: 'api/masters'
          },
          {
            type: 'callBackFn',
            label: 'Edit',
            // callBackFn: (row, action) => {
            //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            // }
          }
        ]
      }
    ]
  };
}

