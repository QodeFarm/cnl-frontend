import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipesListComponent } from './swipes-list.component';

describe('SwipesListComponent', () => {
  let component: SwipesListComponent;
  let fixture: ComponentFixture<SwipesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwipesListComponent]
    });
    fixture = TestBed.createComponent(SwipesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
