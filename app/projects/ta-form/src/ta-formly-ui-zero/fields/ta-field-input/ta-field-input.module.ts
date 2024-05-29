import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaFieldInputComponent } from './ta-field-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormlyModule } from '@ngx-formly/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [
    TaFieldInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'input',
          component: TaFieldInputComponent,
          wrappers: ['ta-field'],
        },
        { name: 'string', extends: 'input' },
        { name: 'text', extends: 'input' },
        {
          name: 'number',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number',
            },
          },
        },
        {
          name: 'integer',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number',
            },
          },
        },
        {
          name: 'phoneNuber',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              maxLength:10,
              minLength:10
            },
          },
        }
      ],
    })
  ],
  exports:[TaFieldInputComponent]
})
export class TaFieldInputModule { 
  static rootComponent = TaFieldInputComponent;
}
