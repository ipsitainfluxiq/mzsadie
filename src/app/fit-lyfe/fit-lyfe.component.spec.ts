import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FitLyfeComponent } from './fit-lyfe.component';

describe('FitLyfeComponent', () => {
  let component: FitLyfeComponent;
  let fixture: ComponentFixture<FitLyfeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FitLyfeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FitLyfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
