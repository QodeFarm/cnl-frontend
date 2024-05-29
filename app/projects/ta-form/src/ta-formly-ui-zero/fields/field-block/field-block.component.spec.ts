import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldBlockComponent } from './field-block.component';

describe('FieldBlockComponent', () => {
  let component: FieldBlockComponent;
  let fixture: ComponentFixture<FieldBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FieldBlockComponent]
    });
    fixture = TestBed.createComponent(FieldBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
