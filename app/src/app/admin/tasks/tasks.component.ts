import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  showTasksList: boolean = false;
  showForm: boolean = false;
  TasksEditID: any;
  formConfig: TaFormConfig = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.showTasksList = false;
    this.showForm = false;
    // Set form config
    this.setFormConfig();
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
        // Set labels for update
        this.formConfig.submit.label = 'Update';
        // Show form after setting form values
        this.formConfig.pkId = 'task_id';
        this.formConfig.model['task_id'] = this.TasksEditID;
        this.showForm = true;
      }
    });
    this.hide();
  }

  showTasksListFn() {
    this.showTasksList = true;
  }

  setFormConfig() {
    this.formConfig = {
      url: 'tasks/task/',
      formState: {
        viewMode: false
      },
      exParams: [],
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {},
      model: {
        task: {},
        task_comments: [],
        task_attachments: [],
        task_history: {}
      },
      fields: [
        {
          template: '<div> <hr> <b>Task</b> </div>',
          fieldGroupClassName: 'ant-row',
        },
        {
          fieldGroupClassName: 'ant-row',
          key: 'task',
          fieldGroup: [
            {
              key: 'user',
              type: 'select',
              className: 'ant-col-5 pr-md m-3',
              templateOptions: {
                label: 'User',
                dataKey: 'user_id',
                dataLabel: 'first_name',
                options: [],
                lazy: {
                  url: 'users/users_list/',
                  lazyOneTime: true
                },
                required: true
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
              key: 'status',
              type: 'select',
              className: 'ant-col-5 pr-md m-3',
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
            },
            {
              key: 'priority',
              type: 'select',
              className: 'ant-col-5 pr-md m-3',
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
              key: 'title',
              type: 'input',
              className: 'ant-col-5 pr-md m-3',
              templateOptions: {
                label: 'Title',
                placeholder: 'Enter title',
                required: true
              }
            },
            {
              key: 'description',
              type: 'textarea',
              className: 'ant-col-5 pr-md m-3',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter description',
                required: false
              }
            },
            {
              key: 'due_date',
              type: 'date',
              className: 'ant-col-5 pr-md m-3',
              templateOptions: {
                type: 'date',
                label: 'Due date',
                required: false
              }
            }
          ]
        },
        // end of tasks

        // start of task_comments keys
        {
          template: '<div> <hr> <b>Task Comments</b> </div>',
          fieldGroupClassName: 'ant-row',
        },
        {
          key: 'task_comments',
          type: 'repeat',
          templateOptions: {
            addText: 'Add Comments'
          },
          fieldArray: {
            fieldGroupClassName: 'row',
            fieldGroup: [
              {
                key: 'user',
                type: 'select',
                className: 'ant-col-10 pr-md m-3',
                templateOptions: {
                  label: 'User',
                  dataKey: 'user_id',
                  dataLabel: 'first_name',
                  lazy: {
                    url: 'users/users_list/',
                    lazyOneTime: true
                  },
                  required: true
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      console.log('user', data);
                      const index = field.parent.key;
                      
                      // if (!this.formConfig || !this.formConfig.model) {
                      //   console.error('Form config or task comments model is not defined.');
                      //   return;
                      // }

                      // if (!this.formConfig.model['task_comments']) {
                      //   console.error('Task comments model is not defined.');
                      //   this.formConfig.model['task_comments'] = [];
                      // }

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
                className: 'ant-col-10 pr-md m-3',
                templateOptions: {
                  label: 'Comment Text',
                  placeholder: 'Enter Comment Text',
                  required: true
                }
              }
            ]
          }
        },
        // end of task_comments keys

        // start of task_attachments keys
        {
          template: '<div> <hr> <b>Task Attachments</b> </div>',
          fieldGroupClassName: 'ant-row',
        },
        {
          key: 'task_attachments',
          type: 'repeat',
          templateOptions: {
            addText: 'Add Attachment'
          },
          fieldArray: {
            fieldGroupClassName: 'row',
            fieldGroup: [
              {
                key: 'attachment_name',
                type: 'input',
                className: 'ant-col-10 pr-md m-3',
                templateOptions: {
                  label: 'Attachment Name',
                  placeholder: 'Enter Attachment Name',
                  required: false
                }
              },
              {
                key: 'attachment_path',
                type: 'input',
                className: 'ant-col-10 pr-md m-3',
                templateOptions: {
                  label: 'Attachment Path',
                  placeholder: 'Enter Attachment Path',
                  required: false
                }
              }
            ]
          }
        },
        // end of task_attachments keys  
      ]
    };
  }
}