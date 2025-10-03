import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDetails } from './message-details';

describe('MessageDetails', () => {
  let component: MessageDetails;
  let fixture: ComponentFixture<MessageDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
