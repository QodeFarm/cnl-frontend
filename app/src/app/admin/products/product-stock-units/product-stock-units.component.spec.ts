import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStockUnitsComponent } from './product-stock-units.component';

describe('ProductStockUnitsComponent', () => {
  let component: ProductStockUnitsComponent;
  let fixture: ComponentFixture<ProductStockUnitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductStockUnitsComponent]
    });
    fixture = TestBed.createComponent(ProductStockUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
