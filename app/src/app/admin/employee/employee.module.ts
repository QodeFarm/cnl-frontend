import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeCreateComponent
  ],
  imports: [
    AdminCommmonModule,
    CommonModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule { }
