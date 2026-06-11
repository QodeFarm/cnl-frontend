import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-leave-balance',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './employee-leave-balance.component.html',
  styleUrls: ['./employee-leave-balance.component.scss']
})

export class EmployeeLeaveBalanceComponent implements OnInit {
  isEmployeePortal: boolean = false;
  employeeId: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {};

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    hideAddBtn: true,
    tableConfig: {
      apiUrl: 'hrms/employee_leave_balance/',
      title: 'Employee Leave Balance',
      pkId: "balance_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['employee','leave_type','leave_balance','year']
      },
      export: {downloadName: 'EmployeeLeaveBalance'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'employee',
          name: 'Employee',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            const firstName = row.employee?.first_name || '';
            const lastName = row.employee?.last_name || '';
            return `${firstName} ${lastName}`.trim();
          },
        }, 
        {
          fieldKey: 'leave_type',
          name: 'Leave Type',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.leave_type?.leave_type_name || '-'}`;
          },
        },
        {
          fieldKey: 'leave_balance',
          name: 'Leave Balance',
          sort: true
        },
        {
          fieldKey: 'year',
          name: 'Year',
          sort: true
        },
      ]
    },
    formConfig: {
      url: 'hrms/employee_leave_balance/',
      title: 'Employee Leave Balance',
      pkId: "balance_id",
      exParams: [
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
        },
        {
          key: 'leave_type_id',
          type: 'script',
          value: 'data.leave_type.leave_type_id'
        }
      ],
      fields: [],
    }
  };

  ngOnInit() {
    // Check if this is employee portal
    this.route.data.subscribe(data => {
      this.isEmployeePortal = data['employeeView'] || false;
      
      if (this.isEmployeePortal) {
        // Get employee ID from localStorage (employee-specific key)
        const user = JSON.parse(localStorage.getItem('employee_user') || '{}');
        this.employeeId = user.id || null;
        
        console.log('Employee Portal Mode - Employee ID:', this.employeeId);
        
        // Update the config for employee view
        this.updateConfigForEmployee();
      }
    });
  }

  updateConfigForEmployee() {
    // Set API URL with employee filter
    this.curdConfig.tableConfig.apiUrl = `hrms/employee_leave_balance/?employee_id=${this.employeeId}`;
    
    // Add fixed filters
    this.curdConfig.tableConfig.fixedFilters = [
      { key: 'employee_id', value: this.employeeId }
    ];

    // Remove export option for employees
    this.curdConfig.tableConfig.export = undefined;
    
    // Remove checkboxes for employees
    this.curdConfig.tableConfig.showCheckbox = false;
    
    // Update title for employee view
    this.curdConfig.tableConfig.title = 'My Leave Balance';
    
    // Remove the Employee column since it will only show current employee
    this.curdConfig.tableConfig.cols = this.curdConfig.tableConfig.cols.filter(
      (col: any) => col.fieldKey !== 'employee'
    );

    console.log('Updated leave balance config for employee:', this.curdConfig);
  }
}