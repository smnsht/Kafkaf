import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicDetails } from './topic-details';

describe('TopicOverview', () => {
  let component: TopicDetails;
  let fixture: ComponentFixture<TopicDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
