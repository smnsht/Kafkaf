import { TestBed } from '@angular/core/testing';

import { KafkafTitleStrategy } from './kafkaf-title-strategy';

describe('KafkafTitleStrategy', () => {
  let service: KafkafTitleStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KafkafTitleStrategy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
