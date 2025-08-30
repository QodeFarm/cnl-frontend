import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TaTableConfig } from '@ta/ta-table';
import { TaCurdConfig } from '@ta/ta-curd';
import { Router } from '@angular/router';

const count = 5;
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  data: any[] = [];
  list: Array<{ loading: boolean; name: any }> = [];
  viewMode = 0;

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      // apiUrl: 'employees/employees',
      title: 'Employee',
      pkId: "employee_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['id', 'first_name', 'last_name']
      },
      cols: [
        {
          fieldKey: 'employee_id',
          name: 'ID',
          sort: true
        },
        {
          fieldKey: 'first_name',
          name: 'First Name'
        },
        {
          fieldKey: 'last_name',
          name: 'Last Name',
          sort: true
        },
        {
          fieldKey: 'email',
          name: 'Email',
          sort: true
        },
        {
          fieldKey: 'phone',
          name: 'Phone',
          sort: true
        },
        {
          fieldKey: 'job_type_id',
          name: 'Job Type',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.job_type_id.job_type_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'job_code_id',
          name: 'Job Code',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.job_code_id.job_code}`;
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
              apiUrl: 'api/users'
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
      url: 'employees/employees/',
      title: 'User',
      pkId: "employee_id",
      exParams: [
        {
          key: 'job_type',
          type: 'script',
          value: 'data.job_type_id.job_type_id'
        },
        {
          key: 'department',
          type: 'script',
          value: 'data.department_id.department_id'
        },
        {
          key: 'designation',
          type: 'script',
          value: 'data.designation_id.designation_id'
        },
        {
          key: 'job_code',
          type: 'script',
          value: 'data.job_code_id.job_code_id'
        },
        {
          key: 'shift',
          type: 'script',
          value: 'data.shift_id.shift_id'
        }
      ],
      fields: [
        {
          key: 'first_name',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'First Name',
            placeholder: 'Enter First name',
            required: true,
          }
        },
        {
          key: 'last_name',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Last Name',
            placeholder: 'Enter Last name',
            required: true,
          }
        },
        {
          key: 'email',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Email',
            placeholder: 'Enter email',
            required: true,
          }
        },
        {
          key: 'phone',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'phone',
            placeholder: 'Enter phone',
            required: true,
          }
        },
        {
          key: 'address',
          type: 'textarea',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'address',
            placeholder: 'Enter address',
            required: true,
          }
        },
        {
          key: 'hire_date',
          type: 'date',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Hire Date',
            placeholder: 'Enter Hire Date',
            required: true,
          }
        },
        {
          key: 'job_type_id',
          type: 'JobTypes-dropdown',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Job Type',
            dataKey: 'job_type_id',
            dataLabel: "job_type_name",
            options: [],
            lazy: {
              url: 'employees/job_types/',
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
          key: 'designation_id',
          type: 'designations-dropdown',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Designation',
            dataKey: 'designation_id',
            dataLabel: "designation_name",
            options: [],
            lazy: {
              url: 'employees/designations/',
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
          key: 'job_code_id',
          type: 'jobCode-dropdown',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Job Code',
            dataKey: 'job_code_id',
            dataLabel: "job_code",
            options: [],
            lazy: {
              url: 'employees/job_codes/',
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
          key: 'department_id',
          type: 'departments-dropdown',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Department',
            dataKey: 'department_id',
            dataLabel: "department_name",
            options: [],
            lazy: {
              url: 'employees/departments/',
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
          key: 'shift_id',
          type: 'shifts-dropdown',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Shift',
            dataKey: 'shift_id',
            dataLabel: "shift_name",
            options: [],
            lazy: {
              url: 'employees/shifts/',
              lazyOneTime: true
            },
            required: true
          },
          hooks: {
            onInit: (field: any) => {
              //field.templateOptions.options = this.cs.getRole();
            }
          }
        }
      ]
    }

  }
  tableConfig: TaTableConfig = {
    apiUrl: 'employees/employees',
    title: 'Employee',
    pkId: "employee_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['id', 'first_name', 'last_name']
    },
    cols: [
      {
        fieldKey: 'employee_id',
        name: 'ID',
        sort: true
      },
      {
        fieldKey: 'first_name',
        name: 'First Name'
      },
      {
        fieldKey: 'last_name',
        name: 'Last Name',
        sort: true
      },
      {
        fieldKey: 'email',
        name: 'Email',
        sort: true
      },
      {
        fieldKey: 'phone',
        name: 'Phone',
        sort: true
      },
      {
        fieldKey: 'job_type_id',
        name: 'Job Type',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.job_type_id.job_type_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'job_code_id',
        name: 'Job Code',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.job_code_id.job_code}`;
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
            apiUrl: 'api/users'
          },
          {
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
            apiUrl: 'api/users'
          },
          {
            type: 'callBackFn',
            label: 'Edit',
            callBackFn: (row, action) => {
              this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            }
          }
        ]
      }
    ]
  };
  options = [
    { label: 'List', value: 'list', icon: 'bars' },
    { label: 'Grid', value: 'grid', icon: 'appstore' }
  ];

  constructor(private http: HttpClient, private msg: NzMessageService, private router: Router) { }

  ngOnInit(): void {
    this.getData((res: any) => {
      this.data = res.results;
      this.list = res.results;
      this.initLoading = false;
    });
  }

  getData(callback: (res: any) => void): void {
    this.http
      .get(fakeDataUrl)
      .pipe(catchError(() => of({ results: [] })))
      .subscribe((res: any) => callback(res));
  }

  onLoadMore(): void {
    this.loadingMore = true;
    this.list = this.data.concat([...Array(count)].fill({}).map(() => ({ loading: true, name: {} })));
    this.http
      .get(fakeDataUrl)
      .pipe(catchError(() => of({ results: [] })))
      .subscribe((res: any) => {
        this.data = this.data.concat(res.results);
        this.list = [...this.data];
        this.loadingMore = false;
      });
  }

  edit(item: any): void {
    this.msg.success(item.email);
  }
  changeView(event: any) {
    console.log('event', event);
  }
}
