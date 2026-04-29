import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TaFormConfig, TaFormComponent } from '@ta/ta-form';
import { JournalVoucherListComponent } from './journal-voucher-list/journal-voucher-list.component';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-journal-voucher',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, JournalVoucherListComponent, FormsModule, NzNotificationModule, NzModalModule],
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.scss']
})
export class JournalVoucherComponent implements OnInit, OnDestroy {
  showJournalVoucherList: boolean = false;
  showForm: boolean = false;
  JournalVoucherEditID: any;
  voucherNumber: string | null = null;
  voucherStatus: string = 'Submitted';

  totalDebit: number = 0;
  totalCredit: number = 0;

  expenseClaimOptions: any[] = [];
  selectedExpenseClaimId: string = '';

  @ViewChild(JournalVoucherListComponent) JournalVoucherListComponent!: JournalVoucherListComponent;
  @ViewChild('journalVoucherForm') journalVoucherForm!: TaFormComponent;

  private subscriptions: Subscription[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private notification: NzNotificationService,
    private modal: NzModalService
  ) {}

  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  getVoucherNo() {
    this.voucherNumber = null;
    return this.http.get('masters/generate_order_no/?type=JV').subscribe(
      (res: any) => {
        if (res?.data?.order_number) {
          this.voucherNumber = res.data.order_number;
          if (this.formConfig?.model?.journal_voucher) {
            this.formConfig.model.journal_voucher.voucher_no = this.voucherNumber;
          }
          if (this.journalVoucherForm?.form) {
            const ctrl = this.journalVoucherForm.form.get('journal_voucher.voucher_no');
            if (ctrl) ctrl.setValue(this.voucherNumber);
          }
          this.cdr.detectChanges();
        }
      },
      error => console.error('Error getting voucher number:', error)
    );
  }

  loadExpenseClaims() {
    this.http.get('finance/expense_claims/').subscribe(
      (res: any) => {
        if (res?.data) {
          this.expenseClaimOptions = res.data.map((claim: any) => ({
            value: claim.expense_claim_id,
            label: `${claim.expense_claim_id} - ${claim.description || 'No Description'} - ₹${claim.total_amount}`
          }));
        }
      },
      error => console.error('Error loading expense claims:', error)
    );
  }

  pullExpenseClaim() {
    if (!this.selectedExpenseClaimId) return;
    this.http.get(`finance/journal_vouchers/pull_expense_claim/${this.selectedExpenseClaimId}/`).subscribe(
      (res: any) => {
        if (res?.data) {
          const expenseData = res.data;
          if (this.formConfig?.model) {
            if (expenseData.lines?.length > 0) {
              this.formConfig.model.voucher_lines = expenseData.lines.map((line: any) => ({
                ledger_account: line.ledger_account,
                ledger_account_id: line.ledger_account_id,
                entry_type: line.entry_type || 'Debit',
                amount: line.amount || 0,
                customer: line.customer,
                customer_id: line.customer_id,
                party_type: 'customer',
                remark: line.remark || ''
              }));
            }
            if (expenseData.narration && this.formConfig.model.journal_voucher) {
              this.formConfig.model.journal_voucher.narration = expenseData.narration;
            }
            this.calculateTotals();
            this.cdr.detectChanges();
          }
        }
      },
      error => console.error('Error pulling expense claim:', error)
    );
  }

  ngOnInit() {
    this.showJournalVoucherList = false;
    this.showForm = false;
    this.JournalVoucherEditID = null;
    this.totalDebit = 0;
    this.totalCredit = 0;

    this.loadExpenseClaims();
    this.setFormConfig();
    this.getVoucherNo();
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose')?.click();
  }

  calculateTotals() {
    let debit = 0;
    let credit = 0;
    if (this.formConfig?.model?.voucher_lines) {
      this.formConfig.model.voucher_lines.forEach((line: any) => {
        const amount = parseFloat(line.amount) || 0;
        if (line.entry_type === 'Debit') debit += amount;
        else if (line.entry_type === 'Credit') credit += amount;
      });
    }
    this.totalDebit = debit;
    this.totalCredit = credit;
    if (this.formConfig?.model?.journal_voucher) {
      this.formConfig.model.journal_voucher.total_debit = this.totalDebit;
      this.formConfig.model.journal_voucher.total_credit = this.totalCredit;
    }
  }

  clearSubscriptions() {
    this.subscriptions.forEach(sub => { try { sub.unsubscribe(); } catch (e) {} });
    this.subscriptions = [];
  }

  ngOnDestroy() {
    this.clearSubscriptions();
  }

  editJournalVoucher(event: any) {
    this.JournalVoucherEditID = event;
    this.clearSubscriptions();

    this.http.get('finance/journal_vouchers/' + event).subscribe((res: any) => {
      if (res?.data) {
        const voucher = res.data;
        this.voucherStatus = voucher.journal_voucher?.status || voucher.status || 'Submitted';
        const isCancelled = this.voucherStatus === 'Cancelled';

        this.formConfig.model = voucher;
        this.formConfig.pkId = 'journal_voucher_id';
        this.formConfig.model['journal_voucher_id'] = this.JournalVoucherEditID;

        if (isCancelled) {
          // Cancelled voucher — view only
          this.formConfig.showActionBtn = false;
          this.formConfig.formState = { viewMode: true };
        } else {
          this.formConfig.showActionBtn = true;
          this.formConfig.formState = { viewMode: false };
          this.formConfig.submit.label = 'Update';
        }

        if (Array.isArray(this.formConfig.model?.voucher_lines)) {
          this.formConfig.model.voucher_lines.sort((a: any, b: any) => {
            const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
            const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
            return ta - tb;
          });
          this.formConfig.model.voucher_lines = this.formConfig.model.voucher_lines.map((line: any) => {
            if (line.customer_id || line.customer) return { ...line, party_type: 'customer' };
            if (line.vendor_id || line.vendor)     return { ...line, party_type: 'vendor' };
            return line;
          });
        }

        this.calculateTotals();
        this.showForm = true;
        this.cdr.detectChanges();
      }
    });
    this.hide();
  }

  showJournalVoucherListFn() {
    this.showJournalVoucherList = true;
    this.JournalVoucherListComponent?.refreshTable();
  }

  showJournalVoucherForm() {
    this.JournalVoucherEditID = null;
    this.voucherStatus = 'Submitted';
    this.clearSubscriptions();
    this.showForm = true;
    this.totalDebit = 0;
    this.totalCredit = 0;
    this.getVoucherNo();
  }

  cancelVoucher() {
    if (!this.JournalVoucherEditID) return;

    this.modal.confirm({
      nzTitle: 'Cancel Voucher',
      nzContent: 'This will remove the voucher\'s impact from the Account Ledger and mark it as Cancelled. This cannot be undone.',
      nzOkText: 'Yes, Cancel Voucher',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Go Back',
      nzCentered: true,
      nzOnOk: () => {
        this.http.post(`finance/journal_vouchers/${this.JournalVoucherEditID}/cancel/`, {}).subscribe(
          () => {
            this.notification.success('Cancelled', 'Voucher has been cancelled and removed from ledger.');
            this.ngOnInit();
          },
          error => {
            const msg = error.error?.message || 'An unexpected error occurred.';
            this.notification.error('Cancel Failed', msg);
          }
        );
      }
    });
  }

  setFormConfig() {
    this.clearSubscriptions();
    this.JournalVoucherEditID = null;

    this.formConfig = {
      url: "finance/journal_vouchers/",
      formState: { viewMode: false },
      showActionBtn: true,
      exParams: [
        {
          key: 'voucher_lines',
          type: 'script',
          value: `data.voucher_lines
            .filter(line => line.ledger_account?.ledger_account_id || line.ledger_account_id)
            .map(line => ({
              ...line,
              ledger_account_id: line.ledger_account?.ledger_account_id || line.ledger_account_id,
              customer_id: line.customer?.customer_id || line.customer_id || null,
              vendor_id:   line.vendor?.vendor_id   || line.vendor_id   || null,
              employee_id: line.employee?.employee_id || line.employee_id
            }))`
        }
      ],
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => this.ngOnInit()
      },
      model: {
        journal_voucher: {
          voucher_date: this.nowDate(),
          voucher_type: 'Journal',
          reference_no: null,
          reference_date: null,
          expense_claim_id: null,
          narration: ''
        },
        voucher_lines: [{}, {}],
        attachments: []
      },
      fields: [
        // ── Header ───────────────────────────────────────────────────────────
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          key: 'journal_voucher',
          fieldGroup: [
            {
              key: 'voucher_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-md-3 col-sm-6 col-12',
              templateOptions: { label: 'Date', placeholder: 'Select date', required: true }
            },
            {
              key: 'voucher_no',
              type: 'input',
              className: 'col-md-3 col-sm-6 col-12',
              templateOptions: {
                label: 'Voucher No',
                placeholder: 'Auto-generated',
                required: false,
                disabled: true,
              },
              hooks: {
                onInit: (field: any) => {
                  if (field.formControl && this.voucherNumber) {
                    field.formControl.setValue(this.voucherNumber);
                  }
                }
              }
            },
            {
              key: 'voucher_type',
              type: 'select',
              className: 'col-md-2 col-sm-6 col-12',
              defaultValue: 'Journal',
              templateOptions: {
                label: 'Voucher Type',
                required: true,
                options: [
                  { value: 'Journal',    label: 'Journal' },
                  { value: 'Contra',     label: 'Contra' },
                  { value: 'Receipt',    label: 'Receipt' },
                  { value: 'Payment',    label: 'Payment' },
                  { value: 'DebitNote',  label: 'Debit Note' },
                  { value: 'CreditNote', label: 'Credit Note' }
                ]
              }
            },
            {
              key: 'reference_no',
              type: 'input',
              className: 'col-md-2 col-sm-6 col-12',
              templateOptions: { label: 'Reference No', placeholder: 'e.g. INV-001', required: false }
            },
            {
              key: 'reference_date',
              type: 'date',
              className: 'col-md-2 col-sm-6 col-12',
              templateOptions: { label: 'Reference Date', placeholder: 'Select date', required: false }
            }
          ]
        },
        // ── Voucher Lines ─────────────────────────────────────────────────────
        {
          key: 'voucher_lines',
          type: 'table',
          className: 'custom-form-list product-table',
          templateOptions: {
            title: 'Journal Voucher Lines',
            addText: 'Add Line',
            // tableCols presence enables the <thead> — labels come from each field's templateOptions.label
            tableCols: true
          },
          fieldArray: {
            fieldGroup: [
              // ── Ledger Account ──
              {
                key: 'ledger_account',
                type: 'select',
                templateOptions: {
                  label: 'Ledger Account',
                  dataKey: 'ledger_account_id',
                  dataLabel: 'name',
                  options: [],
                  hideLabel: true,
                  required: false,
                  lazy: { url: 'customers/ledger_accounts/', lazyOneTime: true },
                },
                hooks: {
                  onChanges: (field: any) => {
                    const sub = field.formControl.valueChanges.pipe(
                      debounceTime(50),
                      distinctUntilChanged((a: any, b: any) => a?.ledger_account_id === b?.ledger_account_id)
                    ).subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['voucher_lines'][index]) {
                        this.formConfig.model['voucher_lines'][index] = {};
                      }
                      const row = this.formConfig.model['voucher_lines'][index];
                      row['ledger_account_id'] = data?.ledger_account_id;

                      // Set party_type from ledger group purpose — hideExpression reads this
                      const purpose = data?.ledger_group?.purpose;
                      if (purpose === 'AccountsReceivable') {
                        row['party_type'] = 'customer';
                      } else if (purpose === 'AccountsPayable') {
                        row['party_type'] = 'vendor';
                      } else {
                        row['party_type'] = null;
                      }
                      // Clear any previously selected party when ledger changes
                      row['customer'] = null; row['customer_id'] = null;
                      row['vendor']   = null; row['vendor_id']   = null;
                    });
                    this.subscriptions.push(sub);
                  }
                }
              },
              // ── Dr/Cr ──
              {
                key: 'entry_type',
                type: 'select',
                defaultValue: 'Debit',
                templateOptions: {
                  label: 'Dr/Cr',
                  hideLabel: true,
                  required: false,
                  options: [
                    { value: 'Debit',  label: 'Dr' },
                    { value: 'Credit', label: 'Cr' }
                  ]
                },
                hooks: {
                  onChanges: (field: any) => {
                    const sub = field.formControl.valueChanges.pipe(debounceTime(100)).subscribe(() => {
                      this.calculateTotals();
                      this.cdr.detectChanges();
                    });
                    this.subscriptions.push(sub);
                  }
                }
              },
              // ── Amount ──
              {
                key: 'amount',
                type: 'input',
                defaultValue: 0,
                templateOptions: {
                  label: 'Amount',
                  type: 'number',
                  placeholder: '0.00',
                  hideLabel: true,
                  required: false
                },
                hooks: {
                  onChanges: (field: any) => {
                    const sub = field.formControl.valueChanges.pipe(debounceTime(100)).subscribe(() => {
                      this.calculateTotals();
                      this.cdr.detectChanges();
                    });
                    this.subscriptions.push(sub);
                  }
                }
              },
              // ── Party (anonymous wrapper → ONE column, TWO lazy fields) ──
              // The wrapper has no key/type so its children render in the same <td>.
              // hideExpression on each child shows Customer OR Vendor based on party_type.
              {
                templateOptions: { label: 'Party', hideLabel: true },
                fieldGroup: [
                  {
                    key: 'customer',
                    type: 'select',
                    templateOptions: {
                      label: 'Party',
                      dataKey: 'customer_id',
                      dataLabel: 'name',
                      options: [],
                      hideLabel: true,
                      required: false,
                      placeholder: 'Select Customer',
                      lazy: { url: 'customers/customer/?minimal=true', lazyOneTime: true },
                    },
                    hideExpression: (model: any) => model?.party_type !== 'customer',
                    hooks: {
                      onChanges: (field: any) => {
                        const sub = field.formControl.valueChanges.pipe(
                          debounceTime(50),
                          distinctUntilChanged((a: any, b: any) => a?.customer_id === b?.customer_id)
                        ).subscribe((data: any) => {
                          const index = field.parent?.parent?.key;
                          if (this.formConfig.model['voucher_lines'][index] != null) {
                            this.formConfig.model['voucher_lines'][index]['customer_id'] = data?.customer_id || null;
                          }
                        });
                        this.subscriptions.push(sub);
                      }
                    }
                  },
                  {
                    key: 'vendor',
                    type: 'select',
                    templateOptions: {
                      label: 'Party',
                      dataKey: 'vendor_id',
                      dataLabel: 'name',
                      options: [],
                      hideLabel: true,
                      required: false,
                      placeholder: 'Select Vendor',
                      lazy: { url: 'vendors/vendors/?minimal=true', lazyOneTime: true },
                    },
                    hideExpression: (model: any) => model?.party_type !== 'vendor',
                    hooks: {
                      onChanges: (field: any) => {
                        const sub = field.formControl.valueChanges.pipe(
                          debounceTime(50),
                          distinctUntilChanged((a: any, b: any) => a?.vendor_id === b?.vendor_id)
                        ).subscribe((data: any) => {
                          const index = field.parent?.parent?.key;
                          if (this.formConfig.model['voucher_lines'][index] != null) {
                            this.formConfig.model['voucher_lines'][index]['vendor_id'] = data?.vendor_id || null;
                          }
                        });
                        this.subscriptions.push(sub);
                      }
                    }
                  },
                  // ── N/A placeholder — keeps the column filled when no party applies ──
                  {
                    key: '_party_na',
                    type: 'input',
                    templateOptions: {
                      label: 'Party',
                      placeholder: 'N/A',
                      hideLabel: true,
                      required: false,
                      disabled: true,
                    },
                    hideExpression: (model: any) => model?.party_type === 'customer' || model?.party_type === 'vendor',
                  }
                ]
              },
              // ── Bill No ──
              {
                key: 'bill_no',
                type: 'input',
                templateOptions: {
                  label: 'Bill No',
                  placeholder: 'Bill No',
                  hideLabel: true,
                  required: false
                }
              },
              // ── TDS ──
              {
                key: 'tds_applicable',
                type: 'checkbox',
                defaultValue: false,
                templateOptions: { label: 'TDS', hideLabel: true, required: false }
              },
              // ── Remark ──
              {
                key: 'remark',
                type: 'input',
                templateOptions: {
                  label: 'Remark',
                  placeholder: 'Enter Remark',
                  hideLabel: true,
                  required: false
                }
              },
              // ── Employee ──
              {
                key: 'employee',
                type: 'select',
                templateOptions: {
                  label: 'Employee',
                  dataKey: 'employee_id',
                  dataLabel: 'first_name',
                  options: [],
                  hideLabel: true,
                  required: false,
                  lazy: { url: 'hrms/employees/', lazyOneTime: true },
                },
                hooks: {
                  onChanges: (field: any) => {
                    const sub = field.formControl.valueChanges.pipe(
                      debounceTime(50),
                      distinctUntilChanged((a: any, b: any) => a?.employee_id === b?.employee_id)
                    ).subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['voucher_lines'][index]) {
                        this.formConfig.model['voucher_lines'][index] = {};
                      }
                      this.formConfig.model['voucher_lines'][index]['employee_id'] = data?.employee_id;
                    });
                    this.subscriptions.push(sub);
                  }
                }
              }
            ]
          }
        },
        // ── Narration + Attachments ───────────────────────────────────────────
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          fieldGroup: [
            {
              className: 'col-12 col-md-6 p-0',
              fieldGroup: [
                {
                  key: 'attachments',
                  type: 'file',
                  className: 'ta-cell col-12 custom-file-attachement',
                  props: {
                    label: 'Attachments',
                    displayStyle: 'files',
                    multiple: true
                  },
                }
              ]
            },
            {
              className: 'col-12 col-md-6 p-0',
              key: 'journal_voucher',
              fieldGroup: [
                {
                  key: 'narration',
                  type: 'textarea',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Narration',
                    placeholder: 'Enter narration',
                    required: false,
                    rows: 4,
                    maxLength: 250
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  }
}
