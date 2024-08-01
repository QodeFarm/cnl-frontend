import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaintenanceListComponent } from './asset-maintenance-list.component';

describe('AssetMaintenanceListComponent', () => {
  let component: AssetMaintenanceListComponent;
  let fixture: ComponentFixture<AssetMaintenanceListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetMaintenanceListComponent]
    });
    fixture = TestBed.createComponent(AssetMaintenanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
