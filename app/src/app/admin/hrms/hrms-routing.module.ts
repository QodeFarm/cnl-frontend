import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './hrms.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DesignationsComponent } from './designations/designations.component';
import { JobTypesComponent } from './job-types/job-types.component';
import { JobCodesComponent } from './job-codes/job-codes.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { SalaryComponentsComponent } from './salary-components/salary-components.component';
import { LeaveTypesComponent } from './leave-types/leave-types.component';
import { EmployeeLeavesComponent } from './employee-leaves/employee-leaves.component';
import { LeaveApprovalsComponent } from './leave-approvals/leave-approvals.component';
import { EmployeeLeaveBalanceComponent } from './employee-leave-balance/employee-leave-balance.component';
import { SwipesComponent } from './swipes/swipes.component';
import { EmployeeSalaryComponent } from './employee-salary/employee-salary.component';
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent // employee component
  },
  {
    path: 'job_types',
    component: JobTypesComponent
  },
  {
    path: 'departments',
    component: DepartmentsComponent
  },
  {
    path: 'designations',
    component: DesignationsComponent
  },
  {
    path: 'job_codes',
    component: JobCodesComponent
  },
  {
    path: 'shifts',
    component: ShiftsComponent
  },
  {
    path: 'employee-salary',
    component: EmployeeSalaryComponent
  },
  {
    path: 'salary-components',
    component: SalaryComponentsComponent
  },
  {
    path: 'employee-salary-components',
    component: EmployeeSalaryComponent
  },
  {
    path: 'leave_types',
    component: LeaveTypesComponent
  },
  {
    path: 'employee-leaves',
    component: EmployeeLeavesComponent
  },
  {
    path: 'leave-approvals',
    component: LeaveApprovalsComponent
  },
  {
    path: 'employee-leave-balance',
    component: EmployeeLeaveBalanceComponent
  },
  {
    path: 'employee-attendance',
    component: EmployeeAttendanceComponent
  },
  {
    path: 'swipes',
    component: SwipesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmsRoutingModule { }
