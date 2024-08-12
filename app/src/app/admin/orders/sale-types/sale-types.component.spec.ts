import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTypesComponent } from './sale-types.component';

describe('SaleTypesComponent', () => {
  let component: SaleTypesComponent;
  let fixture: ComponentFixture<SaleTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleTypesComponent]
    });
    fixture = TestBed.createComponent(SaleTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
