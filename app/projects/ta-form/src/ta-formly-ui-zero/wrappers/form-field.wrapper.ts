import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ta-wrapper-form-field',
  template: `
  <ng-template #labelTemplate>
      <label *ngIf="to.label && to.hideLabel !== true" [attr.for]="id" class="form-label mb-0">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true" aria-hidden="true">*</span>
      </label>
  </ng-template>
  <div class="" [class.form-floating]="to.labelPosition === 'floating'" [class.has-error]="showError">
    <ng-container *ngIf="to.labelPosition !== 'floating'">
      <ng-container [ngTemplateOutlet]="labelTemplate"></ng-container>
    </ng-container>
    <div class="ta-field">
       <ng-template #fieldComponent></ng-template>
    </div>
    <ng-container *ngIf="to.labelPosition === 'floating'">
      <ng-container [ngTemplateOutlet]="labelTemplate"></ng-container>
    </ng-container>
    <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
      <formly-validation-message [field]="field"></formly-validation-message>
    </div>
    <small *ngIf="to.description" class="form-text text-muted">{{ to.description }}</small>
  </div>
  `
})
export class FormlyWrapperFormField extends FieldWrapper implements OnInit{

  get errorState() {
    return this.showError ? 'error' : '';
  }
  ngOnInit(): void {
    //this.ref.markForCheck();
  }
}