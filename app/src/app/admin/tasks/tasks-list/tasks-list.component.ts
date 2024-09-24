import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'tasks/task/',
    // title: 'Edit Tasks List',
    showCheckbox:true,
    pkId: "task_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['title','user_id','description','priority_id','due_date','status_id']
    },
    cols: [
      {
        fieldKey: 'title',
        name: 'Title',
        sort: true
      },
      {
        fieldKey: 'user_id',
        name: 'User',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.user.first_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'description',
        name: 'Description',
        sort: false
      },
      {
        fieldKey: 'priority_id',
        name: 'priority',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.priority.priority_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'due_date',
        name: 'Due Date',
        sort: false,
        displayType: "date"
      },
      {
        fieldKey: 'status_id',
        name: 'Statuses',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.status.status_name}`;
        },
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
            // confirm: true,
            // confirmMsg: "Sure to delete?",
            apiUrl: 'tasks/task'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.task_id);
              // this.router.navigateByUrl('tasks/task/' + row.task_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}
}
