import { TestBed } from '@angular/core/testing';

import { TaCoreService } from './ta-core.service';

describe('TaCoreService', () => {
  let service: TaCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
