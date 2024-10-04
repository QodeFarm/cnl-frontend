import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationFrequenciesComponent } from './notification-frequencies.component';

describe('NotificationFrequenciesComponent', () => {
  let component: NotificationFrequenciesComponent;
  let fixture: ComponentFixture<NotificationFrequenciesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationFrequenciesComponent]
    });
    fixture = TestBed.createComponent(NotificationFrequenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
