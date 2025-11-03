import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdlCleanupPolicy } from './ddl-cleanup-policy';

describe('DdlCleanupPolicy', () => {
  let component: DdlCleanupPolicy;
  let fixture: ComponentFixture<DdlCleanupPolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DdlCleanupPolicy],
    }).compileComponents();

    fixture = TestBed.createComponent(DdlCleanupPolicy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
