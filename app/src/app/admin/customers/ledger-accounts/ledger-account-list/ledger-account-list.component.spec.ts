import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerAccountListComponent } from './ledger-account-list.component';

describe('LedgerAccountListComponent', () => {
  let component: LedgerAccountListComponent;
  let fixture: ComponentFixture<LedgerAccountListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LedgerAccountListComponent]
    });
    fixture = TestBed.createComponent(LedgerAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
