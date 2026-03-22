import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerPortalLayoutComponent } from './customer-portal-layout.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    AdminCommmonModule,
    HttpClientModule,
    CustomerPortalLayoutComponent,
  ],
  exports: [CustomerPortalLayoutComponent]
})
export class CustomerPortalModule { }