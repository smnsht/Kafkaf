import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerConfigs } from './broker-configs';

describe('BrokerConfigs', () => {
  let component: BrokerConfigs;
  let fixture: ComponentFixture<BrokerConfigs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokerConfigs],
    }).compileComponents();

    fixture = TestBed.createComponent(BrokerConfigs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
