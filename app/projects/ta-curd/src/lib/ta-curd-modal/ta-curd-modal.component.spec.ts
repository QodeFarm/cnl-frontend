import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCurdModalComponent } from './ta-curd-modal.component';

describe('TaCurdModalComponent', () => {
  let component: TaCurdModalComponent;
  let fixture: ComponentFixture<TaCurdModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaCurdModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaCurdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
