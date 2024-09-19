import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent {
  showBudgetList: boolean = false;
  showForm: boolean = false;
  BudgetEditID: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showBudgetList = false;
    this.showForm = true;
    this.BudgetEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editBudget(event) {
    console.log('event', event);
    this.BudgetEditID = event;
    this.http.get('finance/budgets/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'budget_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };


  showBudgetListFn() {
    this.showBudgetList = true;
  };

  setFormConfig() {
    this.BudgetEditID = null;
    this.formConfig = {
      url: "finance/budgets/",
      // title: 'warehouses',
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'account_id',
          type: 'script',
          value: 'data.account.account_id'
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
              key: 'account',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Account',
                dataKey: 'account',
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
                }
              }
            },
            {
              key: 'fiscal_year',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Fiscal Year',
                placeholder: 'Enter Fiscal Year',
                required: true,
              }
            },
            {
              key: 'allocated_amount',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Allocated Amount',
                placeholder: 'Enter Allocated Amount',
                required: true,
              }
            },
            {
              key: 'spent_amount',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Spent Amount',
                placeholder: 'Enter Spent Amount',
                required: false,
              }
            }
          ]
        }
      ]
    }
  }
}
