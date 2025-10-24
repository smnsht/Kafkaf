import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicEdit } from './topic-edit';

describe('TopicEdit', () => {
  let component: TopicEdit;
  let fixture: ComponentFixture<TopicEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
