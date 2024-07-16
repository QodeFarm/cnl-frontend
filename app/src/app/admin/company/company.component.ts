import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'company/companies/',
      title: 'Companies List',
      pkId: "company_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['company_id', 'name']
      },
      cols: [
        // {
        //   fieldKey: 'company_id',
        //   name: 'ID',
        //   sort: true
        // },
        {
          fieldKey: 'name',
          name: 'Name'
        },
        {
          fieldKey: 'code',
          name: 'Code'
        },
        // {
        //   fieldKey: 'print_name',
        //   name: 'print name'
        // },
        // {
        //   fieldKey: 'short_name',
        //   name: 'short name'
        // },
        // {
        //   fieldKey: 'num_branches',
        //   name: 'num branches'
        // },
        // {
        //   fieldKey: 'num_employees',
        //   name: 'num employees'
        // },
        // {
        //   fieldKey: 'logo',
        //   name: 'logo'
        // },
        // {
        //   fieldKey: 'gstn_username',
        //   name: 'gstn username'
        // },
        // {
        //   fieldKey: 'gstn_password',
        //   name: 'gstn password'
        // },
        // {
        //   fieldKey: 'other_license_1',
        //   name: 'other license 1'
        // },
        // {
        //   fieldKey: 'other_license_2',
        //   name: 'other license 2'
        // },
        {
          fieldKey: 'logo',
          name: 'logo',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            if (row.logo) {
              return `<a href="${row.logo}" target="_blank">Click to open</a>`;
            } else {
              return `${row.logo}`;
            };
          },
          sort: true
        },
        {
          fieldKey: 'phone',
          name: 'phone'
        },
        {
          fieldKey: 'email',
          name: 'email'
        },
        {
          fieldKey: 'address',
          name: 'address',
        },
        {
          fieldKey: 'pin_code',
          name: 'pin_code'
        },
        {
          fieldKey: 'city_id',
          name: 'city',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.city.city_name}`;
          },
          sort: true
        },
        // {
        //   fieldKey: 'state_id',
        //   name: 'state',
        //   displayType: "map",
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return `${row.state.state_name}`;
        //   },
        //   sort: true
        // },
        // {
        //   fieldKey: 'country_id',
        //   name: 'country',
        //   displayType: "map",
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return `${row.country.country_name}`;
        //   },
        //   sort: true
        // },
        // {
        //   fieldKey: 'longitude',
        //   name: 'longitude'
        // },
        // {
        //   fieldKey: 'latitude',
        //   name: 'latitude'
        // },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'company/companies'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'company/companies/',
      title: 'new company',
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
          key: 'name',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter Name',
            required: true,
          }
        },
        {
          key: 'print_name',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Print name',
            placeholder: 'Enter Name',
            required: true,
          }
        },
        {
          key: 'short_name',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Short name',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'code',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'num_branches',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'num_branches',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'num_employees',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'num_employees',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'logo',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'logo',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'address',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'address',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'pin_code',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Pin code',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'phone',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Phone',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'email',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Email',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'longitude',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Longitude',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'latitude',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Latitude',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'print_address',
          type:  'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'print_address',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'website',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'website',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'facebook_url',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'facebook_url',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'skype_id',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'skype_id',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'twitter_handle',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'twitter handle',
            placeholder: 'Upload',
            required: false,
          }
        },
        {
          key: 'linkedin_url',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'linkedin url',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'pan',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'pan',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'tan',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'tan',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'cin',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'cin',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'gst_tin',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'gst_tin',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'establishment_code',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'establishment_code',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'esi_no',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'esi_no',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'pf_no',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'pf_no',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'authorized_person',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'authorized_person',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'iec_code',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'iec_code',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'eway_username',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'eway username',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'eway_password',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'eway password',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'gstn_username',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Gstn username',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'gstn_password',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Gstn password',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'vat_gst_status',
          type: 'select',
          className: 'ta-cell pr-md',
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
          className: 'ta-cell pr-md',
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
          key: 'einvoice_approved_only',
          type: 'checkbox',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'E-invoice approved only',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'marketplace_url',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Marketplace url',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'drug_license_no',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Drug license no',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'other_license_1',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Other license 1',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'other_license_2',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Other license 2',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'drug_license_no',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Drug license no',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'turnover_less_than_5cr',
          type: 'checkbox',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Turnover less than 5cr',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'is_deleted',
          type: 'checkbox',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Is Deleted',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'city',
          type: 'select',
          className: 'ta-cell pr-md',
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
          className: 'ta-cell pr-md',
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
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Country name',
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
      ]
    }
 
  }
}

