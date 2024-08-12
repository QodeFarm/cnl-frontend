import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderslistComponent } from './orderslist.component';

describe('OrderslistComponent', () => {
  let component: OrderslistComponent;
  let fixture: ComponentFixture<OrderslistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderslistComponent]
    });
    fixture = TestBed.createComponent(OrderslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
