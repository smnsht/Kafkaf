import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdlPartitions } from './ddl-partitions';

describe('DdlPartitions', () => {
  let component: DdlPartitions;
  let fixture: ComponentFixture<DdlPartitions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DdlPartitions],
    }).compileComponents();

    fixture = TestBed.createComponent(DdlPartitions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
