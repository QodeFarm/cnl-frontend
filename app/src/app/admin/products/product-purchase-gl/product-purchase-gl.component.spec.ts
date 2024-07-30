import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPurchaseGlComponent } from './product-purchase-gl.component';

describe('ProductPurchaseGlComponent', () => {
  let component: ProductPurchaseGlComponent;
  let fixture: ComponentFixture<ProductPurchaseGlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductPurchaseGlComponent]
    });
    fixture = TestBed.createComponent(ProductPurchaseGlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
