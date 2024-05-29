import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldConcatComponent } from './field-concat/field-concat.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaCoreModule } from '@ta/ta-core';
import { FormlyModule } from '@ngx-formly/core';



@NgModule({
  declarations: [
    FieldConcatComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaCoreModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'concat',
          component: FieldConcatComponent,
          wrappers: ['ta-field'],
        }]
    })
  ]
})
export class FieldCommonModule { }
