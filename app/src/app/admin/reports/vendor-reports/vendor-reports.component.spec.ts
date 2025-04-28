import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorReportsComponent } from './vendor-reports.component';

describe('VendorReportsComponent', () => {
  let component: VendorReportsComponent;
  let fixture: ComponentFixture<VendorReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorReportsComponent]
    });
    fixture = TestBed.createComponent(VendorReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
