import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@Component({
  selector: 'app-leads-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.scss']
})

export class LeadsListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'leads/leads/',
    // title: 'Edit Sales Order List',
    // showCheckbox:true,
    pkId: "lead_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['lead_id']
    },
    cols: [
      {
        fieldKey: 'name',
        name: 'name',
        sort: true
      },
      {
        fieldKey: 'email',
        name: 'email',
        sort: true
      },
      {
        fieldKey: 'phone',
        name: 'Tax',
        sort: true
      },
      {
        fieldKey: 'score',
        name: 'Score',
        sort: true
      },
      {
        fieldKey: 'lead_status_id',
        name: 'lead_status_id',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.lead_status_id.lead_status_id}`;
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
            confirm: true,
            confirmMsg: "Sure to delete?",
            apiUrl: 'sales/sale_order'
          },
          {
            type: 'callBackFn',
            label: 'Edit',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.sale_order_id);
              // this.router.navigateByUrl('/admin/sales/edit/' + row.sale_order_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}
}