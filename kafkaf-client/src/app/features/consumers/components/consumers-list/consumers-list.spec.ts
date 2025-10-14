import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumersList } from './consumers-list';

describe('ConsumersList', () => {
  let component: ConsumersList;
  let fixture: ComponentFixture<ConsumersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
