import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { EmployeeLeavesListComponent } from './employee-leaves-list/employee-leaves-list.component';

@Component({
  selector: 'app-employee-leaves',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule,EmployeeLeavesListComponent],
  templateUrl: './employee-leaves.component.html',
  styleUrls: ['./employee-leaves.component.scss']
})

export class EmployeeLeavesComponent implements OnInit {
  showEmployeeLeavesList: boolean = false;
  showForm: boolean = false;
  EmployeeLeavesEditID: any; 

  set_default_status_id(): any {
    return (this.http.get('masters/statuses/').subscribe((res: any) => {
      if (res && res.data) {
        const key = 'status_name';
        const value = 'Open';
        const filteredDataSet = res.data.filter((item: any) => item[key] === value);
        const status_id = filteredDataSet[0].status_id;
        this.formConfig.model['leave_approvals']['status_id'] = status_id; // set default is 'Open'
      }
    }));
  };

  constructor(private http: HttpClient) {};

  ngOnInit() {
    this.showEmployeeLeavesList = false;
    this.showForm = true;
    this.EmployeeLeavesEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);
    this.set_default_status_id(); // lead_status_id = 'Open'
    this.formConfig.fields[1].fieldGroup[1].fieldGroup[2].hide = true; 

  };

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editEmployeeLeaves(event) {
    console.log('event', event);
    this.EmployeeLeavesEditID = event;
    this.http.get('hrms/employee_leaves/' + event).subscribe((res: any) => {
      if (res) {
        // this.formConfig.model = res;
        this.formConfig.model = {
          employee_leaves: res.data.employee_leaves,
          leave_approvals: res.data.leave_approvals || {}
        };
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'leave_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['leave_id'] = this.EmployeeLeavesEditID;
        this.showForm = true;
        this.formConfig.fields[1].fieldGroup[1].fieldGroup[2].hide = false; 
      }
    })
    this.hide();
  };

  showEmployeeLeavesListFn() {
    this.showEmployeeLeavesList = true;
  };

  setFormConfig() {
    this.EmployeeLeavesEditID = null;
    this.formConfig = {
      url: "hrms/employee_leaves/",
      // title: 'leads',
      formState: {
        viewMode: false,
      },
      showActionBtn : true,
      exParams: [],
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model:{
        employee_leaves: {},
        leave_approvals: {},
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'employee_leaves',
          fieldGroup: [
            {
              key: 'employee',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
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
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee_leaves']) {
                      this.formConfig.model['employee_leaves']['employee_id'] = data.employee_id;
                    } else {
                      console.error('Form config or employee data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'leave_type',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Leave Type',
                dataKey: 'leave_type_id',
                dataLabel: "leave_type_name",
                options: [],
                lazy: {
                  url: 'hrms/leave_types/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee_leaves']) {
                      this.formConfig.model['employee_leaves']['leave_type_id'] = data.leave_type_id;
                    } else {
                      console.error('Form config or leave_type data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'start_date',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Start Date',
                type: 'date',
                placeholder: 'Select Start Date',
                required: true,
              },
            },
            {
              key: 'end_date',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'End Date',
                type: 'date',
                placeholder: 'Select End Date',
                required: true,
              },
            },
            {
              key: 'comments',
              type: 'textarea',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Comments',
                placeholder: 'Enter Comments',
                required: false,
              }
            },
          ]
        },

        // end employee_leaves

        // start of leave_approvals keys

        {
          fieldGroupClassName: "row col-12 m-0 custom-form-card",
          fieldGroup: [
            {
              template: '<div class="custom-form-card-title">Leave Approvals</div>',
              // className: 'col-12',
              className: 'col-12 p-0'
              // className: 'col-12 pb-3', // Added padding to align properly
            },
            {
              fieldGroupClassName: "row m-0 custom-form-block align-items-center",
              key: 'leave_approvals',
              fieldGroup: [
                {
                  key: 'approval_date',
                  type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
                  className: 'col-3 pb-3 ps-0',
                  templateOptions: {
                    label: 'Approval Date',
                    type: 'datetime-local',  // Use datetime-local for both date and time input
                    placeholder: 'Select Approval Date and Time',
                    required: false,
                  }
                },
                {
                  key: 'comments',
                  type: 'textarea',
                  className: 'col-3 pb-3 ps-0',
                  templateOptions: {
                    label: 'Comments',
                    placeholder: 'Enter Comments',
                    required: false,
                  }
                },            
                {
                  key: 'status',
                  type: 'select',
                  className: 'col-3 pb-3 ps-0',
                  templateOptions: {
                    label: 'Status',
                    dataKey: 'status_id',
                    dataLabel: "status_name",
                    options: [],
                    placeholder: 'Select Order status type',
                    lazy: {
                      url: 'masters/statuses/',
                      lazyOneTime: true
                    },
                    required: true
                  },
                  hooks: {
                    onChanges: (field: any) => {
                      field.formControl.valueChanges.subscribe((data: any) => {
                        if (this.formConfig && this.formConfig.model && this.formConfig.model['leave_approvals']) {
                          this.formConfig.model['leave_approvals']['status_id'] = data.status_id;
                        } else {
                          console.error('Form config or status data model is not defined.');
                        }
                      });
                    }
                  }
                },
                {
                  key: 'approver',
                  type: 'select',
                  className: 'col-3 pb-3 ps-0',
                  templateOptions: {
                    label: 'Approver',
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
                    onChanges: (field: any) => {
                      field.formControl.valueChanges.subscribe((data: any) => {
                        if (this.formConfig && this.formConfig.model && this.formConfig.model['leave_approvals']) {
                          this.formConfig.model['leave_approvals']['approver_id'] = data.employee_id;
                        } else {
                          console.error('Form config or employee data model is not defined.');
                        }
                      });
                    }
                  }
                },                
              ]
            },
          ]
        },
      ]
    }
  }
}



  // calculateDaysOff() {
  //   const startDate = this.formConfig.model.start_date ? new Date(this.formConfig.model.start_date) : null;
  //   const endDate = this.formConfig.model.end_date ? new Date(this.formConfig.model.end_date) : null;
  
  //   if (startDate && endDate && startDate <= endDate) {
  //     let daysOff = 0;
  //     let currentDate = new Date(startDate);
  
  //     while (currentDate <= endDate) {
  //       const day = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
  //       if (day !== 0 && day !== 6) {
  //         daysOff++;
  //       }
  //       currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  //     }
  
  //     // Update the `days_off` field
  //     this.formConfig.model.days_off = daysOff;
  //   } else {
  //     // Reset `days_off` if dates are invalid
  //     this.formConfig.model.days_off = null;
  //   }
  // } 
   
  // submitLeaveRequest() {

  //   const leaveRequestData = {
  //     employee_id: this.formConfig.model.employee.employee_id,
  //     leave_type_id: this.formConfig.model.leave_type.leave_type_id,
  //     start_date: this.formConfig.model.start_date,
  //     end_date: this.formConfig.model.end_date,
  //     comments: this.formConfig.model.comments
  //   }

  //   // const leaveRequestData = this.formConfig.model;
  //   console.log('leaveRequestData',leaveRequestData)

  //   // Submit the leave request to the backend
  //   this.http.post('hrms/employee_leaves/', leaveRequestData).subscribe(
  //     (response: any) => {

  //   // this.http.post(url, leaveRequestData).subscribe(
  //   //   (response: any) => {
  //       console.log('API Response:', response);
  //       if (response && response.data && response.data.leave_id) {

  //         // const leaveApprovalLink = `admin/hrms/leave-approvals/${response.data.leave_id}`;
  //         const leaveApprovalLink = `admin/hrms/leave-approvals`;
  //         console.log('Generated Leave Approval Link:', leaveApprovalLink);

  //         this.router.navigate([leaveApprovalLink], { state: { data: response } });

  //         alert(`Leave request submitted successfully. Redirecting to approvals...`);
  //         this.ngOnInit(); // Reset form or take other actions
  //       } else {
  //         console.error('Error: No leave_id found in the response:', response);
  //         alert('Failed to submit leave request. Please try again.');
  //       }
  //     },
  //     (error) => {
  //       console.error('HTTP Error:', error);
  //       alert('Failed to submit leave request. Please check the console for details.');
  //     }
  //   );
  // }

  // onSubmit() {
  //   if (this.formConfig.submit.label === 'Update') {
  //     this.updateLeaveRequest(); // Call updateLeaveRequest for updating leave
  //   } else {
  //     this.submitLeaveRequest(); // Call submitLeaveRequest for creating a new leave
  //   }
  // }

  // updateLeaveRequest() {
  //   const leaveId = this.formConfig.model.leave_id; // Ensure `leave_id` is part of the model
  //   console.log("Leave ID in edit: ", leaveId);
  
  //   if (!leaveId) {
  //     console.error('Error: Leave ID is required to update a leave request.');
  //     alert('Cannot update leave request without a valid Leave ID.');
  //     return;
  //   }
  
  //   const leaveRequestPayload = {
  //     employee_id: this.formConfig.model.employee.employee_id,
  //     leave_type_id: this.formConfig.model.leave_type.leave_type_id,
  //     start_date: this.formConfig.model.start_date,
  //     end_date: this.formConfig.model.end_date,
  //     comments: this.formConfig.model.comments
  //   };
  
  //   // PUT request to update the leave request
  //   this.http.put(`hrms/employee_leaves/${leaveId}/`, leaveRequestPayload).subscribe(
  //     (response: any) => {
  //       console.log('API Response for Update:', response);

  //       // Navigate to approval page after successful update
  //       // const leaveApprovalLink = `hrms/leave_approvals/?leave_id=${encodeURIComponent(leaveId)}`;
  //       // console.log('Generated Leave Approval Link:', leaveApprovalLink);
  //       // this.router.navigateByUrl(leaveApprovalLink);

  //       const leaveApprovalLink = `admin/hrms/leave-approvals`;
  //       console.log('Generated Leave Approval Link:', leaveApprovalLink);

  //       this.router.navigate([leaveApprovalLink], { state: { data: response } });
  //       alert(`Leave request submitted successfully. Redirecting to approvals...`);
  
  //       // Optionally reset the form
  //       this.ngOnInit();
  //     },
  //     (error) => {
  //       console.error('Error updating Leave Request:', error);
  //     }
  //   );
  // }
// }