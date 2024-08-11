import { TestBed } from '@angular/core/testing';

import { AdminCommonService } from './admin-common.service';

describe('AdminCommonService', () => {
  let service: AdminCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
