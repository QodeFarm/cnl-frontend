import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNoteListComponent } from './debit-note-list.component';

describe('DebitNoteListComponent', () => {
  let component: DebitNoteListComponent;
  let fixture: ComponentFixture<DebitNoteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DebitNoteListComponent]
    });
    fixture = TestBed.createComponent(DebitNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
