import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-employee-leaves-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './employee-leaves-list.component.html',
  styleUrls: ['./employee-leaves-list.component.scss']
})
export class EmployeeLeavesListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'hrms/employee_leaves/',
    showCheckbox:true,
    pkId: "leave_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['employee','start_date','end_date','comments','leave_type']
    },
    cols: [
      {
        fieldKey: 'employee',
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
        fieldKey: 'leave_type',
        name: 'Leave Type',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.leave_type.leave_type_name}`;
        },
      },
      {
        fieldKey: 'start_date',
        name: 'Start Date',
        sort: true
      },
      {
        fieldKey: 'end_date',
        name: 'End Date',
        sort: true
      },
      {
        fieldKey: 'comments', 
        name: 'Comments',
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
            apiUrl: 'hrms/employee_leaves',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.leave_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}


  
