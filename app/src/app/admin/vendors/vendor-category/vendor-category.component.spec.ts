import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCategoryComponent } from './vendor-category.component';

describe('VendorCategoryComponent', () => {
  let component: VendorCategoryComponent;
  let fixture: ComponentFixture<VendorCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorCategoryComponent]
    });
    fixture = TestBed.createComponent(VendorCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
