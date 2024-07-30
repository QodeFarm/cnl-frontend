import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstCategoriesComponent } from './gst-categories.component';

describe('GstCategoriesComponent', () => {
  let component: GstCategoriesComponent;
  let fixture: ComponentFixture<GstCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GstCategoriesComponent]
    });
    fixture = TestBed.createComponent(GstCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
