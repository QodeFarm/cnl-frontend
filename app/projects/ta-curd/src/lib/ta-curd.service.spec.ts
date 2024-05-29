import { TestBed } from '@angular/core/testing';

import { TaCurdService } from './ta-curd.service';

describe('TaCurdService', () => {
  let service: TaCurdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaCurdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
