import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialReportListComponent } from './financial-report-list.component';

describe('FinancialReportListComponent', () => {
  let component: FinancialReportListComponent;
  let fixture: ComponentFixture<FinancialReportListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialReportListComponent]
    });
    fixture = TestBed.createComponent(FinancialReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
