import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BridalHomeComponent } from './bridal-home.component';

describe('BridalHomeComponent', () => {
  let component: BridalHomeComponent;
  let fixture: ComponentFixture<BridalHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BridalHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BridalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
