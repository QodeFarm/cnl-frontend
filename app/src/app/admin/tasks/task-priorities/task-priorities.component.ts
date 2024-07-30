import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-task-priorities',
  templateUrl: './task-priorities.component.html',
  styleUrls: ['./task-priorities.component.scss']
})
export class TaskPrioritiesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'masters/task_priorities/',
      title: 'Task Priorities',
      pkId: "priority_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['priority_id', 'priority_name']
      },
      cols: [
        {
          fieldKey: 'priority_name',
          name: 'Priority Name',
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
              apiUrl: 'masters/task_priorities'
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
      url: 'masters/task_priorities/',
      title: 'Task Priorities',
      pkId: "priority_id",
      fields: [
        {
          key: 'priority_name',
          type: 'input',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Priority Name',
            placeholder: 'Enter Name',
            required: true,
          }
        },
      ]
    }
  }
}