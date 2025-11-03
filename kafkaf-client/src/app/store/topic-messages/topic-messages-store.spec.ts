import { TestBed } from '@angular/core/testing';

import { TopicMessagesStore } from './topic-messages-store';

describe('TopicMessagesStore', () => {
  let service: TopicMessagesStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicMessagesStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
