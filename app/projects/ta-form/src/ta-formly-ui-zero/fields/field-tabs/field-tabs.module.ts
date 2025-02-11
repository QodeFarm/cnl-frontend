import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldTabsComponent } from './field-tabs.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';



@NgModule({
  declarations: [FieldTabsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzTabsModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'tabs',
          component: FieldTabsComponent
        }
      ],
    })
  ]
})
export class FieldTabsModule { }