import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicTabOverview } from './topic-tab-overview';

describe('TopicTabOverview', () => {
  let component: TopicTabOverview;
  let fixture: ComponentFixture<TopicTabOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicTabOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicTabOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
