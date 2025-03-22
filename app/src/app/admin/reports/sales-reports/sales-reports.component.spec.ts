import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRepotsComponent } from './sales-repots.component';

describe('SalesRepotsComponent', () => {
  let component: SalesRepotsComponent;
  let fixture: ComponentFixture<SalesRepotsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesRepotsComponent]
    });
    fixture = TestBed.createComponent(SalesRepotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
