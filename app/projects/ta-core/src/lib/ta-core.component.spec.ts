import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCoreComponent } from './ta-core.component';

describe('TaCoreComponent', () => {
  let component: TaCoreComponent;
  let fixture: ComponentFixture<TaCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaCoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
