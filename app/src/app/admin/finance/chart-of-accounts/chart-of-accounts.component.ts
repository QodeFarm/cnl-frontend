import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.scss']
})
export class ChartOfAccountsComponent {
  showChartOfAccountsList: boolean = false;
  showForm: boolean = false;
  ChartOfAccountsEditID: any;

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
          fieldGroupClassName: "ant-row custom-form-block",
          fieldGroup: [	  
            {
              key: 'account_code',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Account Code',
                placeholder: 'Enter Account Code',
                required: true,
              }
            },
            {
              key: 'account_name',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Account Name',
                placeholder: 'Enter Account Name',
                required: true,
              }
            },
            {
              key: 'account_type',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
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
              className: 'col-3 pb-3 ps-0',
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
              className: 'col-3 pb-3 ps-0',
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
              className: 'col-3 d-flex align-items-center',
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

