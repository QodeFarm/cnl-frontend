import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentTermsComponent } from './customer-payment-terms.component';

describe('CustomerPaymentTermsComponent', () => {
  let component: CustomerPaymentTermsComponent;
  let fixture: ComponentFixture<CustomerPaymentTermsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerPaymentTermsComponent]
    });
    fixture = TestBed.createComponent(CustomerPaymentTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
