import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-production-floors',
  templateUrl: './production-floors.component.html',
  styleUrls: ['./production-floors.component.scss']
})
export class ProductionFloorsComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/production_floors/',
      title: 'Production Floors',
      pkId: "production_floor_id",
      pageSize: 10,
      globalSearch: {
        keys: ['production_floor_id', 'code', 'name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'code',
          name: 'Code',
          sort: true
        },
        {
          fieldKey: 'name',
          name: 'Floor Name',
          sort: true
        },
        {
          fieldKey: 'description',
          name: 'Description',
          sort: false
        },
        // {
        //   fieldKey: 'created_at',
        //   name: 'Created At',
        //   type: 'date',
        //   sort: true
        // },
        {
          fieldKey: 'production_floor_id',
          name: 'Action',
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete this Production Floor?",
              apiUrl: 'masters/production_floors'
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
      url: 'masters/production_floors/',
      title: 'Production Floor',
      pkId: "production_floor_id",
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Floor Code',
                required: true,
              }
            },
            {
              key: 'name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Floor Name',
                required: true,
              }
            },
            {
              key: 'description',
              type: 'textarea',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter Description (optional)'
              }
            },
            // {
            //   key: 'is_deleted',
            //   type: 'checkbox',
            //   className: 'col-md-6 col-12 pb-3 px-1',
            //   templateOptions: {
            //     label: 'Is Deleted'
            //   }
            // }
          ]
        }
      ]
    }
  };
}
