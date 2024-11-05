import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveTypesComponent } from './leave-types.component';

describe('LeaveTypesComponent', () => {
  let component: LeaveTypesComponent;
  let fixture: ComponentFixture<LeaveTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveTypesComponent]
    });
    fixture = TestBed.createComponent(LeaveTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
