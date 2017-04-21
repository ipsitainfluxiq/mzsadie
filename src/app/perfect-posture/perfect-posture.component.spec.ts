import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfectPostureComponent } from './perfect-posture.component';

describe('PerfectPostureComponent', () => {
  let component: PerfectPostureComponent;
  let fixture: ComponentFixture<PerfectPostureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfectPostureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfectPostureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
