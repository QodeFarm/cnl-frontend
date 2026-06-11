import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component';
import { DoubleClickNavigationService } from 'src/app/services/double-click-navigation.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-timesheets-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './timesheets-list.component.html',
  styleUrls: ['./timesheets-list.component.scss'],
})
export class TimesheetsListComponent {
  @Output('edit') edit = new EventEmitter<string>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  /** Called by the parent to refresh the table after a save / submit. */
  refreshTable(): void {
    this.taTableComponent?.refresh();
  }

  tableConfig: TaTableConfig = {
    apiUrl:      'hrms/timesheets/',
    showCheckbox: true,
    pkId:        'timesheet_id',

    rowEvents: {
      dblclick: this.dblClickNav.createHandler({
        pkField:     'timesheet_id',
        moduleName:  'HRMS',
        sectionName: 'Timesheet',
        editEmitter: this.edit,
      }),
    },

    pageSize:    10,
    globalSearch: { keys: ['employee', 'start_date', 'end_date', 'total_hours', 'notes'] },
    export:       { downloadName: 'TimesheetsList' },
    defaultSort:  { key: 'created_at', value: 'descend' },

    cols: [
      // Employee name (nested object)
      {
        fieldKey:    'employee',
        name:        'Employee',
        sort:        true,
        displayType: 'map',
        mapFn: (_v: any, row: any) => {
          const fn = row.employee?.first_name || '';
          const ln = row.employee?.last_name  || '';
          return `${fn} ${ln}`.trim() || '—';
        },
      },

      // Period start
      {
        fieldKey: 'start_date',
        name:     'Start Date',
        sort:     true,
      },

      // Period end
      {
        fieldKey: 'end_date',
        name:     'End Date',
        sort:     true,
      },

      // Total hours — right-aligned with "hrs" suffix
      {
        fieldKey:    'total_hours',
        name:        'Total Hours',
        sort:        true,
        displayType: 'map',
        mapFn: (_v: any, row: any) =>
          row.total_hours != null ? `${parseFloat(row.total_hours).toFixed(2)} hrs` : '—',
      },

      // Notes (truncated)
      {
        fieldKey:    'notes',
        name:        'Notes',
        sort:        false,
        displayType: 'map',
        mapFn: (_v: any, row: any) => {
          const notes = row.notes || '';
          return notes.length > 40 ? notes.substring(0, 40) + '…' : notes || '—';
        },
      },

      // Created date
      {
        fieldKey:    'created_at',
        name:        'Created',
        sort:        true,
        displayType: 'map',
        mapFn: (_v: any, row: any) =>
          row.created_at ? row.created_at.split('T')[0] : '—',
      },

      // Actions: delete | restore | edit
      {
        fieldKey: 'code',
        name:     'Action',
        type:     'action',
        actions: [
          {
            type:       'delete',
            label:      'Delete',
            apiUrl:     'hrms/timesheets',
            confirm:    true,
            confirmMsg: 'Sure to delete this timesheet?',
          },
          {
            type:       'restore',
            label:      'Restore',
            apiUrl:     'hrms/timesheets',
            confirm:    true,
            confirmMsg: 'Sure to restore this timesheet?',
          },
          {
            type:       'callBackFn',
            icon:       'fa fa-paper-plane text-primary',
            label:      '',
            tooltip:    'Submit this timesheet for approval',
            confirm:    true,
            confirmMsg: 'Submit this timesheet for approval?',
            callBackFn: (row: any) => {
              this.submitForApproval(row.timesheet_id);
            },
          },
          {
            type:       'callBackFn',
            icon:       'fa fa-pen',
            label:      '',
            tooltip:    'Edit this timesheet',
            callBackFn: (row: any) => {
              this.edit.emit(row.timesheet_id);
            },
          },
        ],
      },
    ],
  };

  constructor(
    private dblClickNav: DoubleClickNavigationService,
    private http: HttpClient,
    private notification: NzNotificationService,
  ) {}

  /** Submits a timesheet for manager approval. */
  submitForApproval(timesheetId: string): void {
    this.http.post(`hrms/timesheets/${timesheetId}/submit/`, {}).subscribe({
      next: () => {
        this.notification.success('Timesheet submitted for approval successfully.', '');
        this.refreshTable();
      },
      error: (err) => {
        this.notification.error('Error', err?.error?.message || 'Failed to submit timesheet for approval.');
      },
    });
  }

  /** Used by *ngFor trackBy to avoid full DOM re-renders. */
  trackByIndex(index: number): number {
    return index;
  }
}
