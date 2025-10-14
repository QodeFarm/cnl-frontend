import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ExpenseItemListComponent } from './expense-item-list/expense-item-list.component';

@Component({
  selector: 'app-expense-item',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, ExpenseItemListComponent],
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.scss']
})
export class ExpenseItemComponent {
  showExpenseItemList: boolean = false;
  showForm: boolean = true;
  ExpenseItemEditID: any;
  @ViewChild(ExpenseItemListComponent) ExpenseItemListComponent!: ExpenseItemListComponent;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showExpenseItemList = false;
    this.showForm = true;
    this.ExpenseItemEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);
  };
  
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editExpenseItem(event) {
    console.log('event', event);
    this.ExpenseItemEditID = event;
    this.http.get('finance/expense_items/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'expense_item_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };

  showExpenseItemListFn() {
    this.showExpenseItemList = true;
    this.ExpenseItemListComponent?.refreshTable();
  };
  setFormConfig() {
    this.ExpenseItemEditID = null;
    this.formConfig = {
      url: "finance/expense_items/",
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'category_id',
          type: 'script',
          value: 'data.category.category_id'
        },
        {
          key: 'vendor_id',
          type: 'script',
          value: 'data.vendor.vendor_id'
        },
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
        },
        {
          key: 'bank_account_id',
          type: 'script',
          value: 'data.bank_account.bank_account_id'
        },
        {
          key: 'tax_id',
          type: 'script',
          value: 'data.tax.tax_id'
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
      model:{},	  
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          fieldGroup: [	  
            {
              key: 'expense_date',
              type: 'date',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Expense Date',
                placeholder: 'Select Expense Date',
                required: true,
              }
            },
            {
              key: 'amount',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Amount',
                placeholder: 'Enter Amount',
                required: true,
                type: 'number'
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
            },            
            {
              key: 'category',
              type: 'expenseCategory-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Expense Category',
                dataKey: 'category_id',
                dataLabel: 'category_name',
                options: [],
                lazy: {
                  url: 'finance/expense_categories/',
                  lazyOneTime: true
                },
                required: true
              }
            },            {
              key: 'vendor',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Vendor',
                dataKey: 'vendor_id',
                dataLabel: 'name',
                options: [],
                lazy: {
                  url: 'vendors/vendors/',
                  lazyOneTime: true
                },
                required: false
              }
            },{
              key: 'employee',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Employee',
                dataKey: 'employee_id',
                dataLabel: 'first_name',
                options: [],
                lazy: {
                  url: 'hrms/employees/?summary=true',
                  lazyOneTime: true
                },
                required: false
              }
            },            {
              key: 'bank_account',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Bank Account',
                dataKey: 'bank_account_id',
                dataLabel: 'bank_name',
                options: [],
                lazy: {
                  url: 'finance/bank_accounts/',
                  lazyOneTime: true
                },
                required: false
              }
            },
            // {
            //   key: 'expense_claim_id',
            //   type: 'select',
            //   className: 'col-md-4 col-sm-6 col-12',
            //   templateOptions: {
            //     label: 'Expense Claim',
            //     dataKey: 'expense_claim_id',
            //     dataLabel: 'expense_claim_id',
            //     options: [],
            //     lazy: {
            //       url: 'finance/expense_claims/',
            //       lazyOneTime: true
            //     },
            //     required: false
            //   }
            // },
            {
              key: 'status',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Status',
                placeholder: 'Status',
                required: false,
                options: [
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Paid', label: 'Paid' },
                  { value: 'Rejected', label: 'Rejected' }
                ]
              }
            },
            {
              key: 'payment_method',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Payment Method',
                placeholder: 'Select Payment Method',
                required: false,
                options: [
                  { value: 'Bank Transfer', label: 'Bank Transfer' },
                  { value: 'Cash', label: 'Cash' },
                  { value: 'Cheque', label: 'Cheque' },
                  { value: 'Credit Card', label: 'Credit Card' }
                ]
              }
            },
            {
              key: 'reference_number',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Reference Number',
                placeholder: 'Enter Reference Number',
                required: false
              }
            },
            {
              key: 'is_taxable',
              type: 'checkbox',
              className: 'col-md-4 col-sm-6 col-12',
              defaultValue: true,
              templateOptions: {
                label: 'Taxable',
                required: false,
              }
            },            {
              key: 'tax',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Tax Configuration',
                dataKey: 'tax_id',
                dataLabel: 'tax_name',
                options: [],
                lazy: {
                  url: 'finance/tax_configurations/',
                  lazyOneTime: true
                },
                required: false
              },
              hideExpression: '!model.is_taxable'
            },
            {
              key: 'tax_amount',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              defaultValue: 0,
              templateOptions: {
                label: 'Tax Amount',
                placeholder: 'Enter Tax Amount',
                required: false,
                type: 'number'
              },
              hideExpression: '!model.is_taxable'
            },
            // {
            //   key: 'is_recurring',
            //   type: 'checkbox',
            //   className: 'col-md-4 col-sm-6 col-12',
            //   defaultValue: false,
            //   templateOptions: {
            //     label: 'Recurring Expense',
            //     required: false,
            //   }
            // },
            // {
            //   key: 'recurring_frequency',
            //   type: 'select',
            //   className: 'col-md-4 col-sm-6 col-12',
            //   templateOptions: {
            //     label: 'Recurring Frequency',
            //     placeholder: 'Select Frequency',
            //     required: false,
            //     options: [
            //       { value: 'Daily', label: 'Daily' },
            //       { value: 'Weekly', label: 'Weekly' },
            //       { value: 'Monthly', label: 'Monthly' },
            //       { value: 'Quarterly', label: 'Quarterly' },
            //       { value: 'Yearly', label: 'Yearly' }
            //     ]
            //   },
            //   hideExpression: '!model.is_recurring'
            // },
            // {
            //   key: 'next_recurrence_date',
            //   type: 'date',
            //   className: 'col-md-4 col-sm-6 col-12',
            //   templateOptions: {
            //     label: 'Next Recurrence Date',
            //     placeholder: 'Select Next Recurrence Date',
            //     required: false,
            //   },
            //   hideExpression: '!model.is_recurring'
            // },
            // {
            //   key: 'receipt_image',
            //   type: 'file',
            //   className: 'col-md-4 col-sm-6 col-12',
            //   templateOptions: {
            //     label: 'Receipt Image',
            //     required: false,
            //   }
            // }
          ]
        }
      ]
    }
  }
}
