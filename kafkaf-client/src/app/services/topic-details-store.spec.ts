import { TestBed } from '@angular/core/testing';

import { TopicDetailsStore } from './topic-details-store';

describe('TopicStore', () => {
  let service: TopicDetailsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicDetailsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
