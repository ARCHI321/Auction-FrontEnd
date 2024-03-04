import { TestBed } from '@angular/core/testing';

import { WebsocketSecondService } from './websocket-second.service';

describe('WebsocketSecondService', () => {
  let service: WebsocketSecondService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketSecondService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
