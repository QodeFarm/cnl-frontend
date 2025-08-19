import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-workflow-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.scss']
})
export class WorkflowListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
   };

  tableConfig: TaTableConfig = {
    apiUrl: 'sales/work_flow', // The endpoint for fetching workflows
    showCheckbox: true,
    pkId: "workflow_id", // Primary key identifier
    pageSize: 10,
    globalSearch: {
      keys: ['workflow_id', 'name']
    },
    export: {downloadName: 'Workflow'},
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'name',
        name: 'Workflow Name',
        sort: true
      },
      // {
      //   fieldKey: 'workflow_stages',
      //   name: 'Number of Stages',
      //   displayType: "map",
      //   mapFn: (currentValue: any, row: any, col: any) => {
      //     return `${row.workflow_stages.stage_name}`;
      //   },
      //   sort: true
      // },
      {
        fieldKey: "actions",
        name: "Actions",
        type: 'action',
        actions: [
          // {
          //   type: 'delete',
          //   label: 'Delete',
          //   confirm: true,
          //   confirmMsg: "Sure to delete?",
          //   apiUrl: 'sales/work_flow' // The endpoint for deleting a workflow
          // },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              this.edit.emit(row.workflow_id); // Emit the workflow ID for editing
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}
}