import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { RemindersListComponent } from './reminders-list/reminders-list.component';

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule, RemindersListComponent],
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss']
})
export class RemindersComponent {
  showRemindersList: boolean = false;
  showForm: boolean = false;
  RemindersEditID: any;
  @ViewChild(RemindersListComponent) RemindersListComponent!: RemindersListComponent;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showRemindersList = false;
    this.showForm = true;
    this.RemindersEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);
    this.formConfig.fields[1].hide = true; // log_action hide = ture


  };
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editReminders(event) {
    this.RemindersEditID = event;
    this.http.get('reminders/reminders/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;
        this.formConfig.pkId = 'reminder_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['reminder_id'] = this.RemindersEditID;
        this.showForm = true;
        this.formConfig.fields[2].hide = false; // log_action hide = ture

      }
    })
    this.hide();
  };

  showRemindersListFn() {
    this.showRemindersList = true;
    this.RemindersListComponent?.refreshTable();
  };

  setFormConfig() {
    this.RemindersEditID = null;

    // const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    let currentUser: any = {};
    const rawUser = localStorage.getItem('currentUser');
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        currentUser = parsed.data ? parsed.data : parsed; // handle both cases
      } catch (e) {
        console.error("Invalid currentUser in localStorage", e);
      }
    }



  this.http.get<any>('reminders/notification_methods/').subscribe((res: any) => {
      const notificationMethodId = res && res.length > 0 ? res[0].method_id : null;
      this.formConfig = {
        url: "reminders/reminders/",
        // title: 'Reminders',
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
        model:{
          reminders: {},
          // task_comments: [{}],
          reminder_recipients: [{
            recipient_user: currentUser.user_id,   // auto-fill
            recipient_email: currentUser.email,    // auto-fill
            notification_method: notificationMethodId          // default or backend will set
          }
        ],
          reminder_logs: {}
        },
        fields: [
          {
            fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
            key: 'reminders',
            fieldGroup: [
              {
                key: 'reminder_type',
                type: 'select',
                className: 'col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Reminder Types',
                  dataKey: 'reminder_type_id',
                  dataLabel: 'type_name',
                  options: [],
                  lazy: {
                    url: 'reminders/reminder_types/',
                    lazyOneTime: true
                  },
                  required: true
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      if (this.formConfig && this.formConfig.model && this.formConfig.model['reminders']) {
                        this.formConfig.model['reminders']['reminder_type_id'] = data.reminder_type_id;
                      } else {
                        console.error('Form config or Reminder Types data model is not defined.');
                      }
                    });
                  }
                }
              },
              {
                key: 'subject',
                type: 'input',
                className: 'col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Subject',
                  placeholder: 'Enter Subject',
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
              },
              {
                key: 'reminder_date',
                type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
                className: 'col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Reminder Date',
                  type: 'datetime-local',  // Use datetime-local for both date and time input
                  placeholder: 'Select Reminder Date and Time',
                  required: true,
                }
              },
              // {
              //   key: 'is_recurring',
              //   type: 'checkbox',
              //   className: 'col-md-4 col-sm-6 col-12',
              //   templateOptions: {
              //     label: 'Is Recurring',
              //     required: false,
              //   }
              // },
              // {
              //   key: 'recurring_frequency',
              //   type: 'select',
              //   className: 'col-md-4 col-sm-6 col-12',
              //   templateOptions: {
              //     label: 'Recurring Frequency',
              //     placeholder: 'Select Recurring Frequency',
              //     required: true,
              //     options: [
              //       { value: 'Daily', label: 'Daily' },
              //       { value: 'Monthly', label: 'Monthly' },
              //       { value: 'Weekly', label: 'Weekly' },
              //       { value: 'Yearly', label: 'Yearly' },
              //     ]
              //   }
              // },
            ]
          },
          // end of reminders

          // start of reminder_recipients keys
          {
            key: 'reminder_recipients',
            type: 'table',
            className: 'custom-form-list product-table',
            templateOptions: {
              title: 'Reminder Recipients',
              addText: 'Add Recipients',
              tableCols: [
                { name: 'recipient_user', label: 'Recipient User' },
                { name: 'recipient_email', label: 'Recipient Email' },
                { name: 'notification_method', label: 'Notification Method' }
              ]
            },
            fieldArray: {
              fieldGroup: [
                {
                  key: 'recipient_user',
                  type: 'select',
                  templateOptions: {
                    label: 'Recipient User',
                    dataKey: 'user_id',
                    dataLabel: "name",
                    options: [],
                    hideLabel: true,
                    required: true,
                    lazy: {
                      url: 'users/user/',
                      lazyOneTime: true
                    }
                  },
                  hooks: {
                    onInit: (field: any) => {
                      field.formControl.valueChanges.subscribe(data => {
                        const index = field.parent.key; // Get the index of the current row in reminder_recipients
                
                        if (data && data.employee_id) {
                          this.formConfig.model['reminder_recipients'][index]['recipient_user_id'] = data.employee_id;
                        }
                
                        // Check if data.email exists and set the email field
                        if (data.email) {
                          field.form.controls.recipient_email.setValue(data.email);
                        } else {
                          // Optionally clear the email field if no email is found
                          field.form.controls.recipient_email.setValue('');
                        }
                      });
                    }
                  }
                },
                {
                  key: 'recipient_email',
                  type: 'input',
                  templateOptions: {
                    label: 'Recipient Email',
                    dataKey: 'email',
                    placeholder: 'Enter Email',
                    hideLabel: true,
                    required: true,
                  },
                  hooks: {
                    onInit: (field: any) => { }
                  }
                },
                {
                  key: 'notification_method',
                  type: 'select',
                  templateOptions: {
                    label: 'Notification Method',
                    dataKey: 'method_id',
                    dataLabel: 'method_name',
                    options: [],
                    hideLabel: true,
                    required: true,
                    lazy: {
                      url: 'reminders/notification_methods/',
                      lazyOneTime: true
                    },
                  },
                  hooks: {
                    onChanges: (field: any) => {
                      field.formControl.valueChanges.subscribe((data: any) => {
                        const index = field.parent.key; // Get the index of the current row in reminder_recipients
                        
                        if (data && data.method_id) {
                          // Ensure that reminder_recipients is properly initialized
                          if (this.formConfig && this.formConfig.model && this.formConfig.model['reminder_recipients']) {
                            if (!this.formConfig.model['reminder_recipients'][index]) {
                              this.formConfig.model['reminder_recipients'][index] = {};
                            }
                            this.formConfig.model['reminder_recipients'][index]['notification_method_id'] = data.method_id;
                          } else {
                            console.error('Form config or reminder_recipients data model is not defined.');
                          }
                        }
                      });
                    }
                  }
                },
              ]
            }
          },
          // end of reminder_recipients keys

          // start of reminder_logs keys
          {
            fieldGroupClassName: "ant-row custom-form-block",
            key: 'reminder_logs',
            fieldGroup: [
              {
                key: 'log_action',
                type: 'select',
                className: 'col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Log Action',
                  placeholder: 'Select Log Action',
                  required: true,
                  options: [
                    { value: 'Cancelled', label: 'Cancelled' },
                    { value: 'Created', label: 'Created' },
                    { value: 'Dismissed', label: 'Dismissed' },
                    { value: 'Rescheduled', label: 'Rescheduled' },
                    { value: 'Viewed', label: 'Viewed' },
                  ]
                }
              },
            ]
          },
          // end of reminder_logs keys
        ]
      }
  });
}
}


// setFormConfig() {
//   this.RemindersEditID = null;

//   const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
//   console.log("Current user data : ", currentUser)
//   // first fetch notification methods
//   this.http.get<any>('reminders/notification_methods/').subscribe((res: any) => {
//     const notificationMethodId = res && res.length > 0 ? res[0].method_id : null;

//     this.formConfig = {
//       url: "reminders/reminders/",
//       formState: {
//         viewMode: false,
//       },
//       showActionBtn: true,
//       exParams: [],
//       submit: {
//         label: 'Submit',
//         submittedFn: () => this.ngOnInit()
//       },
//       reset: {
//         resetFn: () => {
//           this.ngOnInit();
//         }
//       },
//       model: {
//         reminders: {},
//         reminder_recipients: [
//           {
//             recipient_user: currentUser.user_id,      // auto-fill
//             recipient_email: currentUser.email,       // auto-fill
//             notification_method: notificationMethodId // auto-fill from FK
//           }
//         ],
//         reminder_logs: {}
//       },
//       fields: [
//         {
//           fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
//           key: 'reminders',
//           fieldGroup: [
//             {
//               key: 'reminder_type',
//               type: 'select',
//               className: 'col-md-4 col-sm-6 col-12',
//               templateOptions: {
//                 label: 'Reminder Types',
//                 dataKey: 'reminder_type_id',
//                 dataLabel: 'type_name',
//                 options: [],
//                 lazy: {
//                   url: 'reminders/reminder_types/',
//                   lazyOneTime: true
//                 },
//                 required: true
//               },
//               hooks: {
//                 onChanges: (field: any) => {
//                   field.formControl.valueChanges.subscribe((data: any) => {
//                     if (this.formConfig?.model?.['reminders']) {
//                       this.formConfig.model['reminders']['reminder_type_id'] = data.reminder_type_id;
//                     } else {
//                       console.error('Form config or Reminder Types data model is not defined.');
//                     }
//                   });
//                 }
//               }
//             },
//             {
//               key: 'subject',
//               type: 'input',
//               className: 'col-md-4 col-sm-6 col-12',
//               templateOptions: {
//                 label: 'Subject',
//                 placeholder: 'Enter Subject',
//                 required: true,
//               }
//             },
//             {
//               key: 'description',
//               type: 'textarea',
//               className: 'col-md-4 col-sm-6 col-12',
//               templateOptions: {
//                 label: 'Description',
//                 placeholder: 'Enter Description',
//                 required: false,
//               }
//             },
//             {
//               key: 'reminder_date',
//               type: 'input',
//               className: 'col-md-4 col-sm-6 col-12',
//               templateOptions: {
//                 label: 'Reminder Date',
//                 type: 'datetime-local',
//                 placeholder: 'Select Reminder Date and Time',
//                 required: true,
//               }
//             },
//           ]
//         },
//         // 👇 recipients form stays hidden, but backend gets values
//         {
//           key: 'reminder_recipients',
//           type: 'table',
//           className: 'custom-form-list product-table',
//           hideExpression: true,
//           templateOptions: {
//             title: 'Reminder Recipients',
//             addText: 'Add Recipients',
//             tableCols: [
//               { name: 'recipient_user', label: 'Recipient User' },
//               { name: 'recipient_email', label: 'Recipient Email' },
//               { name: 'notification_method', label: 'Notification Method' }
//             ]
//           },
//           fieldArray: { fieldGroup: [] }
//         },
//         {
//           fieldGroupClassName: "ant-row custom-form-block",
//           key: 'reminder_logs',
//           fieldGroup: [
//             {
//               key: 'log_action',
//               type: 'select',
//               className: 'col-md-4 col-sm-6 col-12',
//               templateOptions: {
//                 label: 'Log Action',
//                 placeholder: 'Select Log Action',
//                 required: true,
//                 options: [
//                   { value: 'Cancelled', label: 'Cancelled' },
//                   { value: 'Created', label: 'Created' },
//                   { value: 'Dismissed', label: 'Dismissed' },
//                   { value: 'Rescheduled', label: 'Rescheduled' },
//                   { value: 'Viewed', label: 'Viewed' },
//                 ]
//               }
//             },
//           ]
//         }
//       ]
//     };
//   });
// }
// }
