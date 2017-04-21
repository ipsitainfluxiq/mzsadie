import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HairhandsnailsfeetComponent } from './hairhandsnailsfeet.component';

describe('HairhandsnailsfeetComponent', () => {
  let component: HairhandsnailsfeetComponent;
  let fixture: ComponentFixture<HairhandsnailsfeetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HairhandsnailsfeetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HairhandsnailsfeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
