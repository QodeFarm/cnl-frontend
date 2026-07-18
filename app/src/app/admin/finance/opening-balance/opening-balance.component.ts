import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { DrilldownEditService } from 'src/app/services/drilldown-edit.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { OpeningBalanceListComponent } from './opening-balance-list/opening-balance-list.component';

@Component({
  selector: 'app-opening-balance',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, OpeningBalanceListComponent, NzModalModule],
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.scss']
})
export class OpeningBalanceComponent implements OnInit, OnDestroy {
  showOpeningBalanceList: boolean = false;
  showForm: boolean = false;
  OpeningBalanceEditID: any;
  @ViewChild(OpeningBalanceListComponent) OpeningBalanceListComponent!: OpeningBalanceListComponent;

  totalDebit: string = '0.00';
  totalCredit: string = '0.00';
  booksBeginningDate: string | null = null;
  private booksDateLoaded = false;
  private drilldownSub: Subscription;

  constructor(
    private http: HttpClient,
    private drilldownEditService: DrilldownEditService,
    private message: NzMessageService,
    private modal: NzModalService,
    private zone: NgZone
  ) {}

  ngOnDestroy() {
    this.drilldownSub?.unsubscribe();
  }

  ngOnInit() {
    if (!this.drilldownSub) {
      this.drilldownSub = this.drilldownEditService.editRequest$
        .pipe(filter(r => r.route === '/admin/finance/opening-balance'))
        .subscribe(r => {
          if (r.editId === this.OpeningBalanceEditID) return;
          this.editOpeningBalanceById(r.editId);
        });
    }

    const editId = window.history.state?.editId;
    if (editId) { history.replaceState({}, '', window.location.href); }

    this.showOpeningBalanceList = false;
    this.OpeningBalanceEditID = null;
    this.loadTotals();

    // Books beginning date anchors every new opening balance; load it once, then build
    // the form so the date field defaults to it (falls back to today if not configured).
    this.ensureBooksBeginningDate(() => {
      this.setFormConfig();
      this.showForm = true;
      if (editId) this.editOpeningBalanceById(editId);
    });
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose')?.click();
  }

  nowDate(): string {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  /** Opening balances default to the company's books-beginning date (else today). */
  defaultOpeningDate(): string {
    return this.booksBeginningDate || this.nowDate();
  }

  ensureBooksBeginningDate(done: () => void) {
    if (this.booksDateLoaded) { done(); return; }
    this.http.get<any>('company/companies/').subscribe({
      next: (res: any) => {
        const companyId = res?.data?.[0]?.company_id;
        if (!companyId) { this.booksDateLoaded = true; done(); return; }
        this.http.get<any>(`company/company-settings/${companyId}/`).subscribe({
          next: (r: any) => {
            this.booksBeginningDate = (r?.data?.books_beginning_date) || null;
            this.booksDateLoaded = true;
            done();
          },
          error: () => { this.booksDateLoaded = true; done(); }
        });
      },
      error: () => { this.booksDateLoaded = true; done(); }
    });
  }

  loadTotals() {
    this.http.get<any>('finance/opening_balance_totals/').subscribe((res: any) => {
      const data = res?.data ?? res;
      this.totalDebit = data?.debit ?? '0.00';
      this.totalCredit = data?.credit ?? '0.00';
    });
  }

  editOpeningBalanceById(id: string) {
    this.http.get<any>(`finance/opening_balance_entries/${id}/`).subscribe({
      next: (res: any) => {
        const row = res?.data ?? res;
        if (row) this.editOpeningBalance(row);
      },
      error: (err) => console.error('Failed to load opening balance entry for edit:', err)
    });
  }

  editOpeningBalance(row: any) {
    // showForm must go false, then true, in two separate change-detection ticks -
    // ta-form doesn't react to formConfig.model being mutated in place, only to the
    // <ta-form> component being torn down and recreated by *ngIf. Flipping both in the
    // same synchronous callback (as this used to) never lets Angular render the "false"
    // state, so the form silently keeps its old instance and ignores the new model.
    this.showForm = false;
    setTimeout(() => {
      this.OpeningBalanceEditID = row.opening_balance_entry_id;
      this.formConfig.model = {
        account_type: row.account_type,
        customer: row.account_type === 'Customer' ? row.customer : null,
        vendor: row.account_type === 'Vendor' ? row.vendor : null,
        ledger_account: row.account_type === 'Ledger' ? row.ledger_account : null,
        amount: row.amount,
        entry_type: row.entry_type,
        opening_balance_date: row.opening_balance_date,
      };
      this.formConfig.showActionBtn = true;
      this.formConfig.submit.label = 'Update';
      this.showForm = true;
      this.hide();
    });
  }

  /** Cancels an opening balance entry and reverses its ledger impact (after confirm). */
  cancelOpeningBalance(row: any) {
    if (row?.status === 'Cancelled') {
      this.message.info('This opening balance is already cancelled.');
      return;
    }
    const drCr = row.entry_type === 'Debit' ? 'Dr' : 'Cr';
    this.modal.confirm({
      nzTitle: 'Cancel Opening Balance',
      nzContent: `This will reverse ${row.account_name}'s opening balance of ₹${row.amount} (${drCr}) from the ledger. Continue?`,
      nzOkText: 'Yes, Cancel It',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Go Back',
      nzCentered: true,
      nzOnOk: () => {
        this.http.delete(`finance/opening_balance/${row.opening_balance_entry_id}/`).subscribe({
          next: () => {
            this.message.success('Opening balance cancelled and reversed from the ledger.');
            this.OpeningBalanceListComponent?.refreshTable();
            this.loadTotals();
          },
          error: (err) => this.message.error(err?.error?.message || 'Failed to cancel opening balance.')
        });
      }
    });
  }

  /** Warns before silently replacing an account's existing opening balance posting. */
  confirmIfExisting(field: any, accountType: string, filterKey: string, id: string) {
    const params: any = { account_type: accountType };
    params[filterKey] = id;
    this.http.get<any>('finance/opening_balance_entries/', { params }).subscribe((res: any) => {
      // Guard against a race: if the user changed Account Type or picked a different
      // account while this request was in flight, this result is stale - drop it instead
      // of popping a confirm for an account that's no longer selected.
      if (field.model?.account_type !== accountType || field.formControl?.value?.[filterKey] !== id) return;

      const results = res?.data ?? res ?? [];
      const existing = Array.isArray(results) ? results[0] : null;
      if (!existing || existing.opening_balance_entry_id === this.OpeningBalanceEditID) return;

      const drCr = existing.entry_type === 'Debit' ? 'Dr' : 'Cr';
      this.modal.confirm({
        nzTitle: 'Opening Balance Already Exists',
        nzContent: `${existing.account_name} already has an opening balance of ₹${existing.amount} (${drCr}). Saving will replace it.`,
        nzOkText: 'Yes, Replace It',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzCancelText: 'Go Back',
        nzCentered: true,
        nzOnCancel: () => field.formControl.setValue(null),
      });
    });
  }

  showOpeningBalanceListFn() {
    this.showOpeningBalanceList = true;
    // The list table lives in a Bootstrap modal that starts hidden, so ng-zorro measures
    // it as zero-size and paints empty until a reflow (which is why clicking/closing "fixed"
    // it). Refresh once the modal has actually finished opening (shown.bs.modal fires with
    // real dimensions), and nudge a resize so the table re-measures and paints immediately.
    const modalEl = document.getElementById('openingBalanceModal');
    if (modalEl) {
      modalEl.addEventListener('shown.bs.modal', () => {
        this.zone.run(() => this.OpeningBalanceListComponent?.refreshTable());
        window.dispatchEvent(new Event('resize'));
      }, { once: true });
    }
  }

  setFormConfig() {
    this.OpeningBalanceEditID = null;
    this.formConfig = {
      url: 'finance/opening_balance/',
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'customer_id',
          type: 'script',
          value: 'data.customer.customer_id'
        },
        {
          key: 'vendor_id',
          type: 'script',
          value: 'data.vendor.vendor_id'
        },
        {
          key: 'ledger_account_id',
          type: 'script',
          value: 'data.ledger_account.ledger_account_id'
        },
      ],
      submit: {
        label: 'Save',
        submittedFn: (res: any) => {
          const warning = (res?.data ?? res)?.warning;
          if (warning) this.message.warning(warning, { nzDuration: 8000 });
          this.formConfig.model = {};
          this.ngOnInit();
        }
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model: {},
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          fieldGroup: [
            {
              key: 'account_type',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              defaultValue: 'Customer',
              templateOptions: {
                label: 'Account Type',
                options: [
                  { value: 'Customer', label: 'Customer' },
                  { value: 'Vendor', label: 'Vendor' },
                  { value: 'Ledger', label: 'Ledger Account' },
                ],
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  // Clear the other account pickers when the type changes, so a stale
                  // pick (e.g. a Vendor selected before switching to Customer) can't linger.
                  field.formControl.valueChanges.subscribe(() => {
                    const m = field.model;
                    if (!m) return;
                    if (m.account_type !== 'Customer') m.customer = null;
                    if (m.account_type !== 'Vendor') m.vendor = null;
                    if (m.account_type !== 'Ledger') m.ledger_account = null;
                  });
                }
              }
            },
            {
              key: 'customer',
              type: 'customer-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              hideExpression: (model: any) => model?.account_type !== 'Customer',
              templateOptions: {
                label: 'Customer',
                placeholder: 'Select Customer',
                dataKey: 'customer_id',
                dataLabel: 'name',
                required: true,
                lazy: {
                  url: 'customers/customers/?summary=true',
                  lazyOneTime: true
                }
              },
              hooks: {
                onInit: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (data?.customer_id) this.confirmIfExisting(field, 'Customer', 'customer_id', data.customer_id);
                  });
                }
              }
            },
            {
              key: 'vendor',
              type: 'vendor-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              hideExpression: (model: any) => model?.account_type !== 'Vendor',
              templateOptions: {
                label: 'Vendor',
                placeholder: 'Select Vendor',
                dataKey: 'vendor_id',
                dataLabel: 'name',
                required: true,
                lazy: {
                  url: 'vendors/vendors/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onInit: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (data?.vendor_id) this.confirmIfExisting(field, 'Vendor', 'vendor_id', data.vendor_id);
                  });
                }
              }
            },
            {
              key: 'ledger_account',
              type: 'ledger-account-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              hideExpression: (model: any) => model?.account_type !== 'Ledger',
              templateOptions: {
                label: 'Ledger Account',
                placeholder: 'Select Account',
                dataKey: 'ledger_account_id',
                dataLabel: 'name',
                required: true,
                lazy: {
                  url: 'customers/ledger_accounts/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onInit: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (data?.ledger_account_id) this.confirmIfExisting(field, 'Ledger', 'ledger_account_id', data.ledger_account_id);
                  });
                }
              }
            },
            {
              key: 'amount',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Amount',
                placeholder: 'Enter Amount',
                type: 'number',
                required: true,
              }
            },
            {
              key: 'entry_type',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              defaultValue: 'Debit',
              templateOptions: {
                label: 'Dr/Cr',
                options: [
                  { value: 'Debit', label: 'Dr' },
                  { value: 'Credit', label: 'Cr' },
                ],
                required: true
              }
            },
            {
              key: 'opening_balance_date',
              type: 'date',
              className: 'col-md-4 col-sm-6 col-12',
              defaultValue: this.defaultOpeningDate(),
              templateOptions: {
                label: 'As Of Date',
                placeholder: 'Enter Date',
                required: true
              }
            }
          ]
        }
      ]
    }
  }
}
