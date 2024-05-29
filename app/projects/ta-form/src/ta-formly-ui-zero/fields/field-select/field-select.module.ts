import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldSelectComponent } from './field-select.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormlyModule } from '@ngx-formly/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormlySelectModule } from '@ngx-formly/core/select';
@NgModule({
  declarations: [
    FieldSelectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzSelectModule,
    FormlySelectModule,
    NzIconModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'select',
          component: FieldSelectComponent,
          wrappers: ['ta-field'],
          defaultOptions:{
            templateOptions:{
              placeholder:'Please Select'
            }
          }
        },
        { name: 'enum', extends: 'select' },
        { name: 'lookup', extends: 'select' }
      ],
    }),
  ]
})
export class FieldSelectModule { }
