import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-timesheet-approvals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminCommmonModule,
    NzModalModule,
    NzTagModule,
    NzToolTipModule,
  ],
  templateUrl: './timesheet-approvals.component.html',
  styleUrls: ['./timesheet-approvals.component.scss'],
})
export class TimesheetApprovalsComponent implements OnInit {
  /** Rejection reason captured in the reject modal. */
  rejectionReason = '';

  /** Reject modal state. */
  showRejectModal = false;
  private rejectTimesheetId: string | null = null;

  // ta-table's `checkedRows` only holds row IDs (timesheet_approval_id strings),
  // so we keep a local copy of the approval rows to resolve each checked id
  // back to its timesheet_id + status for bulk actions.
  private approvalRows: any[] = [];

  curdConfig: TaCurdConfig = {
    drawerSize:      500,
    drawerPlacement: 'right',
    hideAddBtn:      true,          // managers never create approvals manually

    tableConfig: {
      apiUrl:      'hrms/timesheet_approvals_get/',
      title:       'Timesheet Approvals',
      pkId:        'timesheet_approval_id',
      showCheckbox: true,
      pageSize:    10,

      globalSearch: {
        keys: ['employee', 'timesheet_id', 'status_id', 'approver', 'approval_date'],
      },
      export:      { downloadName: 'TimesheetApprovals' },
      defaultSort: { key: 'created_at', value: 'descend' },

      cols: [
        // Employee who owns the timesheet
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
          fieldKey:    'timesheet_id',
          name:        'Start Date',
          sort:        false,
          displayType: 'map',
          mapFn: (_v: any, row: any) => row.timesheet?.start_date || '—',
        },

        // Period end
        {
          fieldKey:    'timesheet_id',
          name:        'End Date',
          sort:        false,
          displayType: 'map',
          mapFn: (_v: any, row: any) => row.timesheet?.end_date || '—',
        },

        // Total hours
        {
          fieldKey:    'total_hours',
          name:        'Total Hours',
          sort:        false,
          displayType: 'map',
          mapFn: (_v: any, row: any) =>
            row.total_hours != null
              ? `${parseFloat(row.total_hours).toFixed(2)} hrs`
              : '—',
        },

        // Approval status — colour-coded
        {
          fieldKey:    'status_id',
          name:        'Status',
          sort:        true,
          displayType: 'map',
          mapFn: (_v: any, row: any) => {
            const name   = row.status?.status_name || '—';
            const colors: Record<string, string> = {
              Open:     '#1890ff',
              Approved: '#52c41a',
              Rejected: '#ff4d4f',
              Draft:    '#8c8c8c',
            };
            const bg: Record<string, string> = {
              Open:     '#e6f7ff',
              Approved: '#f6ffed',
              Rejected: '#fff2f0',
              Draft:    '#f5f5f5',
            };
            const color = colors[name] || '#8c8c8c';
            const bgCol = bg[name]     || '#f5f5f5';
            return `<span style="
              display:inline-block;
              padding:2px 10px;
              border-radius:20px;
              font-size:11px;
              font-weight:700;
              letter-spacing:0.5px;
              text-transform:uppercase;
              color:${color};
              background:${bgCol};
              border:1px solid ${color}33">
              ${name}
            </span>`;
          },
        },

        // Approver name
        {
          fieldKey:    'approver',
          name:        'Approver',
          sort:        true,
          displayType: 'map',
          mapFn: (_v: any, row: any) => {
            const fn = row.approver?.first_name || '';
            const ln = row.approver?.last_name  || '';
            return `${fn} ${ln}`.trim() || '—';
          },
        },

        // Approval / rejection date
        {
          fieldKey: 'approval_date',
          name:     'Action Date',
          sort:     true,
          displayType: 'map',
          mapFn: (_v: any, row: any) => row.approval_date || '—',
        },

        // Rejection reason (truncated)
        {
          fieldKey:    'rejection_reason',
          name:        'Rejection Reason',
          sort:        false,
          displayType: 'map',
          mapFn: (_v: any, row: any) => {
            const r = row.rejection_reason || '';
            return r.length > 35 ? r.substring(0, 35) + '…' : r || '—';
          },
        },

        // Actions: Approve + Reject
        {
          fieldKey: 'code',
          name:     'Action',
          type:     'action',
          actions: [
            {
              type:       'callBackFn',
              icon:       'fa fa-check-circle text-success',
              confirm:    true,
              confirmMsg: 'Approve this timesheet?',
              // Only show on timesheets awaiting review (status = Open).
              conditionFn: (row: any) => row?.status?.status_name === 'Open',
              callBackFn: (row: any) => {
                this.approveTimesheet(row.timesheet_id);
              },
            },
            {
              type:       'callBackFn',
              icon:       'fa fa-times-circle text-danger',
              confirm:    false,
              // Only show on timesheets awaiting review (status = Open).
              conditionFn: (row: any) => row?.status?.status_name === 'Open',
              callBackFn: (row: any) => {
                this.openRejectModal(row.timesheet_id);
              },
            },
          ],
        },
      ],
    },

    // formConfig is empty — approvals are not created via a drawer
    formConfig: {
      url:    'hrms/timesheet_approvals_get/',
      title:  'Timesheet Approvals',
      pkId:   'timesheet_approval_id',
      fields: [],
    },
  };

  // ── Approval action ───────────────────────────────────────────────────────

  approveTimesheet(timesheetId: string): void {
    const today = this.todayString();

    this.http
      .post(`hrms/timesheets/${timesheetId}/approve/`, { approval_date: today })
      .subscribe({
        next: () => {
          this.notification.success('Timesheet approved successfully.', '');
          this.reloadAll();
        },
        error: (err) => {
          this.notification.error('Error',
            err?.error?.message || 'Failed to approve timesheet. Please try again.',
          );
        },
      });
  }

  // ── Rejection modal ───────────────────────────────────────────────────────

  openRejectModal(timesheetId: string): void {
    this.rejectionReason   = '';
    this.rejectTimesheetId = timesheetId;
    this.showRejectModal   = true;
  }

  cancelRejectModal(): void {
    this.showRejectModal   = false;
    this.rejectTimesheetId = null;
  }

  /** Called by the modal's "Confirm Rejection" button. */
  confirmReject(): void {
    const reason = this.rejectionReason?.trim();
    if (!reason) {
      this.notification.error('Error', 'Please provide a rejection reason.');
      return;
    }
    if (!this.rejectTimesheetId) return;
    this.rejectTimesheet(this.rejectTimesheetId, reason);
  }

  rejectTimesheet(timesheetId: string, reason: string): void {
    const today = this.todayString();

    this.http
      .post(`hrms/timesheets/${timesheetId}/reject/`, {
        rejection_reason: reason,
        approval_date:    today,
      })
      .subscribe({
        next: () => {
          this.notification.success('Timesheet rejected. The employee will be notified.', '');
          this.cancelRejectModal();
          this.reloadAll();
        },
        error: (err) => {
          this.notification.error('Error',
            err?.error?.message || 'Failed to reject timesheet. Please try again.',
          );
        },
      });
  }

  // ── Bulk approve ──────────────────────────────────────────────────────────

  bulkApprove(): void {
    // checkedRows holds approval IDs (timesheet_approval_id strings). Resolve
    // them back to full rows, then keep only those still awaiting review (Open).
    const checkedIds = this.curdConfig.tableConfig.checkedRows || [];
    if (checkedIds.length === 0) return;

    const selected = this.approvalRows.filter(
      r => checkedIds.includes(r.timesheet_approval_id),
    );
    const openRows = selected.filter(r => r?.status?.status_name === 'Open');

    if (openRows.length === 0) {
      this.notification.warning('None of the selected timesheets are awaiting approval (Open).', '');
      return;
    }

    this.modal.confirm({
      nzTitle:      `Approve ${openRows.length} Timesheet${openRows.length > 1 ? 's' : ''}`,
      nzContent:    `Are you sure you want to approve all ${openRows.length} selected timesheet(s)?`,
      nzOkText:     'Approve All',
      nzOkType:     'primary',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        const today   = this.todayString();
        let completed = 0;
        let failed    = 0;

        openRows.forEach((row: any) => {
          this.http
            .post(`hrms/timesheets/${row.timesheet_id}/approve/`, { approval_date: today })
            .subscribe({
              next: () => {
                completed++;
                if (completed + failed === openRows.length) {
                  this.notification.success(`${completed} timesheet(s) approved.`, '');
                  if (failed > 0) this.notification.warning(`${failed} timesheet(s) could not be approved.`, '');
                  this.reloadAll();
                }
              },
              error: () => {
                failed++;
                if (completed + failed === openRows.length) {
                  if (completed > 0) this.notification.success(`${completed} timesheet(s) approved.`, '');
                  this.notification.error('Error', `${failed} timesheet(s) could not be approved.`);
                  this.reloadAll();
                }
              },
            });
        });
      },
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadApprovalRows();
  }

  /** Keep a local copy of the approval rows (to resolve checked IDs for bulk). */
  loadApprovalRows(): void {
    this.http.get('hrms/timesheet_approvals_get/?limit=500').subscribe({
      next: (res: any) => { this.approvalRows = res?.data || []; },
      error: () => { /* table already surfaces load errors */ },
    });
  }

  /** Refresh both the table and our local copy after any change. */
  private reloadAll(): void {
    this.curdConfig.tableConfig.reload?.();
    this.loadApprovalRows();
  }

  private todayString(): string {
    const d   = new Date();
    const y   = d.getFullYear();
    const m   = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  get checkedCount(): number {
    return this.curdConfig.tableConfig.checkedRows?.length ?? 0;
  }

  constructor(
    private http:         HttpClient,
    private notification: NzNotificationService,
    private modal:        NzModalService,
  ) {}
}
