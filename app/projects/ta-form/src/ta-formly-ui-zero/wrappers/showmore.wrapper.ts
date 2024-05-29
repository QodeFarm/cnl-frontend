import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ta-wrapper-showmore',
  template: `
    <div class="text-right pt-2" (click)="showMore = !showMore">
      <div *ngIf="!showMore">+ show more</div>
      <div *ngIf="showMore">- Hide all</div>
    </div>
    <div class="card" *ngIf="showMore">
      <h3 class="card-header" *ngIf="props.label">{{ props.label }}</h3>
      <div class="card-body">
        <ng-container #fieldComponent></ng-container>
      </div>
    </div>
  `
})
export class FormlyWrapperShowMore extends FieldWrapper implements OnInit{
  showMore = false;
  get errorState() {
    return this.showError ? 'error' : '';
  }
  ngOnInit(): void {
    //this.ref.markForCheck();
  }
}