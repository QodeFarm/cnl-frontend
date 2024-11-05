import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCodesComponent } from './job-codes.component';

describe('JobCodesComponent', () => {
  let component: JobCodesComponent;
  let fixture: ComponentFixture<JobCodesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobCodesComponent]
    });
    fixture = TestBed.createComponent(JobCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
