import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicConsumers } from './topic-consumers';

describe('TopicConsumers', () => {
  let component: TopicConsumers;
  let fixture: ComponentFixture<TopicConsumers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicConsumers],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicConsumers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
