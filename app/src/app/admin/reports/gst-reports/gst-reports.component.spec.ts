import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstReportsComponent } from './gst-reports.component';

describe('GstReportsComponent', () => {
  let component: GstReportsComponent;
  let fixture: ComponentFixture<GstReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GstReportsComponent]
    });
    fixture = TestBed.createComponent(GstReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
