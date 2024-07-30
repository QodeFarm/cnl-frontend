import { Binary } from '@angular/compiler';
import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})

export class BranchesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'company/branches/',
      title: 'Branches',
      pkId: "branch_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['branch_id', 'name']
      },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name'
        },
        {
          fieldKey: 'code',
          name: 'Code'
        },
        {
          fieldKey: 'phone',
          name: 'Phone'
        },
        {
          fieldKey: 'email',
          name: 'Email'
        },
        {
          fieldKey: 'address',
          name: 'Address',
        },
        {
          fieldKey: 'status_id',
          name: 'Status',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.status.status_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'city_id',
          name: 'City',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.city.city_name}`;
          },
          sort: true
        },
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
              apiUrl: 'company/branches'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'company/branches/',
      title: 'Branch',
      pkId: "branch_id",
      exParams: [
	    {
          key: 'company_id',
          type: 'script',
          value: 'data.company.company_id'
        },
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
        },
        {
          key: 'status_id',
          type: 'script',
          value: 'data.status.status_id'
        },
      ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'name',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-6 pb-3 pe-0',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code',
                required: false,
              }
            },
            {
              key: 'phone',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Phone',
                placeholder: 'Enter Number',
                required: false,
              }
            },
            {
              key: 'email',
              type: 'input',
              className: 'col-6 pb-3 pe-0',
              templateOptions: {
                label: 'Email',
                placeholder: 'Enter Email',
                required: false,
              }
            },
            {
              key: 'address',
              type: 'textarea',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Address',
                placeholder: 'Enter Address',
                required: false,
              }
            },
            {
              key: 'city',
              type: 'select',
              className: 'col-6 pb-3 pe-0',
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
                  
                }
              }
            },
        {
              key: 'state',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
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
                  
                }
              }
            },
        {
              key: 'country',
              type: 'select',
              className: 'col-6 pb-3 pe-0',
              templateOptions: {
                label: 'Country',
                dataKey: 'country_id',
                dataLabel: "country_name",
                options: [],
                lazy: {
                  url: 'masters/country/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  
                }
              }
            },
            {
              key: 'pin_code',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Pin code',
                placeholder: 'Enter code',
                required: false,
              }
            },
            {
              key: 'gst_no',
              type: 'input',
              className: 'col-6 pb-3 pe-0',
              templateOptions: {
                label: 'Gst No',
                placeholder: 'Enter Gst No',
                required: false,
              }
            },
            {
              key: 'status',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Status',
                dataKey: 'status_id',
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
                  
                }
              }
            },
            {
              key: 'allowed_warehouse',
              type: 'input',
              className: 'col-6 pb-3 pe-0',
              templateOptions: {
                label: 'Allowed Warehouse',
                placeholder: 'Enter allowed warehouse',
                required: false,
              }
            },
            {
              key: 'e_way_username',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'e-way username',
                placeholder: 'Enter e-way username',
                required: false,
              }
            },
            {
              key: 'e_way_password',
              type: 'input',
              className: 'col-6 pb-3 pe-0',
              templateOptions: {
                label: 'e-way password',
                placeholder: 'Enter e-way password',
                required: false,
              }
            },
            {
              key: 'other_license_1',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Other license 1',
                placeholder: 'Enter license name',
                required: false,
              }
            },
            {
              key: 'other_license_2',
              type: 'input',
              className: 'col-6 pb-3 pe-0',
              templateOptions: {
                label: 'Other license 2',
                placeholder: 'Enter license name',
                required: false,
              }
            },
            {
              key: 'gstn_username',
              type:  'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Gstn username',
                placeholder: 'Enter username',
                required: false,
              }
            },
            {
              key: 'gstn_password',
              type: 'input',
              className: 'col-6 pb-3 pe-0',
              templateOptions: {
                label: 'Gstn password',
                placeholder: 'Enter password',
                required: false,
              }
            },
            {
              key: 'longitude',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Longitude',
                placeholder: 'Enter longitude',
                required: false,
              }
            },
            {
              key: 'latitude',
              type: 'input',
              className: 'col-6 pb-3 pe-0',
              templateOptions: {
                label: 'Latitude',
                placeholder: 'Enter latitude',
                required: false,
              }
            },
            {
              key: 'picture',
              type: 'file',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'picture',
                placeholder: 'Upload',
                required: false,
              }
            },
          ]
        }
      ]
    }
 
  }
}