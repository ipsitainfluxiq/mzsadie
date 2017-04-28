import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditacesComponent } from './editaces.component';

describe('EditacesComponent', () => {
  let component: EditacesComponent;
  let fixture: ComponentFixture<EditacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
