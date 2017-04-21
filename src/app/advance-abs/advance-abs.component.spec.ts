import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceAbsComponent } from './advance-abs.component';

describe('AdvanceAbsComponent', () => {
  let component: AdvanceAbsComponent;
  let fixture: ComponentFixture<AdvanceAbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceAbsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceAbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
