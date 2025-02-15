import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderboardComponent } from './workorderboard.component';

describe('WorkorderboardComponent', () => {
  let component: WorkorderboardComponent;
  let fixture: ComponentFixture<WorkorderboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkorderboardComponent]
    });
    fixture = TestBed.createComponent(WorkorderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});