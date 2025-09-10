import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionFloorsComponent } from './production-floors.component';

describe('ProductionFloorsComponent', () => {
  let component: ProductionFloorsComponent;
  let fixture: ComponentFixture<ProductionFloorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionFloorsComponent]
    });
    fixture = TestBed.createComponent(ProductionFloorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
