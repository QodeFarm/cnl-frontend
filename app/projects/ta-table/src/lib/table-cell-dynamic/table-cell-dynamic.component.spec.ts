import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellDynamicComponent } from './table-cell-dynamic.component';

describe('TableCellDynamicComponent', () => {
  let component: TableCellDynamicComponent;
  let fixture: ComponentFixture<TableCellDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableCellDynamicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCellDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
