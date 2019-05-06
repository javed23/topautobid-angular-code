import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridListViewComponent } from './grid-list-view.component';

describe('GridListViewComponent', () => {
  let component: GridListViewComponent;
  let fixture: ComponentFixture<GridListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
