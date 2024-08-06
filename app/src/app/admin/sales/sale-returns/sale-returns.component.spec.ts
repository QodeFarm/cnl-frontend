import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnsComponent } from './sale-returns.component';

describe('SaleReturnsComponent', () => {
  let component: SaleReturnsComponent;
  let fixture: ComponentFixture<SaleReturnsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleReturnsComponent]
    });
    fixture = TestBed.createComponent(SaleReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
