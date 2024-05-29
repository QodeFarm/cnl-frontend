import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ta-wrapper-nz-form-field',
  template: `
    <nz-form-item>
      <ng-container *ngIf="to.label && to.hideLabel !== true">
        <nz-form-label [nzRequired]="to.required && to.hideRequiredMarker !== true" [nzFor]="id">
          {{ to.label }}
        </nz-form-label>
      </ng-container>
      <nz-form-control [nzValidateStatus]="errorState" [nzErrorTip]="errorTpl">
        <div *ngIf="to.viewMode || formState.viewMode" class="field-value">{{field.formControl?.value | fieldValue:field:to }}</div> 
        <div [style.display]="(to.viewMode || formState.viewMode)?'none':'block'"> <ng-container   #fieldComponent></ng-container></div>
        
        <ng-template #errorTpl let-control>
          <formly-validation-message [field]="field"></formly-validation-message>
        </ng-template>
      </nz-form-control>
    </nz-form-item>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyWrapperFormField extends FieldWrapper {
  get errorState() {
    return this.showError ? 'error' : '';
  }
}