import { NgModule } from '@angular/core';
import { TaFieldInputModule } from './fields/ta-field-input/ta-field-input.module';
import { FieldSelectModule } from './fields/field-select/field-select.module';
import { FieldRepeatModule } from './fields/field-repeat/field-repeat.module';
import { FieldDatepickerModule } from './fields/field-datepicker/field-datepicker.module';
import { TaFormFieldModule } from './wrappers/form-field.module';
import { FormlyTaTextAreaModule } from './fields/textarea/textarea.module';
import { FormlyTaRadioModule } from './fields/ta-radio/radio.module';
import { FormlyTaCheckboxModule } from './fields/checkbox/checkbox.module';
import { FieldFileModule } from './fields/field-file/field-file.module';
import { FieldCommonModule } from './fields/field-common/field-common.module';
import { FieldAccordionModule } from './fields/field-accordion/field-accordion.module';
import { FieldTabsModule } from './fields/field-tabs/field-tabs.module';



@NgModule({
  declarations: [],
  imports: [
    TaFormFieldModule,
    TaFieldInputModule,
    FormlyTaTextAreaModule,
    FormlyTaRadioModule,
    FormlyTaCheckboxModule,
    FieldSelectModule,
    FieldRepeatModule,
    FieldDatepickerModule,
    FieldFileModule,
    FieldCommonModule,
    FieldAccordionModule,
    FieldTabsModule
  ]
})
export class TaFormlyUiZeroModule { }
