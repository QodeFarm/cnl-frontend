import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationMethodsComponent } from './notification-methods.component';

describe('NotificationMethodsComponent', () => {
  let component: NotificationMethodsComponent;
  let fixture: ComponentFixture<NotificationMethodsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationMethodsComponent]
    });
    fixture = TestBed.createComponent(NotificationMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
