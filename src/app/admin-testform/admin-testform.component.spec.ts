import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTestformComponent } from './admin-testform.component';

describe('AdminTestformComponent', () => {
  let component: AdminTestformComponent;
  let fixture: ComponentFixture<AdminTestformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTestformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTestformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
