import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrdersComponent } from './work-orders.component';

describe('WorkOrdersComponent', () => {
  let component: WorkOrdersComponent;
  let fixture: ComponentFixture<WorkOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkOrdersComponent]
    });
    fixture = TestBed.createComponent(WorkOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
