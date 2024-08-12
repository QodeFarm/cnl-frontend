import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingCompaniesComponent } from './shipping-companies.component';

describe('ShippingCompaniesComponent', () => {
  let component: ShippingCompaniesComponent;
  let fixture: ComponentFixture<ShippingCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingCompaniesComponent]
    });
    fixture = TestBed.createComponent(ShippingCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
