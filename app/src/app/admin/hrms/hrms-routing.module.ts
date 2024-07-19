import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrmsComponent } from './hrms.component';

const routes: Routes = [
  {
    path: '',
    component: HrmsComponent // employee component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmsRoutingModule { }
