import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaFormConfig } from '@ta/ta-form';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  options: TaFormConfig = {
    url: "users/reset_password_email/",
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
        key: 'email',
        type: 'input',
        className: "pb-3",
        templateOptions: {
          type: 'email',
          hideLabel: true,
          addonLeftIcon: "user",
          addonLeft: {
            class: 'user',
          },
          addonRight: {
            text: '$',
          },
          label: 'Email',
          placeholder: 'Enter Email',
          required: true,
        }
      }
    ]
  }
  constructor(private router: Router) { }
  ngOnInit(): void {

  }
  formSubmiiterd(res: any) {
    // console.log('res', res);
    this.router.navigateByUrl('/login');
  }

}
