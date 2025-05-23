import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { ChartOfAccountsListComponent } from './chart-of-accounts-list/chart-of-accounts-list.component';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-chart-of-accounts',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, ChartOfAccountsListComponent],
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.scss']
})
export class ChartOfAccountsComponent {
  showChartOfAccountsList: boolean = false;
  showForm: boolean = false;
  ChartOfAccountsEditID: any;
  @ViewChild(ChartOfAccountsListComponent) ChartOfAccountsListComponent!: ChartOfAccountsListComponent;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showChartOfAccountsList = false;
    this.showForm = true;
    this.ChartOfAccountsEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editChartOfAccounts(event) {
    console.log('event', event);
    this.ChartOfAccountsEditID = event;
    this.http.get('finance/chart_of_accounts/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'account_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };


  showChartOfAccountsListFn() {
    this.showChartOfAccountsList = true;
    this.ChartOfAccountsListComponent?.refreshTable();
  };

  setFormConfig() {
    this.ChartOfAccountsEditID = null;
    this.formConfig = {
      url: "finance/chart_of_accounts/",
      // title: 'warehouses',
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'parent_account_id',
          type: 'script',
          value: 'data.parent_account.account_id'
        },
        {
          key: 'bank_account_id',
          type: 'script',
          value: 'data.bank_account.bank_account_id'
        },
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
      model:{},	  
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          fieldGroup: [	  
            {
              key: 'account_code',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Account Code',
                placeholder: 'Enter Account Code',
                required: true,
              }
            },
            {
              key: 'account_name',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Account Name',
                placeholder: 'Enter Account Name',
                required: true,
              }
            },
            {
              key: 'account_type',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Account Type',
                placeholder: 'Select Account Type',
                required: true,
                options: [
                  { value: 'Asset', label: 'Asset' },
                  { value: 'Liability', label: 'Liability' },
                  { value: 'Equity', label: 'Equity' },
                  { value: 'Revenue', label: 'Revenue' },
                  { value: 'Expense', label: 'Expense' },
                ]
              }
            },
            {
              key: 'parent_account',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Parent Account',
                dataKey: 'parent_account_id',
                dataLabel: "account_name",
                options: [],
                lazy: {
                  url: 'finance/chart_of_accounts/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'bank_account',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Bank Account',
                dataKey: 'bank_account_id',
                dataLabel: "bank_name",
                options: [],
                lazy: {
                  url: 'finance/bank_accounts/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'is_active',
              type: 'checkbox',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Is Active',
                required: false,
              }
            }
          ]
        }
      ]
    }
  }
}

