import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDrugTypesComponent } from './product-drug-types.component';

describe('ProductDrugTypesComponent', () => {
  let component: ProductDrugTypesComponent;
  let fixture: ComponentFixture<ProductDrugTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDrugTypesComponent]
    });
    fixture = TestBed.createComponent(ProductDrugTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
