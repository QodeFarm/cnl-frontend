import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { EmployeeSalaryComponentsListComponent } from './employee-salary-components-list/employee-salary-components-list.component';

@Component({
  selector: 'app-employee-salary-components',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule,EmployeeSalaryComponentsListComponent],
  templateUrl: './employee-salary-components.component.html',
  styleUrls: ['./employee-salary-components.component.scss']
})
export class EmployeeSalaryComponentsComponent {
  showEmployeeSalaryComponentsList: boolean = false;
  showForm: boolean = false;
  EmployeeSalaryComponentsEditID: any; 

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showEmployeeSalaryComponentsList = false;
    this.showForm = true;
    this.EmployeeSalaryComponentsEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editEmployeeSalaryComponents(event) {
    console.log('event', event);
    this.EmployeeSalaryComponentsEditID = event;
    this.http.get('hrms/employee_salary_components/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'employee_component_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };

  showEmployeeSalaryComponentsListFn() {
    this.showEmployeeSalaryComponentsList = true;
  };

  setFormConfig() {
    this.EmployeeSalaryComponentsEditID = null;
    this.formConfig = {
      url: "hrms/employee_salary_components/",
      // title: 'leads',
      formState: {
        viewMode: false,
      },
      showActionBtn : true,
      exParams: [
        {
          key: 'component_id',
          type: 'script',
          value: 'data.component.component_id'
        },
        {
          key: 'salary_id',
          type: 'script',
          value: 'data.salary.salary_id'
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
              key: 'component',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Component',
                dataKey: 'component_id',
                dataLabel: "component_name",
                options: [],
                lazy: {
                  url: 'hrms/salary_components/',
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
              key: 'component_amount',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Component Amount',
                placeholder: 'Enter Component Amount',
                type: 'number',
              }
            },
            {
              key: 'salary',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Salary',
                dataKey: 'salary_id',
                dataLabel: "salary_amount",
                options: [],
                lazy: {
                  url: 'hrms/employee_salary/',
                  lazyOneTime: true
                },
                required: true
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

