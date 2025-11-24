import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TaFormConfig, TaFormComponent } from '@ta/ta-form';
import { JournalEntryListComponent } from './journal-entry-list/journal-entry-list.component';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-journal-entry',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, JournalEntryListComponent],
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.scss']
})
export class JournalEntryComponent implements OnInit {
  showJournalEntryList: boolean = false;
  showForm: boolean = false;
  JournalEntryEditID: any;
  voucherNumber: string | null = null;
  @ViewChild(JournalEntryListComponent) JournalEntryListComponent!: JournalEntryListComponent;
  @ViewChild('journalEntryForm') journalEntryForm!: TaFormComponent;

  // Track subscriptions created inside Formly hooks so we can unsubscribe on re-open
  private ledgerAccountSubscriptions: Subscription[] = [];

  constructor(private http: HttpClient) {}
  
  // Get the next voucher number from the API
  getVoucherNo() {
    this.voucherNumber = null;
    
    // Call API to get voucher number for Journal Entry type JE
    return this.http.get('masters/generate_order_no/?type=JE').subscribe(
      (res: any) => {
        console.log('Voucher API response:', res);
        if (res?.data?.order_number) {
          this.voucherNumber = res.data.order_number;
          console.log('Setting voucher number to:', this.voucherNumber);
          
          // Update the model if it exists
          if (this.formConfig?.model?.journal_entry) {
            this.formConfig.model.journal_entry.voucher_no = this.voucherNumber;
            
            // Update form control if it exists
            if (this.journalEntryForm?.form) {
              const voucherNoControl = this.journalEntryForm.form.get('journal_entry.voucher_no');
              if (voucherNoControl) {
                voucherNoControl.setValue(this.voucherNumber);
                console.log('Form control updated with voucher number');
              }
            }
          }
        }
      },
      error => {
        console.error('Error getting voucher number:', error);
      }
    );
  }
  

  ngOnInit() {
    this.showJournalEntryList = false;
    this.showForm = false;
    this.JournalEntryEditID = null;
    
    // Get voucher number first, then set form config
    // We need to make sure the form config is set up after we get the voucher number
    this.getVoucherNo();
    this.setFormConfig();
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }


  editJournalEntry(event) {
    this.JournalEntryEditID = event;
    // clear previous subscriptions/messages to avoid duplicate handlers
    this.clearLedgerAccountSubscriptions();
    this.http.get('finance/journal_entries/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'journal_entry_id';
        // set labels for update
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['journal_entry_id'] = this.JournalEntryEditID;
        
        // Sort journal entry lines by created_at timestamp to maintain order
        if (this.formConfig.model?.journal_entry_lines && Array.isArray(this.formConfig.model.journal_entry_lines)) {
          this.formConfig.model.journal_entry_lines.sort((a, b) => {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          });
        }
        
        this.showForm = true;
      }
    })
    this.hide();
  };

  // Unsubscribe tracked subscriptions and remove any existing ledger info UI
  clearLedgerAccountSubscriptions() {
    try {
      if (this.ledgerAccountSubscriptions && this.ledgerAccountSubscriptions.length) {
        this.ledgerAccountSubscriptions.forEach(sub => {
          try { sub.unsubscribe(); } catch (e) { /* ignore */ }
        });
      }
    } catch (e) {
      console.warn('Error clearing ledger subscriptions', e);
    }
    this.ledgerAccountSubscriptions = [];
    // remove any existing UI messages (scoped to journal entry table)
    document.querySelectorAll('.custom-form-list.product-table .center-message').forEach(el => el.remove());
  }


  showJournalEntryListFn() {
    this.showJournalEntryList = true;
    this.JournalEntryListComponent?.refreshTable();
  };
  
  showJournalEntryForm() {
    this.JournalEntryEditID = null;
    // clear previous subscriptions/messages when opening a fresh create form
    this.clearLedgerAccountSubscriptions();
    this.showForm = true;
    
    // Get a fresh voucher number when showing the form for a new entry
    this.getVoucherNo();
  }

  // Method to update ledger account info display (similar to sales product info)
  updateLedgerAccountInfo(currentRowIndex: number, ledgerAccount: any) {
    // Select the card wrapper element for Journal Entry Lines table
    const cardWrapper = document.querySelector('.custom-form-list.product-table .ant-card-head-wrapper') as HTMLElement;
    if (cardWrapper) {
      // Remove any existing ledger info displays scoped to journal entry tables
      // (clears duplicates created by multiple subscriptions or rapid calls)
      document.querySelectorAll('.custom-form-list.product-table .center-message').forEach(el => el.remove());
      
      // Create and insert new ledger account info
      const ledgerInfoDiv = document.createElement('div');
      ledgerInfoDiv.classList.add('center-message');
      
      // Fetch balance from account ledger API
      this.fetchLedgerBalance(ledgerAccount.ledger_account_id).subscribe(
        (balance: any) => {
          ledgerAccount.balance = balance || '0.00';
          this.displayLedgerInfo(ledgerInfoDiv, ledgerAccount);
          // Insert at the beginning of card wrapper (like Sales Order)
          cardWrapper.insertAdjacentElement('afterbegin', ledgerInfoDiv);
        },
        (error) => {
          console.warn('Could not fetch ledger balance:', error);
          ledgerAccount.balance = 'N/A';
          this.displayLedgerInfo(ledgerInfoDiv, ledgerAccount);
          cardWrapper.insertAdjacentElement('afterbegin', ledgerInfoDiv);
        }
      );
      
      console.log(`Ledger Account Info Updated for ${ledgerAccount.name}`);
    }
  }

  // Helper method to display ledger info
  displayLedgerInfo(element: HTMLElement, ledgerAccount: any) {
    element.innerHTML = `
      <span style="color: red;">Ledger Account:</span> 
      <span style="color: blue;">${ledgerAccount.name || 'N/A'}</span> | 
      <span style="color: red;">Code:</span> 
      <span style="color: blue;">${ledgerAccount.code || 'N/A'}</span> | 
      <span style="color: red;">Type:</span> 
      <span style="color: blue;">${ledgerAccount.type || 'N/A'}</span> | 
      <span style="color: red;">Balance:</span> 
      <span style="color: blue; font-weight: 600;">${ledgerAccount.balance || '0.00'}</span>
    `;
  }

  // Fetch ledger balance (if API provides individual balance)
  fetchLedgerBalance(ledgerAccountId: string) {
    // This assumes there's an endpoint that returns balance
    // Adjust the URL based on your actual API structure
    return this.http.get(`finance/journal_entry_lines_list/${ledgerAccountId}/`).pipe(
      map((response: any) => {
        // Extract balance from the response and calculate running balance
        if (response && response.data && response.data.length > 0) {
          // Calculate running balance from all transactions
          let runningBalance = 0;
          response.data.forEach((entry: any) => {
            const debit = parseFloat(entry.debit || 0);
            const credit = parseFloat(entry.credit || 0);
            runningBalance += (debit - credit);
          });
          return runningBalance.toFixed(2);
        }
        return '0.00';
      })
    );
  }

  setFormConfig() {
    // clear previous subscriptions/messages when re-creating the form configuration
    this.clearLedgerAccountSubscriptions();
    this.JournalEntryEditID =null
    this.formConfig = {
      url: "finance/journal_entries/",
      // title: 'leads',
      formState: {
        viewMode: false,
        // isEdit: false,
      },
      showActionBtn: true,
      exParams: [],
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
        journal_entry: {},
        journal_entry_lines: [{}],
      },
      fields: [
        //-----------------------------------------journal_entry-----------------------------------//
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          key: 'journal_entry',
          fieldGroup: [
            {
            key: 'voucher_type',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            defaultValue: 'CommonVoucher', 
            templateOptions: {
              label: 'Voucher Type',
              required: true,
              options: [
                { value: 'CommonVoucher', label: 'Common Voucher' },
                { value: 'OtherVoucher', label: 'Other Voucher' },
                { value: 'ExpenseVoucher', label: 'Expense Voucher'},
                { value: 'PaymentVoucher', label: 'Payment Voucher' },
                { value: 'ReceiptVoucher', label: 'Receipt Voucher'}


              ]
            }
          },
            {
              key: 'entry_date',
              type: 'date',
              defaultValue: this.nowDate(),

              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Entry Date',
                placeholder: 'Select date',
                required: true,
                // disabled: true
              },
              hooks: {
                onInit: (field: any) => {}
              },
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
            key: 'cash_bank_posting',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            defaultValue: 'LineWise', 
            templateOptions: {
              label: 'Cash/Bank Posting',
              required: true,
              options: [
                { value: 'Single', label: 'Single' },
                { value: 'LineWise', label: 'Line Wise' }
              ]
            }
          },
          {
            key: 'ref_no',
            type: 'input',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Reference No',
              placeholder: 'Enter Reference No',
              required: false,
            }
          },
            // {
            //   key: 'reference',
            //   type: 'input',
            //   className: 'col-md-4 col-sm-6 col-12',
            //   templateOptions: {
            //     type: 'input',
            //     label: 'Reference',
            //     placeholder: 'Enter Reference',
            //     required: false
            //   },
            //   hooks: {
            //     onInit: (field: any) => {}
            //   }
            // },
            // {
            //   key: 'ledger_account',
            //   type: 'select',
            //   className: 'col-md-4 col-sm-6 col-12',
            //   templateOptions: {
            //     label: 'Cash/Bank A/c ',
            //     dataKey: 'ledger_account_id',
            //     dataLabel: "name",
            //     options: [],
            //     lazy: {
            //       url: 'finance/general_accounts/',
            //       lazyOneTime: true
            //     },
            //     required: true
            //   }
            // }, 
          {
            key: 'ledger_account',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Cash/Bank A/c ',
              dataKey: 'ledger_account_id',
              dataLabel: "name",
              options: [],
              lazy: {
                url: 'finance/general_accounts/',
                lazyOneTime: true,
              },
              required: true
            },
            hooks: {
            onChanges: (field: any) => {
              // debounce and ignore repeated identical selections to avoid duplicate handlers running
              const sub = field.formControl.valueChanges.pipe(
                debounceTime(50),
                distinctUntilChanged((a: any, b: any) => a?.ledger_account_id === b?.ledger_account_id)
              ).subscribe((data: any) => {
                // console.log('ledger_account', data);
                if (this.formConfig && this.formConfig.model && this.formConfig.model['journal_entry']) {
                  this.formConfig.model['journal_entry']['ledger_account_id'] = data.ledger_account_id;
                } else {
                  console.error('Form config or Customer data model is not defined.');
                }
              });
              // track subscription so we can unsubscribe on form reopen
              this.ledgerAccountSubscriptions.push(sub);
            }
          }
          },
            {
              key: 'description',
              type: 'textarea',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter Description',
                required: false,
              }
            }
          ]
        },
        //----------------------------------------- journal_entry_lines  -----------------------------------//
        {
          key: 'journal_entry_lines',
          type: 'table',
          className: 'custom-form-list product-table',
          templateOptions: {
            title: 'Journal Entry Lines',
            addText: 'Add Journal Entry Line',
            tableCols: [
              { name: 'debit', label: 'Debit' },
              { name: 'credit', label: 'Credit' },
              { name: 'description', label: 'Description' },
              { name: 'ledger_account', label: 'Account' }
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'debit',
                type: 'input',
                templateOptions: {
                  label: 'Debit',
                  placeholder: 'Enter Debit',
                  hideLabel: true,
                  required: false
                }
              },
              {
                key: 'credit',
                type: 'input',
                templateOptions: {
                  label: 'Credit',
                  placeholder: 'Enter Credit',
                  hideLabel: true,
                  required: false
                }
              },
              {
                key: 'description',
                type: 'text',
                templateOptions: {
                  label: 'Description',
                  placeholder: 'Enter Description',
                  hideLabel: true,
                  required: false
                }
              },
              // {
              //   key: 'account',
              //   type: 'select',
              //   templateOptions: {
              //     label: 'Account',
              //     dataKey: 'account_id',
              //     dataLabel: 'account_name',
              //     options: [],
              //     hideLabel: true,
              //     required: false,
              //     lazy: {
              //       url: 'finance/chart_of_accounts/',
              //       lazyOneTime: true
              //     },
              //   },
              //   hooks: {
              //     onChanges: (field: any) => {
              //       field.formControl.valueChanges.subscribe((data: any) => {
              //         const index = field.parent.key;
              //         if (!this.formConfig.model['journal_entry_lines'][index]) {
              //           console.error(`account_id at index ${index} is not defined. Initializing...`);
              //           this.formConfig.model['journal_entry_lines'][index] = {};
              //         }

              //         this.formConfig.model['journal_entry_lines'][index]['account_id'] = data.account_id;
              //       });
              //     }
              //   }
              // },
              // {
              //   key: 'customer',
              //   type: 'select',
              //   templateOptions: {
              //     label: 'Customer',
              //     dataKey: 'name',
              //     dataLabel: 'name',
              //     options: [],
              //     hideLabel: true,
              //     required: false,
              //     lazy: {
              //       url: 'customers/customer/',
              //       lazyOneTime: true
              //     },
              //   },
              //   hooks: {
              //     onChanges: (field: any) => {
              //       field.formControl.valueChanges.subscribe((data: any) => {
              //         const index = field.parent.key;
              //         if (!this.formConfig.model['journal_entry_lines'][index]) {
              //           console.error(`customer_id at index ${index} is not defined. Initializing...`);
              //           this.formConfig.model['journal_entry_lines'][index] = {};
              //         }
              //         this.formConfig.model['journal_entry_lines'][index]['customer_id'] = data.customer_id;
              //       });
              //     }
              //   }
              // },

              // {
              //   key: 'vendor',
              //   type: 'select',
              //   templateOptions: {
              //     label: 'Vendor',
              //     dataKey: 'name',
              //     dataLabel: 'name',
              //     options: [],
              //     hideLabel: true,
              //     required: false,
              //     lazy: {
              //       url: 'vendors/vendor_get/',
              //       lazyOneTime: true
              //     },
              //   },
              //   hooks: {
              //     onChanges: (field: any) => {
              //       field.formControl.valueChanges.subscribe((data: any) => {
              //         const index = field.parent.key;
              //         if (!this.formConfig.model['journal_entry_lines'][index]) {
              //           console.error(`vendor_id at index ${index} is not defined. Initializing...`);
              //           this.formConfig.model['journal_entry_lines'][index] = {};
              //         }
              //         this.formConfig.model['journal_entry_lines'][index]['vendor_id'] = data.vendor_id;
              //       });
              //     }
              //   }
              // },
              
               {
                key: 'ledger_account',
                type: 'select',
                templateOptions: {
                  label: 'ledger Account',
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
                    // debounce and guard against duplicate identical emissions
                    const sub = field.formControl.valueChanges.pipe(
                      debounceTime(50),
                      distinctUntilChanged((a: any, b: any) => a?.ledger_account_id === b?.ledger_account_id)
                    ).subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['journal_entry_lines'][index]) {
                        this.formConfig.model['journal_entry_lines'][index] = {};
                      }
                      this.formConfig.model['journal_entry_lines'][index]['ledger_account_id'] = data.ledger_account_id;
                      
                      // Update ledger account info display
                      if (data && data.ledger_account_id) {
                        this.updateLedgerAccountInfo(index, data);
                      }
                    });
                    this.ledgerAccountSubscriptions.push(sub);
                  }
                }
              },
              {
                key: 'customer',
                type: 'select',
                templateOptions: {
                  label: 'Customer',
                  dataKey: 'name',
                  dataLabel: 'name',
                  options: [],
                  hideLabel: true,
                  required: false,
                  lazy: {
                    url: 'customers/customer/',
                    lazyOneTime: true
                  },
                },
                expressionProperties: {
                  'templateOptions.disabled': (model: any, formState: any, field: any) => {
                    // Disable customer if vendor and account are selected
                    return !!(model?.vendor && model?.ledger_account);
                  }
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['journal_entry_lines'][index]) {
                        this.formConfig.model['journal_entry_lines'][index] = {};
                      }
                      this.formConfig.model['journal_entry_lines'][index]['customer_id'] = data.customer_id;
                    });
                  }
                }
              },
              {
                key: 'vendor',
                type: 'select',
                templateOptions: {
                  label: 'Vendor',
                  dataKey: 'name',
                  dataLabel: 'name',
                  options: [],
                  hideLabel: true,
                  required: false,
                  lazy: {
                    url: 'vendors/vendor_get/',
                    lazyOneTime: true
                  },
                },
                expressionProperties: {
                  'templateOptions.disabled': (model: any, formState: any, field: any) => {
                    // Disable vendor if customer and account are selected
                    return !!(model?.customer && model?.ledger_account);
                  }
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['journal_entry_lines'][index]) {
                        this.formConfig.model['journal_entry_lines'][index] = {};
                      }
                      this.formConfig.model['journal_entry_lines'][index]['vendor_id'] = data.vendor_id;
                    });
                  }
                }
              },
            ]
          }
        }
     ]
    }
  }
}