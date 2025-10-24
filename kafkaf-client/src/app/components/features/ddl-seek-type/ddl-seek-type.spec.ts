import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdlSeekType } from './ddl-seek-type';

describe('DdlSeekType', () => {
  let component: DdlSeekType;
  let fixture: ComponentFixture<DdlSeekType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DdlSeekType],
    }).compileComponents();

    fixture = TestBed.createComponent(DdlSeekType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
