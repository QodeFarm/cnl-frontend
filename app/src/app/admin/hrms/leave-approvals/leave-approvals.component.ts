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
        // {
        //   fieldKey: 'comments', 
        //   name: 'Comments',
        //   sort: true
        // }, 
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
            // {
            //   type: 'delete',
            //   label: 'Delete',
            //   confirm: true,
            //   confirmMsg: "Sure to delete?",
            //   apiUrl: 'hrms/leave_approvals'
            // },
            // {
            //   type: 'edit',
            //   label: 'Edit'
            // },
            {
              type: 'callBackFn',
              icon: 'fa fa-check-circle',
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
              icon: 'fa fa-times-circle', // Change to a reject icon
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
          value: 'data.approver.employee_id'
        }
      ],
      fields: [ ]
    }
  }

  constructor(private http: HttpClient) {};

  circleLeaveApprovals(event: any) {
    console.log("we are in this method");
    // Construct the URL for the patch request
    const url = `hrms/leave_approvals/${event}/`;
    // Prepare the payload with the updated status
    const payload = { status_id: 'c2898235-4568-49ee-a68d-451b3ac703e5' }; // Approved status
      
    // Send the patch request to update the status
    this.http.patch(url, payload).subscribe(
      (res: any) => {
          console.log("Response:", res);

          // Check if the response contains approval_id
          if (res && res.data.approval_id) {
              // Store the success message in localStorage
              // localStorage.setItem('sidebarMessage', 'Leave status Approved');

              // Reload the page to reflect changes
              window.location.reload();
          } else {
              // Handle the case when no approval_id is returned
              console.error("Error: Approval ID not found in response:", res);
          }
      },
      (error) => {
          // Handle any HTTP error and log the error message
          console.error("HTTP error:", error);
          alert("An error occurred while updating the leave status.");
      }
    );
  }

  circleLeaveRejections(event: any) {
    console.log("we are in the rejection method");
    // Construct the URL for the patch request
    const url = `hrms/leave_approvals/${event}/`;
    // Prepare the payload with the updated rejection status
    const payload = { status_id: '349fb6e4-6e48-4121-9573-57275ae85a37' }; // Rejected status

    // Send the patch request to update the status
    this.http.patch(url, payload).subscribe(
      (res: any) => {
          console.log("Response:", res);

          // Check if the response contains approval_id
          if (res && res.data.approval_id) {
              // Reload the page to reflect changes
              window.location.reload();
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
