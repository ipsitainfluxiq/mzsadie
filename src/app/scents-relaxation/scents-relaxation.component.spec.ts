import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScentsRelaxationComponent } from './scents-relaxation.component';

describe('ScentsRelaxationComponent', () => {
  let component: ScentsRelaxationComponent;
  let fixture: ComponentFixture<ScentsRelaxationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScentsRelaxationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScentsRelaxationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
