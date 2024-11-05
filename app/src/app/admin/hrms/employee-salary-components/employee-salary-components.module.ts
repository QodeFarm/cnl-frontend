import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeSalaryComponentsRoutingModule } from './employee-salary-components-routing.module';
import { EmployeeSalaryComponentsComponent } from './employee-salary-components.component';
import { EmployeeSalaryComponentsListComponent } from './employee-salary-components-list/employee-salary-components-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    EmployeeSalaryComponentsComponent,
    EmployeeSalaryComponentsListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    EmployeeSalaryComponentsRoutingModule
  ]
})
export class EmployeeSalaryComponentsModule { }
