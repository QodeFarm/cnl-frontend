import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerAccountsComponent } from './ledger-accounts.component';

describe('LedgerAccountsComponent', () => {
  let component: LedgerAccountsComponent;
  let fixture: ComponentFixture<LedgerAccountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LedgerAccountsComponent]
    });
    fixture = TestBed.createComponent(LedgerAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
