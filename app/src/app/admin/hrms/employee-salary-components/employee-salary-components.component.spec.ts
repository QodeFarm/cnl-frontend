import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryComponentsComponent } from './employee-salary-components.component';

describe('EmployeeSalaryComponentsComponent', () => {
  let component: EmployeeSalaryComponentsComponent;
  let fixture: ComponentFixture<EmployeeSalaryComponentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeSalaryComponentsComponent]
    });
    fixture = TestBed.createComponent(EmployeeSalaryComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
