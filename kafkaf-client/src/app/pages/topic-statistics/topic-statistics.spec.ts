import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicStatistics } from './topic-statistics';

describe('TopicStatistics', () => {
  let component: TopicStatistics;
  let fixture: ComponentFixture<TopicStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicStatistics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicStatistics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
