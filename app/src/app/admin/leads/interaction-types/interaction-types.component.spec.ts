import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionTypesComponent } from './interaction-types.component';

describe('InteractionTypesComponent', () => {
  let component: InteractionTypesComponent;
  let fixture: ComponentFixture<InteractionTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InteractionTypesComponent]
    });
    fixture = TestBed.createComponent(InteractionTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
