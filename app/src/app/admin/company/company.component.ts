import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaFormConfig } from 'projects/ta-form/src/lib/ta-form-config';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})

export class CompanyComponent {
  ids: string[] = []; // Array to hold extracted IDs
  title = "";
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
        fieldGroupClassName: 'row',
        fieldGroup : [
          {
            key: 'name',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Name',
              placeholder: 'Enter Name',
              required: true,
            }
          },
          {
            key: 'print_name',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Print name',
              placeholder: 'Enter Name',
              required: true,
            }
          },
          {
            key: 'short_name',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Short name',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'phone',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Phone',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'email',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Email',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'code',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Code',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'num_branches',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'num_branches',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'num_employees',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'num_employees',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'logo',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'logo',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'pin_code',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Pin code',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'city',
            type: 'select',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'City name',
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
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'State name',
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
            className: 'ant-col-4 pr-md m-3',
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
            key: 'longitude',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Longitude',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'latitude',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Latitude',
              placeholder: 'Enter Name',
              required: false,
            }
          },
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup : [
          {
            key: 'address',
            type: 'textarea',
            className: 'ant-col-11 pr-md m-1',
            templateOptions: {
              label: 'address',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'print_address',
            type:  'textarea',
            className: 'ant-col-11 pr-md m-1',
            templateOptions: {
              label: 'print_address',
              placeholder: 'Enter Name',
              required: false,
            }
          },
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup : [
          {
            key: 'website',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'website',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'facebook_url',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'facebook_url',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'skype_id',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'skype_id',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'twitter_handle',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'twitter handle',
              placeholder: 'Upload',
              required: false,
            }
          },
          {
            key: 'linkedin_url',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'linkedin url',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'pan',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'pan',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'tan',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'tan',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'cin',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'cin',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'gst_tin',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'gst_tin',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'establishment_code',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'establishment_code',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'esi_no',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'esi_no',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'pf_no',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'pf_no',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'authorized_person',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'authorized_person',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'iec_code',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'iec_code',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'turnover_less_than_5cr',
            type: 'checkbox',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Turnover less than 5cr',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          { fieldGroupClassName: 'row',
            fieldGroup : [
              {
                key: 'eway_username',
                type: 'input',
                className: 'ant-col-4 pr-md m-3',
                templateOptions: {
                  label: 'eway username',
                  placeholder: 'Enter Name',
                  required: false,
                }
              },
              {
                key: 'eway_password',
                type: 'input',
                className: 'ant-col-4 pr-md m-3',
                templateOptions: {
                  label: 'eway password',
                  placeholder: 'Enter Name',
                  required: false,
                }
              },
              {
                key: 'gstn_username',
                type: 'input',
                className: 'ant-col-4 pr-md m-3',
                templateOptions: {
                  label: 'Gstn username',
                  placeholder: 'Enter Name',
                  required: false,
                }
              },
              {
                key: 'gstn_password',
                type: 'input',
                className: 'ant-col-4 pr-md m-3',
                templateOptions: {
                  label: 'Gstn password',
                  placeholder: 'Enter Name',
                  required: false,
                }
              },
              {
                key: 'einvoice_approved_only',
                type: 'checkbox',
                className: 'ant-col-4 pr-md m-3',
                templateOptions: {
                  label: 'E-invoice approved only',
                  placeholder: 'Enter Name',
                  required: false,
                }
              },
            ]
          },
          {
            key: 'vat_gst_status',
            type: 'select',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Vat gst status',
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
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Gst type',
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
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Marketplace url',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'drug_license_no',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Drug license no',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'is_deleted',
            type: 'checkbox',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Is Deleted',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'other_license_1',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Other license 1',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'other_license_2',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Other license 2',
              placeholder: 'Enter Name',
              required: false,
            }
          },
          {
            key: 'drug_license_no',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Drug license no',
              placeholder: 'Enter Name',
              required: false,
            }
          },
        ]
      }
    ]
  }
  constructor(private router: Router, private activeRouter: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('company/companies/').subscribe((res: any) => {
      this.formConfig.model = res.data;
      // Check if the object is empty
      if (!res || res === 0) {
        console.log('Data is empty');
        this.showForm = true;
      } else {
        const id = res.data[0].company_id;
        this.title = "company";
        const url = `company/companies/${id}/`;
        this.http.get(url).subscribe(res => {
          this.formConfig.model = res;
          this.showForm = true;
        })
      }
    })
  }
}