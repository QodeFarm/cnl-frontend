import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { BranchesComponent } from './branches/branches.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    CompanyComponent,
    BranchesComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    AdminCommmonModule,
  ]
})
export class CompanyModule { }
