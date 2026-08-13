import { WorkorderboardComponent } from './workorderboard.component';

/**
 * Floor routing on the board. If these mappings are wrong the printing team is shown
 * production jobs (or the reverse), and work orders with no floor become reachable from
 * no tab at all — so they are asserted directly rather than through a TestBed.
 *
 * The component is built with null collaborators: getCurdConfig() and the floor query
 * touch none of them.
 */
describe('WorkorderboardComponent - floor filtering', () => {
  let component: WorkorderboardComponent;

  beforeEach(() => {
    component = new WorkorderboardComponent(null as any, null as any, null as any, null as any);
  });

  it('sends no floor filter on the All tab', () => {
    component.activeFloorId = component.ALL_FLOORS;

    expect(component.getCurdConfig().tableConfig.apiUrl)
      .toBe('production/work_order/?flow_status=Production');
  });

  it('filters by floor id, not by name, so renaming a floor cannot break the tab', () => {
    component.activeFloorId = 'b1f2c3d4-0000-4000-8000-000000000001';

    const apiUrl = component.getCurdConfig().tableConfig.apiUrl;

    expect(apiUrl).toContain('production_floor_id=b1f2c3d4-0000-4000-8000-000000000001');
    expect(apiUrl).toContain('flow_status=Production');
  });

  it('asks for rows with no floor on the Unassigned tab', () => {
    component.activeFloorId = component.UNASSIGNED;

    expect(component.getCurdConfig().tableConfig.apiUrl)
      .toContain('production_floor_isnull=true');
  });

  it('never sends a floor id as the literal "unassigned"', () => {
    component.activeFloorId = component.UNASSIGNED;

    expect(component.getCurdConfig().tableConfig.apiUrl)
      .not.toContain('production_floor_id=unassigned');
  });

  it('shows Unassigned rather than a blank cell when a job has no floor', () => {
    const floorCol: any = component.getCurdConfig().tableConfig.cols
      .find((c: any) => c.fieldKey === 'production_floor');

    expect(floorCol.mapFn(null, { production_floor: null })).toBe('Unassigned');
    expect(floorCol.mapFn(null, { production_floor: { name: 'Printing' } })).toBe('Printing');
  });

  it('keeps the column set identical across floors, so the table is never rebuilt', () => {
    const allCols = component.getCurdConfig().tableConfig.cols.map((c: any) => c.fieldKey);

    component.activeFloorId = 'b1f2c3d4-0000-4000-8000-000000000001';
    const floorCols = component.getCurdConfig().tableConfig.cols.map((c: any) => c.fieldKey);

    // Only apiUrl may differ between floors. A differing column set would force a rebuild of
    // ta-table, which is what made its global filter bar appear and disappear.
    expect(floorCols).toEqual(allCols);
  });
});
