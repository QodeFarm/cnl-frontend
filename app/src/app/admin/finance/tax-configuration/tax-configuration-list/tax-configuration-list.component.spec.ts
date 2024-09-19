import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxConfigurationListComponent } from './tax-configuration-list.component';

describe('TaxConfigurationListComponent', () => {
  let component: TaxConfigurationListComponent;
  let fixture: ComponentFixture<TaxConfigurationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxConfigurationListComponent]
    });
    fixture = TestBed.createComponent(TaxConfigurationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
