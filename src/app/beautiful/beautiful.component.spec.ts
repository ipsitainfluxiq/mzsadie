import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeautifulComponent } from './beautiful.component';

describe('BeautifulComponent', () => {
  let component: BeautifulComponent;
  let fixture: ComponentFixture<BeautifulComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeautifulComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeautifulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
