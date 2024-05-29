import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FieldRepeatComponent } from './field-repeat.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
@NgModule({
  declarations: [
    FieldRepeatComponent
  ],
  imports: [
    CommonModule,
    NzCardModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'repeat',
          component: FieldRepeatComponent,
          wrappers: ['ta-field'],
        },
        { name: 'table', extends: 'repeat' },
      ],
    }),
  ]
})
export class FieldRepeatModule { }
