import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicSettings } from './topic-settings';

describe('TopicSettings', () => {
  let component: TopicSettings;
  let fixture: ComponentFixture<TopicSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
