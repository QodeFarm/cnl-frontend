import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { EmployeeLeavesListComponent } from './employee-leaves-list/employee-leaves-list.component';
import { HelpIconComponent } from '../../help/help-icon.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-leaves',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule,EmployeeLeavesListComponent, HelpIconComponent],
  templateUrl: './employee-leaves.component.html',
  styleUrls: ['./employee-leaves.component.scss']
})

export class EmployeeLeavesComponent implements OnInit {
  showEmployeeLeavesList: boolean = false;
  showForm: boolean = false;
  EmployeeLeavesEditID: any; 
  isEmployeePortal: boolean = false;
  loggedEmployeeId: string = '';
  loggedEmployeeData: any = null;
  
  @ViewChild(EmployeeLeavesListComponent) EmployeeLeavesListComponent!: EmployeeLeavesListComponent;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {};

  // ngOnInit() {
  //   this.route.data.subscribe(data => {
  //     this.isEmployeePortal = data['employeeView'] || false;
      
  //     if (this.isEmployeePortal) {
  //       console.log("We are in the employee logged portal...")
  //       const user = JSON.parse(localStorage.getItem('employee_user') || '{}');
  //       this.loggedEmployeeId = user.id || '';
        
  //       // First fetch employee data, then set form config
  //       this.fetchEmployeeAndSetForm();
  //       // REMOVED: this.setFormConfig(); - Don't call it here, it will be called after fetch
  //     } else {
  //       // Admin mode - normal flow
  //       this.showEmployeeLeavesList = false;
  //       this.showForm = true;
  //       this.EmployeeLeavesEditID = null;
  //       this.setFormConfig();
  //     }
  //   });
  // };

  ngOnInit() {
    // First, check if this is employee portal and get employee data
    this.route.data.subscribe(data => {
      this.isEmployeePortal = data['employeeView'] || false;
      
      if (this.isEmployeePortal) {
        // Get logged-in employee data from localStorage (similar to customer portal)
        const user = JSON.parse(localStorage.getItem('employee_user') || '{}');
        this.loggedEmployeeId = user.id;
        this.loggedEmployeeData = user;
        
        console.log('Employee Portal Mode - Employee ID:', this.loggedEmployeeId);
      }
      
      // Now set form config (after we have the portal mode and employee ID)
      this.showEmployeeLeavesList = false;
      this.showForm = true;
      this.EmployeeLeavesEditID = null;
      this.setFormConfig();
    });
  }

  fetchEmployeeAndSetForm() {
    console.log("logged employee - 1 : ", this.loggedEmployeeId);
    if (this.loggedEmployeeId) {
      console.log("logged employee -2 : ", this.loggedEmployeeId);
      this.http.get(`hrms/employees/${this.loggedEmployeeId}/`).subscribe({
        next: (res: any) => {
          if (res && res.data) {
            const emp = res.data.employee || res.data;
            this.loggedEmployeeData = {
              employee_id: emp.employee_id,
              full_name: `${emp.first_name} ${emp.last_name}`
            };
            
            // Now set form config with employee data
            this.showEmployeeLeavesList = false;
            this.showForm = true;
            this.EmployeeLeavesEditID = null;
            this.setFormConfig();
          }
        },
        error: (err) => {
          console.error('Error fetching employee:', err);
          this.setFormConfig();
        }
      });
    } else {
      this.setFormConfig();
    }
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editEmployeeLeaves(event) {
    this.showForm = false;
    console.log('event', event);
    this.EmployeeLeavesEditID = event;
    this.http.get('hrms/employee_leaves/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = {
          employee_leaves: res.data.employee_leaves,
          leave_approvals: res.data.leave_approvals || {}
        };
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'leave_id';
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['leave_id'] = this.EmployeeLeavesEditID;
        this.showForm = true;
      }
    })
    this.hide();
  };

  showEmployeeLeavesListFn() {
    this.showEmployeeLeavesList = true;
    this.EmployeeLeavesListComponent?.refreshTable();
  };

  setFormConfig() {
    this.EmployeeLeavesEditID = null;
    
    this.formConfig = {
      url: "hrms/employee_leaves/",
      formState: {
        viewMode: false,
      },
      showActionBtn : true,
      exParams: [],
      submit: {
        label: 'Submit',
        submittedFn: () => {
          if (this.isEmployeePortal) {
            this.showEmployeeLeavesList = true;
            this.showForm = false;
            this.EmployeeLeavesListComponent?.refreshTable();
          } else {
            this.ngOnInit();
          }
        }
      },
      reset: {
        resetFn: () => {
          if (this.isEmployeePortal) {
            this.showEmployeeLeavesList = true;
            this.showForm = false;
          } else {
            this.ngOnInit();
          }
        }
      },
      model:{
        employee_leaves: {
          employee_id: this.isEmployeePortal ? this.loggedEmployeeId : undefined
        },
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          key: 'employee_leaves',
          fieldGroup: [
            {
              key: 'employee',
              type: 'select',  // You need to create this custom type OR use 'select'
              className: 'col-md-4 col-sm-6 col-12',
              props: {
                label: 'Employee',
                dataKey: 'employee_id',
                dataLabel: "first_name",
                options: [],
                lazy: {
                  url: this.isEmployeePortal 
                    ? `hrms/employees/${this.loggedEmployeeId}/`  // Single employee for portal
                    : 'hrms/employees/?summary=true',  // All employees for admin
                  lazyOneTime: true
                },
                required: true,
                disabled: this.isEmployeePortal  // Disable for employees
              },
              hooks: {
                onInit: (field: any) => {
                  // For employee portal, auto-set the employee
                  if (this.isEmployeePortal && this.loggedEmployeeId) {
                    // Fetch employee data first
                    this.http.get(`hrms/employees/${this.loggedEmployeeId}/`).subscribe({
                      next: (res: any) => {
                        if (res && res.data) {
                          const emp = res.data.employee || res.data;
                          const employeeData = {
                            employee_id: emp.employee_id,
                            first_name: `${emp.first_name} ${emp.last_name}`,
                            last_name: ''
                          };
                          
                          setTimeout(() => {
                            field.formControl.setValue(employeeData);
                            field.formControl.disable(); // Ensure it's disabled
                            
                            // Update the model
                            if (this.formConfig?.model?.employee_leaves) {
                              this.formConfig.model.employee_leaves.employee_id = emp.employee_id;
                            }
                          }, 500);
                        }
                      },
                      error: (err) => console.error('Error fetching employee:', err)
                    });
                  }

                  // Handle value changes for both modes
                  field.formControl.valueChanges.subscribe(data => {
                    if (data && data.employee_id) {
                      if (this.formConfig?.model?.employee_leaves) {
                        this.formConfig.model.employee_leaves.employee_id = data.employee_id;
                      }
                    }
                  });
                }
              }
            },
            {
              key: 'leave_type',
              type: 'leaveTypes-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
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
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee_leaves']) {
                      this.formConfig.model['employee_leaves']['leave_type_id'] = data?.leave_type_id;
                    }
                  });
                }
              }
            },
            {
              key: 'start_date',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Start Date',
                type: 'date',
                placeholder: 'Select Start Date',
                required: true,
              },
            },
            {
              key: 'end_date',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'End Date',
                type: 'date',
                placeholder: 'Select End Date',
                required: true,
              },
            },
            {
              key: 'comments',
              type: 'textarea',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Comments',
                placeholder: 'Enter Comments',
                required: false,
              }
            },
          ]
        },
      ]
    }
  }
}