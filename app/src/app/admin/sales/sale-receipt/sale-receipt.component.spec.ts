import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReceiptComponent } from './sale-receipt.component';

describe('SaleReceiptComponent', () => {
  let component: SaleReceiptComponent;
  let fixture: ComponentFixture<SaleReceiptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleReceiptComponent]
    });
    fixture = TestBed.createComponent(SaleReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
