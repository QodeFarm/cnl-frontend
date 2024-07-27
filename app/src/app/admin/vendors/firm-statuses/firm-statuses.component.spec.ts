import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmStatusesComponent } from './firm-statuses.component';

describe('FirmStatusesComponent', () => {
  let component: FirmStatusesComponent;
  let fixture: ComponentFixture<FirmStatusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FirmStatusesComponent]
    });
    fixture = TestBed.createComponent(FirmStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
