import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';

@Component({
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, WorkflowListComponent],
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent {
  showWorkflowList: boolean = false;
  showForm: boolean = false;
  workflowEditID: any;
  @ViewChild(WorkflowListComponent) WorkflowListComponent!: WorkflowListComponent;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.showWorkflowList = true;
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
    this.http.get('sales/work_flow/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'workflow_id';
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['workflow_id'] = this.workflowEditID;

        this.showWorkflowList = false;
        this.showForm = true;
      }
    });
    this.hide();
  }

  backToList() {
    this.showForm = false;
    this.showWorkflowList = true;
    this.WorkflowListComponent?.refreshTable(); // reload the list
  }

  // Show workflow list modal
  showWorkflowListFn() {
    this.showWorkflowList = true;
    this.WorkflowListComponent?.refreshTable();
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
        workflow_stages: [{}],
      },
      fields: [
        //----------------------------------------- W O R K F L O W -----------------------------------//
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          key: 'workflow',
          fieldGroup: [
            {
              key: 'name',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Workflow Name',
                placeholder: 'Enter Workflow Name',
                // required: true,
              }
            },
            {
              key: 'is_active', // New key for the checkbox
              type: 'checkbox',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Is Active',
                // Optional properties can be added here
              }
            }
          ]
        },
        //----------------------------------------- W O R K F L O W   S T A G E S -----------------------------------//
        {
          key: 'workflow_stages',
          type: 'table',
          className: 'custom-form-list product-table',
          templateOptions: {
            title: 'Workflow Stages',
            addText: 'Add Stage',
            tableCols: [
              // { 
              //   name: 'stage_name', 
              //   label: 'Stage Name' 
              // },
              { 
                name: 'stage_order', 
                label: 'Stage Order' 
              },
              { 
                name: 'description', 
                label: 'Description' 
              },
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'section',
                type: 'select',
                templateOptions: {
                  label: 'Section name',
                  dataKey: 'section_id',
                  dataLabel: 'section_name',
                  hideLabel: true, 
                  options: [],
                  lazy: {
                    url: 'users/module_sections/', // API endpoint to fetch the list of workflows
                    lazyOneTime: true // Load the data once and cache it
                  }
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      // console.log('Selected Workflow', data);
                      const index = field.parent.key;
                      if (!this.formConfig.model['workflow_stages'][index]) {
                        console.error(`Workflow stage at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['workflow_stages'][index] = {};
                      }
              
                      this.formConfig.model['workflow_stages'][index]['section_id'] = data.section_id;
                    });
                  }
                }
              },
              {
                key: 'flow_status',
                type: 'select',
                templateOptions: {
                  label: 'Flow Status Name',
                  dataKey: 'flow_status_id',
                  dataLabel: 'flow_status_name',
                  hideLabel: true, 
                  options: [],
                  lazy: {
                    url: 'masters/flow_status/', // API endpoint to fetch the list of workflows
                    lazyOneTime: true // Load the data once and cache it
                  }
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      // console.log('Selected Workflow', data);
                      const index = field.parent.key;
                      if (!this.formConfig.model['workflow_stages'][index]) {
                        console.error(`Workflow stage at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['workflow_stages'][index] = {};
                      }
              
                      this.formConfig.model['workflow_stages'][index]['flow_status_id'] = data.flow_status_id;
                    });
                  }
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
                  hideLabel: true
                }
              },
              {
                key: 'description',
                type: 'input',
                templateOptions: {
                  label: 'Description',
                  placeholder: 'Enter Description',
                  hideLabel: true
                }
              }
            ]
          }
        },
      ]
    };
  }
}
