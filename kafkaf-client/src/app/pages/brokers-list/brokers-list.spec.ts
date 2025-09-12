import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokersList } from './brokers-list';

describe('BrokersList', () => {
  let component: BrokersList;
  let fixture: ComponentFixture<BrokersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
