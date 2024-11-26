import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeSalaryListComponent } from './employee-salary-list/employee-salary-list.component';

const routes: Routes = [
  {
    path:"",
    component:EmployeeSalaryListComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeSalaryRoutingModule { }
