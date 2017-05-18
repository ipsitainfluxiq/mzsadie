import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewlogoutdetailsComponent } from './viewlogoutdetails.component';

describe('ViewlogoutdetailsComponent', () => {
  let component: ViewlogoutdetailsComponent;
  let fixture: ComponentFixture<ViewlogoutdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewlogoutdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewlogoutdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
