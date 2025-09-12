import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Brokers } from './brokers';

describe('Brokers', () => {
  let component: Brokers;
  let fixture: ComponentFixture<Brokers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Brokers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Brokers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
