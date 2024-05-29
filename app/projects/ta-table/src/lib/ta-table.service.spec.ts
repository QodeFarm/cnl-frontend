import { TestBed } from '@angular/core/testing';

import { TaTableService } from './ta-table.service';

describe('TaTableService', () => {
  let service: TaTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
