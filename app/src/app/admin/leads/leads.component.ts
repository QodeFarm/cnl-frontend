import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { LeadsListComponent } from './leads-list/leads-list.component';


@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule,LeadsListComponent],
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent {
  showLeadsList: boolean = false;
  showForm: boolean = false;
  LeadsEditID: any;
  @ViewChild(LeadsListComponent) leadsListComponent!: LeadsListComponent;


  set_default_status_id(): any {
    return (this.http.get('leads/lead_statuses/').subscribe((res: any) => {
      if (res && res.data) {
        const key = 'status_name';
        const value = 'Open';
        const filteredDataSet = res.data.filter((item: any) => item[key] === value);
        const lead_status_id = filteredDataSet[0].lead_status_id;
        this.formConfig.model['lead']['lead_status_id'] = lead_status_id; // set default is 'Open'
      }
    }));
  };

  constructor(private http: HttpClient) {};

  ngOnInit() {
    this.showLeadsList = false;
    this.showForm = false;
    this.LeadsEditID = null;
    // set form config
    this.setFormConfig();
    this.set_default_status_id(); // lead_status_id = 'Open'
    this.formConfig.fields[0].fieldGroup[5].hide = true; // Leads[lead_status_id]   hide = true
    this.formConfig.fields[1].hide = true; // Interaction hide = ture
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editLeads(event) {
    this.LeadsEditID = event;
    this.http.get('leads/leads/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'lead_id';
        // set labels for update
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['lead_id'] = this.LeadsEditID;
        this.showForm = true;
        this.formConfig.fields[0].fieldGroup[5].hide = false; // Leads[lead_status_id]   hide = true
        this.formConfig.fields[1].hide = false; // Interaction hide = ture
      }
    })
    this.hide();
  };


  showLeadsListFn() {
    this.showLeadsList = true;
    this.leadsListComponent?.refreshTable();
  };

  setFormConfig() {
    this.LeadsEditID =null
    this.formConfig = {
      url: "leads/leads/",
      // title: 'leads',
      formState: {
        viewMode: false,
        // isEdit: false,
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
        lead: {},
        interaction: {},
      },
      fields: [
        //-----------------------------------------L E A D S -----------------------------------//
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'lead',
          fieldGroup: [{
              key: 'name',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
                // disabled: true
              },
              hooks: {
                onInit: (field: any) => {}
              },
            },
            {
              key: 'email',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                type: 'input',
                label: 'Email',
                placeholder: 'Enter Email',
                required: true
              },
              hooks: {
                onInit: (field: any) => {}
              }
            },
            {
              key: 'phone',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                label: 'Phone',
                placeholder: 'Enter Number',
                required: true,
              }
            },
            {
              key: 'score',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                label: 'Score',
                placeholder: 'Enter Score',
                // required: true,
              }
            },
            {
              key: 'assignee',
              type: 'select',
              className: 'col-3',
              templateOptions: {
                label: 'Assigned',
                dataKey: 'employee_id',
                dataLabel: "first_name",
                options: [],
                required: true,
                lazy: {
                  url: 'hrms/employees/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['lead']) {
                      this.formConfig.model['lead']['assignee_id'] = data.employee_id;
                    } else {
                      console.error('Form config or lead_status data model is not defined.');
                    }
                  });
                }
              }
            },            
            {
              key: 'lead_status',
              type: 'select',
              className: 'col-3',
              templateOptions: {
                label: 'Lead Status',
                dataKey: 'lead_status_id',
                dataLabel: "status_name",
                options: [],
                // required: true,
                lazy: {
                  url: 'leads/lead_statuses/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['lead']) {
                      this.formConfig.model['lead']['lead_status_id'] = data.lead_status_id;
                    } else {
                      console.error('Form config or lead_status data model is not defined.');
                    }
                  });
                }
              }
            }
          ]
        },
        // end of lead
        //----------------------------------------- I N T E R A C T I O N  -----------------------------------//
        {
          key: 'interaction',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Lead Interactions',
            addText: 'Add Interaction Notes',
            tableCols: [
              { name: 'interaction_type_id', label: 'Interaction Type' },
              { name: 'interaction_date', label: 'Interaction Date' },
              { name: 'notes', label: 'Notes' },
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'interaction_type',
                type: 'select',
                templateOptions: {
                  label: 'Interaction Type',
                  dataKey: 'interaction_type_id',
                  dataLabel: 'interaction_type',
                  options: [],
                  hideLabel: true,
                  required: true,
                  lazy: {
                    url: 'leads/interaction_types/',
                    lazyOneTime: true
                  },
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      console.log('user', data);
                      const index = field.parent.key;
                      if (!this.formConfig.model['interaction'][index]) {
                        console.error(`Task comments at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['interaction'][index] = {};
                      }

                      this.formConfig.model['interaction'][index]['interaction_type_id'] = data.interaction_type_id;
                    });
                  }
                }
              },
              {
                key: 'interaction_date',
                type: 'date',
                templateOptions: {
                  label: 'Interaction Date',
                  // placeholder: 'Enter Notes',
                  hideLabel: true,
                  required: true
                }
              },
              {
                key: 'notes',
                type: 'text',
                templateOptions: {
                  label: 'Notes',
                  placeholder: 'Enter Notes',
                  hideLabel: true,
                  required: true
                }
              }
            ]
          }
        },
     ]
    }
  }
}