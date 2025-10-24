import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsCreate } from './topics-create';

describe('TopicsCreate', () => {
  let component: TopicsCreate;
  let fixture: ComponentFixture<TopicsCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicsCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
