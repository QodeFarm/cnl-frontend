import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandSalesmanComponent } from './brand-salesman.component';

describe('BrandSalesmanComponent', () => {
  let component: BrandSalesmanComponent;
  let fixture: ComponentFixture<BrandSalesmanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrandSalesmanComponent]
    });
    fixture = TestBed.createComponent(BrandSalesmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
