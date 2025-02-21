import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomfieldsListComponent } from './customfields-list.component';

describe('CustomfieldsListComponent', () => {
  let component: CustomfieldsListComponent;
  let fixture: ComponentFixture<CustomfieldsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomfieldsListComponent]
    });
    fixture = TestBed.createComponent(CustomfieldsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
