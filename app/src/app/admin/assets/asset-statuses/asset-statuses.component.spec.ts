import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetStatusesComponent } from './asset-statuses.component';

describe('AssetStatusesComponent', () => {
  let component: AssetStatusesComponent;
  let fixture: ComponentFixture<AssetStatusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetStatusesComponent]
    });
    fixture = TestBed.createComponent(AssetStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
