import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MillennialsComponent } from './millennials.component';

describe('MillennialsComponent', () => {
  let component: MillennialsComponent;
  let fixture: ComponentFixture<MillennialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MillennialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MillennialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
