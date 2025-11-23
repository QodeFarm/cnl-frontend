import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { LedgerAccountListComponent } from './ledger-account-list/ledger-account-list.component';

@Component({
  selector: 'app-ledger-accounts',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, LedgerAccountListComponent], 
  templateUrl: './ledger-accounts.component.html',
  styleUrls: ['./ledger-accounts.component.scss']
})
export class LedgerAccountsComponent {
  showLedgerAccountsList: boolean = false;
  showForm: boolean = false;
  LedgerAccountsEditID: any;
  LedgerAccountsListComponent: any;
  @ViewChild(LedgerAccountListComponent) LedgerAccountListComponent!: LedgerAccountListComponent;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.showLedgerAccountsList = false;
    this.showForm = true;
    this.LedgerAccountsEditID = null;
    this.setFormConfig();
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose')?.click();
  }

  editLedgerAccount(event: any) {
    this.LedgerAccountsEditID = event;
    this.http.get('customers/ledger_accounts/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'ledger_account_id';
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    });
    this.hide();
  }

showLedgerAccountsListFn() {
  this.showLedgerAccountsList = true;
  this.LedgerAccountListComponent?.refreshTable();
}

  setFormConfig() {
    this.LedgerAccountsEditID = null;
    this.formConfig = {
      url: 'customers/ledger_accounts/',
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'ledger_group_id',
          type: 'script',
          value: 'data.ledger_group.ledger_group_id'
        },
      ],
      submit: {
        label: 'Submit',
        submittedFn: () => {
          // Clear the form completely and reinitialize
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
              key: 'name',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Code',
                placeholder: 'Auto-generated',
                readonly: true
              },
              hooks: {
                onInit: ((http) => {
                  return (field: any) => {
                    // Only auto-generate for new records (no ledger_account_id and no existing code)
                    if (!field.model?.ledger_account_id && !field.model?.code) {
                      const ledgerGroupId = field.model?.ledger_group_id;
                      
                      if (ledgerGroupId) {
                        const url = `masters/generate_ledger_code/?type=account&parent_id=${ledgerGroupId}`;
                        
                        http.get(url).subscribe((res: any) => {
                          if (res?.data?.code) {
                            field.formControl.setValue(res.data.code);
                            if (field.model) {
                              field.model['code'] = res.data.code;
                            }
                          }
                        }, (error) => {
                          console.error('Error generating code:', error);
                        });
                      }
                    } else if (!field.model?.ledger_account_id && field.model?.code) {
                      // Clear old code if it's a new form but has stale code
                      field.formControl.setValue('');
                      if (field.model) {
                        field.model['code'] = '';
                      }
                    }
                  };
                })(this.http)
              }
            },
            {
              key: 'type',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              defaultValue: 'General', 
              templateOptions: {
                label: 'Type',
                options: [
                  { value: 'Bank', label: 'Bank' },
                  { value: 'Cash', label: 'Cash' },
                  { value: 'General', label: 'General' },
                  // { value: 'Customer', label: 'Customer' },
                  // { value: 'Vendor', label: 'Vendor' },
                ],
                required: true
              }
            },
            {
              key: 'account_no',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Account No',
                type: 'password'
              }
            },
            {
              key: 'rtgs_ifsc_code',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'RTGS IFSC Code',
              }
            },
            {
              key: 'classification',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Classification',
              }
            },
            {
              key: 'address',
              type: 'text',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Address',
              }
            },
            {
              key: 'pan',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'PAN',
              }
            },
            {
              key: 'ledger_group',
              type: 'ledger-group-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Under Group',
                dataKey: 'ledger_group_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'masters/ledger_groups/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: ((http) => {
                  return (field: any) => {
                    field.formControl.valueChanges.subscribe((selectedGroup: any) => {
                      if (selectedGroup && selectedGroup.ledger_group_id) {
                        // Update ledger_group_id in model
                        if (field.model) {
                          field.model['ledger_group_id'] = selectedGroup.ledger_group_id;
                        }
                        
                        // Auto-generate new code
                        const codeField = field.form.get('code');
                        if (codeField) {
                          const url = `masters/generate_ledger_code/?type=account&parent_id=${selectedGroup.ledger_group_id}`;
                          http.get(url).subscribe((res: any) => {
                            if (res?.data?.code) {
                              codeField.setValue(res.data.code);
                              if (field.model) {
                                field.model['code'] = res.data.code;
                              }
                            }
                          }, (error) => {
                            console.error('Error generating code:', error);
                          });
                        }
                      }
                    });
                  };
                })(this.http)
              }
            },
            {
              key: 'tds_applicable',
              type: 'checkbox',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'TDS Applicable'
              }
            },
            {
              key: 'is_subledger',
              type: 'checkbox',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Is Subledger'
              }
            },
            {
              key: 'inactive',
              type: 'checkbox',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Inactive'
              }
            },
            {
              key: 'is_loan_account',
              type: 'checkbox',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Is Loan Account'
              }
            }
          ]
        }
      ]
    }
  }
}