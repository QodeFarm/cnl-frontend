import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ExpenseCategoryListComponent } from './expense-category-list/expense-category-list.component';

@Component({
  selector: 'app-expense-category',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, ExpenseCategoryListComponent],
  templateUrl: './expense-category.component.html',
  styleUrls: ['./expense-category.component.scss']
})
export class ExpenseCategoryComponent {
  showExpenseCategoryList: boolean = false;
  showForm: boolean = true;
  ExpenseCategoryEditID: any;
  @ViewChild(ExpenseCategoryListComponent) ExpenseCategoryListComponent!: ExpenseCategoryListComponent;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showExpenseCategoryList = false;
    this.showForm = true;
    this.ExpenseCategoryEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);
  };
  
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editExpenseCategory(event) {
    console.log('event', event);
    this.ExpenseCategoryEditID = event;
    this.http.get('finance/expense_categories/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'category_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };

  showExpenseCategoryListFn() {
    this.showExpenseCategoryList = true;
    this.ExpenseCategoryListComponent?.refreshTable();
  };  setFormConfig() {
    this.ExpenseCategoryEditID = null;
    this.formConfig = {
      url: "finance/expense_categories/",
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
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          fieldGroup: [	  
            {
              key: 'category_name',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Category Name',
                placeholder: 'Enter Category Name',
                required: true,
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
            },            {
              key: 'account',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Chart of Account',
                dataKey: 'account_id',
                dataLabel: 'account_name',
                options: [],
                lazy: {
                  url: 'finance/chart_of_accounts/',
                  lazyOneTime: true
                },
                required: false
              },
              // hooks: {
              //   onInit: (field: any) => {
              //     field.formControl.valueChanges.subscribe(data => {
              //       if (data && data.account_id) {
              //         this.formConfig.model['account_id'] = data.account_id;
              //       }
              //     });
              //   }
              // } 
            },
            {
              key: 'is_active',
              type: 'checkbox',
              className: 'col-md-4 col-sm-6 col-12',
              defaultValue: true,
              templateOptions: {
                label: 'Active',
                required: false,
              }
            }
          ]
        }
      ]
    }
  }
}
