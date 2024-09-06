import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionStatusesComponent } from './production-statuses.component';

describe('ProductionStatusesComponent', () => {
  let component: ProductionStatusesComponent;
  let fixture: ComponentFixture<ProductionStatusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionStatusesComponent]
    });
    fixture = TestBed.createComponent(ProductionStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
