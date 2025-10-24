import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicMessages } from './topic-messages';

describe('TopicMessages', () => {
  let component: TopicMessages;
  let fixture: ComponentFixture<TopicMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicMessages],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicMessages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
