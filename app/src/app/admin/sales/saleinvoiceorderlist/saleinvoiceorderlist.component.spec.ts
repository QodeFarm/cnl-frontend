import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleinvoiceorderlistComponent } from './saleinvoiceorderlist.component';

describe('SaleinvoiceorderlistComponent', () => {
  let component: SaleinvoiceorderlistComponent;
  let fixture: ComponentFixture<SaleinvoiceorderlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleinvoiceorderlistComponent]
    });
    fixture = TestBed.createComponent(SaleinvoiceorderlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
