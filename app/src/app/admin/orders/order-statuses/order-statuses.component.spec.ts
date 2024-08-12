import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusesComponent } from './order-statuses.component';

describe('OrderStatusesComponent', () => {
  let component: OrderStatusesComponent;
  let fixture: ComponentFixture<OrderStatusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderStatusesComponent]
    });
    fixture = TestBed.createComponent(OrderStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
