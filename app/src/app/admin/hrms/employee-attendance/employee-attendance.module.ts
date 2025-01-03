import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeAttendanceRoutingModule } from './employee-attendance-routing.module';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    // EmployeeAttendanceComponent
  ],
  imports: [
    CommonModule,
    EmployeeAttendanceRoutingModule,
    AdminCommmonModule
  ]
})
export class EmployeeAttendanceModule { }
