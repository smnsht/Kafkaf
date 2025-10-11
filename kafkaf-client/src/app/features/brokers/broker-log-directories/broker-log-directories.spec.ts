import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerLogDirectories } from './broker-log-directories';

describe('BrokerLogDirectories', () => {
  let component: BrokerLogDirectories;
  let fixture: ComponentFixture<BrokerLogDirectories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokerLogDirectories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerLogDirectories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
