import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaFormConfig } from '@ta/ta-form';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  options: TaFormConfig = {
    url: "/users/reset_password/",
    // submitted:(res:any)=>{
    //  this.formSubmiiterd(res);
    // },
    reset: {
      cssClass: 'd-none'
    },
    submit: {
      label: "Submit",
      icon: 'user',
      successMsg: "Password Reset Link Send. Please Check Your Email",
      submittedFn: (res: any) => {
        this.formSubmiiterd(res);
      },
    },
    fields: [
      {
        key: 'password',
        type: 'input',
        className: "pb-3",
        templateOptions: {
          type: 'password',
          hideLabel: true,
          addonLeftIcon: "lock",
          addonLeft: {
            class: 'user',
          },
          addonRight: {
            text: '$',
          },
          attributes: {
            style: 'padding-left: 10px;' // Add your padding here
          },
          label: 'Password',
          placeholder: 'Enter Password',
          required: true,
        }
      },
      {
        key: 'confirm_password',
        type: 'input',
        className: "pb-3",
        templateOptions: {
          type: 'password',
          hideLabel: true,
          addonLeftIcon: "lock",
          addonLeft: {
            class: 'user',
          },
          addonRight: {
            text: '$',
          },
          attributes: {
            style: 'padding-left: 10px;' // Add your padding here
          },
          label: 'Confirm Password',
          placeholder: 'Enter Confirm Password',
          required: true,
        }
      }
    ]
  }
  constructor(private router: Router, private activeRouter: ActivatedRoute) { }
  ngOnInit(): void {
    this.options.url = 'users/reset_password/' + this.activeRouter.snapshot.params.uid + '/' + this.activeRouter.snapshot.params.token + '/';
    this.options.model = {
      token: this.activeRouter.snapshot.params.token,
      uid: this.activeRouter.snapshot.params.uid
    }
  }
  formSubmiiterd(res: any) {
    // console.log('res', res);
    this.router.navigateByUrl('/login');
  }
}
