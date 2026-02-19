import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnorderslistComponent } from './returnorderslist.component';

describe('ReturnorderslistComponent', () => {
  let component: ReturnorderslistComponent;
  let fixture: ComponentFixture<ReturnorderslistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnorderslistComponent]
    });
    fixture = TestBed.createComponent(ReturnorderslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
