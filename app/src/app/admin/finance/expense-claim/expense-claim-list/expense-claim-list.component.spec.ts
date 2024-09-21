import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseClaimListComponent } from './expense-claim-list.component';

describe('ExpenseClaimListComponent', () => {
  let component: ExpenseClaimListComponent;
  let fixture: ComponentFixture<ExpenseClaimListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseClaimListComponent]
    });
    fixture = TestBed.createComponent(ExpenseClaimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
