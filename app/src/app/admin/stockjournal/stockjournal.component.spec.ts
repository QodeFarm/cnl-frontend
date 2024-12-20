import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockjournalComponent } from './stockjournal.component';

describe('StockjournalComponent', () => {
  let component: StockjournalComponent;
  let fixture: ComponentFixture<StockjournalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockjournalComponent]
    });
    fixture = TestBed.createComponent(StockjournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
