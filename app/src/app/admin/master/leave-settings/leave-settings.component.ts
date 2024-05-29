import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-leave-settings',
  templateUrl: './leave-settings.component.html',
  styleUrls: ['./leave-settings.component.scss']
})
export class LeaveSettingsComponent {
  statusConfig: TaCurdConfig = {
    tableConfig: {
      pkId: "status_id",
      apiUrl: "leaves/status",
      title: "Status",
      globalSearch: {
        keys: ['status']
      },
      cols: [
        {
          fieldKey: "status_id",
          name: "#",
          filter: false,
          sort: false
        },
        {
          fieldKey: "status_name",
          name: "Name",
          filter: true,
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          sort: false,
          type: 'action',
          filter: false,
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'leaves/status'
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
      url: "leaves/status/",
      pkId: "status_id",
      title: "Status",
      fields: [
        {
          key: 'status_name',
          type: 'input',
          templateOptions: {
            label: 'Status Name',
            placeholder: 'Enter Status Name',
            required: true,
          }
        }
      ],
      submit: {}
    },
    drawerSize: 500,
    drawerPlacement: 'right',
  }
  typeConfig: TaCurdConfig = {
    tableConfig: {
      pkId: "leave_type_id",
      apiUrl: "leaves/leavetypes",
      title: "Leave Type",
      globalSearch: {
        keys: ['status']
      },
      cols: [
        {
          fieldKey: "leave_type_id",
          name: "#",
          filter: false,
          sort: false
        },
        {
          fieldKey: "leave_type_name",
          name: "Name",
          filter: true,
          sort: true
        },
        {
          fieldKey: "description",
          name: "Description",
          filter: true,
          sort: true
        },
        {
          fieldKey: "max_days_allowed",
          name: "Max Days",
          filter: true,
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          sort: false,
          type: 'action',
          filter: false,
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'leaves/leavetypes'
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
      url: "leaves/leavetypes/",
      pkId: "leave_type_id",
      title: "Leave Type",
      fields: [
        {
          key: 'leave_type_name',
          type: 'input',
          templateOptions: {
            label: 'Leave Type Name',
            placeholder: 'Enter Leave Type Name',
            required: true,
          }
        },
        {
          key: 'max_days_allowed',
          type: 'input',
          templateOptions: {
            label: 'Max Days Allowed',
            placeholder: 'Enter Max Days Allowed',
            type: 'number',
            required: true,
          }
        },
        {
          key: 'description',
          type: 'textarea',
          templateOptions: {
            label: 'Description',
            placeholder: 'Enter Description',
            required: true,
          }
        }
      ],
      submit: {}
    },
    drawerSize: 500,
    drawerPlacement: 'right',
  }
}
