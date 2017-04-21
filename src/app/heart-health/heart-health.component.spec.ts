import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartHealthComponent } from './heart-health.component';

describe('HeartHealthComponent', () => {
  let component: HeartHealthComponent;
  let fixture: ComponentFixture<HeartHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeartHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
