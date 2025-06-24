import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReceiptListComponent } from './payment-receipt-list.component';

describe('PaymentReceiptListComponent', () => {
  let component: PaymentReceiptListComponent;
  let fixture: ComponentFixture<PaymentReceiptListComponent>;

  beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PaymentReceiptListComponent]
      });
      fixture = TestBed.createComponent(PaymentReceiptListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
});