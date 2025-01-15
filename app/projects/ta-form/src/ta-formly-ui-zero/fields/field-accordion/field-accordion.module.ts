import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldAccordionComponent } from './field-accordion.component';
import { FormlyModule } from '@ngx-formly/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FieldAccordionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'accordion',
          component: FieldAccordionComponent
        }
      ],
    })
  ]
})
export class FieldAccordionModule { }
