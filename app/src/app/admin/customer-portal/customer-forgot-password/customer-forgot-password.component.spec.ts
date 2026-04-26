import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerForgotPasswordComponent } from './customer-forgot-password.component';

describe('CustomerForgotPasswordComponent', () => {
  let component: CustomerForgotPasswordComponent;
  let fixture: ComponentFixture<CustomerForgotPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerForgotPasswordComponent]
    });
    fixture = TestBed.createComponent(CustomerForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
