import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageWrapper } from './page-wrapper';

describe('PageWrapper', () => {
  let component: PageWrapper;
  let fixture: ComponentFixture<PageWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
