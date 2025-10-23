import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerDetails } from './broker-details';

describe('BrokerDetails', () => {
  let component: BrokerDetails;
  let fixture: ComponentFixture<BrokerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokerDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
