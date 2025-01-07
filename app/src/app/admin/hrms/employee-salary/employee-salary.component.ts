import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { EmployeeSalaryListComponent } from './employee-salary-list/employee-salary-list.component';


@Component({
  selector: 'app-employee-salary',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule,EmployeeSalaryListComponent],
  templateUrl: './employee-salary.component.html',
  styleUrls: ['./employee-salary.component.scss']
})
export class EmployeeSalaryComponent {
  showEmployeeSalaryList: boolean = false;
  showForm: boolean = false;
  EmployeeSalaryEditID: any; 
  @ViewChild(EmployeeSalaryListComponent) EmployeeSalaryListComponent!: EmployeeSalaryListComponent;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showEmployeeSalaryList = false;
    this.showForm = true;
    this.EmployeeSalaryEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editEmployeeSalary(event) {
    console.log('event', event);
    this.EmployeeSalaryEditID = event;
    this.http.get('hrms/employee_salary/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'salary_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };

  showEmployeeSalaryListFn() {
    this.showEmployeeSalaryList = true;
    this.EmployeeSalaryListComponent?.refreshTable();
  };

  setFormConfig() {
    this.EmployeeSalaryEditID = null;
    this.formConfig = {
      url: "hrms/employee_salary/",
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
              key: 'salary_amount',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Salary Amount',
                placeholder: 'Enter Salary Amount',
                type: 'number',
                required: true,
              }
            },
            {
              key: 'salary_currency',
              type: 'textarea',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Salary Currency',
                placeholder: 'Enter Salary Currency',
                required: true,
              }
            },
            {
              key: 'salary_start_date',
              type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Salary Start Date',
                type: 'date',  // Use date for date-only input
                placeholder: 'Select Salary Start Date and Time',
                required: true,
              }
            },
            {
              key: 'salary_end_date',
              type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Salary End Date',
                type: 'date',  // Use date for date-only input
                placeholder: 'Select Salary End Date and Time',
                required: true,
              }
            },
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
                required: false
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

