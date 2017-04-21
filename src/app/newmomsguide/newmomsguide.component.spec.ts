import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewmomsguideComponent } from './newmomsguide.component';

describe('NewmomsguideComponent', () => {
  let component: NewmomsguideComponent;
  let fixture: ComponentFixture<NewmomsguideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewmomsguideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewmomsguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
