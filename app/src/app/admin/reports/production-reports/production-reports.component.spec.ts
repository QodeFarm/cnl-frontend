import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReportsComponent } from './production-reports.component';

describe('ProductionReportsComponent', () => {
  let component: ProductionReportsComponent;
  let fixture: ComponentFixture<ProductionReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionReportsComponent]
    });
    fixture = TestBed.createComponent(ProductionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
