import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarBidsComponent } from './car-bids.component';

describe('CarBidsComponent', () => {
  let component: CarBidsComponent;
  let fixture: ComponentFixture<CarBidsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarBidsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
