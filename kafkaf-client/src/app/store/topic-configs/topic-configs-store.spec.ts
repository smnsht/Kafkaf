import { TestBed } from '@angular/core/testing';

import { TopicConfigsStore } from './topic-configs-store';

describe('TopicConfigsStore', () => {
  let service: TopicConfigsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicConfigsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
