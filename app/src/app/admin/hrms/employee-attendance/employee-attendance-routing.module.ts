import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeAttendanceComponent } from './employee-attendance.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeAttendanceComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeAttendanceRoutingModule { }
