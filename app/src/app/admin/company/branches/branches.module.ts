import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchesRoutingModule } from './branches-routing.module';
import { BranchListComponent } from './branch-list/branch-list.component';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    BranchesRoutingModule,
    BranchListComponent
  ]
})
export class BranchesModule { }
