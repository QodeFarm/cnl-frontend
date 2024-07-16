import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerGroupsComponent } from './ledger-groups.component';

describe('LedgerGroupsComponent', () => {
  let component: LedgerGroupsComponent;
  let fixture: ComponentFixture<LedgerGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LedgerGroupsComponent]
    });
    fixture = TestBed.createComponent(LedgerGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
