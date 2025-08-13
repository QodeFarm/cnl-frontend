import { NgModule } from '@angular/core';
import { FieldAdvSelectComponent } from './field-adv-select.component';

import { FormlyModule } from '@ngx-formly/core';



@NgModule({
  declarations: [
  ],
  imports: [
    FieldAdvSelectComponent,
    FormlyModule.forChild({
      types: [
        {
          name: 'adv-select',
          component: FieldAdvSelectComponent,
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select'
            }
          }
        }
      ],
    }),
  ]
})
export class FieldAdvSelectModule { }
