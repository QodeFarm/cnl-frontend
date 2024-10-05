import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemindersRoutingModule } from './reminders-routing.module';
import { RemindersComponent } from './reminders.component';
import { RemindersListComponent } from './reminders-list/reminders-list.component';
import { NotificationFrequenciesComponent } from './notification-frequencies/notification-frequencies.component';
import { NotificationMethodsComponent } from './notification-methods/notification-methods.component';
import { ReminderTypesComponent } from './reminder-types/reminder-types.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ReminderSettingsComponent } from './reminder-settings/reminder-settings.component';


@NgModule({
  declarations: [
    RemindersComponent,
    NotificationMethodsComponent,
    NotificationFrequenciesComponent,
    ReminderTypesComponent,
    ReminderSettingsComponent,
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    RemindersRoutingModule,
    RemindersListComponent
  ],
  exports:[
    NotificationMethodsComponent,
    NotificationFrequenciesComponent,
    ReminderTypesComponent,
    ReminderSettingsComponent,
  ]
})
export class RemindersModule { }
