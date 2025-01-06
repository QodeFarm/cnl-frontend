import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeLeaveBalanceComponent } from './employee-leave-balance.component';

const routes: Routes = [
  {
    path:"",
    component:EmployeeLeaveBalanceComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeLeaveBalanceRoutingModule { }
