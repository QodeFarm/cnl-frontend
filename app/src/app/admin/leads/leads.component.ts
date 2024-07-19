import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent {
  showLeadsList: boolean = false;
  showForm: boolean = false;
  LeadsEditID: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showLeadsList = false;
    this.showForm = false;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);
  }

  formConfig: TaFormConfig = {};

  hide(){
      document.getElementById('modalClose').click();
  }

  editLeads(event){
    console.log('event',event);
    this.LeadsEditID = event;
    this.http.get('leads/leads/' + event).subscribe((res: any) => {
      console.log('--------> res ', res);
      if (res && res.data) {
        this.formConfig.model = res.data;
        // set labels for update
        this.formConfig.submit.label = 'Update';
        // show form after setting form values

        // this.formConfig.url= "sales/lead/" + this.LeadsEditID;
        this.formConfig.pkId = 'lead_id';
        
        this.formConfig.model['lead_id'] = this.LeadsEditID;
        this.showForm = true;
      }
    })
    this.hide();
  }


  showLeadsListFn() {
    this.showLeadsList = true;
  }

  setFormConfig() {
    this.formConfig = {
      url: "leads/leads/" ,
      // title: 'leads',
      formState: {
        viewMode: false
      },
      exParams: [
        {
          key: 'lead_status_id',
          type: 'script',
          value: 'data.lead_status_id.lead_status_id'
        }
      ],
      submit: {
        label:'Submit',
        submittedFn : ()=>this.ngOnInit()        
      },
      // reset: {},
      // model: {
      //   lead: {},
      //   assignment: {},
      //   assignment_history: {},
      //   interaction: {},
      // },
      fields:[
        {
          template:'<div> <hr> <b>Lead</b> </div>',
          fieldGroupClassName: "ant-row",
        },
        {
          fieldGroupClassName: "ant-row",
          key:'lead',
          fieldGroup: [
            {
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
                onInit: (field: any) => {
                }
              },
            },
            {
              key: 'email',
              type: 'input',
              defaultValue: "testing@example.com",
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                type: 'input',
                label: 'Email',
                placeholder: 'Enter Email',
                // required: true
              },
              hooks: {
                onInit: (field: any) => { }
              }
            },
            {
              key: 'phone',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              defaultValue: "+919985757477",
              templateOptions: {
                label: 'Phone',
                placeholder: 'Enter number',
                required: false,
              }
            },
            {
              key: 'lead_status_id',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              defaultValue: "3f186760-ad4d-4a86-a53d-4207658140ca",
              templateOptions: {
                label: 'Lead Status',
                dataKey: 'name',
                dataLabel: "status_name",
                options: [],
                // required: true,
                lazy: {
                  url: 'leads/lead_statuses/',
                  lazyOneTime: true
                }
              }
            },
            {
              key: 'score',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Score',
                placeholder: 'Enter score',
                // required: true,
              }
            },
          ]
        },
        // end of lead

        {
          template:'<div> <hr> <b>Lead Assignment </b> </div>',
          fieldGroupClassName: "ant-row",
        },
        {
          fieldGroupClassName: "ant-row",
          key:'assignment',
          fieldGroup: [
            {
              key: 'lead_id',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Lead',
                dataKey: 'lead_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'leads/leads/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'sales_rep_id',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Sales Representative',
                dataKey: 'sales_rep_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'hrms/employees/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: (field: any) => {
                }
              }
            },
            {
              key: 'assignment_date',
              type: 'date',
              defaultValue: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                type: 'date',
                label: 'Assignment date',
                // placeholder: 'Select Oder Date',
                required: false
              }
            }
          ]
        },
        // end of assignment

        {
          template:'<div> <hr> <b>Assignment History</b> </div>',
          fieldGroupClassName: "ant-row",
        },
        {
          fieldGroupClassName: "ant-row",
          key:'assignment_history',
          fieldGroup: [
            {
              key: 'lead_id',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Lead',
                dataKey: 'lead_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'leads/leads/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'sales_rep_id',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Sales Representative',
                dataKey: 'sales_rep_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'hrms/employees/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: (field: any) => {
                }
              }
            },
            {
              key: 'assignment_date',
              type: 'date',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                type: 'date',
                label: 'Assignment date',
                // placeholder: 'Select Oder Date',
                required: false
              }
            },
            {
              key: 'end_date',
              type: 'date',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                type: 'date',
                label: 'End date',
                // placeholder: 'Select Oder Date',
                required: false
              }
            }
          ]
        },
        // end of assignment history
        {
          template:'<div> <hr> <b>Interaction</b> </div>',
          fieldGroupClassName: "ant-row",
        },
        {
          fieldGroupClassName: "ant-row",
          key:'interaction',
          fieldGroup: [
            {
              key: 'lead_id',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Lead',
                dataKey: 'lead_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'leads/leads/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'interaction_type_id',
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
                onInit: (field: any) => {
                }
              }
            },
            {
              key: 'interaction_date',
              type: 'date',
              defaultValue: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                type: 'date',
                label: 'Interaction date',
                // placeholder: 'Select Oder Date',
                required: false
              }
            },
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
