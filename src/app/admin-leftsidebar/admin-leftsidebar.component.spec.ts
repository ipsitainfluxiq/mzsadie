import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeftsidebarComponent } from './admin-leftsidebar.component';

describe('AdminLeftsidebarComponent', () => {
  let component: AdminLeftsidebarComponent;
  let fixture: ComponentFixture<AdminLeftsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLeftsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLeftsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
