import { TestBed } from '@angular/core/testing';
import { BaseStore_OLD } from './base-store-old';



describe('BaseStore_OLD', () => {
  let service: BaseStore_OLD<undefined>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseStore_OLD);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
