import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ExpenseClaimListComponent } from './expense-claim-list/expense-claim-list.component';

@Component({
  selector: 'app-expense-claim',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, ExpenseClaimListComponent],
  templateUrl: './expense-claim.component.html',
  styleUrls: ['./expense-claim.component.scss']
})
export class ExpenseClaimComponent {
  showExpenseClaimList: boolean = false;
  showForm: boolean = false;
  ExpenseClaimEditID: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showExpenseClaimList = false;
    this.showForm = true;
    this.ExpenseClaimEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editExpenseClaim(event) {
    console.log('event', event);
    this.ExpenseClaimEditID = event;
    this.http.get('finance/expense_claims/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'expense_claim_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };


  showExpenseClaimListFn() {
    this.showExpenseClaimList = true;
  };

  setFormConfig() {
    this.ExpenseClaimEditID = null;
    this.formConfig = {
      url: "finance/expense_claims/",
      // title: 'warehouses',
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
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
              key: 'employee',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Employee',
                dataKey: 'employee',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'hrms/employees/',
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
              key: 'claim_date',
              type: 'date',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Claim Date',
                placeholder: 'Select Claim Date',
                required: true,
              }
            },
            {
              key: 'description',
              type: 'textarea',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter Description',
                required: false,
              }
            },
            {
              key: 'total_amount',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Total Amount',
                placeholder: 'Enter Total Amount',
                required: true,
              }
            },
            {
              key: 'status',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Status',
                placeholder: 'Status',
                required: false,
                options: [
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Approved', label: 'Approved' },
                  { value: 'Rejected', label: 'Rejected' }
                ]
              }
            },
          ]
        }
      ]
    }
  }
}

