import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDispatchComponent } from './sales-dispatch.component';

describe('SalesDispatchComponent', () => {
  let component: SalesDispatchComponent;
  let fixture: ComponentFixture<SalesDispatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesDispatchComponent]
    });
    fixture = TestBed.createComponent(SalesDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
