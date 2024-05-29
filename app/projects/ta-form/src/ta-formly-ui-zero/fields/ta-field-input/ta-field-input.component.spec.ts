import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaFieldInputComponent } from './ta-field-input.component';

describe('TaFieldInputComponent', () => {
  let component: TaFieldInputComponent;
  let fixture: ComponentFixture<TaFieldInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaFieldInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaFieldInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
