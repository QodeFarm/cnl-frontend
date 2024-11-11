import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BomListComponent } from './bom-list.component';

describe('BomListComponent', () => {
  let component: BomListComponent;
  let fixture: ComponentFixture<BomListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BomListComponent]
    });
    fixture = TestBed.createComponent(BomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
