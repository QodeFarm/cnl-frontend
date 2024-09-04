import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReceiptListComponent } from './sale-receipt-list.component';

describe('SaleReceiptListComponent', () => {
  let component: SaleReceiptListComponent;
  let fixture: ComponentFixture<SaleReceiptListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleReceiptListComponent]
    });
    fixture = TestBed.createComponent(SaleReceiptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
