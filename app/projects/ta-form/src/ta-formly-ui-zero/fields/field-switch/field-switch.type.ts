import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-nz-switch',
  template: `
    <div class="switch-field-wrapper">
      <nz-switch 
        [formControl]="formControl"
        [nzCheckedChildren]="to.checkedLabel || 'Active'"
        [nzUnCheckedChildren]="to.uncheckedLabel || 'Inactive'"
        [nzDisabled]="to.disabled"
        [nzLoading]="to.loading"
        [nzSize]="to.size || 'default'"
      ></nz-switch>
      <span *ngIf="to.showLabel !== false" class="switch-label ms-2">
        {{ formControl.value ? (to.checkedLabel || 'Active') : (to.uncheckedLabel || 'Inactive') }}
      </span>
    </div>
  `,
  styles: [`
    .switch-field-wrapper {
      display: flex;
      align-items: center;
      padding: 8px 0;
    }
    .switch-label {
      font-size: 14px;
      color: #666;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSwitch extends FieldType {
  defaultOptions = {
    templateOptions: {
      hideLabel: false,
      checkedLabel: 'Active',
      uncheckedLabel: 'Inactive',
      showLabel: true,
    },
  };
}
