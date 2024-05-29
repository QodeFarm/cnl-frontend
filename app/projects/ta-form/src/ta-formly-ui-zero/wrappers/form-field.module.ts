import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyWrapperFormField } from './form-field.wrapper';
import { FieldViewmodeValuePipe } from './field-viewmode-value.pipe';
import { FormlyWrapperShowMore } from './showmore.wrapper';

@NgModule({
    declarations: [FormlyWrapperFormField, FieldViewmodeValuePipe,FormlyWrapperShowMore],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormlyModule.forChild({
            wrappers: [
                {
                    name: 'form-field',
                    component: FormlyWrapperFormField,
                },
                {
                    name: 'ta-field',
                    component: FormlyWrapperFormField,
                },
                {
                    name:'show-more',
                    component:FormlyWrapperShowMore
                }
            ],
        }),
    ],
})
export class TaFormFieldModule { }