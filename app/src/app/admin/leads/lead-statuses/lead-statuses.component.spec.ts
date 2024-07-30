import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadStatusesComponent } from './lead-statuses.component';

describe('LeadStatusesComponent', () => {
  let component: LeadStatusesComponent;
  let fixture: ComponentFixture<LeadStatusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeadStatusesComponent]
    });
    fixture = TestBed.createComponent(LeadStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
