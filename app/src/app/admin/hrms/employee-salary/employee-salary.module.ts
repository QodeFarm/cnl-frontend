import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeSalaryRoutingModule } from './employee-salary-routing.module';
import { EmployeeSalaryComponent } from './employee-salary.component';
import { EmployeeSalaryListComponent } from './employee-salary-list/employee-salary-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    EmployeeSalaryComponent,
    EmployeeSalaryListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    EmployeeSalaryRoutingModule
  ]
})
export class EmployeeSalaryModule { }
