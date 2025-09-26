import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ta-field-tabs',
  templateUrl: './field-tabs.component.html',
  styleUrls: ['./field-tabs.component.css']
})
export class FieldTabsComponent extends FieldType {

  activeTab = 0;

  selectTab(index: number) {
    this.activeTab = index;
  }
  hasError(field: any): boolean {
    if (!field) return false;

    // Case 1: Direct control

    // Case 2: FieldGroup
    if (field.fieldGroup?.length) {
      return field.fieldGroup.some((child: any) => this.hasError(child));
    } else {
      if (field.formControl) {
        return field.formControl.invalid;
      }
    }

    // Case 3: FieldArray
    if (field.fieldArray && field.formControl?.controls) {
      return field.formControl.controls.some((ctrl: any) =>
        this.hasError({ ...field.fieldArray, formControl: ctrl })
      );
    }

    return false;
  }
  countErrors(field: any): number {
    if (!field) return 0;

    if (field.fieldGroup?.length) {
      return field.fieldGroup.reduce((acc, child) => acc + this.countErrors(child), 0);
    } else {
      if (field.formControl) {
        return field.formControl.invalid ? 1 : 0;
      }
    }

    if (field.fieldArray && field.formControl?.controls) {
      return field.formControl.controls.reduce(
        (acc: number, ctrl: any) => acc + this.countErrors({ ...field.fieldArray, formControl: ctrl }),
        0
      );
    }

    return 0;
  }


}