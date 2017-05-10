import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlcallComponent } from './urlcall.component';

describe('UrlcallComponent', () => {
  let component: UrlcallComponent;
  let fixture: ComponentFixture<UrlcallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlcallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlcallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
