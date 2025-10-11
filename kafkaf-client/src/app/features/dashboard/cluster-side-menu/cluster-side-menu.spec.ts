import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterSideMenu } from './cluster-side-menu';

describe('ClusterSideMenu', () => {
  let component: ClusterSideMenu;
  let fixture: ComponentFixture<ClusterSideMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClusterSideMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClusterSideMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
