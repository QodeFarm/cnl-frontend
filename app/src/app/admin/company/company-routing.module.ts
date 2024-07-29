import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company.component';
import { BranchesComponent } from './branches/branches.component';

const routes: Routes = [
  {
    path : '',
    component: CompanyComponent,
  },
  {
    path : 'branches',
    component: BranchesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
