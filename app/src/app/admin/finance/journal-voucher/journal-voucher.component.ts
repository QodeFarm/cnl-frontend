import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TaFormConfig, TaFormComponent } from '@ta/ta-form';
import { JournalVoucherListComponent } from './journal-voucher-list/journal-voucher-list.component';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-journal-voucher',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, JournalVoucherListComponent, FormsModule],
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.scss']
})
export class JournalVoucherComponent implements OnInit {
  showJournalVoucherList: boolean = false;
  showForm: boolean = false;
  JournalVoucherEditID: any;
  voucherNumber: string | null = null;
  
  // Total calculations
  totalDebit: number = 0;
  totalCredit: number = 0;
  
  // Expense claim options for pull
  expenseClaimOptions: any[] = [];
  selectedExpenseClaimId: string = '';
  
  @ViewChild(JournalVoucherListComponent) JournalVoucherListComponent!: JournalVoucherListComponent;
  @ViewChild('journalVoucherForm') journalVoucherForm!: TaFormComponent;

  // Track subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  // Get the next voucher number from the API
  getVoucherNo() {
    this.voucherNumber = null;
    
    return this.http.get('masters/generate_order_no/?type=JV').subscribe(
      (res: any) => {
        console.log('Voucher API response:', res);
        if (res?.data?.order_number) {
          this.voucherNumber = res.data.order_number;
          console.log('Setting voucher number to:', this.voucherNumber);
          
          // Update the nested model if it exists
          if (this.formConfig?.model?.journal_voucher) {
            this.formConfig.model.journal_voucher.voucher_no = this.voucherNumber;
          }
          
          // Update form control if it exists (nested path)
          if (this.journalVoucherForm?.form) {
            const voucherNoControl = this.journalVoucherForm.form.get('journal_voucher.voucher_no');
            if (voucherNoControl) {
              voucherNoControl.setValue(this.voucherNumber);
            }
          }
          
          this.cdr.detectChanges();
        }
      },
      error => {
        console.error('Error getting voucher number:', error);
      }
    );
  }

  // Load expense claims for the pull from expense claim dropdown
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
      error => {
        console.error('Error loading expense claims:', error);
      }
    );
  }

  // Pull expense claim data
  pullExpenseClaim() {
    if (!this.selectedExpenseClaimId) {
      return;
    }

    this.http.get(`finance/journal_vouchers/pull_expense_claim/${this.selectedExpenseClaimId}/`).subscribe(
      (res: any) => {
        if (res?.data) {
          // Pre-populate the form with expense claim data
          const expenseData = res.data;
          
          if (this.formConfig?.model) {
            // Update lines from expense claim
            if (expenseData.lines && expenseData.lines.length > 0) {
              this.formConfig.model.voucher_lines = expenseData.lines.map((line: any) => ({
                ledger_account: line.ledger_account,
                ledger_account_id: line.ledger_account_id,
                entry_type: line.entry_type || 'Debit',
                amount: line.amount || 0,
                customer: line.customer,
                customer_id: line.customer_id,
                remark: line.remark || ''
              }));
            }
            
            // Update narration if available
            if (expenseData.narration && this.formConfig.model.journal_voucher) {
              this.formConfig.model.journal_voucher.narration = expenseData.narration;
            }
            
            this.calculateTotals();
            this.cdr.detectChanges();
          }
        }
      },
      error => {
        console.error('Error pulling expense claim:', error);
      }
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

  // Calculate total debit and credit
  calculateTotals() {
    this.totalDebit = 0;
    this.totalCredit = 0;
    
    if (this.formConfig?.model?.voucher_lines) {
      this.formConfig.model.voucher_lines.forEach((line: any) => {
        const amount = parseFloat(line.amount) || 0;
        if (line.entry_type === 'Debit') {
          this.totalDebit += amount;
        } else if (line.entry_type === 'Credit') {
          this.totalCredit += amount;
        }
      });
    }
    
    // Update model totals
    if (this.formConfig?.model?.journal_voucher) {
      this.formConfig.model.journal_voucher.total_debit = this.totalDebit;
      this.formConfig.model.journal_voucher.total_credit = this.totalCredit;
    }
  }

  // Clear subscriptions
  clearSubscriptions() {
    this.subscriptions.forEach(sub => {
      try { sub.unsubscribe(); } catch (e) { /* ignore */ }
    });
    this.subscriptions = [];
  }

  editJournalVoucher(event: any) {
    this.JournalVoucherEditID = event;
    this.clearSubscriptions();
    
    this.http.get('finance/journal_vouchers/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'journal_voucher_id';
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['journal_voucher_id'] = this.JournalVoucherEditID;
        
        // Sort voucher lines by created_at if available
        if (this.formConfig.model?.voucher_lines && Array.isArray(this.formConfig.model.voucher_lines)) {
          this.formConfig.model.voucher_lines.sort((a: any, b: any) => {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
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
    this.clearSubscriptions();
    this.showForm = true;
    this.totalDebit = 0;
    this.totalCredit = 0;
    this.getVoucherNo();
  }

  // Post voucher to ledger
  postVoucher() {
    if (!this.JournalVoucherEditID) {
      console.error('Cannot post: No voucher ID');
      return;
    }

    this.http.post(`finance/journal_vouchers/${this.JournalVoucherEditID}/post/`, {}).subscribe(
      (res: any) => {
        console.log('Voucher posted successfully:', res);
        alert('Voucher posted to ledger successfully!');
        this.ngOnInit();
      },
      error => {
        console.error('Error posting voucher:', error);
        alert('Error posting voucher: ' + (error.error?.message || 'Unknown error'));
      }
    );
  }

  setFormConfig() {
    this.clearSubscriptions();
    this.JournalVoucherEditID = null;
    
    this.formConfig = {
      url: "finance/journal_vouchers/",
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'voucher_lines',
          type: 'script',
          value: 'data.voucher_lines.filter(line => line.ledger_account?.ledger_account_id || line.ledger_account_id).map(line => ({...line, ledger_account_id: line.ledger_account?.ledger_account_id || line.ledger_account_id, customer_id: line.customer?.customer_id || line.customer_id, vendor_id: line.vendor?.vendor_id || line.vendor_id, employee_id: line.employee?.employee_id || line.employee_id}))'
        }
      ],
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
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
        voucher_lines: [{}, {}, {}, {}, {}],
        attachments: []
      },
      fields: [
        // Header Section - journal_voucher
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          key: 'journal_voucher',
          fieldGroup: [
            {
              key: 'voucher_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Date',
                placeholder: 'Select date',
                required: true,
              }
            },
            {
              key: 'voucher_no',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Voucher No',
                placeholder: 'Enter Voucher No',
                required: false,
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
              className: 'col-md-4 col-sm-6 col-12',
              defaultValue: 'Journal',
              templateOptions: {
                label: 'Voucher Type',
                required: true,
                options: [
                  { value: 'Journal', label: 'Journal' },
                  { value: 'Contra', label: 'Contra' },
                  { value: 'Receipt', label: 'Receipt' },
                  { value: 'Payment', label: 'Payment' },
                  { value: 'DebitNote', label: 'Debit Note' },
                  { value: 'CreditNote', label: 'Credit Note' }
                ]
              }
            }
          ]
        },
        // Voucher Lines (Table)
        {
          key: 'voucher_lines',
          type: 'table',
          className: 'custom-form-list product-table',
          templateOptions: {
            title: 'Journal Voucher Lines',
            addText: 'Add Line',
            tableCols: [
              { name: 'ledger_account', label: 'Ledger Account' },
              { name: 'is_panel', label: 'Panel' },
              { name: 'is_investment', label: 'Investment' },
              { name: 'customer', label: 'Party (Customer)' },
              { name: 'entry_type', label: 'Debit/Credit' },
              { name: 'amount', label: 'Amount' },
              { name: 'bill_no', label: 'Bill No' },
              { name: 'tds_applicable', label: 'TDS' },
              { name: 'remark', label: 'Remark' },
              { name: 'employee', label: 'Employee' }
            ]
          },
          fieldArray: {
            fieldGroup: [
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
                  lazy: {
                    url: 'customers/ledger_accounts/',
                    lazyOneTime: true
                  },
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
                      this.formConfig.model['voucher_lines'][index]['ledger_account_id'] = data?.ledger_account_id;
                    });
                    this.subscriptions.push(sub);
                  }
                }
              },
              {
                key: 'is_panel',
                type: 'checkbox',
                defaultValue: false,
                templateOptions: {
                  label: 'Panel',
                  hideLabel: true,
                  required: false
                }
              },
              {
                key: 'is_investment',
                type: 'checkbox',
                defaultValue: false,
                templateOptions: {
                  label: 'Investment',
                  hideLabel: true,
                  required: false
                }
              },
              {
                key: 'customer',
                type: 'select',
                templateOptions: {
                  label: 'Party (Customer)',
                  dataKey: 'customer_id',
                  dataLabel: 'name',
                  options: [],
                  hideLabel: true,
                  required: false,
                  lazy: {
                    url: 'customers/customers/?summary=true',
                    lazyOneTime: true
                  },
                },
                hooks: {
                  onChanges: (field: any) => {
                    const sub = field.formControl.valueChanges.pipe(
                      debounceTime(50),
                      distinctUntilChanged((a: any, b: any) => a?.customer_id === b?.customer_id)
                    ).subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['voucher_lines'][index]) {
                        this.formConfig.model['voucher_lines'][index] = {};
                      }
                      this.formConfig.model['voucher_lines'][index]['customer_id'] = data?.customer_id;
                    });
                    this.subscriptions.push(sub);
                  }
                }
              },
              {
                key: 'entry_type',
                type: 'select',
                defaultValue: 'Debit',
                templateOptions: {
                  label: 'Debit/Credit',
                  hideLabel: true,
                  required: false,
                  options: [
                    { value: 'Debit', label: 'Debit' },
                    { value: 'Credit', label: 'Credit' }
                  ]
                },
                hooks: {
                  onChanges: (field: any) => {
                    const sub = field.formControl.valueChanges.pipe(
                      debounceTime(100)
                    ).subscribe(() => {
                      this.calculateTotals();
                      this.cdr.detectChanges();
                    });
                    this.subscriptions.push(sub);
                  }
                }
              },
              {
                key: 'amount',
                type: 'input',
                defaultValue: 0,
                templateOptions: {
                  label: 'Amount',
                  type: 'number',
                  placeholder: '₹0.00',
                  hideLabel: true,
                  required: false
                },
                hooks: {
                  onChanges: (field: any) => {
                    const sub = field.formControl.valueChanges.pipe(
                      debounceTime(100)
                    ).subscribe(() => {
                      this.calculateTotals();
                      this.cdr.detectChanges();
                    });
                    this.subscriptions.push(sub);
                  }
                }
              },
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
              {
                key: 'tds_applicable',
                type: 'checkbox',
                defaultValue: false,
                templateOptions: {
                  label: 'TDS',
                  hideLabel: true,
                  required: false
                }
              },
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
                  lazy: {
                    url: 'hrms/employees/',
                    lazyOneTime: true
                  },
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
        // Narration and Attachments Section
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
