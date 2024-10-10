import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TasksListComponent } from './tasks-list/tasks-list.component';

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

  constructor(private http: HttpClient) {}

  set_default_status_id(): any {
    return (this.http.get('master/statuses/').subscribe((res: any) => {
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
          fieldGroupClassName: 'ant-row custom-form-block',
          key: 'task',
          fieldGroup: [
            {
              key: 'title',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                label: 'Title',
                placeholder: 'Enter title',
                required: true
              }
            },
            {
              key: 'selectionType',
              type: 'radio',
              className: 'col-3',
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
              className: 'col-3',
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
              className: 'col-3',
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
              className: 'col-3',
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
              className: 'col-3',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter description',
                required: false
              }
            },
            {
              key: 'due_date',
              type: 'date',
              className: 'col-3',
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
          key: 'task_comments',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Task Comments',
            addText: 'Add Comments',
            tableCols: [
              { name: 'user', label: 'User' },
              { name: 'comment_text', label: 'Comment Text' }
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'user',
                type: 'select',
                templateOptions: {
                  label: 'Select User',
                  dataKey: 'user_id',
                  dataLabel: 'first_name',
                  options: [],
                  hideLabel: true,
                  required: true,
                  lazy: {
                    url: 'users/user',
                    lazyOneTime: true
                  },
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      console.log('user', data);
                      const index = field.parent.key;
                      if (!this.formConfig.model['task_comments'][index]) {
                        console.error(`Task comments at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['task_comments'][index] = {};
                      }

                      this.formConfig.model['task_comments'][index]['user_id'] = data.user_id;
                    });
                  }
                }
              }, 
              {
                key: 'comment_text',
                type: 'text',
                templateOptions: {
                  label: 'Comment Text',
                  placeholder: 'Enter Comment Text',
                  hideLabel: true,
                  required: true
                }
              }
            ]
          }
        },
        // end of task_comments keys

        // start of task_attachments keys

        {
          className: 'col-6 pb-0',
          fieldGroupClassName: "field-no-bottom-space",
          fieldGroup: [
            {
              fieldGroupClassName: "row col-12 m-0 custom-form-card",
              fieldGroup: [
                {
                  className: 'col-12 custom-form-card-block w-100',
                  fieldGroup:[
                    {
                      template: '<div class="custom-form-card-title"> Task Attachments </div>',
                      fieldGroupClassName: "ant-row",
                    },
                    {
                      key: 'task_attachments',
                      type: 'file',
                      className: 'ta-cell col-12 custom-file-attachement',
                      templateOptions: {
                        "displayStyle": "files",
                        "multiple": true
                        // label: 'Order Attachments',
                        // // required: true
                        // required: true
                      }
                    },
                  ]
                },
              ]
            }
          ]
        }
      ]
    };
  }
}