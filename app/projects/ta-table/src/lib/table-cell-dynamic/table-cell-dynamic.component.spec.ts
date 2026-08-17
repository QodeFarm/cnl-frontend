import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableCellDynamicComponent } from './table-cell-dynamic.component';


describe('TableCellDynamicComponent - re-render on input change', () => {
  const build = () =>
    new TableCellDynamicComponent(new DatePipe('en-US'), new CurrencyPipe('en-US'), null as any);

  it('recomputes a mapped cell when the row is replaced', () => {
    const component = build();
    component.col = {
      displayType: 'map',
      mapFn: (_v: any, row: any) => row.flow_status?.flow_status_name || ''
    };

    component.row = { flow_status: { flow_status_name: 'Review Inventory' } };
    component.ngOnInit();
    expect(component.html).toBe('Review Inventory');

    // Same row id, new data — exactly what a refresh delivers to a tracked row.
    component.row = { flow_status: { flow_status_name: 'Dispatch' } };
    component.ngOnChanges();

    expect(component.html).toBe('Dispatch');
  });

  it('recomputes a date cell when the value is replaced', () => {
    const component = build();
    component.col = { displayType: 'date', dateFormat: 'yyyy-MM-dd' };

    component.value = '2026-08-17';
    component.ngOnInit();
    expect(component.html).toBe('2026-08-17');

    component.value = '2026-09-01';
    component.ngOnChanges();

    expect(component.html).toBe('2026-09-01');
  });

  it('recomputes a plain cell when the value is replaced', () => {
    const component = build();
    component.col = {};

    component.value = 'Pending';
    component.ngOnInit();
    expect(component.html).toBe('Pending');

    component.value = 'Completed';
    component.ngOnChanges();

    expect(component.html).toBe('Completed');
  });
});
