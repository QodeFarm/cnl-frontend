import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { customerCudConfig } from '../utils/master-curd-config';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'customer-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select',
              label: 'Customer Category',
              dataKey: 'customer_category_id',
              dataLabel: 'name',
              required: true,
              curdConfig: customerCudConfig
            }
          }
        }
      ],
    })
  ]
})
export class FomrlyMasterAdvSelectFieldsModule { }
