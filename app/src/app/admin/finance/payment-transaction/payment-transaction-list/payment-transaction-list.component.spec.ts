import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransactionListComponent } from './payment-transaction-list.component';

describe('PaymentTransactionListComponent', () => {
  let component: PaymentTransactionListComponent;
  let fixture: ComponentFixture<PaymentTransactionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentTransactionListComponent]
    });
    fixture = TestBed.createComponent(PaymentTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
