import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent {
  showWorkflowList: boolean = false;
  showForm: boolean = false;
  workflowEditID: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.showWorkflowList = false;
    this.showForm = false;
    this.workflowEditID = null;
    // Initialize form configuration
    this.setFormConfig();
  }

  formConfig: TaFormConfig = {};

  // Hide modal
  hide() {
    document.getElementById('modalClose')?.click();
  }

  // Edit Workflow
  editWorkflow(event: any) {
    this.workflowEditID = event;
    this.http.get('workflow/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'workflow_id';
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['workflow_id'] = this.workflowEditID;
        this.showForm = true;
      }
    });
    this.hide();
  }

  // Show workflow list modal
  showWorkflowListFn() {
    this.showWorkflowList = true;
  }

  // Set form configuration
  setFormConfig() {
    this.workflowEditID = null;
    this.formConfig = {
      url: "sales/work_flow/",
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
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
        workflow: {},
        workflow_stages: [],
      },
      fields: [
        //----------------------------------------- W O R K F L O W -----------------------------------//
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'workflow',
          fieldGroup: [
            {
              key: 'name',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                label: 'Workflow Name',
                placeholder: 'Enter Workflow Name',
                // required: true,
              }
            }
          ]
        },
        //----------------------------------------- W O R K F L O W   S T A G E S -----------------------------------//
        {
          key: 'workflow_stages',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Workflow Stages',
            addText: 'Add Stage',
            tableCols: [
              { name: 'stage_name', label: 'Stage Name' },
              { name: 'stage_order', label: 'Stage Order' },
              { name: 'description', label: 'Description' },
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'workflow_id',
                type: 'select',
                templateOptions: {
                  label: 'Workflow',
                  dataKey: 'workflow_id',
                  dataLabel: 'name', // Assuming the workflow has a 'name' field
                  options: [], // This will be populated dynamically
                  // required: true,
                  lazy: {
                    url: 'sales/work_flow/', // API endpoint to fetch the list of workflows
                    lazyOneTime: true // Load the data once and cache it
                  }
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      console.log('Selected Workflow', data);
                      const index = field.parent.key;
                      if (!this.formConfig.model['workflow_stages'][index]) {
                        console.error(`Workflow stage at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['workflow_stages'][index] = {};
                      }
              
                      this.formConfig.model['workflow_stages'][index]['workflow_id'] = data.workflow_id;
                    });
                  }
                }
              },
              {
                key: 'stage_name',
                type: 'input',
                templateOptions: {
                  label: 'Stage Name',
                  placeholder: 'Enter Stage Name',
                  // required: true,
                }
              },
              {
                key: 'stage_order',
                type: 'input',
                templateOptions: {
                  label: 'Stage Order',
                  placeholder: 'Enter Stage Order',
                  type: 'number',
                  // required: true,
                }
              },
              {
                key: 'description',
                type: 'input',
                templateOptions: {
                  label: 'Description',
                  placeholder: 'Enter Description',
                }
              }
            ]
          }
        },
      ]
    };
  }
}
