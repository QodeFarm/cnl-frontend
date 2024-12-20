import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-leave-balance',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule],
  templateUrl: './employee-leave-balance.component.html',
  styleUrls: ['./employee-leave-balance.component.scss']
})

export class EmployeeLeaveBalanceComponent {

  constructor(private http: HttpClient) {};

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    // drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'hrms/employee_leave_balance/',
      title: 'Employee Leave Balance',
      pkId: "balance_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['employee_id','leave_type_id','leave_balance','year']
      },
      cols: [
        {
          fieldKey: 'employee_id',
          name: 'Employee',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            // Concatenate first_name and last_name correctly
            const firstName = row.employee?.first_name || '';
            const lastName = row.employee?.last_name || '';
            return `${firstName} ${lastName}`.trim();
          },
        }, 
        {
          fieldKey: 'leave_type_id',
          name: 'Leave Type',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.leave_type.leave_type_name}`;
          },
        },
        {
          fieldKey: 'leave_balance',
          name: 'Leave Balance',
          sort: true
        },
        {
          fieldKey: 'year',
          name: 'Year',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action', 
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'hrms/employee_leave_balance'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'hrms/employee_leave_balance/',
      title: 'Employee Leave Balance',
      pkId: "balance_id",
      exParams: [
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
        },
        {
          key: 'leave_type_id',
          type: 'script',
          value: 'data.leave_type.leave_type_id'
        }
      ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'employee',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Employee',
                dataKey: 'employee_id',
                dataLabel: "first_name",
                options: [],
                lazy: {
                  url: 'hrms/employees/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            // {
            //   key: 'leave_type',
            //   type: 'select',
            //   className: 'col-6 pb-3 ps-0',
            //   templateOptions: {
            //     label: 'Leave Type',
            //     dataKey: 'leave_type_id',
            //     dataLabel: "leave_type_name",
            //     options: [],
            //     lazy: {
            //       url: 'hrms/leave_types/',
            //       lazyOneTime: true
            //     },
            //     required: true
            //   },
            //   hooks: {
            //     onInit: (field: any) => {
            //       //field.templateOptions.options = this.cs.getRole();
            //     }
            //   }
            // },
            {
              key: 'leave_type',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Leave Type',
                dataKey: 'leave_type_id',
                dataLabel: 'leave_type_name',
                options: [],
                lazy: {
                  url: 'hrms/leave_types/',
                  lazyOneTime: true,
                },
                required: true,
              },
              hooks: {
                onInit: (field: any) => {
                  const leaveTypeControl = field.formControl;
                  const parentFields = field.parent?.fieldGroup || [];
                  const employeeField = parentFields.find((f: any) => f.key === 'employee');
                  const leaveBalanceField = parentFields.find((f: any) => f.key === 'leave_balance');
            
                  if (!leaveTypeControl || !employeeField || !leaveBalanceField) {
                    console.warn('Required fields are missing for leave balance update.');
                    return;
                  }
            
                  const calculateDaysOff = (startDate: string, endDate: string): number => {
                    let daysOff = 0;
                    const start = new Date(startDate);
                    const end = new Date(endDate);
            
                    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                      const dayOfWeek = date.getDay();
                      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                        daysOff++;
                      }
                    }
                    return daysOff;
                  };
            
                  const updateLeaveBalance = () => {
                    const employeeId = employeeField.formControl?.value?.employee_id;
                    const leaveTypeId = leaveTypeControl?.value?.leave_type_id;
                  
                    if (!employeeId || !leaveTypeId) {
                      console.warn('Missing Employee ID or Leave Type ID. Resetting Leave Balance.');
                      leaveBalanceField.formControl.setValue(null);
                      return;
                    }
                  
                    console.log('Fetching Max Days Allowed from Leave Types table...');
                    this.http.get(`hrms/leave_types/?leave_type_id=${leaveTypeId}`)
                      .subscribe(
                        (leaveTypesResponse: any) => {
                          console.log("res", leaveTypesResponse);
                          const leaveType = leaveTypesResponse.data?.find(
                            (type: any) => type.leave_type_id === leaveTypeId
                          )

                          if (!leaveType) {
                            console.warn('Leave Type not found. Defaulting to 0.');
                            leaveBalanceField.formControl.setValue(0);
                            return;
                          }

                          const maxDaysAllowed = leaveType.max_days_allowed;

                          if (maxDaysAllowed === undefined || maxDaysAllowed === null) {
                            console.warn('Max Days Allowed not found. Defaulting to 0.');
                            leaveBalanceField.formControl.setValue(0);
                            return;
                          }

                          leaveBalanceField.formControl.setValue(maxDaysAllowed);
                          console.log('Max Days Allowed Retrieved:', maxDaysAllowed);
                  
                          // Fetch approved leave approvals
                          this.http.get(`hrms/leave_approvals/?leave.leave_type_id=${leaveTypeId}&leave.employee_id=${employeeId}`)
                            .subscribe(
                              (leaveApprovalsResponse: any) => {
                                const approvedLeaves = leaveApprovalsResponse.data?.filter(
                                  (approval: any) => approval.status?.status_name === 'Approved'
                                );
                  
                                if (!approvedLeaves.length) {
                                  console.warn('No approved leave approvals found.');
                                  leaveBalanceField.formControl.setValue(maxDaysAllowed);
                                  return;
                                }
                  
                                let totalDaysOff = 0;
                                approvedLeaves.forEach((approval: any) => {
                                  const leaveId = approval.leave?.leave_id;
                  
                                  // Fetch employee leave records based on leaveId
                                  this.http.get(`hrms/employee_leaves/?employee_id=${employeeId}&leave_type_id=${leaveTypeId}`)
                                    .subscribe(
                                      (employeeLeavesResponse: any) => {
                                        const leaveRecords = employeeLeavesResponse.data?.filter((record: any) =>
                                          record.leave_id === leaveId
                                        );
                  
                                        leaveRecords.forEach((record: any) => {
                                          if (record.start_date && record.end_date) {
                                            totalDaysOff += calculateDaysOff(record.start_date, record.end_date);
                                          }
                                        });
                  
                                        console.log('Total Approved Days Off:', totalDaysOff);
                                        const remainingLeaveBalance = maxDaysAllowed - totalDaysOff;
                                        console.log('Remaining Leave Balance:', remainingLeaveBalance);
                                        leaveBalanceField.formControl.setValue(remainingLeaveBalance);
                                      },
                                      (error) => {
                                        console.error('Error fetching employee leaves:', error);
                                        leaveBalanceField.formControl.setValue(null);
                                      }
                                    );
                                });
                              },
                              (error) => {
                                console.error('Error fetching leave approvals:', error);
                                leaveBalanceField.formControl.setValue(0);
                              }
                            );
                        },
                        (error) => {
                          console.error('Error fetching Max Days Allowed:', error);
                          leaveBalanceField.formControl.setValue(null);
                        }
                      );
                  };
                  
            
                  // Subscribe to changes in employee or leave type fields
                  employeeField.formControl?.valueChanges.subscribe(updateLeaveBalance);
                  leaveTypeControl.valueChanges.subscribe(updateLeaveBalance);
                },
              },
            }, 
            {
              key: 'leave_balance',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Leave Balance',
                required: true,
                placeholder: 'Leave Balance',
              },
              hooks: {
                onInit: (field: any) => {
                  // field.formControl.disable(); // Disable to make it read-only if auto-filled
                }
              }
            },
            {
              key: 'year',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Year',
                placeholder: 'Enter Year',
                required: false,
                defaultValue: new Date().getFullYear().toString(), // Set default value to the current year
              },
              hide: true // This hides the field from the UI
            },
          ]
        }
      ],
    }
  };
};