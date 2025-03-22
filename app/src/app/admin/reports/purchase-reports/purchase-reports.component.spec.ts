import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReportsComponent } from './purchase-reports.component';

describe('PurchaseReportsComponent', () => {
  let component: PurchaseReportsComponent;
  let fixture: ComponentFixture<PurchaseReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseReportsComponent]
    });
    fixture = TestBed.createComponent(PurchaseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
