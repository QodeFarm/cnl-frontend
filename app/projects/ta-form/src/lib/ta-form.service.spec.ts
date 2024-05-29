import { TestBed } from '@angular/core/testing';

import { TaFormService } from './ta-form.service';

describe('TaFormService', () => {
  let service: TaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
