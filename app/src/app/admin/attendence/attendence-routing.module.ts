import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendenceComponent } from './attendence.component';

const routes: Routes = [
  {
    path: '',
    component: AttendenceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendenceRoutingModule { }
