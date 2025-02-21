import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-journal-entry-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './journal-entry-list.component.html',
  styleUrls: ['./journal-entry-list.component.scss']
})
export class JournalEntryListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
 };

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/journal_entries/',
    showCheckbox:true,
    pkId: "journal_entry_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['entry_date','reference','description']
    },
    defaultSort: { key: 'created_at', value: 'descend' },
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
            apiUrl: 'finance/journal_entries',
            confirm: true,
            confirmMsg: "Sure to delete?",
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