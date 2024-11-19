import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApprovalsListComponent } from './leave-approvals-list.component';

describe('LeaveApprovalsListComponent', () => {
  let component: LeaveApprovalsListComponent;
  let fixture: ComponentFixture<LeaveApprovalsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveApprovalsListComponent]
    });
    fixture = TestBed.createComponent(LeaveApprovalsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
