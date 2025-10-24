import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdlSerde } from './ddl-serde';

describe('DdlSerde', () => {
  let component: DdlSerde;
  let fixture: ComponentFixture<DdlSerde>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DdlSerde],
    }).compileComponents();

    fixture = TestBed.createComponent(DdlSerde);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
