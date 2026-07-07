import { Component, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'
import { DoubleClickNavigationService } from 'src/app/services/double-click-navigation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-salary-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './employee-salary-list.component.html',
  styleUrls: ['./employee-salary-list.component.scss']
})
export class EmployeeSalaryListComponent implements OnInit {

  @Output('edit') edit = new EventEmitter<any>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;
  
  // Employee portal properties
  isEmployeePortal: boolean = false;
  employeeId: string | null = null;

  refreshTable() {
    if (this.taTableComponent) {
      this.taTableComponent.refresh();
    }
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'hrms/employee_salary/',
    showCheckbox: true,
    pkId: "salary_id",
    rowEvents: {
      dblclick: this.dblClickNav.createHandler({ pkField: 'salary_id', moduleName: 'HRMS', sectionName: 'Employee Salary', editEmitter: this.edit }),
    },
    pageSize: 10,
    "globalSearch": {
      keys: ['salary_start_date','salary_end_date','salary_amount','salary_currency','employee_id']
    },
    export: {downloadName: 'EmployeeSalaryList'},
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'salary_start_date',
        name: 'Salary Start Date',
        sort: true
      },
      {
        fieldKey: 'salary_end_date',
        name: 'Salary End Date',
        sort: true
      },
      {
        fieldKey: 'salary_amount', 
        name: 'Salary Amount',
        sort: true
      }, 
      {
        fieldKey: 'salary_currency', 
        name: 'Salary Currency',
        sort: true
      }, 
      {
        fieldKey: 'employee_id',
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
        fieldKey: "code",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            apiUrl: 'hrms/employee_salary',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'restore',
            label: 'Restore',
            apiUrl: 'hrms/employee_salary',
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
              this.edit.emit(row.salary_id);
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

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.isEmployeePortal = data['employeeView'] || false;
      
      if (this.isEmployeePortal) {
        const user = JSON.parse(localStorage.getItem('employee_user') || '{}');
        let rawEmployeeId = user.id || null;
        
        // Remove hyphens from UUID to match database format
        if (rawEmployeeId) {
          this.employeeId = rawEmployeeId.replace(/-/g, '');
        }
        
        console.log('Employee Portal Mode - Original Employee ID:', rawEmployeeId);
        console.log('Employee Portal Mode - Formatted Employee ID:', this.employeeId);
        
        // Update API URL with employee filter (without hyphens)
        this.tableConfig.apiUrl = `hrms/employee_salary/?employee_id=${this.employeeId}`;
        
        // Remove actions for employees
        this.tableConfig.cols = this.tableConfig.cols.map(col => {
          if (col.fieldKey === 'code') {
            col.actions = [];
          }
          return col;
        });
        
        // Remove export and checkboxes
        this.tableConfig.export = undefined;
        this.tableConfig.showCheckbox = false;
        
        // Update title
        this.tableConfig.title = 'My Salary Details';
        
        // Remove Employee column
        this.tableConfig.cols = this.tableConfig.cols.filter(
          (col: any) => col.fieldKey !== 'employee_id'
        );
        
        console.log('Updated API URL for Employee Portal:', this.tableConfig.apiUrl);
        
        // Force refresh after view is initialized
        setTimeout(() => {
          if (this.taTableComponent) {
            this.taTableComponent.refresh();
          }
        }, 100);
      }
    });
  }
}