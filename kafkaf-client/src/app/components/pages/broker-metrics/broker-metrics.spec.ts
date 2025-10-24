import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerMetrics } from './broker-metrics';

describe('BrokerMetrics', () => {
  let component: BrokerMetrics;
  let fixture: ComponentFixture<BrokerMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokerMetrics],
    }).compileComponents();

    fixture = TestBed.createComponent(BrokerMetrics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
