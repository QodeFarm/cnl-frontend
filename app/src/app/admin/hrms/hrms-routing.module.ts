import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './hrms.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DesignationsComponent } from './designations/designations.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent // employee component
  },
  {
    path: 'departments',
    component: DepartmentsComponent
  },
  {
    path: 'designations',
    component: DesignationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmsRoutingModule { }
