import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUniqueQuantityCodesComponent } from './product-unique-quantity-codes.component';

describe('ProductUniqueQuantityCodesComponent', () => {
  let component: ProductUniqueQuantityCodesComponent;
  let fixture: ComponentFixture<ProductUniqueQuantityCodesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductUniqueQuantityCodesComponent]
    });
    fixture = TestBed.createComponent(ProductUniqueQuantityCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
