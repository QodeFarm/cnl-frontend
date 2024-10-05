import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { BankAccountListComponent } from './bank-account-list/bank-account-list.component';

@Component({
  selector: 'app-bank-account',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule, BankAccountListComponent],
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent {
  showBankAccountList: boolean = false;
  showForm: boolean = false;
  BankAccountEditID: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showBankAccountList = false;
    this.showForm = true;
    this.BankAccountEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editBankAccount(event) {
    console.log('event', event);
    this.BankAccountEditID = event;
    this.http.get('finance/bank_accounts/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'bank_account_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };


  showBankAccountListFn() {
    this.showBankAccountList = true;
  };

  setFormConfig() {
    this.BankAccountEditID = null;
    this.formConfig = {
      url: "finance/bank_accounts/",
      // title: 'warehouses',
      formState: {
        viewMode: false,
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
      model:{},	  
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          fieldGroup: [	  
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
              key: 'account_number',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Account Number',
                placeholder: 'Enter Account number',
                required: true,
              }
            },
            {
              key: 'bank_name',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Bank Name',
                placeholder: 'Enter Bank Name',
                required: true,
              }
            },
            {
              key: 'branch_name',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Branch Name',
                placeholder: 'Enter Branch Name',
                required: false,
              }
            },
            {
              key: 'ifsc_code',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'IFSC Code',
                placeholder: 'Enter IFSC Code',
                required: false,
              },
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
                  { value: 'Savings', label: 'Savings' },
                  { value: 'Current', label: 'Current' }
                ]
              }
            },            
            {
              key: 'balance',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Balance',
                placeholder: 'Enter Balance',
                required: true,
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            }
          ]
        }
      ]
    }
  }
}
