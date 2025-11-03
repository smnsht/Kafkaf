import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerDetails } from './consumer-details';

describe('ConsumerDetails', () => {
  let component: ConsumerDetails;
  let fixture: ComponentFixture<ConsumerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumerDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumerDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
