import { TestBed } from '@angular/core/testing';

import { NotificationCarrierService } from './notification-carrier.service';

describe('NotificationCarrierService', () => {
  let service: NotificationCarrierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationCarrierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
