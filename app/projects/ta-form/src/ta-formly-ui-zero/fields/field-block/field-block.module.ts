import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldBlockComponent } from './field-block.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';



@NgModule({
  declarations: [FieldBlockComponent],
  imports: [CommonModule,ReactiveFormsModule, FormlyModule.forChild({
    types: [
      {
        name: 'field-block',
        component: FieldBlockComponent
      }
    ]})
  ]
})
export class FieldBlockModule { }
