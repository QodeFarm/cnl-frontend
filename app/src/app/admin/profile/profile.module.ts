import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HelpIconComponent } from '../help/help-icon.component';


@NgModule({
  declarations: [
    ProfileComponent,
    // ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    AdminCommmonModule,
    HelpIconComponent
  ],
  exports:[
    // ChangePasswordComponent
    ProfileComponent
  ]

})
export class ProfileModule { }
