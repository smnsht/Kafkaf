import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicOverview } from './topic-overview';

describe('TopicOverview', () => {
  let component: TopicOverview;
  let fixture: ComponentFixture<TopicOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
