import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})

export class LeadsComponent {
  showLeadsList: boolean = false;
  showForm: boolean = false;
  LeadsEditID: any;


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
    // set form config
    this.setFormConfig();
    this.set_default_status_id(); // lead_status_id = 'Open'
    // this.formConfig.fields[0].fieldGroup[5].hide = true; // Leads[lead_status_id]   hide = true
    // this.formConfig.fields[1].hide = true; // Interaction hide = ture
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
        // set labels for update
        this.formConfig.submit.label = 'Update';
        this.formConfig.pkId = 'lead_id';
        this.formConfig.model['lead_id'] = this.LeadsEditID;
        this.showForm = true;
        // this.formConfig.fields[0].fieldGroup[5].hide = false; // Leads[lead_status_id]
        // this.formConfig.fields[1].hide = false; // Interaction hide = ture
      }
    })
    this.hide();
  };


  showLeadsListFn() {
    this.showLeadsList = true;
  };

  setFormConfig() {
    this.formConfig = {
      url: "leads/leads/",
      // title: 'leads',
      formState: {
        viewMode: false,
        // isEdit: false,
      },
      exParams: [],
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {},
      model: {
        lead: {},
        assignment_history:[],
        interaction: {}
      },
      fields: [
        //-----------------------------------------L E A D S -----------------------------------//
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'lead',
          fieldGroup: [{
              key: 'name',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              defaultValue: "test name",
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter name',
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
              className: 'ant-col-4 pr-md m-3',
              defaultValue: "bhagya@gmail.com",
              templateOptions: {
                type: 'input',
                label: 'Email',
                placeholder: 'Enter Email',
                // required: true
              },
              hooks: {
                onInit: (field: any) => {}
              }
            },
            {
              key: 'phone',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
               defaultValue: "9985757477",
              templateOptions: {
                label: 'Phone',
                placeholder: 'Enter number',
                required: false,
              }
            },
            {
              key: 'score',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              defaultValue: "100",
              templateOptions: {
                label: 'Score',
                placeholder: 'Enter score',
                // required: true,
              }
            },
            {
              key: 'assignee',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Assigned',
                dataKey: 'employee_id',
                dataLabel: "name",
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
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['lead']) {
                      this.formConfig.model['lead']['assignee_id'] = data.employee_id;
                    } else {
                      console.error('Form config or vendor data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'lead_status',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
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
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'interaction',
          fieldGroup: [{
              key: 'interaction_type',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Interaction Type',
                dataKey: 'interaction_type_id',
                dataLabel: "interaction_type",
                options: [],
                lazy: {
                  url: 'leads/interaction_types/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['interaction']) {
                      this.formConfig.model['interaction']['interaction_type_id'] = data.interaction_type_id;
                    } else {
                      console.error('Form config or lead_status data model is not defined.');
                    }
                  });
                }
              }
            },
            // {
            //   key: 'interaction_date',
            //   type: 'input',
            //   className: 'ant-col-4 pr-md m-3',
            //   templateOptions: {
            //     type: 'datetime-local',
            //     label: 'Interaction date',
            //     placeholder: 'Select interaction date',
            //     required: false
            //   }
            // },
            {
              key: 'notes',
              type: 'textarea',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                type: 'input',
                label: 'Notes',
                // placeholder: 'Select Oder Date',
                required: false
              }
            }
          ]
        },
        // end of interaction
      ]
    }
  }
}