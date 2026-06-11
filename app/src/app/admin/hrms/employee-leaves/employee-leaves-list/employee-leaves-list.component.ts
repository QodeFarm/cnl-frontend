import { Component, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'
import { DoubleClickNavigationService } from 'src/app/services/double-click-navigation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-leaves-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './employee-leaves-list.component.html',
  styleUrls: ['./employee-leaves-list.component.scss']
})
export class EmployeeLeavesListComponent implements OnInit {

  @Output('edit') edit = new EventEmitter<any>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;
  
  isEmployeePortal: boolean = false;
  employeeId: string | null = null;

  refreshTable() {
   this.taTableComponent?.refresh();
  };

  ngOnInit() {
    // Check if this is employee portal
    this.route.data.subscribe(data => {
      this.isEmployeePortal = data['employeeView'] || false;
      
      if (this.isEmployeePortal) {
        // Get employee ID from localStorage (employee-specific key)
        const user = JSON.parse(localStorage.getItem('employee_user') || '{}');
        console.log('Employee user data from localStorage:', user);
        this.employeeId = user.id || null;
        
        console.log('Employee Portal Mode - Employee ID:', this.employeeId);
        
        // Update the table config for employee view
        this.updateTableConfigForEmployee();
      }
    });
  }

  updateTableConfigForEmployee() {
    // Set API URL with employee filter
    this.tableConfig.apiUrl = `hrms/employee_leaves/?employee_id=${this.employeeId}`;
    
    // Update fixed filters
    this.tableConfig.fixedFilters = [
      { key: 'employee_id', value: this.employeeId }
    ];

    // Remove admin-only actions (keep only edit for pending leaves)
    this.tableConfig.cols = this.tableConfig.cols.map(col => {
      if (col.fieldKey === 'code') {
        // For employee portal, only keep edit action
        col.actions = [
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            tooltip: "Edit this record",
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.leave_id);
            }
          }
        ];
      }
      return col;
    });

    // Remove export option for employees
    this.tableConfig.export = undefined;
    
    // Remove checkboxes for employees
    this.tableConfig.showCheckbox = false;
    
    // Update title for employee view
    this.tableConfig.title = 'My Leaves';
    
    // Remove the Employee column since it will only show current employee
    this.tableConfig.cols = this.tableConfig.cols.filter(
      (col: any) => col.fieldKey !== 'employee'
    );

    console.log('Updated leaves table config for employee:', this.tableConfig);
  }

  tableConfig: TaTableConfig = {
    apiUrl: 'hrms/employee_leaves/',
    showCheckbox: true,
    pkId: "leave_id",
    title: 'Employee Leaves',
    rowEvents: {
      dblclick: this.dblClickNav.createHandler({ pkField: 'leave_id', moduleName: 'HRMS', sectionName: 'Employee Leave', editEmitter: this.edit }),
    },
    pageSize: 10,
    "globalSearch": {
      keys: ['employee','start_date','end_date','comments','leave_type']
    },
    export: {downloadName: 'EmployeeLeavesList'},
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
        fieldKey: 'start_date',
        name: 'Start Date',
        sort: true
      },
      {
        fieldKey: 'end_date',
        name: 'End Date',
        sort: true
      },
      {
        fieldKey: 'comments', 
        name: 'Comments',
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
            apiUrl: 'hrms/employee_leaves',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'restore',
            label: 'Restore',
            apiUrl: 'hrms/employee_leaves',
            confirm: true,
            confirmMsg: "Sure to restore?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            tooltip: "Edit this record",
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.leave_id);
            }
          }
        ]
      }
    ]
  };
  
  constructor(
    private router: Router, 
    private dblClickNav: DoubleClickNavigationService,
    private route: ActivatedRoute
  ) {}
}