import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveBalanceListComponent } from './employee-leave-balance-list.component';

describe('EmployeeLeaveBalanceListComponent', () => {
  let component: EmployeeLeaveBalanceListComponent;
  let fixture: ComponentFixture<EmployeeLeaveBalanceListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveBalanceListComponent]
    });
    fixture = TestBed.createComponent(EmployeeLeaveBalanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
