import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeLeavesListComponent } from './employee-leaves-list/employee-leaves-list.component';

const routes: Routes = [
  {
    path:"",
    component:EmployeeLeavesListComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeLeavesRoutingModule { }
