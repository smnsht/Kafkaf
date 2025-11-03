import { TestBed } from '@angular/core/testing';

import { HttpTopics } from './http-topics';

describe('HttpTopics', () => {
  let service: HttpTopics;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpTopics);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
