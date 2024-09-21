import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOfAccountsListComponent } from './chart-of-accounts-list.component';

describe('ChartOfAccountsListComponent', () => {
  let component: ChartOfAccountsListComponent;
  let fixture: ComponentFixture<ChartOfAccountsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartOfAccountsListComponent]
    });
    fixture = TestBed.createComponent(ChartOfAccountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
