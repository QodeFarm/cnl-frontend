import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { JournalEntryListComponent } from './journal-entry-list/journal-entry-list.component';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-journal-entry',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, JournalEntryListComponent],
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.scss']
})
export class JournalEntryComponent {
  showJournalEntryList: boolean = false;
  showForm: boolean = false;
  JournalEntryEditID: any;
  @ViewChild(JournalEntryListComponent) JournalEntryListComponent!: JournalEntryListComponent;

  constructor(private http: HttpClient) {};

  ngOnInit() {
    this.showJournalEntryList = false;
    this.showForm = false;
    this.JournalEntryEditID = null;
    // set form config
    this.setFormConfig();
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editJournalEntry(event) {
    this.JournalEntryEditID = event;
    this.http.get('finance/journal_entries/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'journal_entry_id';
        // set labels for update
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['journal_entry_id'] = this.JournalEntryEditID;
        this.showForm = true;
      }
    })
    this.hide();
  };


  showJournalEntryListFn() {
    this.showJournalEntryList = true;
    this.JournalEntryListComponent?.refreshTable();
  };

  setFormConfig() {
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
          fieldGroup: [{
              key: 'entry_date',
              type: 'date',
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
              key: 'reference',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                type: 'input',
                label: 'Reference',
                placeholder: 'Enter Reference',
                required: false
              },
              hooks: {
                onInit: (field: any) => {}
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
          className: 'custom-form-list',
          templateOptions: {
            title: 'Journal Entry Lines',
            addText: 'Add Journal Entry Line',
            tableCols: [
              { name: 'debit', label: 'Debit' },
              { name: 'credit', label: 'Credit' },
              { name: 'description', label: 'Description' },
              { name: 'account_id', label: 'Account' }
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
              {
                key: 'account',
                type: 'select',
                templateOptions: {
                  label: 'Account',
                  dataKey: 'account_id',
                  dataLabel: 'account_name',
                  options: [],
                  hideLabel: true,
                  required: false,
                  lazy: {
                    url: 'finance/chart_of_accounts/',
                    lazyOneTime: true
                  },
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['journal_entry_lines'][index]) {
                        console.error(`account_id at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['journal_entry_lines'][index] = {};
                      }

                      this.formConfig.model['journal_entry_lines'][index]['account_id'] = data.account_id;
                    });
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
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['journal_entry_lines'][index]) {
                        console.error(`customer_id at index ${index} is not defined. Initializing...`);
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
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['journal_entry_lines'][index]) {
                        console.error(`vendor_id at index ${index} is not defined. Initializing...`);
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