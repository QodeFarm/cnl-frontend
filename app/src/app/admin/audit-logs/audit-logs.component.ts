import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent implements OnInit {

  loading = false;
  error = false;
  tableConfig?: TaTableConfig;

  ngOnInit(): void {
    this.setTableConfig();
  }

  setTableConfig() {
    this.tableConfig = {
      apiUrl: 'audit/logs/',
      pkId: 'audit_id',
      pageSize: 10,
      globalSearch: {
        keys: ['action_type', 'module_name', 'description', 'user_id']
      },
      export: { downloadName: 'AuditLogs' },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'action_type',
          name: 'Action',
          sort: true
        },
        {
          fieldKey: 'module_name',
          name: 'Module',
          sort: true
        },
        // {
        //   fieldKey: 'user_id',
        //   name: 'User',
        //   sort: true
        // },
        {
          fieldKey: 'user_id',
          name: 'User',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.user?.username || ''}`;
          },
          sort: true
        },
        {
          fieldKey: 'description',
          name: 'Details',
          sort: true
        },
        {
          fieldKey: 'created_at',
          name: 'Timestamp',
          sort: true,
          displayType: 'date',
          format: 'dd/MM/yyyy HH:mm'
        }
      ]
    };
  }

  onDataLoaded(data: any) {
    console.log("Audit Log Data Loaded:", data);
  }

}