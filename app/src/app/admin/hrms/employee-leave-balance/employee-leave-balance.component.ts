import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { EmployeeLeaveBalanceListComponent } from './employee-leave-balance-list/employee-leave-balance-list.component';

@Component({
  selector: 'app-employee-leave-balance',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule,EmployeeLeaveBalanceListComponent],
  templateUrl: './employee-leave-balance.component.html',
  styleUrls: ['./employee-leave-balance.component.scss']
})
export class EmployeeLeaveBalanceComponent {
  showEmployeeLeaveBalanceComponentList: boolean = false;
  showForm: boolean = false;
  EmployeeLeaveBalanceComponentEditID: any; 

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showEmployeeLeaveBalanceComponentList = false;
    this.showForm = true;
    this.EmployeeLeaveBalanceComponentEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editEmployeeLeaveBalanceComponent(event) {
    console.log('event', event);
    this.EmployeeLeaveBalanceComponentEditID = event;
    this.http.get('hrms/employee_leave_balance/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'balance_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };

  showEmployeeLeaveBalanceComponentListFn() {
    this.showEmployeeLeaveBalanceComponentList = true;
  };

  setFormConfig() {
    this.EmployeeLeaveBalanceComponentEditID = null;
    this.formConfig = {
      url: "hrms/employee_leave_balance/",
      // title: 'leads',
      formState: {
        viewMode: false,
      },
      showActionBtn : true,
      exParams: [
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
        },
        {
          key: 'leave_type_id',
          type: 'script',
          value: 'data.leave_type.leave_type_id'
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
          fieldGroupClassName: "ant-row custom-form-block",
          fieldGroup: [
            {
              key: 'employee',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Employee',
                dataKey: 'employee_id',
                dataLabel: "first_name",
                options: [],
                lazy: {
                  url: 'hrms/employees/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'leave_type',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Leave Type',
                dataKey: 'leave_type_id',
                dataLabel: "leave_type_name",
                options: [],
                lazy: {
                  url: 'hrms/leave_types/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'leave_balance',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Leave Balance',
                required: true,
                placeholder: 'Enter Leave Balance',
              }
            },
            {
              key: 'year',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Year',
                placeholder: 'Enter Year',
                required: true,
              }
            },
          ]
        }
      ]
    }
  }
}

