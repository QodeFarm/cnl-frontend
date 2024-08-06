import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnsListComponent } from './sale-returns-list.component';

describe('SaleReturnsListComponent', () => {
  let component: SaleReturnsListComponent;
  let fixture: ComponentFixture<SaleReturnsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleReturnsListComponent]
    });
    fixture = TestBed.createComponent(SaleReturnsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
