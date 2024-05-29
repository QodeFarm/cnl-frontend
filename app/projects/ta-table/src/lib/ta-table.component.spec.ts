import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTableComponent } from './ta-table.component';

describe('TaTableComponent', () => {
  let component: TaTableComponent;
  let fixture: ComponentFixture<TaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
