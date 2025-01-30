import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteListComponent } from './credit-note-list.component';

describe('CreditNoteListComponent', () => {
  let component: CreditNoteListComponent;
  let fixture: ComponentFixture<CreditNoteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditNoteListComponent]
    });
    fixture = TestBed.createComponent(CreditNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
