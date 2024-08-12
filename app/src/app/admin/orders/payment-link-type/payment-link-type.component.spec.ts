import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentLinkTypeComponent } from './payment-link-type.component';

describe('PaymentLinkTypeComponent', () => {
  let component: PaymentLinkTypeComponent;
  let fixture: ComponentFixture<PaymentLinkTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentLinkTypeComponent]
    });
    fixture = TestBed.createComponent(PaymentLinkTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
