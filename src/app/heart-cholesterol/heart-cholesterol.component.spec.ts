import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartCholesterolComponent } from './heart-cholesterol.component';

describe('HeartCholesterolComponent', () => {
  let component: HeartCholesterolComponent;
  let fixture: ComponentFixture<HeartCholesterolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeartCholesterolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartCholesterolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
