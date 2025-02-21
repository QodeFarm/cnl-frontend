import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaFormConfig } from 'projects/ta-form/src/lib/ta-form-config';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})

export class CompanyComponent {
  ids: string[] = []; // Array to hold extracted IDs
  title = "Company";
  showForm = false;
  formConfig: TaFormConfig = {
    url: 'company/companies/',
    title: '',
    pkId: "company_id",
    exParams: [
      {
        key: 'city_id',
        type: 'script',
        value: 'data.city.city_id'
      },
      {
        key: 'state_id',
        type: 'script',
        value: 'data.state.state_id'
      },
      {
        key: 'country_id',
        type: 'script',
        value: 'data.country.country_id'
      }
    ],


    fields: [
      
      {
        fieldGroupClassName: 'ant-row custom-form-block',
        className:"p-0",
        fieldGroup : [
          {
            className: 'col-md-9 col-12 col-sm-8 p-0',
            fieldGroupClassName: "ant-row",
            
            fieldGroup: [
              {
                key: 'logo',
                type: 'file',
                className: 'ta-cell col-12 d-sm-none d-block',
                templateOptions: {
                  label: 'Logo',
                  placeholder: 'Upload',
                  // required: true
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
                key: 'print_name',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Print name',
                  placeholder: 'Enter print name',
                  required: true,
                }
              },
              {
                key: 'short_name',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Short name',
                  placeholder: 'Enter short name',
                  required: false,
                }
              },
              {
                key: 'phone',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Phone',
                  placeholder: 'Enter number',
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
                key: 'code',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Code',
                  placeholder: 'Enter code',
                  required: false,
                }
              },
              {
                key: 'num_branches',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Num branches',
                  placeholder: 'Enter number',
                  required: false,
                }
              },
              {
                key: 'num_employees',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Num employees',
                  placeholder: 'Enter number',
                  required: false,
                }
              },
              {
                key: 'pin_code',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Pin code',
                  placeholder: 'Enter pin code',
                  required: false,
                }
              },
              {
                key: 'city',
                type: 'select',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'City',
                  dataKey: 'city_id',
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
                    //field.templateOptions.options = this.cs.getRole();
                  }
                }
              },
              {
                key: 'state',
                type: 'select',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'State',
                  dataKey: 'state_id',
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
                    //field.templateOptions.options = this.cs.getRole();
                  }
                }
              },
              {
                key: 'country',
                type: 'select',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Country',
                  dataKey: 'country_id',
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
                    //field.templateOptions.options = this.cs.getRole();
                  }
                }
              },
              {
                key: 'website',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Website',
                  placeholder: 'Enter URL',
                  required: false,
                }
              },
              {
                key: 'facebook_url',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Facebook URL',
                  placeholder: 'Enter URL',
                  required: false,
                }
              },
              {
                key: 'skype_id',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Skype id',
                  placeholder: 'Enter URL',
                  required: false,
                }
              },
              {
                key: 'twitter_handle',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Twitter handle',
                  placeholder: 'Enter URL',
                  required: false,
                }
              },
              {
                key: 'pan',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'PAN',
                  placeholder: 'Enter pan',
                  required: false,
                }
              },
              {
                key: 'tan',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'TAN',
                  placeholder: 'Enter tan',
                  required: false,
                }
              },
              {
                key: 'cin',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'CIN',
                  placeholder: 'Enter cin',
                  required: false,
                }
              },
              {
                key: 'gst_tin',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'GST TIN',
                  placeholder: 'Enter gst tin',
                  required: false,
                }
              },
              {
                  key: 'esi_no',
                  type: 'input',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'ESI no',
                    placeholder: 'Enter number',
                    required: false,
                  }
                },
                {
                  key: 'pf_no',
                  type: 'input',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'PF no',
                    placeholder: 'Enter number',
                    required: false,
                  }
                },
                {
                  key: 'authorized_person',
                  type: 'input',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Authorized person',
                    placeholder: 'Enter name',
                    required: false,
                  }
                },
                {
                  key: 'iec_code',
                  type: 'input',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'IEC code',
                    placeholder: 'Enter IEC code',
                    required: false,
                  }
                },
                {
                  key: 'eway_username',
                  type: 'input',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'E-Way Username',
                    placeholder: 'Enter name',
                    required: false,
                  }
                },
                {
                  key: 'eway_password',
                  type: 'input',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'E-Way password',
                    placeholder: 'Enter password',
                    required: false,
                  }
                },
                {
                  key: 'gstn_username',
                  type: 'input',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'GSTN Username',
                    placeholder: 'Enter name',
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
                {
                  key: 'vat_gst_status',
                  type: 'select',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Vat GST status',
                    placeholder: 'select',
                    required: false,
                    options: [
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' },
                      { value: 'Pending', label: 'Pending' },
                    ]
                  }
                },
                {
                  key: 'gst_type',
                  type: 'select',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'GST type',
                    placeholder: 'select',
                    required: false,
                    options: [
                      { value: 'Goods', label: 'Goods' },
                      { value: 'Service', label: 'Service' },
                      { value: 'Both', label: 'Both' },
                    ]
                  }
                },
                {
                  key: 'marketplace_url',
                  type: 'input',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Marketplace URL',
                    placeholder: 'Enter URL',
                    required: false,
                  }
                },
                {
                  key: 'drug_license_no',
                  type: 'input',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Drug license no',
                    placeholder: 'Enter number',
                    required: false,
                  }
                },
                {
                  key: 'address',
                  type: 'textarea',
                  className: 'col-md-6 col-12',
                  templateOptions: {
                    label: 'Address',
                    placeholder: 'Enter address',
                    required: false,
                  }
                },
                {
                  key: 'print_address',
                  type:  'textarea',
                  className: 'col-md-6 col-12',
                  templateOptions: {
                    label: 'Print Address',
                    placeholder: 'Enter address',
                    required: false,
                  }
                },
                {
                  key: 'turnover_less_than_5cr',
                  type: 'checkbox',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Turnover less than 5cr',
                    placeholder: 'Enter Name',
                    required: false,
                  }
                },
                {
                  key: 'einvoice_approved_only',
                  type: 'checkbox',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'E-Invoice approved only',
                    placeholder: 'Enter Name',
                    required: false,
                  }
                },
                {
                  key: 'is_deleted',
                  type: 'checkbox',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Is Deleted',
                    placeholder: 'Enter Name',
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
                  key: 'logo',
                  type: 'file',
                  className: 'ta-cell col-12 d-sm-block d-none',
                  templateOptions: {
                    label: 'Logo',
                    placeholder: 'Upload',
                    // required: true
                  }
                },
                {
                  key: 'linkedin_url',
                  type: 'input',
                  className: 'col-12 mt-',
                  templateOptions: {
                    label: 'Linkedin URL',
                    placeholder: 'Enter Name',
                    required: false,
                  }
                },
                {
                  key: 'establishment_code',
                  type: 'input',
                  className: 'col-12 mt-',
                  templateOptions: {
                    label: 'Establishment code',
                    placeholder: 'Enter code',
                    required: false,
                  }
                },
                {
                  key: 'longitude',
                  type: 'input',
                  className: 'col-12 mt-',
                  templateOptions: {
                    label: 'Longitude',
                    placeholder: 'Enter longitude',
                    required: false,
                  }
                },
                {
                  key: 'latitude',
                  type: 'input',
                  className: 'col-12 mt-',
                  templateOptions: {
                    label: 'Latitude',
                    placeholder: 'Enter latitude',
                    required: false,
                  }
                },
                {
                  key: 'other_license_1',
                  type: 'input',
                  className: 'col-12 mt-',
                  templateOptions: {
                    label: 'Other license 1',
                    placeholder: 'Enter license',
                    required: false,
                  }
                },
                {
                  key: 'other_license_2',
                  type: 'input',
                  className: 'col-12 mt-',
                  templateOptions: {
                    label: 'Other license 2',
                    placeholder: 'Enter license',
                    required: false,
                  }
                },
              ]
            }
          ]
        },
      ]
    }
  constructor(private router: Router, private activeRouter: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<{ data: any[] }>('company/companies/').pipe(
      switchMap(res => {
        if (!res || !res.data || res.data.length === 0) {
          this.showForm = true;
          return of(null); // Return an observable with null value
        } else {
          const id = res.data[0].company_id;
          this.title = 'company';
          const url = `company/companies/${id}/`;
          return this.http.get(url);
        }
      }),
      catchError(err => {
        return of(null); // Handle the error by returning an observable with null value
      })
    ).subscribe(res => {
      if (res) {
        this.formConfig.model = res;
      }
      this.showForm = true;
    });
  }
}