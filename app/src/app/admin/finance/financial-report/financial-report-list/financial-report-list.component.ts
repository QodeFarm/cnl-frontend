import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-financial-report-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './financial-report-list.component.html',
  styleUrls: ['./financial-report-list.component.scss']
})
export class FinancialReportListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/financial_reports/',
    showCheckbox:true,
    pkId: "report_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['generated_at','report_name','report_type']
    },
    export: {downloadName: 'FinancialReportList'},
    defaultSort: { key: 'created_at', value: 'descend' }, 
    cols: [
      {
        fieldKey: 'report_name',
        name: 'Account Code',
        sort: true
      },
      {
        fieldKey: 'report_type',
        name: 'Report Type',
        sort: true
      }, 
      {
        fieldKey: 'generated_at', 
        name: 'Generated At',
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
            apiUrl: 'finance/financial_reports',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.report_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}