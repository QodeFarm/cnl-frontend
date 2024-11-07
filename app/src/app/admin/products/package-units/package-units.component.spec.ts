import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageUnitsComponent } from './package-units.component';

describe('PackageUnitsComponent', () => {
  let component: PackageUnitsComponent;
  let fixture: ComponentFixture<PackageUnitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackageUnitsComponent]
    });
    fixture = TestBed.createComponent(PackageUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
