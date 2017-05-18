import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewlogouthistoryComponent } from './viewlogouthistory.component';

describe('ViewlogouthistoryComponent', () => {
  let component: ViewlogouthistoryComponent;
  let fixture: ComponentFixture<ViewlogouthistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewlogouthistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewlogouthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
