import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingModesComponent } from './shipping-modes.component';

describe('ShippingModesComponent', () => {
  let component: ShippingModesComponent;
  let fixture: ComponentFixture<ShippingModesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingModesComponent]
    });
    fixture = TestBed.createComponent(ShippingModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
