import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild} from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { HelpIconComponent } from '../help/help-icon.component';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-hrms',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule,EmployeeListComponent, HelpIconComponent],
  templateUrl: './hrms.component.html',
  styleUrls: ['./hrms.component.scss']
})

export class EmployeesComponent  implements OnInit {
  showEmployeesList: boolean = false;
  showForm: boolean = false;
  EmployeeEditID: any;
  @ViewChild(EmployeeListComponent) EmployeeListComponent!: EmployeeListComponent;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showEmployeesList = false;
    this.showForm = true;
    this.EmployeeEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editEmployee(event) {
    this.showForm = false;
    console.log('event', event);
    this.EmployeeEditID = event;
    this.http.get('hrms/employees/' + event).subscribe((res: any) => {
      if (res) {
        // this.formConfig.model = res;
        this.formConfig.model = {
          employee: res.data.employee
        };
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'employee_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['employee_id'] = this.EmployeeEditID;
        this.showForm = true;
      }
    })
    this.hide();
  };

  showEmployeesListFn() {
    this.showEmployeesList = true;
    if (this.EmployeeListComponent) {
      if (this.EmployeeListComponent.taTableComponent) {
        this.EmployeeListComponent.taTableComponent.resetFilterValues();
      }
      this.EmployeeListComponent.refreshTable();
    }
  };

generatedUsername: string = '';
generatedPassword: string = '';

// Generate credentials for employee
generateEmployeeCredentials() {
  // if (!this.EmployeeEditID) {
  //   alert('Please save the employee first');
  //   return;
  // }
  
  this.http.post(`hrms/employees/generate-credentials/${this.EmployeeEditID}/`, {}).subscribe(
    (res: any) => {
      if (res.success) {
        // Store generated credentials
        this.generatedUsername = res.username;
        this.generatedPassword = res.password;
        
        // Update form fields
        this.formConfig.model.employee.username = res.username;
        this.formConfig.model.employee.password_display = res.password;
        this.formConfig.model.employee.is_portal_user = true;
        
        // Show the credentials modal
        const modalElement = document.getElementById('credentialsModal');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      } else {
        alert(res.message || 'Error generating credentials');
      }
    },
    (error) => {
      alert('Error generating credentials');
    }
  );
}

// Copy single field to clipboard
copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    this.showToast('Copied to clipboard!');
  });
}

// Copy both username and password
copyAllCredentials() {
  const credentials = `Username: ${this.generatedUsername}\nPassword: ${this.generatedPassword}`;
  navigator.clipboard.writeText(credentials).then(() => {
    this.showToast('All credentials copied to clipboard!');
  });
}

showSuccessToast: boolean = false;
toastMessage: string = '';

// Show toast message
showToast(message: string) {
  this.toastMessage = message;
  this.showSuccessToast = true;
  setTimeout(() => {
    this.showSuccessToast = false;
  }, 3000);
}

// Add this method to hide the credentials modal
hideCredentialsModal() {
  const modalElement = document.getElementById('credentialsModal');
  if (modalElement) {
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
}

// Update your showSendCredentialsPopup method to use the correct modal
// showSendCredentialsPopup() {
//   if (!this.EmployeeEditID) {
//     this.showToast('⚠️ Please save the employee first');
//     return;
//   }
  
//   // Show the send credentials modal
//   const modalElement = document.getElementById('sendCredentialsModal');
//   if (modalElement) {
//     const modal = new (window as any).bootstrap.Modal(modalElement);
//     modal.show();
//   }
// }

// In your employee component .ts file

// Replace the existing sendViaEmail and sendViaWhatsApp methods
sendViaEmail() {
  // Close the modal first
  const modalElement = document.getElementById('sendCredentialsModal');
  if (modalElement) {
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
  }
  
  // Show loading toast
  this.showToast('📧 Sending credentials via email...');
  
  this.http.post(`hrms/employees/send-credentials/${this.EmployeeEditID}/?method=email`, {}).subscribe(
    (res: any) => {
      if (res.success) {
        this.showToast('✅ Credentials sent successfully via email!');
        // Update last_sent timestamp in UI if needed
      } else {
        this.showToast('❌ ' + (res.message || 'Failed to send email'));
      }
    },
    (error) => {
      console.error('Email send error:', error);
      this.showToast('❌ Failed to send email. Please check email configuration.');
    }
  );
}

sendViaWhatsApp() {
  // Close the modal first
  const modalElement = document.getElementById('sendCredentialsModal');
  if (modalElement) {
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
  }
  
  // Check if employee has WhatsApp number
  const phone = this.formConfig?.model?.employee?.phone;
  if (!phone || phone === '+91') {
    this.showToast('⚠️ Please add a valid phone number for the employee first');
    return;
  }
  
  this.showToast('📱 Sending credentials via WhatsApp...');
  
  this.http.post(`hrms/employees/send-credentials/${this.EmployeeEditID}/?method=whatsapp`, {}).subscribe(
    (res: any) => {
      if (res.success) {
        this.showToast('✅ Credentials sent successfully via WhatsApp!');
      } else {
        this.showToast('❌ ' + (res.message || 'Failed to send WhatsApp message'));
      }
    },
    (error) => {
      console.error('WhatsApp send error:', error);
      this.showToast('❌ Failed to send WhatsApp. Please check WhatsApp configuration.');
    }
  );
}

showSendCredentialsPopup() {
  if (!this.EmployeeEditID) {
    this.showToast('⚠️ Please save the employee first');
    return;
  }
  
  // Show the custom modal
  const modalElement = document.getElementById('sendCredentialsModal');
  if (modalElement) {
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }
}

// // Show send credentials popup
// showSendCredentialsPopup() {
//   if (!this.EmployeeEditID) {
//     alert('Please save the employee first');
//     return;
//   }
  
//   const method = confirm('Send credentials via Email?\n\nClick OK for Email, Cancel for WhatsApp');
//   if (method) {
//     this.sendViaEmail();
//   } else {
//     this.sendViaWhatsApp();
//   }
// }

// // Send via email
// sendViaEmail() {
//   this.http.post(`hrms/employees/send-credentials/${this.EmployeeEditID}/?method=email`, {}).subscribe(
//     (res: any) => {
//       alert(res.success ? '✅ Credentials sent via email!' : (res.message || 'Failed to send'));
//     },
//     () => alert('Failed to send email')
//   );
// }

// // Send via WhatsApp
// sendViaWhatsApp() {
//   alert('WhatsApp template under construction. Please use email.');
// }

findField(key: string): any {
  const search = (fields: any[]): any => {
    for (const f of fields) {
      if (f.key === key) return f;
      if (f.fieldGroup) {
        const found = search(f.fieldGroup);
        if (found) return found;
      }
    }
    return null;
  };
  return search(this.formConfig.fields || []);
}


  setFormConfig() {
    this.EmployeeEditID = null;
    this.formConfig = {
      url: "hrms/employees/",
      // title: 'leads',
      formState: {
        viewMode: false,
      },
      showActionBtn : true,
      exParams: [
        {
          key: 'job_type_id',
          type: 'script',
          value: 'data.job_type.job_type_id'
        },
        {
          key: 'designation_id',
          type: 'script',
          value: 'data.designation.designation_id'
        },
        {
          key: 'job_code_id',
          type: 'script',
          value: 'data.job_code.job_code_id'
        },
        {
          key: 'department_id',
          type: 'script',
          value: 'data.department.department_id'
        },
        {
          key: 'shift_id',
          type: 'script',
          value: 'data.shift.shift_id'
        },
        {
          key: 'manager_id',
          type: 'script',
          value: 'data.manager.employee_id'
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
      model:{
        employee:{},
      },
      fields: [
        {
          key:"employee",
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          fieldGroup: [
            {
              key: 'first_name',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'First Name',
                placeholder: 'Enter First Name',
                required: true,
              },
            },
            {
              key: 'last_name',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Last Name',
                placeholder: 'Enter Last Name',
                required: true,
              },
            },
            // {
            //   key: 'phone',
            //   type: 'input',
            //   className: 'col-md-4 col-sm-6 col-12',
            //   templateOptions: {
            //     label: 'Phone',
            //     placeholder: 'Enter with country code',
            //     required: true,
            //   },
            // },
            {
  key: 'phone',
  type: 'input',
  className: 'col-md-4 col-sm-6 col-12',
  templateOptions: {
    label: 'Phone',
    placeholder: 'Enter with country code',
    required: true,
  },
  defaultValue: '+91',
  hooks: {
    onInit: (field) => {
      const currentValue = field.formControl.value;

      if (!currentValue) {
        field.formControl.setValue('+91');
      }
    }
  }
},
            {
              key: 'gender',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Gender',
                required: true,
                options: [
                  { value: 'Female', label: 'Female' },
                  { value: 'Male', label: 'Male' }
                ]
              }
            },
            {
              key: 'job_type',
              type: 'JobTypes-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Job Type',
                dataKey: 'job_type_id',
                dataLabel: "job_type_name",
                options: [],
                lazy: {
                  url: 'hrms/job_types/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['job_type_id'] = data.job_type_id;
                    } else {
                      console.error('Form config or job_type data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'designation',
              type: 'designations-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Designation',
                dataKey: 'designation_id',
                dataLabel: "designation_name",
                options: [],
                lazy: {
                  url: 'hrms/designations/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['designation_id'] = data.designation_id;
                    } else {
                      console.error('Form config or designation data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'job_code',
              type: 'jobCode-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Job Code',
                dataKey: 'job_code_id',
                dataLabel: "job_code",
                options: [],
                lazy: {
                  url: 'hrms/job_codes/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['job_code_id'] = data.job_code_id;
                    } else {
                      console.error('Form config or job_code data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'department',
              type: 'departments-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Department',
                dataKey: 'department_id',
                dataLabel: "department_name",
                options: [],
                lazy: {
                  url: 'hrms/departments/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['department_id'] = data.department_id;
                    } else {
                      console.error('Form config or department data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'shift',
              type: 'shifts-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Shift',
                dataKey: 'shift_id',
                dataLabel: "shift_name",
                options: [],
                lazy: {
                  url: 'hrms/shifts/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['shift_id'] = data.shift_id;
                    } else {
                      console.error('Form config or shift data model is not defined.');
                    }
                  });
                }
              }
            },  
            {
              key: 'manager',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Manager',
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
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['manager_id'] = data.employee_id;
                    } else {
                      console.error('Form config or employee data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'hire_date',
              type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Hire Date',
                type: 'date',  
                placeholder: 'Select Hire Date and Time',
                required: false,
              },
            },
            {
              key: 'email',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Email',
                placeholder: 'Enter Email',
                required: false,
              },
            },
            {
              key: 'address',
              type: 'textarea',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Address',
                placeholder: 'Enter Address',
                required: false,
              },
            },
            {
              key: 'date_of_birth',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Date Of Birth',
                type: 'date',
                placeholder: 'Select Date',
                required: false,
              }
            },
            {
              key: 'nationality',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Nationality',
                placeholder: 'Enter Nationality',
                required: false,
              }
            },
            {
              key: 'emergency_contact',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Emergency Contact',
                placeholder: 'Enter Emergency Contact',
                required: false,
              }
            },
            {
              key: 'emergency_contact_relationship',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Emergency Contact Relationship',
                placeholder: 'Enter Name',
                required: false,
              }
            },
            // Add this at the end of your employee fieldGroup (before closing brackets)

{
  className: 'col-12 mt-3',
  fieldGroupClassName: 'row',
  fieldGroup: [
    {
      className: 'col-12',
      key: 'is_portal_user',
      type: 'checkbox',
      templateOptions: {
        label: 'Enable Employee Portal Access',
        description: 'Allow employee to login and view their data'
      },
      hooks: {
        onChanges: (field: any) => {
          const isEnabled = field.formControl.value;
          const portalFields = ['username', 'password_display'];
          portalFields.forEach(fieldKey => {
            const portalField = this.findField(fieldKey);
            if (portalField) portalField.hide = !isEnabled;
          });
        }
      }
    },
    {
      className: 'col-md-4 col-sm-6 col-12',
      key: 'username',
      type: 'input',
      hide: true,
      templateOptions: {
        label: 'Portal Username',
        placeholder: 'Auto-generated',
        description: 'Leave empty to auto-generate from name'
      }
    },
    {
      className: 'col-md-4 col-sm-6 col-12',
      key: 'password_display',
      type: 'input',
      hide: true,
      templateOptions: {
        label: 'Password',
        readonly: true,
        description: 'Click Generate to create password'
      }
    },
    {
      key: 'password',
      type: 'input',
      hide: true
    }
  ]
},
            {
              className: 'col-12 custom-form-card-block w-100 p-0 govt-id-card',
              fieldGroupClassName: "ant-row row mx-0 mt-2 w-100",
              fieldGroup: [
                {
                  type: 'template',
                  className: 'col-12',
                  template: `
                    <div class="govt-id-header">
                      <div class="govt-id-title"><i class="fas fa-id-card"></i>Identity Documents (Govt. ID)</div>
                      <div class="govt-id-hint">Upload Aadhaar, PAN, Passport or Driving Licence — image or PDF, more than one allowed.</div>
                    </div>
                  `
                },
                {
                  key: 'picture',
                  type: 'file',
                  className: 'ta-cell col-12 custom-file-attachement govt-id-upload',
                  props: {
                    "displayStyle": "files",
                    "multiple": true,
                  },}
              ]
            },
          ],
        },
      ]
    }
  }
}