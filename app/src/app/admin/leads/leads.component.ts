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
    this.formConfig.fields[0].fieldGroup[4].hide = true; // Leads[lead_status_id]   hide = true
    // this.formConfig.fields[1].hide = true; // assignments   hide = true
    // this.formConfig.fields[2].hide = true; // Interaction hide = true    
    this.formConfig.fields[0].fieldGroup[5].hide = true; 
    this.formConfig.fields[0].fieldGroup[6].hide = true; 
    this.formConfig.fields[0].fieldGroup[7].hide = true; 
    this.formConfig.fields[0].fieldGroup[8].hide = true; 
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
        console.log('-------------------------------')
        console.log('model :',this.formConfig.model);
        console.log('data :',res.data);
        this.formConfig.model = res.data;
        // set labels for update
        this.formConfig.submit.label = 'Update';
        this.formConfig.pkId = 'lead_id';
        this.formConfig.model['lead_id'] = this.LeadsEditID;
        this.showForm = true;
        this.formConfig.fields[0].fieldGroup[4].hide = false; // Leads[lead_status_id]   hide = false
        // this.formConfig.fields[1].hide = false; // assignments   hide = false
        // this.formConfig.fields[2].hide = false; // Interaction hide = false
        this.formConfig.fields[0].fieldGroup[5].hide = false; 
        this.formConfig.fields[0].fieldGroup[6].hide = false; 
        this.formConfig.fields[0].fieldGroup[7].hide = false; 
        this.formConfig.fields[0].fieldGroup[8].hide = false; 

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
        assignment: {},
        assignment_history: [{}],
        interaction: {},
      },
      fields: [

        // {
        //   fieldGroupClassName: 'row col-12 p-0 m-0 custom-form field-no-bottom-space',
        //   className: 'ta-cell pr-md col-md-10 col-12',
        //   fieldGroup: [

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
              className: 'col-3',
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
              className: 'col-3',
              templateOptions: {
                label: 'Phone',
                placeholder: 'Enter number',
                required: false,
              }
            },
            {
              key: 'score',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                label: 'Score',
                placeholder: 'Enter score',
                // required: true,
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
            },
            {
              // fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
              // key: 'assignment',
              // fieldGroup: [{
                key: 'sales_rep',
                type: 'select',
                className: 'col-3',
                templateOptions: {
                  label: 'Sales Representative',
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
                      if (this.formConfig && this.formConfig.model && this.formConfig.model['assignment']) {
                        this.formConfig.model['assignment']['sales_rep_id'] = data.employee_id;
                      } else {
                        console.error('Form config or vendor data model is not defined.');
                      }
                    });
                  }
                }
              // }]
            },
            {
              key: 'interaction_type',
              type: 'select',
              className: 'col-3',
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
            {
              key: 'interaction_date',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                type: 'datetime-local',
                label: 'Interaction date',
                placeholder: 'Select interaction date',
                required: false
              }
            },
            {
              key: 'notes',
              type: 'textarea',
              className: 'col-3',
              templateOptions: {
                label: 'Notes',
                required: false,
                placeholder: 'Enter Notes',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
          ]
        },
        // end of lead
        //-----------------------------------------A S S I G N M E N T -----------------------------------//
        // {
        //   // fieldGroupClassName: "ant-row",
        //   key: 'assignment',
        //   fieldGroup: [{
        //     key: 'sales_rep',
        //     type: 'select',
        //     className: 'col-3',
        //     templateOptions: {
        //       label: 'Sales Representative',
        //       dataKey: 'employee_id',
        //       dataLabel: "name",
        //       options: [],
        //       lazy: {
        //         url: 'hrms/employees/',
        //         lazyOneTime: true
        //       },
        //       required: false
        //     },
        //     hooks: {
        //       onChanges: (field: any) => {
        //         field.formControl.valueChanges.subscribe((data: any) => {
        //           if (this.formConfig && this.formConfig.model && this.formConfig.model['assignment']) {
        //             this.formConfig.model['assignment']['sales_rep_id'] = data.employee_id;
        //           } else {
        //             console.error('Form config or vendor data model is not defined.');
        //           }
        //         });
        //       }
        //     }
        //   }]
        // },
        // end of assignment
        //----------------------------------------- I N T E R A C T I O N  -----------------------------------//
        // {
        //   // fieldGroupClassName: "ant-row custom-form-block",
        //   key: 'interaction',
        //   fieldGroup: [{
        //       key: 'interaction_type',
        //       type: 'select',
        //       className: 'col-3',
        //       templateOptions: {
        //         label: 'Interaction Type',
        //         dataKey: 'interaction_type_id',
        //         dataLabel: "interaction_type",
        //         options: [],
        //         lazy: {
        //           url: 'leads/interaction_types/',
        //           lazyOneTime: true
        //         },
        //         required: false
        //       },
        //       hooks: {
        //         onChanges: (field: any) => {
        //           field.formControl.valueChanges.subscribe((data: any) => {
        //             if (this.formConfig && this.formConfig.model && this.formConfig.model['interaction']) {
        //               this.formConfig.model['interaction']['interaction_type_id'] = data.interaction_type_id;
        //             } else {
        //               console.error('Form config or lead_status data model is not defined.');
        //             }
        //           });
        //         }
        //       }
        //     },
        //     {
        //       key: 'interaction_date',
        //       type: 'input',
        //       className: 'col-3',
        //       templateOptions: {
        //         type: 'datetime-local',
        //         label: 'Interaction date',
        //         placeholder: 'Select interaction date',
        //         required: false
        //       }
        //     },
        //     {
        //       key: 'notes',
        //       type: 'textarea',
        //       className: 'col-3',
        //       templateOptions: {
        //         type: 'input',
        //         label: 'Notes',
        //         // placeholder: 'Select Oder Date',
        //         required: false
        //       }
        //     }
        //   ]
        // },
        // end of interaction
    //   ]
    // }


      ]
    }
  }
}