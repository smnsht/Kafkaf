import { TestBed } from '@angular/core/testing';

import { BrokerDetailsStore } from './broker-details-store';

describe('BrokerDetailsStore', () => {
  let service: BrokerDetailsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokerDetailsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
