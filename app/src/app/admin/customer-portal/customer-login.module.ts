import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerLoginComponent } from './customer-login.component';

@NgModule({
  declarations: [CustomerLoginComponent],
  imports: [
    CommonModule,
    FormsModule // This is required for ngModel
  ],
  exports: [CustomerLoginComponent]
})
export class CustomerLoginModule { }