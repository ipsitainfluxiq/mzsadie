import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BridalMassageComponent } from './bridal-massage.component';

describe('BridalMassageComponent', () => {
  let component: BridalMassageComponent;
  let fixture: ComponentFixture<BridalMassageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BridalMassageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BridalMassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
