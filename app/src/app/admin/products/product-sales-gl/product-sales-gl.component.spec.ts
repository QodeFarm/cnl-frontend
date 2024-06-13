import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSalesGlComponent } from './product-sales-gl.component';

describe('ProductSalesGlComponent', () => {
  let component: ProductSalesGlComponent;
  let fixture: ComponentFixture<ProductSalesGlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductSalesGlComponent]
    });
    fixture = TestBed.createComponent(ProductSalesGlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
