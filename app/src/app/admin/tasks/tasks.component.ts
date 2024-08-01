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
          fieldGroupClassName: 'ant-row custom-form-block',
          key: 'task',
          fieldGroup: [
            {
              key: 'user',
              type: 'select',
              className: 'col-3',
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
                    url: 'users/users_list/',
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
          key: 'task_attachments',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Task Attachment',
            addText: 'Add Attachment',
            tableCols: [
              { name: 'attachment_name', label: 'Attachment Name' },
              { name: 'attachment_path', label: 'Attachment Path' }
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'attachment_name',
                type: 'input',
                templateOptions: {
                  label: 'Attachment Name',
                  placeholder: 'Enter Attachment Name',
                  hideLabel: true,
                  required: false
                }
              },
              {
                key: 'attachment_path',
                type: 'file',
                className: 'ta-cell col-12 custom-file-attachement',
                templateOptions: {
                  label: 'Attachment Path',
                  hideLabel: true,
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