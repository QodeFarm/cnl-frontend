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
import { LeaveTypesComponent } from './leave-types/leave-types.component';
import { EmployeeLeavesListComponent } from './employee-leaves/employee-leaves-list/employee-leaves-list.component';
import { LeaveApprovalsListComponent } from './leave-approvals/leave-approvals-list/leave-approvals-list.component';
import { EmployeeLeaveBalanceListComponent } from './employee-leave-balance/employee-leave-balance-list/employee-leave-balance-list.component';
import { AttendanceListComponent } from './attendance/attendance-list/attendance-list.component';
import { SwipesListComponent } from './swipes/swipes-list/swipes-list.component';
import { EmployeeSalaryListComponent } from './employee-salary/employee-salary-list/employee-salary-list.component';
import { EmployeeSalaryComponentsListComponent } from './employee-salary-components/employee-salary-components-list/employee-salary-components-list.component';


@NgModule({
  declarations: [
    // EmployeesComponent,
    DepartmentsComponent,
    DesignationsComponent,
    JobTypesComponent,
    JobCodesComponent,
    ShiftsComponent,
    SalaryComponentsComponent,
    LeaveTypesComponent,
  ],
  imports: [
    CommonModule,
    HrmsRoutingModule,
    AdminCommmonModule,
    EmployeeListComponent,
    EmployeeSalaryListComponent,
    EmployeeSalaryComponentsListComponent,
    EmployeeLeavesListComponent,
    LeaveApprovalsListComponent,
    EmployeeLeaveBalanceListComponent,
    AttendanceListComponent,
    SwipesListComponent,
  ],
  exports:[
    JobTypesComponent,
    DepartmentsComponent,
    DesignationsComponent,
    JobCodesComponent,
    ShiftsComponent,
    SalaryComponentsComponent,
    LeaveTypesComponent,
  ]
})
export class EmployeeModule {};