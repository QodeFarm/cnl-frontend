import { CommonModule } from '@angular/common';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})

export class BranchListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'company/branches/',
    // title: 'Edit Sales Order List',
    showCheckbox:true,
    pkId: "branch_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['name','code','phone','email','address','city_id','state_id','status_id']
    },
    export: {downloadName: 'BranchList'},
    // defaultSort: { key: 'created_at', value: 'descend' },
    defaultSort: { key: 'is_deleted', value: 'ascend' },
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
        name: 'City',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.city.city_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'state_id',
        name: 'State',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.state.state_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'status_id',
        name: 'Status',
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
            apiUrl: 'company/branches'
          },
          {
            type: 'restore',
            label: 'Restore',
            apiUrl: 'company/branches',
            confirm: true,
            confirmMsg: "Sure to restore?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            tooltip: "Edit this record",
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
