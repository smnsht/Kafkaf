import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsDropdownMenu } from './topics-dropdown-menu';

describe('TopicsDropdownMenu', () => {
  let component: TopicsDropdownMenu;
  let fixture: ComponentFixture<TopicsDropdownMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsDropdownMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsDropdownMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
