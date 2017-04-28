import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddacesComponent } from './addaces.component';

describe('AddacesComponent', () => {
  let component: AddacesComponent;
  let fixture: ComponentFixture<AddacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
