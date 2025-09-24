import { TestBed } from '@angular/core/testing';

import { BrokersStore } from './brokers-store';

describe('BrokersStore', () => {
  let service: BrokersStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokersStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
