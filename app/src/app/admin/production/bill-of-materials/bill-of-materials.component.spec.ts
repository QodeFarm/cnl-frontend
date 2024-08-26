import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOfMaterialsComponent } from './bill-of-materials.component';

describe('BillOfMaterialsComponent', () => {
  let component: BillOfMaterialsComponent;
  let fixture: ComponentFixture<BillOfMaterialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillOfMaterialsComponent]
    });
    fixture = TestBed.createComponent(BillOfMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
