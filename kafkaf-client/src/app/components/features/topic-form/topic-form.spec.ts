import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicForm } from './topic-form';

describe('TopicForm', () => {
  let component: TopicForm;
  let fixture: ComponentFixture<TopicForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
