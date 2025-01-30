import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeLeavesRoutingModule } from './employee-leaves-routing.module';
import { EmployeeLeavesComponent } from './employee-leaves.component';
import { EmployeeLeavesListComponent } from './employee-leaves-list/employee-leaves-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    EmployeeLeavesComponent,
    EmployeeLeavesListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    EmployeeLeavesRoutingModule
  ]
})
export class EmployeeLeavesModule { }
