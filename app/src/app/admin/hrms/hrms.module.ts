import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrmsRoutingModule } from './hrms-routing.module';
import { EmployeesComponent } from './hrms.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { DepartmentsComponent } from './departments/departments.component';
import { DesignationsComponent } from './designations/designations.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';


@NgModule({
  declarations: [
    // EmployeesComponent,
    DepartmentsComponent,
    DesignationsComponent,
  ],
  imports: [
    CommonModule,
    HrmsRoutingModule,
    AdminCommmonModule,
    EmployeeListComponent
  ],
  exports:[
    DepartmentsComponent,
    DesignationsComponent,
  ]
})
export class EmployeeModule {};