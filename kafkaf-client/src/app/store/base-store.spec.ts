import { TestBed } from '@angular/core/testing';
import { BaseStore } from './base-store';



describe('BaseStore', () => {
  let service: BaseStore<undefined>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
