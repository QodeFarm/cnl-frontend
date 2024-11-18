import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave-approvals-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './leave-approvals-list.component.html',
  styleUrls: ['./leave-approvals-list.component.scss']
})
export class LeaveApprovalsListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'hrms/leave_approvals/',
    showCheckbox:true,
    pkId: "approval_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['approval_date','comments','status_id','leave_id','approver_id']
    },
    cols: [
      {
        fieldKey: 'approval_date',
        name: 'Approval Date',
        sort: true
      },
      {
        fieldKey: 'comments', 
        name: 'Comments',
        sort: true
      }, 
      {
        fieldKey: 'status_id',
        name: 'Status',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.status.status_name}`;
        },
      },
      {
        fieldKey: 'leave_id',
        name: 'Leave',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.leave.start_date}`;
        },
      },
      {
        fieldKey: 'approver_id',
        name: 'Approver',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.approver.first_name}`;
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
            apiUrl: 'hrms/leave_approvals',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.approval_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}


  
