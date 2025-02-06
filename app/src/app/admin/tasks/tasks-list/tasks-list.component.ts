import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'tasks/task/',
    showCheckbox:true,
    pkId: "task_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['due_date','title','user_id','group_id','description','priority_id','status_id']
    },
    defaultSort: { key: 'created_at', value: 'descend' },
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
          return `${row.user?.first_name || ''}`;
        },
        sort: true
      },
      {
        fieldKey: 'group_id',
        name: 'group',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.group?.group_name || ''}`;
        },
        sort: true
      },
      {
        fieldKey: 'description',
        name: 'Description',
        sort: true
      },
      {
        fieldKey: 'priority_id',
        name: 'priority',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.priority?.priority_name || ''}`;
        },
        sort: true
      },
      {
        fieldKey: 'due_date',
        name: 'Due Date',
        sort: true,
        displayType: "date"
      },
      {
        fieldKey: 'status_id',
        name: 'Statuses',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.status?.status_name}`;
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
            apiUrl: 'tasks/task',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.task_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}
}
