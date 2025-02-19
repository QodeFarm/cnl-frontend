import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { BranchListComponent } from './branch-list/branch-list.component';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule, BranchListComponent],
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})

export class BranchesComponent {
  showBranchList: boolean = false;
  showForm: boolean = false;
  BranchEditID: any;
  @ViewChild(BranchListComponent) BranchListComponent!: BranchListComponent;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showBranchList = false;
    this.showForm = true;
    this.BranchEditID = null;
    // set form config
    this.setFormConfig();
  };

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editBranch(event) {
    console.log('event', event);
    this.BranchEditID = event;
    this.http.get('company/branches/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'branch_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };


  showBranchListFn() {
    this.showBranchList = true;
    this.BranchListComponent?.refreshTable();
  };

  setFormConfig() {
    this.BranchEditID = null;
    this.formConfig = {
      url: "company/branches/",
      // title: 'Branches',
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'status_id',
          type: 'script',
          value: 'data.status.status_id'
        },
        {
          key: 'state_id',
          type: 'script',
          value: 'data.state.state_id'
        },
        {
          key: 'city_id',
          type: 'script',
          value: 'data.city.city_id'
        },
        {
          key: 'country_id',
          type: 'script',
          value: 'data.country.country_id'
        },
        {
          key: 'company_id',
          type: 'script',
          value: 'data.company.company_id'
        },
      ],
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model:{},
      fields: [
      
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          className:"p-0",
          fieldGroup : [
            {
              className: 'col-md-9 col-12 col-sm-8 p-0',
              fieldGroupClassName: "ant-row",
              
              fieldGroup: [
                {
                  key: 'picture',
                  type: 'file',
                  className: 'ta-cell col-12 d-sm-none d-block',
                  templateOptions: {
                    label: 'picture',
                    required: true
                  }
                },
                {
                  key: 'name',
                  type: 'input',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Name',
                    placeholder: 'Enter name',
                    required: true,
                  }
                },
                 {
                    key: 'code',
                    type: 'input',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'Code',
                      placeholder: 'Enter Code',
                      required: true,
                    }
                  },
                {
                    key: 'phone',
                    type: 'input',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'Phone',
                      placeholder: 'Enter Phone',
                      required: false,
                    }
                  },
                {
                  key: 'email',
                  type: 'input',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Email',
                    placeholder: 'Enter email',
                    required: false,
                  }
                },
                 {
                    key: 'city',
                    type: 'select',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'City',
                      dataKey: 'city',
                      dataLabel: "city_name",
                      options: [],
                      lazy: {
                        url: 'masters/city/',
                        lazyOneTime: true
                      },
                      required: true
                    },
                    hooks: {
                      onInit: (field: any) => {
                        field.formControl.valueChanges.subscribe((data: any) => {
                          if (this.formConfig && this.formConfig.model && this.formConfig.model['city_id']) {
                            this.formConfig.model['city_id'] = data.city_id
                          } else {
                            console.error('Form config or city_id data model is not defined.');
                          }
                        });
                      }
                    }
                  },
                {
                    key: 'state',
                    type: 'select',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'State',
                      dataKey: 'state',
                      dataLabel: "state_name",
                      options: [],
                      lazy: {
                        url: 'masters/state/',
                        lazyOneTime: true
                      },
                      required: true
                    },
                    hooks: {
                      onInit: (field: any) => {
                        field.formControl.valueChanges.subscribe((data: any) => {
                          if (this.formConfig && this.formConfig.model && this.formConfig.model['state_id']) {
                            this.formConfig.model['state_id'] = data.state_id
                          } else {
                            console.error('Form config or state_id data model is not defined.');
                          }
                        });
                      }
                    }
                  },
                  {
                    key: 'country',
                    type: 'select',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'Country',
                      dataKey: 'country',
                      dataLabel: "country_name",
                      options: [],
                      lazy: {
                        url: 'masters/country/',
                        lazyOneTime: true
                      },
                      required: false
                    },
                    hooks: {
                      onInit: (field: any) => {
                        field.formControl.valueChanges.subscribe((data: any) => {
                          if (this.formConfig && this.formConfig.model && this.formConfig.model['country_id']) {
                            this.formConfig.model['country_id'] = data.country_id
                          } else {
                            console.error('Form config or city_id data model is not defined.');
                          }
                        });
                      }
                    }
                  },
                 {
                    key: 'pin_code',
                    type: 'input',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'PIN Code',
                      placeholder: 'Enter PIN Code',
                      required: false,
                    }
                  },
                {
                    key: 'status',
                    type: 'select',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'Status',
                      dataKey: 'status',
                      dataLabel: "status_name",
                      options: [],
                      lazy: {
                        url: 'masters/statuses/',
                        lazyOneTime: true
                      },
                      required: true
                    },
                    hooks: {
                      onInit: (field: any) => {
                        field.formControl.valueChanges.subscribe((data: any) => {
                          if (this.formConfig && this.formConfig.model && this.formConfig.model['status_id']) {
                            this.formConfig.model['status_id'] = data.status_id
                          } else {
                            console.error('Form config or city_id data model is not defined.');
                          }
                        });
                      }
                    }
                  },
                 {
                    key: 'longitude',
                    type: 'input',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'Longitude',
                      placeholder: 'Enter Longitude',
                      required: false,
                    }
                  },
                {
                    key: 'latitude',
                    type: 'input',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'Latitude',
                      placeholder: 'Enter Latitude',
                      required: false,
                    }
                  },
                {
                    key: 'gst_no',
                    type: 'input',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'GST No',
                      placeholder: 'Enter GST No',
                      required: false,
                    }
                  },
                {
                    key: 'e_way_username',
                    type: 'input',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'E-Way Username',
                      placeholder: 'Enter E-Way Username',
                      required: false,
                    }
                  },
                {
                    key: 'gstn_username',
                    type: 'input',
                    className: 'col-3',
                    templateOptions: {
                      label: 'GSTN Username',
                      placeholder: 'Enter GSTN Username',
                      required: false,
                    }
                  },
                 {
                    key: 'other_license_1',
                    type: 'input',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'Other License 1',
                      placeholder: 'Enter Other License 1',
                      required: false,
                    }
                  },{
                    key: 'other_license_2',
                    type: 'input',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'Other License 2',
                      placeholder: 'Enter Other License 2',
                      required: false,
                    }
                  },
                {
                    key: 'address',
                    type: 'textarea',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'Address',
                      placeholder: 'Enter Address',
                      required: false,
                    }
                  },
                  {
                    key: 'e_way_password',
                    type: 'input',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'E-Way Password',
                      placeholder: 'Enter E-Way Password',
                      required: false,
                    }
                  },
             
                  {
                    key: 'gstn_password',
                    type: 'input',
                    className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                    templateOptions: {
                      label: 'GSTN password',
                      placeholder: 'Enter password',
                      required: false,
                    }
                  }, 
                ]
              },
  
              // Right side for the picture and additional fields
              {
                className: 'col-md-3 col-sm-4 col-12 p-0',
                fieldGroup: [
                  {
                    key: 'picture',
                    type: 'file',
                    className: 'ta-cell col-12 d-sm-block d-none',
                    templateOptions: {
                      label: 'Picture',
                      required: true
                    }
                  },
                 
                 {
                    key: 'company',
                    type: 'select',
                    className: 'col-12',
                    templateOptions: {
                      label: 'Company',
                      dataKey: 'company',
                      dataLabel: "name",
                      options: [],
                      lazy: {
                        url: 'company/companies/',
                        lazyOneTime: true
                      },
                      required: true
                    },
                    hooks: {
                      onInit: (field: any) => {
                        field.formControl.valueChanges.subscribe((data: any) => {
                          if (this.formConfig && this.formConfig.model && this.formConfig.model['company_id']) {
                            this.formConfig.model['company_id'] = data.company_id
                          } else {
                            console.error('Form config or city_id data model is not defined.');
                          }
                        });
                      }
                    }
                  },
                   {
                    key: 'allowed_warehouse',
                    type: 'input',
                    className: 'col-12 mt-',
                    templateOptions: {
                      label: 'Allowed Warehouse',
                      placeholder: 'Enter Allowed Warehouse',
                      required: false,
                    }
                  },
                ]
              }
            ]
          },
        ]
      }
    }
  }

