import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeLoginComponent } from './employee-login/employee-login.component';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { EmployeePortalLayoutComponent } from './employee-portal-layout.component';



@NgModule({
  declarations: [
    EmployeeLoginComponent,
    EmployeeDashboardComponent,
    EmployeePortalLayoutComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule
  ]
})
export class EmployeePortalModule { }
