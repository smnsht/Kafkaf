import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Topics } from './topics';

describe('Topics', () => {
  let component: Topics;
  let fixture: ComponentFixture<Topics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Topics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Topics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
