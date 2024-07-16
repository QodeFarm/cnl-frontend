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
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'company/branches/',
      title: 'Branches List',
      pkId: "branch_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['branch_id', 'name']
      },
      cols: [
        // {
        //   fieldKey: 'branch_id',
        //   name: 'ID',
        //   sort: true
        // },
        // {
        //   fieldKey: 'company_id',
        //   name: 'company id',
        //   displayType: "map",
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return `${row.company.name}`;
        //   },
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
        //   fieldKey: 'party',
        //   name: 'Party'
        // },
        // {
        //   fieldKey: 'gst_no',
        //   name: 'Gst no'
        // },
        // {
        //   fieldKey: 'allowed_warehouse',
        //   name: 'allowed warehouse'
        // },
        // {
        //   fieldKey: 'e_way_username',
        //   name: 'e way username'
        // },
        // {
        //   fieldKey: 'e_way_password',
        //   name: 'e way password'
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
        // {
        //   fieldKey: 'picture',
        //   name: 'picture'
        // },
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
        // {
        //   fieldKey: 'pin_code',
        //   name: 'pin_code'
        // },
        {
          fieldKey: 'status_id',
          name: 'status',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.status.status_name}`;
          },
          sort: true
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
              apiUrl: 'company/branches'
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
      url: 'company/branches/',
      title: 'new branch',
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
          key: 'code',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter Code',
            required: false,
          }
        },
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
          key: 'party',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Party',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'gst_no',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Gst No',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'allowed_warehouse',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Allowed Warehouse',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'e_way_username',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'e-way username',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'e_way_password',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'e-way password',
            placeholder: 'Enter Name',
            required: false,
          }
        },
        {
          key: 'gstn_username',
          type:  'input',
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
          key: 'picture',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'picture',
            placeholder: 'Upload',
            required: false,
          }
        },
        {
          key: 'address',
          type: 'textarea',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Address',
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
          key: 'company',
          type: 'select',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Company name',
            dataKey: 'company_id',
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
              //field.templateOptions.options = this.cs.getRole();
            }
          }
        },
        {
          key: 'status',
          type: 'select',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Status name',
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
              //field.templateOptions.options = this.cs.getRole();
            }
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
            required: true
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
