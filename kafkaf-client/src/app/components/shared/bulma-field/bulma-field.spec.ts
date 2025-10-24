import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulmaField } from './bulma-field';

describe('BulmaField', () => {
  let component: BulmaField;
  let fixture: ComponentFixture<BulmaField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulmaField],
    }).compileComponents();

    fixture = TestBed.createComponent(BulmaField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
