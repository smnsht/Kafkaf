import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdlSortOrder } from './ddl-sort-order';

describe('DdlSortOrder', () => {
  let component: DdlSortOrder;
  let fixture: ComponentFixture<DdlSortOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DdlSortOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(DdlSortOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
