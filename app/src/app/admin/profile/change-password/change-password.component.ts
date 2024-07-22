import { Component } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  options: TaFormConfig = {
    url: 'users/change_password/',
    exParams: [
    ],
    submit: {
      label: "Change Password",
      icon: 'user',
      successMsg: "Change Password Successfully",
      submittedFn: (res: any) => {
        // this.router.navigateByUrl('/');
        console.log("Change Password Successfully");
        
      },
    },
    fields: [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'password',
            type: 'text',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Old Password',
              // dataKey: 'user',
              // dataLabel: "user",
              placeholder: "Enter Old Password",
              required: true
            },
            hooks: {
              onInit: (field: any) => {
              }
            }
          },
          {
            key: 'confirm_password',
            type: 'text',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'New Password',
              placeholder: "Enter New Password",
              required: true
            },
            hooks: {
              onInit: (field: any) => {
              }
            }
          }
        ]
      }
    ]

  }


}
