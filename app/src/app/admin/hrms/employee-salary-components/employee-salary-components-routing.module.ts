import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeSalaryComponentsListComponent } from './employee-salary-components-list/employee-salary-components-list.component';

const routes: Routes = [
  {
    path:"",
    component:EmployeeSalaryComponentsListComponent
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeSalaryComponentsRoutingModule { }
