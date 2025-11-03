import { TestBed } from '@angular/core/testing';

import { TopicOverviewStore } from './topic-overview-store';

describe('TopicOverviewStore', () => {
  let service: TopicOverviewStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicOverviewStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
