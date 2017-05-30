import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneraldoctorComponent } from './generaldoctor.component';

describe('GeneraldoctorComponent', () => {
  let component: GeneraldoctorComponent;
  let fixture: ComponentFixture<GeneraldoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneraldoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneraldoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
