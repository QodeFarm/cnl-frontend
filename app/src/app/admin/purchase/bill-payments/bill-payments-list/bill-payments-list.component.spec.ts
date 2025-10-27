import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPaymentsListComponent } from './bill-payments-list.component';

describe('BillPaymentsListComponent', () => {
  let component: BillPaymentsListComponent;
  let fixture: ComponentFixture<BillPaymentsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillPaymentsListComponent]
    });
    fixture = TestBed.createComponent(BillPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
