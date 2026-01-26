import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryScanComponent } from './inventory-scan.component';

describe('InventoryScanComponent', () => {
  let component: InventoryScanComponent;
  let fixture: ComponentFixture<InventoryScanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryScanComponent]
    });
    fixture = TestBed.createComponent(InventoryScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
