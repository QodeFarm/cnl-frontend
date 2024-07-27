import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasereturnordersListComponent } from './purchasereturnorders-list.component';

describe('PurchasereturnordersListComponent', () => {
  let component: PurchasereturnordersListComponent;
  let fixture: ComponentFixture<PurchasereturnordersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchasereturnordersListComponent]
    });
    fixture = TestBed.createComponent(PurchasereturnordersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
