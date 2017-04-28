import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceslistComponent } from './aceslist.component';

describe('AceslistComponent', () => {
  let component: AceslistComponent;
  let fixture: ComponentFixture<AceslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
