import { TestBed } from '@angular/core/testing';

import { TopicConsumersStore } from './topic-consumers-store';

describe('TopicConsumersStore', () => {
  let service: TopicConsumersStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicConsumersStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
