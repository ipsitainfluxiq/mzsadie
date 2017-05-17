import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewlogindetailsComponent } from './viewlogindetails.component';

describe('ViewlogindetailsComponent', () => {
  let component: ViewlogindetailsComponent;
  let fixture: ComponentFixture<ViewlogindetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewlogindetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewlogindetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
