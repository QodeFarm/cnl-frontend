import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldAdvSelectComponent } from './field-adv-select.component';

describe('FieldAdvSelectComponent', () => {
  let component: FieldAdvSelectComponent;
  let fixture: ComponentFixture<FieldAdvSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FieldAdvSelectComponent]
    });
    fixture = TestBed.createComponent(FieldAdvSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
