import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationFrequenciesComponent } from './notification-frequencies/notification-frequencies.component';
import { NotificationMethodsComponent } from './notification-methods/notification-methods.component';
import { ReminderTypesComponent } from './reminder-types/reminder-types.component';
import { RemindersComponent } from './reminders.component';
import { ReminderSettingsComponent } from './reminder-settings/reminder-settings.component';

const routes: Routes = [
  {
    path : 'reminders',
    component : RemindersComponent
  },
  {
    path : 'reminder_settings',
    component : ReminderSettingsComponent
  },
  {
    path : 'reminder_types',
    component : ReminderTypesComponent
  },
  {
    path : 'notification_frequencies',
    component : NotificationFrequenciesComponent
  },
  {
    path : 'notification_methods',
    component : NotificationMethodsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemindersRoutingModule { }
