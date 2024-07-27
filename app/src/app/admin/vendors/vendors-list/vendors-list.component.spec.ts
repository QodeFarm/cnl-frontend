import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsListComponent } from './vendors-list.component';

describe('VendorsListComponent', () => {
  let component: VendorsListComponent;
  let fixture: ComponentFixture<VendorsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorsListComponent]
    });
    fixture = TestBed.createComponent(VendorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
