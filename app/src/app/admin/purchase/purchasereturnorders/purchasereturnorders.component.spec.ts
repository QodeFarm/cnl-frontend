import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasereturnordersComponent } from './purchasereturnorders.component';

describe('PurchasereturnordersComponent', () => {
  let component: PurchasereturnordersComponent;
  let fixture: ComponentFixture<PurchasereturnordersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchasereturnordersComponent]
    });
    fixture = TestBed.createComponent(PurchasereturnordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
