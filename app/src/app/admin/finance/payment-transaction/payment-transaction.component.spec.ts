import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransactionComponent } from './payment-transaction.component';

describe('PaymentTransactionComponent', () => {
  let component: PaymentTransactionComponent;
  let fixture: ComponentFixture<PaymentTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentTransactionComponent]
    });
    fixture = TestBed.createComponent(PaymentTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
