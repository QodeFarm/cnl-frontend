import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeLeaveBalanceRoutingModule } from './employee-leave-balance-routing.module';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    // EmployeeLeaveBalanceComponent,
    // EmployeeLeaveBalanceListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    EmployeeLeaveBalanceRoutingModule
  ]
})
export class EmployeeLeaveBalanceModule { }
