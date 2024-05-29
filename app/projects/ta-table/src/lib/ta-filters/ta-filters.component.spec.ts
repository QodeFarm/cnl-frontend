import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaFiltersComponent } from './ta-filters.component';

describe('TaFiltersComponent', () => {
  let component: TaFiltersComponent;
  let fixture: ComponentFixture<TaFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
