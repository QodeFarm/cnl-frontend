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
                  label: 'Company Logo',
                  placeholder: 'Upload logo',
                  // required: true
                }
              },
              {
                key: 'name',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Company Name',
                  placeholder: 'Enter company name',
                  required: true,
                }
              },
              {
                key: 'print_name',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Print Name',
                  placeholder: 'Enter print name',
                  required: true,
                }
              },
              {
                key: 'short_name',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Short Name',
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
                  placeholder: 'Enter phone number',
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
                  label: 'Company Code',
                  placeholder: 'Enter company code',
                  required: false,
                }
              },
              {
                key: 'num_branches',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Number of Branches',
                  placeholder: 'Enter number of branches',
                  required: false,
                }
              },
              {
                key: 'num_employees',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Number of Employees',
                  placeholder: 'Enter number of employees',
                  required: false,
                }
              },
              {
                key: 'pin_code',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'PIN Code',
                  placeholder: 'Enter PIN code',
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
                  placeholder: 'Enter website URL',
                  required: false,
                }
              },
              {
                key: 'facebook_url',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Facebook URL',
                  placeholder: 'Enter Facebook URL',
                  required: false,
                }
              },
              /* Removed as per requirements
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
              */
              {
                key: 'pan',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'PAN',
                  placeholder: 'Enter PAN number',
                  required: false,
                }
              },
              {
                key: 'tan',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'TAN',
                  placeholder: 'Enter TAN number',
                  required: false,
                }
              },
              {
                key: 'cin',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'CIN',
                  placeholder: 'Enter CIN number',
                  required: false,
                }
              },
              {
                key: 'gst_tin',
                type: 'input',
                className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'GST TIN',
                  placeholder: 'Enter GST TIN number',
                  required: false,
                }
              },
              /* Removed as per requirements
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
                */
                {
                  key: 'authorized_person',
                  type: 'input',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Authorized Person',
                    placeholder: 'Enter name',
                    required: false,
                  }
                },
                /* Removed as per requirements
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
                */
                /* Removed as per requirements
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
                */
                {
                  key: 'vat_gst_status',
                  type: 'select',
                  className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'VAT/GST Status',
                    placeholder: 'Select status',
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
                    label: 'GST Type',
                    placeholder: 'Select type',
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
                    placeholder: 'Enter marketplace URL',
                    required: false,
                  }
                },
                /* Removed as per requirements
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
                */
                {
                  key: 'address',
                  type: 'textarea',
                  className: 'col-md-6 col-12',
                  templateOptions: {
                    label: 'Company Address',
                    placeholder: 'Enter company address',
                    required: false,
                  }
                },
                {
                  key: 'print_address',
                  type:  'textarea',
                  className: 'col-md-6 col-12',
                  templateOptions: {
                    label: 'Billing Address',
                    placeholder: 'Enter address for billing/printing',
                    required: false,
                  }
                },
                {
                  key: 'turnover_less_than_5cr',
                  type: 'checkbox',
                  className: 'col-lg-6 col-md-6 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Turnover Less Than 5 Crores',
                    required: false,
                  }
                },
                /* Removed as per requirements
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
                */
              ]
            },

            // Right side for the picture and additional fields
            {
              className: 'col-md-3 col-sm-4 col-12 p-0',
              fieldGroup: [
                {
                  key: 'logo',
                  type: 'file',
                  className: 'ta-cell col-12 d-sm-block d-none mb-4',
                  templateOptions: {
                    label: 'Company Logo',
                    placeholder: 'Upload logo',
                    // required: true
                  }
                },
                {
                  key: 'linkedin_url',
                  type: 'input',
                  className: 'col-12 mt-3',
                  templateOptions: {
                    label: 'LinkedIn URL',
                    placeholder: 'Enter LinkedIn URL',
                    required: false,
                  }
                },
                {
                  key: 'establishment_code',
                  type: 'input',
                  className: 'col-12 mt-3',
                  templateOptions: {
                    label: 'Establishment Code',
                    placeholder: 'Enter establishment code',
                    required: false,
                  }
                },
                /* Removed as per requirements - Longitude and Latitude
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
                */
                {
                  key: 'other_license_1',
                  type: 'input',
                  className: 'col-12 mt-3',
                  templateOptions: {
                    label: 'License Number',
                    placeholder: 'Enter license number',
                    required: false,
                  }
                },
                /* Removed as per requirements - Other license 2
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
                */
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
          this.title = 'Company';
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