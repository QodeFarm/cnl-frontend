import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialReceivedListComponent } from './material-received-list.component';

describe('MaterialReceivedListComponent', () => {
  let component: MaterialReceivedListComponent;
  let fixture: ComponentFixture<MaterialReceivedListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialReceivedListComponent]
    });
    fixture = TestBed.createComponent(MaterialReceivedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
