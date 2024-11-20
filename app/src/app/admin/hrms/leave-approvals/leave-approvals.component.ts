import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { LeaveApprovalsListComponent } from './leave-approvals-list/leave-approvals-list.component';


@Component({
  selector: 'app-leave-approvals',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule,LeaveApprovalsListComponent],
  templateUrl: './leave-approvals.component.html',
  styleUrls: ['./leave-approvals.component.scss']
})
export class LeaveApprovalsComponent {
  showLeaveApprovalsList: boolean = false;
  showForm: boolean = false;
  LeaveApprovalsEditID: any; 

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showLeaveApprovalsList = false;
    this.showForm = true;
    this.LeaveApprovalsEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editLeaveApprovals(event) {
    console.log('event', event);
    this.LeaveApprovalsEditID = event;
    this.http.get('hrms/leave_approvals/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'approval_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };

  showLeaveApprovalsListFn() {
    this.showLeaveApprovalsList = true;
  };

  setFormConfig() {
    this.LeaveApprovalsEditID = null;
    this.formConfig = {
      url: "hrms/leave_approvals/",
      // title: 'leads',
      formState: {
        viewMode: false,
      },
      showActionBtn : true,
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
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model:{},

      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
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
            },            {
              key: 'status',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Status',
                dataKey: 'status_id',
                dataLabel: "status_name",
                options: [],
                lazy: {
                  url: 'masters/statuses/',
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
            {
              key: 'leave',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Leave',
                dataKey: 'leave_id',
                dataLabel: "comments",
                options: [],
                lazy: {
                  url: 'hrms/employee_leaves/',
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
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            }
          ]
        }
      ]
    }
  }
}

