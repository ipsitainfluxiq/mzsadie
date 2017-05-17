import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewreviewofemployeeComponent } from './viewreviewofemployee.component';

describe('ViewreviewofemployeeComponent', () => {
  let component: ViewreviewofemployeeComponent;
  let fixture: ComponentFixture<ViewreviewofemployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewreviewofemployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewreviewofemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
