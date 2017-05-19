import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeloginouttimeComponent } from './employeeloginouttime.component';

describe('EmployeeloginouttimeComponent', () => {
  let component: EmployeeloginouttimeComponent;
  let fixture: ComponentFixture<EmployeeloginouttimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeloginouttimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeloginouttimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
