import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicSettingInput } from './topic-setting-input';

describe('TopicSettingInput', () => {
  let component: TopicSettingInput;
  let fixture: ComponentFixture<TopicSettingInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicSettingInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicSettingInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
