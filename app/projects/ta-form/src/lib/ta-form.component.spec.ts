import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaFormComponent } from './ta-form.component';

describe('TaFormComponent', () => {
  let component: TaFormComponent;
  let fixture: ComponentFixture<TaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
