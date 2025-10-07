import { TestBed } from '@angular/core/testing';

import { TopicsStore } from './topics-store';

describe('TopicsStore', () => {
  let service: TopicsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
