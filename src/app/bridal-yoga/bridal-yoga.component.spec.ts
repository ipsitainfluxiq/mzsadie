import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BridalYogaComponent } from './bridal-yoga.component';

describe('BridalYogaComponent', () => {
  let component: BridalYogaComponent;
  let fixture: ComponentFixture<BridalYogaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BridalYogaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BridalYogaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
