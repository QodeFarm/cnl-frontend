import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPaymentTermsComponent } from './vendor-payment-terms.component';

describe('VendorPaymentTermsComponent', () => {
  let component: VendorPaymentTermsComponent;
  let fixture: ComponentFixture<VendorPaymentTermsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorPaymentTermsComponent]
    });
    fixture = TestBed.createComponent(VendorPaymentTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
