import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldRepeatComponent } from './field-repeat.component';

describe('FieldRepeatComponent', () => {
  let component: FieldRepeatComponent;
  let fixture: ComponentFixture<FieldRepeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldRepeatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldRepeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
