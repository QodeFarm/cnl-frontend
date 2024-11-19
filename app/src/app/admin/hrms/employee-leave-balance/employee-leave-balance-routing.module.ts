import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeLeaveBalanceListComponent } from './employee-leave-balance-list/employee-leave-balance-list.component';

const routes: Routes = [
  {
    path:"",
    component:EmployeeLeaveBalanceListComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeLeaveBalanceRoutingModule { }
