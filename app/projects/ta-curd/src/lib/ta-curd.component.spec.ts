import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCurdComponent } from './ta-curd.component';

describe('TaCurdComponent', () => {
  let component: TaCurdComponent;
  let fixture: ComponentFixture<TaCurdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaCurdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaCurdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
