import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-workflow-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.scss']
})
export class WorkflowListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'sales/work_flow/', // The endpoint for fetching workflows
    showCheckbox: true,
    pkId: "workflow_id", // Primary key identifier
    pageSize: 10,
    globalSearch: {
      keys: ['workflow_id', 'name']
    },
    cols: [
      {
        fieldKey: 'name',
        name: 'Workflow Name',
        sort: true
      },
      {
        fieldKey: 'workflow_stages',
        name: 'Number of Stages',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.workflow_stages.stage_name}`;
        },
        sort: true
      },
      {
        fieldKey: "actions",
        name: "Actions",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            apiUrl: 'workflow' // The endpoint for deleting a workflow
          },
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
