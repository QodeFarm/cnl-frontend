import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-leave-approvals',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule],
  templateUrl: './leave-approvals.component.html',
  styleUrls: ['./leave-approvals.component.scss']
})
export class LeaveApprovalsComponent {
  @Output('edit') edit = new EventEmitter<void>();
  @Output('circle') circle = new EventEmitter<void>();

    curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    hideAddBtn: true,
    tableConfig: {
      apiUrl: 'hrms/leave_approvals/',
      title: 'Leave Approvals',
      pkId: "approval_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['approval_id', 'name']
      },
      cols: [
        {
          fieldKey: 'leave_id',
          name: 'Employee',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            // Concatenate first_name and last_name correctly
            const firstName = row.leave.employee?.first_name || '';
            const lastName = row.leave.employee?.last_name || '';
            return `${firstName} ${lastName}`.trim();
          },
        }, 
        {
          fieldKey: 'leave_id',
          name: 'Leave Type',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.leave.leave_type.leave_type_name}`;
          },
        },
        {
          fieldKey: 'leave_id',
          name: 'Start Date',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.leave.start_date}`;
          },
        },
        {
          fieldKey: 'leave_id',
          name: 'End Date',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.leave.end_date}`;
          },
        },
        {
          fieldKey: 'status_id',
          name: 'Status',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.status.status_name}`;
          },
        },
        {
          fieldKey: 'approval_date',
          name: 'Approval Date',
          sort: true
        },
        {
          fieldKey: 'approver',
          name: 'Approver',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            // Concatenate first_name and last_name correctly
            const firstName = row.approver?.first_name || '';
            const lastName = row.approver?.last_name || '';
            return `${firstName} ${lastName}`.trim();
          },
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'callBackFn',
              icon: 'fa fa-check-circle text-success',
              confirm: true,
              confirmMsg: "Sure to Approve?",
              callBackFn: (row, action) => {
                console.log(row);
                this.circleLeaveApprovals(row.approval_id);  // Call the method for approval
                this.circle.emit(row.approval_id);
              }
            },
            {
              type: 'callBackFn',
              icon: 'fa fa-times-circle text-danger', // Change to a reject icon
              confirm: true,
              confirmMsg: "Are you sure to Reject?", // Updated confirmation message
              callBackFn: (row, action) => {
                console.log(row);
                this.circleLeaveRejections(row.approval_id);  // Call the method for reject
                this.circle.emit(row.approval_id); // Adjust emit for rejection
              }
            }
          ]
        },
      ]
    },
    formConfig: {
      url: 'hrms/leave_approvals/',
      title: 'Leave Approvals',
      pkId: "approval_id",
      exParams: [
        {
          key: 'status_id',
          type: 'script',
          value: 'data.status.status_id'
        },
        {
          key: 'leave_id',
          type: 'script',
          value: 'data.leave.leave_id'
        },
        {
          key: 'approver_id',
          type: 'script',
          value: 'data.approver.manager_id'
        }
      ],
      fields: [ ]
    }
  }

  constructor(private http: HttpClient) {};

//=====================================Status = Approved ==============================================


  circleLeaveApprovals(event: any) {
    const url = `hrms/leave_approvals/${event}/`;
    const statusName = 'Approved'; // Status name to search for

    // URL to fetch statuses
    const statusesUrl = `masters/statuses/`;

    // Fetch the status ID by status name
    this.http.get(statusesUrl).subscribe(
        (response: any) => {
            if (response && Array.isArray(response.data)) {
                // Find the status object with the matching status name
                const status = response.data.find((s: any) => s.status_name.toLowerCase() === statusName.toLowerCase());
                
                if (status && status.status_id) {
                    this.updateLeaveApproval(url, status.status_id);
              
                } else {
                    console.error(`Error: Status "${statusName}" not found.`);
                    alert(`Status "${statusName}" not found.`);
                }
            } else {
                console.error("Invalid response format from statuses API:", response);
                alert("Failed to fetch statuses. Please try again.");
            }
        },
        (error) => {
            console.error("Error fetching statuses:", error);
            alert("Failed to fetch statuses. Please try again.");
        }
    );
  }


  updateLeaveApproval(url: string, statusId: string) {
    const now = new Date();
    const formattedDate = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + 'T' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

    // Prepare the payload for the PATCH request
    const payload = {
        status_id: statusId, // Fetched status ID
        approval_date: formattedDate // Today's date
    };

    // Send the PATCH request to update the status
    this.http.patch(url, payload).subscribe(
      (res: any) => {
          if (res && res.data && res.data.leave_id) {
              // Extract employee ID, leave type ID, and leave days
              const leave = res.data.leave;
              const employeeId = leave.employee.employee_id;
              const leaveTypeId = leave.leave_type.leave_type_id;
              const leaveDays = res.data.leave_days;

              // Fetch the employee's leave balance
              this.http.get(`hrms/employee_leave_balance/?employee_id=${employeeId}&leave_type_id=${leaveTypeId}`).subscribe(
                  (balanceResponse: any) => {
                      if (balanceResponse && balanceResponse.data && balanceResponse.data.length > 0) {
                        const leaveBalance = balanceResponse.data[0]; // Assuming one record is returned
                        const balanceId = leaveBalance.balance_id;

                        // Check if leave_balance exists in the response
                        const totalBalance = leaveBalance.leave_balance;
                        if (totalBalance === undefined) {
                          console.error("Error: leave_balance field is undefined in the response.");
                          return;
                        }
                  
                        // Convert leave_balance to a number, as it is a string in the response
                        const totalBalanceParsed = parseFloat(totalBalance); // Ensure it's a number
                        if (isNaN(totalBalanceParsed)) {
                          console.error("Error: Invalid leave_balance value.");
                          return;
                        }
                          const remainingBalance = totalBalance - leaveDays;


                          // Prepare the payload for the leave balance update
                          const balancePayload = {
                            leave_balance: remainingBalance
                          }

                          // Save the updated leave balance
                          this.http.patch(`hrms/employee_leave_balance/${balanceId}/`, balancePayload).subscribe(
                              () => {
                                  window.location.reload(); // Reload page to reflect changes
                              },
                              (error) => {
                                  console.error("Error saving leave balance:", error);
                                  alert("Failed to update leave balance.");
                              }
                          );
                      } else {
                          console.error("No leave balance found for employee or leave type.");
                          alert("No leave balance found for this employee and leave type.");
                      }
                  },
                  (error) => {
                      console.error("Error fetching leave balance:", error);
                      alert("Failed to fetch leave balance.");
                  }
              );
          } else {
              console.error("Error: Leave data not found in response:", res);
          }
      },
      (error) => {
          console.error("HTTP error:", error);
          alert("An error occurred while updating the leave status.");
      }
    );
  }


//=====================================Status = Rejected ==============================================
      
  circleLeaveRejections(event: any) {
    const url = `hrms/leave_approvals/${event}/`;
    const statusName = 'Rejected'; // Status name to search for

    // URL to fetch statuses
    const statusesUrl = `masters/statuses/`;

    // Fetch the status ID by status name
    this.http.get(statusesUrl).subscribe(
      (response: any) => {
        if (response && Array.isArray(response.data)) {
          // Find the status object with the matching status name
          const status = response.data.find((s: any) => s.status_name.toLowerCase() === statusName.toLowerCase());

          if (status && status.status_id) {
            this.updateLeaveRejection(url, status.status_id);
          } else {
            console.error(`Error: Status "${statusName}" not found.`);
            alert(`Status "${statusName}" not found.`);
          }
        } else {
          console.error("Invalid response format from statuses API:", response);
          alert("Failed to fetch statuses. Please try again.");
        }
      },
      (error) => {
        console.error("Error fetching statuses:", error);
        alert("Failed to fetch statuses. Please try again.");
      }
    );
  }

  updateLeaveRejection(url: string, statusId: string) {
    const now = new Date();
    const formattedDate = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + 'T' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    const payload = {
      status_id: statusId, // Fetched status ID for 'Rejected'
      approval_date: formattedDate // Today's date
    };

    // Send the PATCH request to update the status
    this.http.patch(url, payload).subscribe(
      (res: any) => {
        if (res && res.data && res.data.approval_id) {
          window.location.reload(); // Reload the page to reflect changes
        } else {
          console.error("Error: Approval ID not found in response:", res);
        }
      },
      (error) => {
        console.error("HTTP error:", error);
        alert("An error occurred while updating the leave status.");
      }
    );
  }
}
