import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemBalanceComponent } from './product-item-balance.component';

describe('ProductItemBalanceComponent', () => {
  let component: ProductItemBalanceComponent;
  let fixture: ComponentFixture<ProductItemBalanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductItemBalanceComponent]
    });
    fixture = TestBed.createComponent(ProductItemBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
