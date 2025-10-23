import { TestBed } from '@angular/core/testing';
import { ClustersStore } from './clusters.service';



describe('ClustersStore', () => {
  let service: ClustersStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClustersStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
