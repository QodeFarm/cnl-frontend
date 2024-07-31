import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousesListComponent } from './warehouses-list.component';

describe('WarehousesListComponent', () => {
  let component: WarehousesListComponent;
  let fixture: ComponentFixture<WarehousesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WarehousesListComponent]
    });
    fixture = TestBed.createComponent(WarehousesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
