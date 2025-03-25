import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'


@Component({
  selector: 'app-leads-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.scss']
})

export class LeadsListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  }

  tableConfig: TaTableConfig = {
    apiUrl: 'leads/leads/',
    // title: 'Edit Sales Order List',
    showCheckbox:true,
    pkId: "lead_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['interaction_date','name','email','phone','lead_status','score','assignee','notes']
    },
    export: {downloadName: 'PaymentRecepitList'},
    defaultSort: { key: 'created_at', value: 'descend' },
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
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          // Concatenate first_name and last_name correctly
          const firstName = row.assignee?.first_name || '';
          const lastName = row.assignee?.last_name || '';
          return `${firstName} ${lastName}`.trim();
        },
      },
      // {
      //   fieldKey: 'interaction_date',
      //   name: 'Interaction Date',
      //   displayType: "map",
      //   mapFn: (currentValue: any, row: any, col: any) => {
      //     const interactionDate = row.interaction[0].interaction_date;
      //     const [date, time] = interactionDate.split('T');
      //     return `${date}<br>${time}`;
      //   },
      //   sort: false
      // },
      {
        fieldKey: 'interaction_date',
        name: 'Interaction Date',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          if (row.interaction && row.interaction.length > 0 && row.interaction[0].interaction_date) {
            const interactionDate = row.interaction[0].interaction_date;
            const [date, time] = interactionDate.split('T');
            return `${date}<br>${time}`;
          } else {
            return ''; // or return a default value like 'N/A'
          }
        },
        sort: false
      },      
      
      // {
      //   fieldKey: 'notes',
      //   name: 'Notes',
      //   displayType: "map",
      //   mapFn: (currentValue: any, row: any, col: any) => {
      //     console.log("row",row)
      //     return `${row.interaction[0].notes}`;
      //   },
      //   sort: false
      // },
      {
        fieldKey: 'notes',
        name: 'Notes',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          if (row.interaction && row.interaction.length > 0 && row.interaction[0].notes) {
            return `${row.interaction[0].notes}`;
          } else {
            return ''; // or a default like 'No Notes'
          }
        },
        sort: false
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
            apiUrl: 'leads/leads'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
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