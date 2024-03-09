import { TestBed } from '@angular/core/testing';

import { OptService } from './opt.service';

describe('OptService', () => {
  let service: OptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
