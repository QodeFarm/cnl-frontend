import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { FormlyFieldSwitch } from './field-switch.type';

@NgModule({
  declarations: [FormlyFieldSwitch],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzSwitchModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'switch',
          component: FormlyFieldSwitch,
          wrappers: ['ta-field'],
        },
        {
          name: 'toggle',
          extends: 'switch',
        },
      ],
    }),
  ],
})
export class FormlyFieldSwitchModule {}
