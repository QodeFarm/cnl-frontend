import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-account-ledger',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './account-ledger.component.html',
  styleUrls: ['./account-ledger.component.scss']
})
export class AccountLedgerComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    hideAddBtn: true,
    tableConfig: {
      // apiUrl: 'hrms/employee_attendance/',
      // title: 'Account ledger',
      pkId: "employee_attendance_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['employee', 'attendance_date', 'absent', 'leave_duration']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'date',
          name: 'Date',
          sort: true
        },
        {
          fieldKey: 'description', 
          name: 'Description',
          sort: true
        },
        {
          fieldKey: 'debit',
          name: 'Debit',
          sort: true
        },
        {
          fieldKey: 'cebit',
          name: 'Cebit',
          sort: true
        },
        {
          fieldKey: 'running_balance',
          name: 'Running Balance',
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
              apiUrl: 'hrms/employee_attendance'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: undefined
  };

}
