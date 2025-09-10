import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialReceivedComponent } from './material-received.component';

describe('MaterialReceivedComponent', () => {
  let component: MaterialReceivedComponent;
  let fixture: ComponentFixture<MaterialReceivedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialReceivedComponent]
    });
    fixture = TestBed.createComponent(MaterialReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
