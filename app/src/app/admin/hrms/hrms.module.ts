import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrmsRoutingModule } from './hrms-routing.module';
import { EmployeesComponent } from './hrms.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { DepartmentsComponent } from './departments/departments.component';
import { DesignationsComponent } from './designations/designations.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { JobTypesComponent } from './job-types/job-types.component';
import { JobCodesComponent } from './job-codes/job-codes.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { SalaryComponentsComponent } from './salary-components/salary-components.component';
import { EmployeeSalaryListComponent } from './employee-salary/employee-salary-list/employee-salary-list.component';
import { EmployeeSalaryComponentsComponent } from './employee-salary-components/employee-salary-components.component';
import { LeaveTypesComponent } from './leave-types/leave-types.component';
import { EmployeeLeavesListComponent } from './employee-leaves/employee-leaves-list/employee-leaves-list.component';
import { LeaveApprovalsComponent } from './leave-approvals/leave-approvals.component';
import { EmployeeLeaveBalanceComponent } from './employee-leave-balance/employee-leave-balance.component';
import { SwipesListComponent } from './swipes/swipes-list/swipes-list.component';
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';



@NgModule({
  declarations: [
    DepartmentsComponent,
    DesignationsComponent,
    JobTypesComponent,
    JobCodesComponent,
    ShiftsComponent,
    SalaryComponentsComponent,
    EmployeeSalaryComponentsComponent,
    LeaveTypesComponent,
  ],
  imports: [
    CommonModule,
    HrmsRoutingModule,
    AdminCommmonModule,
    EmployeeListComponent,
    EmployeeSalaryListComponent,
    EmployeeLeavesListComponent,
    LeaveApprovalsComponent,
    EmployeeLeaveBalanceComponent,
    SwipesListComponent,
    EmployeeAttendanceComponent,
  ],
  exports:[
    JobTypesComponent,
    DepartmentsComponent,
    DesignationsComponent,
    JobCodesComponent,
    ShiftsComponent,
    SalaryComponentsComponent,
    EmployeeSalaryComponentsComponent,
    LeaveTypesComponent,
  ]
})
export class EmployeeModule {};