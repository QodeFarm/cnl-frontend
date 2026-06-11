import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TimesheetsListComponent } from './timesheets-list/timesheets-list.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { HelpIconComponent } from '../../help/help-icon.component';

@Component({
  selector: 'app-timesheets',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, TimesheetsListComponent, NzTagModule, HelpIconComponent],
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
})
export class TimesheetsComponent implements OnInit {

  showTimesheetsList = false;
  showForm = false;
  loadingEdit = false;

  TimesheetEditID: any;
  timesheetStatus = 'Draft';

  // Live summary (updated by the form's valueChangeFn)
  totalHours = 0;
  totalDays  = 0;
  isBillable = false;
  billableAmount = 0;

  @ViewChild(TimesheetsListComponent) TimesheetsListComponent!: TimesheetsListComponent;

  constructor(private http: HttpClient, private notification: NzNotificationService) {}

  formConfig: TaFormConfig = {};

  // ── Computed ──────────────────────────────────────────────────────────────
  get statusColor(): string {
    const map: Record<string, string> = {
      Draft: 'default', Open: 'processing', Approved: 'success', Rejected: 'error',
    };
    return map[this.timesheetStatus] ?? 'default';
  }

  get periodLabel(): string {
    const ts = this.formConfig?.model?.['timesheet'] || {};
    if (ts.start_date && ts.end_date) return `${ts.start_date}  →  ${ts.end_date}`;
    return 'Not set';
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit() {
    this.showTimesheetsList = false;
    this.loadingEdit = false;
    this.showForm = true;
    this.TimesheetEditID = null;
    this.timesheetStatus = 'Draft';
    this.totalHours = 0;
    this.totalDays = 0;
    this.setFormConfig();
  }

  hide() {
    document.getElementById('tsModalClose')?.click();
  }

  showTimesheetsListFn() {
    this.showTimesheetsList = true;
    this.TimesheetsListComponent?.refreshTable();
  }

  // ── Date helpers ────────────────────────────────────────────────────────--
  private dayName(dateStr: string): string {
    if (!dateStr) return '';
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(dateStr + 'T00:00:00').getDay()];
  }

  private toYMD(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // ── Live summary (called on every form value change) ──────────────────────
  private recomputeSummary() {
    const items = this.formConfig?.model?.['items'] || [];
    this.totalHours = items.reduce((s: number, r: any) => s + (Number(r?.hours_worked) || 0), 0);
    this.totalDays  = items.filter((r: any) => r && r.work_date).length;

    const ts = this.formConfig?.model?.['timesheet'] || {};
    this.isBillable = !!ts.is_billable;
    this.billableAmount = (this.isBillable && ts.billing_rate)
      ? this.totalHours * Number(ts.billing_rate)
      : 0;
  }

  // ── Auto-fill the grid with one row per day in the selected period ────────
  autoFillDates() {
    const ts = this.formConfig?.model?.['timesheet'] || {};
    if (!ts.start_date || !ts.end_date) {
      this.notification.warning('Please select both Start Date and End Date first.', '');
      return;
    }
    if (ts.end_date < ts.start_date) {
      this.notification.error('End Date must be on or after Start Date.', '');
      return;
    }

    const start = new Date(ts.start_date + 'T00:00:00');
    const end   = new Date(ts.end_date   + 'T00:00:00');
    const diff  = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
    if (diff > 31) {
      this.notification.error('The period cannot exceed 31 days.', '');
      return;
    }

    const items: any[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const copy = new Date(d);
      const ymd  = this.toYMD(copy);
      const dow  = copy.getDay();
      items.push({
        work_date:    ymd,
        day:          this.dayName(ymd),
        hours_worked: (dow === 0 || dow === 6) ? 0 : 8,
        description:  '',
      });
    }

    this.formConfig.model['items'] = items;
    this.recomputeSummary();
    this.rebuildForm();
    this.notification.success(`${items.length} day rows generated.`, '');
  }

  /** Rebuilds the ta-form so the repeat field re-renders with the new rows. */
  private rebuildForm() {
    this.showForm = false;
    setTimeout(() => { this.showForm = true; }, 0);
  }

  // ── Edit: load full record ────────────────────────────────────────────────
  editTimesheet(timesheetId: string) {
    this.showForm = false;
    this.loadingEdit = true;
    this.TimesheetEditID = timesheetId;

    this.http.get('hrms/timesheets/' + timesheetId).subscribe({
      next: (res: any) => {
        const data     = res?.data || {};
        const ts       = data.timesheet || {};
        const entries  = data.timesheet_entries || [];
        const approval = data.timesheet_approvals;

        this.timesheetStatus = approval?.status?.status_name || 'Draft';

        this.formConfig.model = {
          timesheet: {
            employee:     ts.employee,
            employee_id:  ts.employee_id,
            customer:     ts.customer,                       // {customer_id, name} or null
            customer_id:  ts.customer_id,
            is_billable:  ts.is_billable,
            billing_rate: ts.billing_rate,
            start_date:   ts.start_date,
            end_date:     ts.end_date,
            notes:        ts.notes || '',
          },
          items: entries.length
            ? entries.map((e: any) => ({
                work_date:    e.work_date,
                day:          this.dayName(e.work_date),
                hours_worked: parseFloat(e.hours_worked),
                description:  e.description || '',
              }))
            : [{}],
        };

        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'timesheet_id';
        this.formConfig.submit.label = 'Update';

        this.recomputeSummary();
        this.loadingEdit = false;
        this.showForm = true;
        this.hide();
      },
      error: () => {
        this.loadingEdit = false;
        this.showForm = true;
        this.notification.error('Error', 'Failed to load timesheet details.');
      },
    });
  }

  // ── Form configuration ────────────────────────────────────────────────────
  setFormConfig() {
    this.TimesheetEditID = null;
    this.formConfig = {
      // No `url` — submittedFn performs the create/update so we control the payload.
      formState: { viewMode: false },
      showActionBtn: true,
      exParams: [],
      valueChangeFn: () => this.recomputeSummary(),
      submit: {
        label: 'Submit',
        submittedFn: () => {
          if (this.TimesheetEditID) {
            this.updateTimesheet();
          } else {
            this.createTimesheet();
          }
        },
      },
      reset: { resetFn: () => { this.ngOnInit(); this.rebuildForm(); } },
      model: {
        timesheet: {},
        items: [{}],
      },
      fields: [
        // ── Header block ─────────────────────────────────────────────────
        {
          fieldGroupClassName: 'ant-row custom-form-block px-0 mx-0',
          key: 'timesheet',
          fieldGroup: [
            {
              key: 'employee',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Employee',
                dataKey: 'employee_id',
                dataLabel: 'first_name',
                placeholder: 'Select Employee',
                options: [],
                lazy: { url: 'hrms/employees/', lazyOneTime: true },
                required: true,
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig?.model?.['timesheet']) {
                      this.formConfig.model['timesheet']['employee_id'] = data?.employee_id;
                    }
                  });
                },
              },
            },
            {
              key: 'customer',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Customer (Bill To)',
                dataKey: 'customer_id',
                dataLabel: 'name',
                placeholder: 'Select Client (for billable work)',
                options: [],
                lazy: { url: 'customers/customers/', lazyOneTime: true },
                required: false,
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig?.model?.['timesheet']) {
                      this.formConfig.model['timesheet']['customer_id'] = data?.customer_id;
                    }
                  });
                },
              },
            },
            {
              key: 'start_date',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Start Date',
                type: 'date',
                placeholder: 'Select Start Date',
                required: true,
              },
            },
            {
              key: 'end_date',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'End Date',
                type: 'date',
                placeholder: 'Select End Date',
                required: true,
              },
            },
            {
              key: 'billing_rate',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Billing Rate (per hour)',
                type: 'number',
                placeholder: 'e.g. 1000',
                min: 0,
                required: false,
              },
            },
            {
              key: 'notes',
              type: 'textarea',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Notes',
                placeholder: 'Enter notes for this timesheet period',
                required: false,
              },
            },
            {
              key: 'is_billable',
              type: 'checkbox',
              className: 'col-md-4 col-sm-6 col-12 d-flex align-items-end',
              templateOptions: {
                label: 'Billable (chargeable to the client)',
                required: false,
              },
            },
          ],
        },

        // ── Daily entries (native repeat field) ──────────────────────────
        {
          key: 'items',
          type: 'repeat',
          className: 'custom-form-list timesheet-entries',
          templateOptions: {
            title: 'Daily Time Entries',
            addText: 'Add Row',
            extraActionText: 'Auto-fill Dates',
            extraActionIcon: 'fa fa-magic',
            onExtraAction: () => this.autoFillDates(),
            tableCols: [
              { name: 'work_date', label: 'Date' },
              { name: 'day', label: 'Day' },
              { name: 'hours_worked', label: 'Hours' },
              { name: 'description', label: 'Description / Task' },
            ],
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'work_date',
                type: 'input',
                className: 'col',
                templateOptions: {
                  label: 'Date',
                  type: 'date',
                  hideLabel: true,
                  required: true,
                },
              },
              {
                key: 'day',
                type: 'input',
                className: 'col',
                templateOptions: {
                  label: 'Day',
                  hideLabel: true,
                  disabled: true,
                  placeholder: '—',
                },
                // Auto-compute the weekday name from the row's work_date.
                expressionProperties: {
                  'model.day': (model: any) =>
                    model?.work_date ? this.dayName(model.work_date) : '',
                },
              },
              {
                key: 'hours_worked',
                type: 'input',
                className: 'col',
                defaultValue: 8,
                templateOptions: {
                  label: 'Hours',
                  type: 'number',
                  hideLabel: true,
                  placeholder: '0.00',
                  min: 0,
                  max: 24,
                  required: true,
                },
              },
              {
                key: 'description',
                type: 'input',
                className: 'col',
                templateOptions: {
                  label: 'Description / Task',
                  hideLabel: true,
                  placeholder: 'What did you work on?',
                  required: false,
                },
              },
            ],
          },
        },
      ],
    };
  }

  // ── Payload + validation ──────────────────────────────────────────────────
  private buildPayload() {
    const model = this.formConfig.model || {};
    const ts    = model['timesheet'] || {};
    const items = model['items'] || [];

    return {
      timesheet: {
        employee_id:  ts.employee?.employee_id || ts.employee_id,
        customer_id:  ts.customer?.customer_id || ts.customer_id || null,
        is_billable:  !!ts.is_billable,
        billing_rate: (ts.billing_rate !== undefined && ts.billing_rate !== null && ts.billing_rate !== '')
          ? Number(ts.billing_rate)
          : null,
        start_date:   ts.start_date,
        end_date:     ts.end_date,
        notes:        ts.notes || null,
      },
      // 'day' is display-only and intentionally excluded from the payload.
      timesheet_entries: items
        .filter((r: any) => r && r.work_date)
        .map((r: any) => ({
          work_date:    r.work_date,
          hours_worked: Number(r.hours_worked) || 0,
          description:  r.description || null,
        })),
    };
  }

  private validateBeforeSave(payload: any): string | null {
    const ts = payload.timesheet;
    if (!ts.employee_id) return 'Please select an Employee.';
    if (!ts.start_date)  return 'Please select a Start Date.';
    if (!ts.end_date)    return 'Please select an End Date.';
    if (ts.end_date < ts.start_date) return 'End Date must be on or after Start Date.';
    if (payload.timesheet_entries.length === 0) return 'Please add at least one entry with a date.';
    // When billable, a client and a positive rate are required.
    if (ts.is_billable) {
      if (!ts.customer_id) return 'For billable work, please select the Customer (Bill To).';
      if (!ts.billing_rate || ts.billing_rate <= 0) return 'For billable work, please enter a Billing Rate greater than 0.';
    }
    return null;
  }

  // ── Create / Update ─────────────────────────────────────────────────────--
  createTimesheet() {
    const payload = this.buildPayload();
    const error   = this.validateBeforeSave(payload);
    if (error) { this.notification.error('Error', error); return; }

    this.http.post('hrms/timesheets/', payload).subscribe({
      next: () => {
        this.notification.success('Timesheet created successfully.', '');
        this.ngOnInit();
        // Recreate the ta-form: submit marked every control as touched, so a
        // plain model reset would show all the required errors on a fresh form.
        this.rebuildForm();
        this.TimesheetsListComponent?.refreshTable();
      },
      error: (err) => this.notification.error('Error', err?.error?.message || 'Failed to create timesheet.'),
    });
  }

  updateTimesheet() {
    const payload = this.buildPayload();
    const error   = this.validateBeforeSave(payload);
    if (error) { this.notification.error('Error', error); return; }

    this.http.put(`hrms/timesheets/${this.TimesheetEditID}/`, payload).subscribe({
      next: () => {
        this.notification.success('Timesheet updated successfully.', '');
        this.ngOnInit();
        this.rebuildForm();
        this.TimesheetsListComponent?.refreshTable();
      },
      error: (err) => this.notification.error('Error', err?.error?.message || 'Failed to update timesheet.'),
    });
  }
}
