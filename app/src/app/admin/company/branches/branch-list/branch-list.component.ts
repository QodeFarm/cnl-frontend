import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})

export class BranchListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'company/branches/',
    // title: 'Edit Sales Order List',
    showCheckbox:true,
    pkId: "branch_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['branch_id']
    },
    cols: [
      {
        fieldKey: 'name',
        name: 'Name',
        sort: true
      },
      {
        fieldKey: 'code',
        name: 'Code',
        sort: true
      },
      {
        fieldKey: 'phone',
        name: 'Phone',
        sort: true
      },
      {
        fieldKey: 'email',
        name: 'Email',
        sort: true
      },
      {
        fieldKey: 'address',
        name: 'Address',
        sort: true
      },
      {
        fieldKey: 'city_id',
        name: 'Department',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.city.city_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'state_id',
        name: 'Designation',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.state.state_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'status_id',
        name: 'Designation',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.status.state_name}`;
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
            apiUrl: 'company/branches'
          },
          {
            type: 'callBackFn',
            label: 'Edit',
            callBackFn: (row, action) => {
              this.edit.emit(row.branch_id);
              // this.router.navigateByUrl('company/branches' + row.branch_id);
            }
          }
        ]
      }
    ]
  };
}
