import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgersReportsComponent } from './ledgers-reports.component';

describe('LedgersReportsComponent', () => {
  let component: LedgersReportsComponent;
  let fixture: ComponentFixture<LedgersReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LedgersReportsComponent]
    });
    fixture = TestBed.createComponent(LedgersReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
