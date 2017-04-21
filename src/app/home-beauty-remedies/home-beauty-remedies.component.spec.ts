import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBeautyRemediesComponent } from './home-beauty-remedies.component';

describe('HomeBeautyRemediesComponent', () => {
  let component: HomeBeautyRemediesComponent;
  let fixture: ComponentFixture<HomeBeautyRemediesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeBeautyRemediesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBeautyRemediesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
