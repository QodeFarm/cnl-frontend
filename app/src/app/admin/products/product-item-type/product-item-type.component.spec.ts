import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemTypeComponent } from './product-item-type.component';

describe('ProductItemTypeComponent', () => {
  let component: ProductItemTypeComponent;
  let fixture: ComponentFixture<ProductItemTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductItemTypeComponent]
    });
    fixture = TestBed.createComponent(ProductItemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
