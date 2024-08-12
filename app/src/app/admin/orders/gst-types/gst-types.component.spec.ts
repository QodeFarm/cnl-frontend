import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstTypesComponent } from './gst-types.component';

describe('GstTypesComponent', () => {
  let component: GstTypesComponent;
  let fixture: ComponentFixture<GstTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GstTypesComponent]
    });
    fixture = TestBed.createComponent(GstTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
