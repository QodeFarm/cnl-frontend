import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-transporters',
  templateUrl: './transporters.component.html',
  styleUrls: ['./transporters.component.scss']
})
export class TransportersComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/transporters/',
      title: 'Transporters',
      
      pkId: "transporter_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['transporter_id', 'name', 'code','gst_no','website_url']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          // sort: true
        },
        {
          fieldKey: 'code', 
          name: 'Code',
          // sort: true
        },
        {
          fieldKey: 'gst_no', 
          name: 'GST',
          sort: true
        },
        {
          fieldKey: 'website_url', 
          name: 'Web URL',
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
              apiUrl: 'masters/transporters'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/transporters'
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
      url: 'masters/transporters/',
      title: 'Transporter',
      pkId: "transporter_id",
      exParams: [
      ],
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup:[
            {
              key: 'name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code',
                required: true,
              }
            },
            {
              key: 'gst_no',
              type: 'input',
              className: 'col-md-6 col-12 pb-md-0 pb-3 px-1',
              templateOptions: {
                label: 'GST',
                placeholder: 'Enter GST',
              }
            },
            {
              key: 'website_url',
              type: 'input',
              className: 'col-md-6 col-12  px-1',
              templateOptions: {
                label: 'Website url',
                placeholder: 'Enter website url',
              }
            },
          ]
        }
      ]
    }

  }
}
