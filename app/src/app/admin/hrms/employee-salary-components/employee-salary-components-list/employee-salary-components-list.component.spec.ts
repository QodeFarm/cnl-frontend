import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryComponentsListComponent } from './employee-salary-components-list.component';

describe('EmployeeSalaryComponentsListComponent', () => {
  let component: EmployeeSalaryComponentsListComponent;
  let fixture: ComponentFixture<EmployeeSalaryComponentsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeSalaryComponentsListComponent]
    });
    fixture = TestBed.createComponent(EmployeeSalaryComponentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
