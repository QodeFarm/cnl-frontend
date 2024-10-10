import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupMembersComponent } from './user-group-members.component';

describe('UserGroupMembersComponent', () => {
  let component: UserGroupMembersComponent;
  let fixture: ComponentFixture<UserGroupMembersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserGroupMembersComponent]
    });
    fixture = TestBed.createComponent(UserGroupMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
