import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GPackageUnitsComponent } from './g-package-units.component';

describe('GPackageUnitsComponent', () => {
  let component: GPackageUnitsComponent;
  let fixture: ComponentFixture<GPackageUnitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GPackageUnitsComponent]
    });
    fixture = TestBed.createComponent(GPackageUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
