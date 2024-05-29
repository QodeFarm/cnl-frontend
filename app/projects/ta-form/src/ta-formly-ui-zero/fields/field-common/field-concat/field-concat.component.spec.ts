import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldConcatComponent } from './field-concat.component';

describe('FieldConcatComponent', () => {
  let component: FieldConcatComponent;
  let fixture: ComponentFixture<FieldConcatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FieldConcatComponent]
    });
    fixture = TestBed.createComponent(FieldConcatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
