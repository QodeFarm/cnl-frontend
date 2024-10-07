import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reminders-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.scss']
})
export class RemindersListComponent {
  @Output('edit') edit = new EventEmitter<void>();
  @Output('circle') circle = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'reminders/reminders/',
    showCheckbox:true,
    pkId: "reminder_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['reminder_type_id','subject','description','reminder_date','recurring_frequency']
    },
    cols: [
      {
        fieldKey: 'reminder_type_id',
        name: 'Reminders',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.reminder_type.type_name}`;
        },
      },
      {
        fieldKey: 'subject',
        name: 'Subject',
        sort: true
      },
      {
        fieldKey: 'description', 
        name: 'Description',
        sort: true
      }, 
      {
        fieldKey: 'reminder_date',
        name: 'Reminder Date',
        sort: true,
        displayType: "datetime-local"
      },
      {
        fieldKey: 'recurring_frequency', 
        name: 'Recurring Frequency',
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
            apiUrl: 'reminders/reminders',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.reminder_id);
            }
          },
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}

