import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesinvoiceComponent } from './salesinvoice.component';

describe('SalesinvoiceComponent', () => {
  let component: SalesinvoiceComponent;
  let fixture: ComponentFixture<SalesinvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesinvoiceComponent]
    });
    fixture = TestBed.createComponent(SalesinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
