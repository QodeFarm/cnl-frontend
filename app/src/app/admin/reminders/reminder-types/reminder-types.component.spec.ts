import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderTypesComponent } from './reminder-types.component';

describe('ReminderTypesComponent', () => {
  let component: ReminderTypesComponent;
  let fixture: ComponentFixture<ReminderTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReminderTypesComponent]
    });
    fixture = TestBed.createComponent(ReminderTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
