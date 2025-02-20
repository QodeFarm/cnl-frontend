import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { UserService } from 'src/app/services/user.service';  // Import the UserService

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, TasksListComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  showTasksList: boolean = false;
  showForm: boolean = false;
  TasksEditID: any;
  formConfig: TaFormConfig = {};
  @ViewChild(TasksListComponent) TasksListComponent!: TasksListComponent;

  // constructor(private http: HttpClient) {}
  constructor(private http: HttpClient, private userService: UserService) { }  // Inject UserService

  set_default_status_id(): any {
    return (this.http.get('masters/statuses/').subscribe((res: any) => {
      if (res && res.data) {
        const key = 'status_name';
        const value = 'Open';
        const filteredDataSet = res.data.filter((item: any) => item[key] === value);
        const status_id = filteredDataSet[0].status_id;
        this.formConfig.model['task']['status_id'] = status_id; // set default is 'Open'
      }
    }));
  };

  ngOnInit() {
    this.showTasksList = false;
    this.showForm = false;
    this.TasksEditID = null;
    // Set form config
    this.setFormConfig();
    this.set_default_status_id(); // lead_status_id = 'Open'
    this.formConfig.fields[0].fieldGroup[7].hide = true;

    // Fetch the logged-in user's ID and auto-fill the task_comments
    const userId = this.userService.getUserId();  // Fetch user ID here
    if (userId) {
      this.formConfig.model['task_comments'] = [{
        user_id: userId,  // Set user_id in the task_comments
        comment_text: '',  // Initialize with an empty comment text
      }];
    }

    console.log('this.formConfig', this.formConfig);
  }

  hide() {
    document.getElementById('modalClose').click();
  }

  editTasks(event) {
    console.log('event', event);
    this.TasksEditID = event;
    this.http.get('tasks/task/' + event).subscribe((res: any) => {
      console.log('--------> res ', res);
      if (res && res.data) {
        this.formConfig.model = res.data;

        // Check if the task was assigned to a user or a group and set the selectionType
        if (res.data['task']['user_id']) {
          this.formConfig.model['task']['selectionType'] = 'user';
          this.formConfig.model['task']['user_id'] = res.data['task']['user_id'];  // Set user_id
        } else if (res.data['task']['group_id']) {
          this.formConfig.model['task']['selectionType'] = 'group';
          this.formConfig.model['task']['group_id'] = res.data['task']['group_id'];  // Set group_id
        }

        // Fetch the logged-in user's ID
        const userId = this.userService.getUserId();

        if (res.data['task_comments']) {
          this.formConfig.model['task_comments'] = res.data['task_comments'].map(comment => ({
            ...comment,
            comment_text: `By ${comment.user.first_name} ${comment.user.last_name || ''} - ${comment.created_at}
          ${comment.comment_text}`,
            isExisting: true, // Mark as existing comments
          }));

          // Add the current user's comment (assuming empty comment text for now)
          if (userId) {
            this.formConfig.model['task_comments'].push({
              user_id: userId,
              comment_text: '', // Initialize with an empty comment text
              isExisting: false,  // Mark as a new comment
            });
          }
        } else if (userId) {
          // If no task_comments exist, initialize with the current user's comment
          this.formConfig.model['task_comments'] = [{
            user_id: userId,
            comment_text: '',  // Initialize with an empty comment text
            isExisting: false,  // New comment, editable
          }];
        }

        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'task_id';
        // Set labels for update
        this.formConfig.submit.label = 'Update';
        // Show form after setting form values
        this.formConfig.model['task_id'] = this.TasksEditID;
        this.showForm = true;
        this.formConfig.fields[0].fieldGroup[7].hide = false;
      }
    });
    this.hide();
  }

  showTasksListFn() {
    this.showTasksList = true;
    this.TasksListComponent?.refreshTable();
  }

  setFormConfig() {
    this.TasksEditID = null
    this.formConfig = {
      url: 'tasks/task/',
      formState: {
        viewMode: false
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
      model: {
        task: {},
        task_comments: [],
        task_attachments: [],
        task_history: {}
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          key: 'task',
          fieldGroup: [
            {
              key: 'title',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Title',
                placeholder: 'Enter title',
                required: true
              }
            },
            {
              key: 'selectionType',
              type: 'radio',
              className: 'col-md-4 col-sm-6 col-12',
              defaultValue: 'user', // Set default selection to 'user'
              templateOptions: {
                label: 'Assign to',
                options: [
                  { label: 'User', value: 'user' },
                  { label: 'Group', value: 'group' }
                ],
                required: true,
              }
            },
            {
              key: 'user',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              hideExpression: (model) => model.selectionType !== 'user', // Hide if not user selected
              templateOptions: {
                label: 'User',
                dataKey: 'user_id',
                dataLabel: 'first_name',
                options: [], // Options will be loaded via lazy
                lazy: {
                  url: 'users/user/',
                  lazyOneTime: true
                },
                required: true // Required only if 'User' is selected
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['task']) {
                      this.formConfig.model['task']['user_id'] = data.user_id;
                    } else {
                      console.error('Form config or user data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'group',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              hideExpression: (model) => model.selectionType !== 'group', // Hide if not group selected
              templateOptions: {
                label: 'Group',
                dataKey: 'group_id',
                dataLabel: 'group_name',
                options: [], // Options will be loaded via lazy
                lazy: {
                  url: 'masters/user_groups/',
                  lazyOneTime: true
                },
                required: true // Required only if 'Group' is selected
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['task']) {
                      this.formConfig.model['task']['group_id'] = data.group_id;
                    } else {
                      console.error('Form config or group data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'priority',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Priorities',
                dataKey: 'priority_id',
                dataLabel: 'priority_name',
                options: [],
                lazy: {
                  url: 'masters/task_priorities/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['task']) {
                      this.formConfig.model['task']['priority_id'] = data.priority_id;
                    } else {
                      console.error('Form config or priority data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'description',
              type: 'textarea',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter description',
                required: false
              }
            },
            {
              key: 'due_date',
              type: 'date',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                type: 'date',
                label: 'Due date',
                required: false
              }
            },
            {
              key: 'status',
              type: 'select',
              className: 'col-3',
              templateOptions: {
                label: 'Statuses',
                dataKey: 'status_id',
                dataLabel: 'status_name',
                options: [],
                lazy: {
                  url: 'masters/statuses/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['task']) {
                      this.formConfig.model['task']['status_id'] = data.status_id;
                    } else {
                      console.error('Form config or statuses data model is not defined.');
                    }
                  });
                }
              }
            }
          ]
        },
        // end of tasks

        // start of task_comments keys
        {
          className: "tab-form-list",
          type: 'tabs',
          fieldGroup: [
            {
              className: 'col-12 pb-0',
              fieldGroupClassName: "field-no-bottom-space",
              props: {
                label: 'Task Comments'
              },
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      key: 'task_comments',
                      type: 'table',
                      className: 'custom-form-list',
                      templateOptions: {
                        // title: 'Task Comments',
                        addText: 'Add Comments',
                        tableCols: [
                          { name: 'comment_text', label: 'Comment Text' }
                        ]
                      },
                      fieldArray: {
                        fieldGroup: [
                          {
                            key: 'comment_text',
                            type: 'textarea',
                            templateOptions: {
                              label: 'Comment Text',
                              placeholder: 'Enter Comment Text',
                              hideLabel: true,
                              required: true,
                              // Leave out the `readonly` field here
                            },
                            defaultValue: '',  // Set the default value to an empty string for new comments
                            expressionProperties: {
                              'templateOptions.readonly': (model: any, formState: any) => {
                                // Ensure that model is available and check 'isExisting' field safely
                                return model && model['isExisting'] === true;
                              }
                              //   'type': (model: any, formState: any) => {
                              //   // Set the input type based on whether the comment is existing
                              //   return model && model['isExisting'] ? 'text' : 'textarea';
                              // }
                            },
                          }



                        ]
                      }
                    },
                  ]
                }
              ]
            },
            {
              className: 'col-12 p-0',
              props: {
                label: 'Task Attachments'
              },
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      className: 'col-12 custom-form-card-block w-100 p-0',
                      fieldGroup: [
                        // {
                        //   template: '<div class="custom-form-card-title"> Order Attachments </div>',
                        //   fieldGroupClassName: "ant-row",
                        // },
                        {
                          key: 'task_attachments',
                          type: 'file',
                          className: 'ta-cell col-12 col-md-6 custom-file-attachement',
                          props: {
                            "displayStyle": "files",
                            "multiple": true
                          },
                        }
                      ]
                    }
                  ]
                }
              ]
            },
          ]
        },
      ]
    };
  }
}