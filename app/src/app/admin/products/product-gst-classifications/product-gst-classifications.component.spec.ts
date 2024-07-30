import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGstClassificationsComponent } from './product-gst-classifications.component';

describe('ProductGstClassificationsComponent', () => {
  let component: ProductGstClassificationsComponent;
  let fixture: ComponentFixture<ProductGstClassificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductGstClassificationsComponent]
    });
    fixture = TestBed.createComponent(ProductGstClassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
