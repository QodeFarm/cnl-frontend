import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { TaFieldInrDisplayComponent } from './ta-field-inr-display.component';

@NgModule({
  declarations: [TaFieldInrDisplayComponent],
  imports: [
    CommonModule,
    FormlyModule.forChild({
      types: [
        { name: 'inrDisplay', component: TaFieldInrDisplayComponent, wrappers: ['ta-field'] },
      ],
    }),
  ],
  exports: [TaFieldInrDisplayComponent],
})
export class FieldInrDisplayModule { }
