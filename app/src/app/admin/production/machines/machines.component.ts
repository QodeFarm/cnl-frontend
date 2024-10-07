import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-machines',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class MachinesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'production/machines/',
      title: 'Machines',
      pkId: "machine_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['machine_id', 'machine_name']
      },
      cols: [
        {
          fieldKey: 'machine_name',
          name: 'Machine Name'
        },
        {
          fieldKey: 'description',
          name: 'Description'
        },
        {
          fieldKey: 'status',
          name: 'status'
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [{
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'production/machines'
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
      url: 'production/machines/',
      title: 'Machine',
      pkId: "machine_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [                  
            {
              key: 'machine_name',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Machine Name',
                placeholder: 'Enter Machine Name',
                required: true,
              }
            },
            {
              key: 'status',
              type: 'select',
              className: 'col-6 pb-3 pe-0',
              templateOptions: {
                label: 'Status',
                placeholder: 'Enter Status',
                required: false,
                options : [
                  { value: 'Operational', label: 'Operational' },
                  { value: 'Under Maintenance', label: 'Under Maintenance' },
                  { value: 'Out of Service', label: 'Out of Service' }
                ]
              }
            },
            {
              key: 'description',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter Description',
                required: false,
              }
            }
          ]
        }
      ]
    }
  }
}
