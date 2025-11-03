import { TestBed } from '@angular/core/testing';

import { TopicSettingsStore } from './topic-settings.service';

describe('TopicSettingsService', () => {
  let service: TopicSettingsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicSettingsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
