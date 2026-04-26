import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerPortalLayoutComponent } from './customer-portal-layout.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomerResetPasswordComponent } from './customer-reset-password/customer-reset-password.component';
import { CustomerForgotPasswordComponent } from './customer-forgot-password/customer-forgot-password.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    AdminCommmonModule,
    HttpClientModule,
    CustomerPortalLayoutComponent,
    CustomerResetPasswordComponent,
    CustomerForgotPasswordComponent
  ],
  exports: [
    CustomerPortalLayoutComponent,
    CustomerResetPasswordComponent,
    CustomerForgotPasswordComponent,
  ]
})
export class CustomerPortalModule { }