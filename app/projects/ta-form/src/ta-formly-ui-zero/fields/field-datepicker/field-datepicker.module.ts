import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldDatepickerComponent } from './field-datepicker.component';
import { FormlyModule } from '@ngx-formly/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FieldDatepickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'date',
          component: FieldDatepickerComponent,
          wrappers: ['ta-field'],
        }
      ],
    })
  ]
})
export class FieldDatepickerModule { }
