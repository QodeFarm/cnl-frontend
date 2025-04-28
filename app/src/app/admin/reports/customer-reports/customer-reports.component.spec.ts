import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReportsComponent } from './customer-reports.component';

describe('CustomerReportsComponent', () => {
  let component: CustomerReportsComponent;
  let fixture: ComponentFixture<CustomerReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerReportsComponent]
    });
    fixture = TestBed.createComponent(CustomerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
