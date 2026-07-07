import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-billable-hours',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminCommmonModule,
    NzModalModule,
    NzSelectModule,
  ],
  templateUrl: './billable-hours.component.html',
  styleUrls: ['./billable-hours.component.scss'],
})
export class BillableHoursComponent implements OnInit {

  // --- Create-invoice modal state ---
  showInvoiceModal = false;
  isCreating = false;
  products: any[] = [];
  selectedProductId: string | null = null;

  // Summary shown inside the modal (computed from the checked rows)
  modalCustomerId   = '';
  modalCustomerName = '';
  modalCount        = 0;
  modalTotalHours   = 0;
  modalTotalAmount  = 0;
  private selectedTimesheetIds: string[] = [];

  // ta-table's `checkedRows` only holds row IDs (not full objects), so we keep
  // our own copy of the loaded billable rows to look up customer + totals.
  private billableRows: any[] = [];

  constructor(
    private http: HttpClient,
    private notification: NzNotificationService,
    private router: Router,
  ) {}

  // ── Eligible billable-hours list (reuses the leave-approvals curd pattern) ──
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    hideAddBtn: true,
    tableConfig: {
      apiUrl: 'hrms/billable_timesheets/',
      title: 'Billable Hours',
      pkId: 'timesheet_id',
      showCheckbox: true,
      pageSize: 10,
      globalSearch: {
        keys: ['employee', 'customer', 'start_date', 'end_date', 'total_hours', 'billable_amount'],
      },
      export: { downloadName: 'BillableHours' },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'employee',
          name: 'Employee',
          sort: true,
          displayType: 'map',
          mapFn: (_v: any, row: any) => {
            const fn = row.employee?.first_name || '';
            const ln = row.employee?.last_name || '';
            return `${fn} ${ln}`.trim() || '—';
          },
        },
        {
          fieldKey: 'customer',
          name: 'Customer',
          sort: true,
          displayType: 'map',
          mapFn: (_v: any, row: any) => row.customer?.name || '—',
        },
        { fieldKey: 'start_date', name: 'Start Date', sort: true },
        { fieldKey: 'end_date', name: 'End Date', sort: true },
        {
          fieldKey: 'total_hours',
          name: 'Total Hours',
          sort: true,
          displayType: 'map',
          mapFn: (_v: any, row: any) =>
            row.total_hours != null ? `${parseFloat(row.total_hours).toFixed(2)} hrs` : '—',
        },
        {
          fieldKey: 'billing_rate',
          name: 'Rate / hr',
          sort: true,
          displayType: 'map',
          mapFn: (_v: any, row: any) =>
            row.billing_rate != null ? parseFloat(row.billing_rate).toFixed(2) : '—',
        },
        {
          fieldKey: 'billable_amount',
          name: 'Billable Amount',
          sort: true,
          displayType: 'map',
          mapFn: (_v: any, row: any) =>
            row.billable_amount != null ? parseFloat(row.billable_amount).toFixed(2) : '—',
        },
      ],
    },
    // Not used (no add/edit drawer) — kept minimal to satisfy ta-curd.
    formConfig: {
      url: 'hrms/billable_timesheets/',
      title: 'Billable Hours',
      pkId: 'timesheet_id',
      fields: [],
    },
  };

  ngOnInit(): void {
    this.loadProducts();
    this.loadBillableRows();
  }

  // ── Load service products for the invoice line item ───────────────────────
  loadProducts(): void {
    this.http.get('products/products/?summary=true').subscribe({
      next: (res: any) => { this.products = res?.data || []; },
      error: () => { this.notification.error('Error', 'Failed to load products list.'); },
    });
  }

  // ── Keep a local copy of the billable rows (to resolve checked IDs) ───────
  loadBillableRows(): void {
    this.http.get('hrms/billable_timesheets/?limit=500').subscribe({
      next: (res: any) => { this.billableRows = res?.data || []; },
      error: () => { /* table already surfaces load errors */ },
    });
  }

  // ta-table stores only the checked row IDs (timesheet_id strings).
  get checkedIds(): string[] {
    return this.curdConfig.tableConfig.checkedRows || [];
  }

  get checkedCount(): number {
    return this.checkedIds.length;
  }

  // ── Step 1: validate selection, open the modal ────────────────────────────
  openCreateInvoice(): void {
    const ids = this.checkedIds;
    if (ids.length === 0) return;

    // The local copy may not have loaded yet (or may be stale) when the user
    // clicks. If any checked row is missing from it, fetch fresh on demand and
    // then open — this avoids the spurious "Could not read the selected rows".
    const haveAll = ids.every(id => this.billableRows.some(r => r.timesheet_id === id));
    if (haveAll) {
      this.prepareAndOpenModal(ids);
      return;
    }

    this.http.get('hrms/billable_timesheets/?limit=500').subscribe({
      next: (res: any) => {
        this.billableRows = res?.data || [];
        this.prepareAndOpenModal(ids);
      },
      error: () => this.notification.error('Error', 'Could not load billable hours. Please refresh and try again.'),
    });
  }

  /** Resolve checked IDs to full rows, validate, and open the invoice modal. */
  private prepareAndOpenModal(ids: string[]): void {
    // Resolve the checked IDs back to full rows (for customer + totals).
    const selected = this.billableRows.filter(r => ids.includes(r.timesheet_id));
    if (selected.length === 0) {
      this.notification.error('Error', 'Could not read the selected rows. Please refresh and try again.');
      return;
    }

    // All selected timesheets must belong to the SAME customer (one invoice = one client).
    const customerIds = Array.from(
      new Set(selected.map(r => r.customer?.customer_id || r.customer_id).filter(Boolean))
    );
    if (customerIds.length !== 1) {
      this.notification.error('Error', 'Please select billable hours for ONE customer only.');
      return;
    }

    this.modalCustomerId   = customerIds[0];
    this.modalCustomerName = selected[0].customer?.name || '—';
    this.selectedTimesheetIds = selected.map(r => r.timesheet_id);
    this.modalCount        = selected.length;
    this.modalTotalHours   = selected.reduce((s, r) => s + (Number(r.total_hours) || 0), 0);
    this.modalTotalAmount  = selected.reduce((s, r) => s + (Number(r.billable_amount) || 0), 0);

    this.selectedProductId = null;
    this.showInvoiceModal  = true;
  }

  // ── Step 2: confirm → POST to backend ─────────────────────────────────────
  confirmCreateInvoice(): void {
    if (!this.selectedProductId) {
      this.notification.error('Error', 'Please select the service item (e.g. Professional Services).');
      return;
    }

    const payload = {
      customer_id:   this.modalCustomerId,
      product_id:    this.selectedProductId,
      timesheet_ids: this.selectedTimesheetIds,
    };

    this.isCreating = true;
    this.http.post('hrms/timesheets/create_invoice/', payload).subscribe({
      next: (res: any) => {
        this.isCreating = false;
        this.showInvoiceModal = false;
        const invoiceNo = res?.data?.invoice_no || '';
        const total     = res?.data?.total_amount || '';
        this.notification.success(`Invoice ${invoiceNo} created (₹${total}).`, '');
        // Refresh both the table and our local copy (invoiced rows drop out),
        // then open the Sales Invoice screen.
        this.curdConfig.tableConfig.reload?.();
        this.loadBillableRows();
        // Land on the Sales Invoice LIST (not a blank create form) so the user
        // can immediately open/print the invoice just created.
        setTimeout(
          () => this.router.navigate(
            ['/admin/sales/salesinvoice'],
            { state: { openInvoiceList: true } },
          ),
          800,
        );
      },
      error: (err) => {
        this.isCreating = false;
        this.notification.error('Error', err?.error?.message || 'Failed to create invoice. Please try again.');
      },
    });
  }

  cancelInvoiceModal(): void {
    this.showInvoiceModal = false;
  }
}
