import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipesComponent } from './swipes.component';

describe('SwipesComponent', () => {
  let component: SwipesComponent;
  let fixture: ComponentFixture<SwipesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwipesComponent]
    });
    fixture = TestBed.createComponent(SwipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
