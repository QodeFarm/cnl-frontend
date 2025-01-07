import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-swipes-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './swipes-list.component.html',
  styleUrls: ['./swipes-list.component.scss']
})
export class SwipesListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'hrms/swipes/',
    showCheckbox:true,
    pkId: "swipe_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['swipe_time','employee_id']
    },
    cols: [
      {
        fieldKey: 'swipe_time',
        name: 'Swipe Time',
        sort: true
      },
      {
        fieldKey: 'employee_id',
        name: 'Employee',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          // Concatenate first_name and last_name correctly
          const firstName = row.employee?.first_name || '';
          const lastName = row.employee?.last_name || '';
          return `${firstName} ${lastName}`.trim();
        },
      }, 
      {
        fieldKey: "code",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            apiUrl: 'hrms/swipes',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.swipe_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}