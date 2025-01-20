import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldTabsComponent } from './field-tabs.component';

describe('FieldTabsComponent', () => {
  let component: FieldTabsComponent;
  let fixture: ComponentFixture<FieldTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FieldTabsComponent]
    });
    fixture = TestBed.createComponent(FieldTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
