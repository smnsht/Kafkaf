import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicCustsomParameters } from './topic-custsom-parameters';

describe('TopicCustsomParameters', () => {
  let component: TopicCustsomParameters;
  let fixture: ComponentFixture<TopicCustsomParameters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicCustsomParameters],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicCustsomParameters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
