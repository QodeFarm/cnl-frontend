import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxConfigurationComponent } from './tax-configuration.component';

describe('TaxConfigurationComponent', () => {
  let component: TaxConfigurationComponent;
  let fixture: ComponentFixture<TaxConfigurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxConfigurationComponent]
    });
    fixture = TestBed.createComponent(TaxConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
