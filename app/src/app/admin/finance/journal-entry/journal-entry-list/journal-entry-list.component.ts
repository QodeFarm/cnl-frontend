import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-journal-entry-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './journal-entry-list.component.html',
  styleUrls: ['./journal-entry-list.component.scss']
})
export class JournalEntryListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/journal_entries/',
    // title: 'Edit Tasks List',
    showCheckbox:true,
    pkId: "journal_entry_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['journal_entry_id']
    },
    cols: [
      {
        fieldKey: 'entry_date',
        name: 'Entry Date',
        sort: true
      },
      {
        fieldKey: 'reference',
        name: 'Reference',
        sort: true
      },
      {
        fieldKey: 'description', 
        name: 'Description',
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
            // confirm: true,
            // confirmMsg: "Sure to delete?",
            apiUrl: 'finance/journal_entries'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.journal_entry_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}