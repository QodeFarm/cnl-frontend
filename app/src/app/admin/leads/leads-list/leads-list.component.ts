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
    showCheckbox:true,
    pkId: "lead_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['lead_id']
    },
    cols: [
      {
        fieldKey: 'name',
        name: 'Name',
        sort: true
      },
      {
        fieldKey: 'email',
        name: 'Email',
        sort: true
      },
      {
        fieldKey: 'phone',
        name: 'Phone',
        sort: true
      },
      {
        fieldKey: 'lead_status',
        name: 'Lead Status',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.lead_status.status_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'score',
        name: 'Score',
        sort: true
      },
      {
        fieldKey: 'assignee',
        name: 'Assigned',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.assignee.name}`;
        },
        sort: true
      },
      {
        fieldKey: 'interaction',
        name: 'Interaction Date',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          const interactionDate = row.interaction[0].interaction_date;
          const [date, time] = interactionDate.split('T');
          return `${date}<br>${time}`;
        },
        sort: true
      },
      {
        fieldKey: 'interaction',
        name: 'Notes',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          console.log("row",row)
          return `${row.interaction[0].notes}`;
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
            apiUrl: 'leads/leads'
          },
          {
            type: 'callBackFn',
            label: 'Edit',
            callBackFn: (row, action) => {
              this.edit.emit(row.lead_id);
              // this.router.navigateByUrl('leads/leads/' + row.lead_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}
}