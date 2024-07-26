import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaLocalStorage } from '@ta/ta-core';
import { TaFormConfig } from '@ta/ta-form';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  options = {
    url: "users/login/",
    // submitted:(res:any)=>{
    //  this.formSubmiiterd(res);
    // },
    submit: {
      label: "Login",
      icon: 'user',
      successMsg: "Login Successfully",
      submittedFn: (res: any) => {
        this.formSubmiiterd(res);
      },
    },
    fields: [
      {
        key: 'username',
        type: 'input',
        className: "form-group",
        templateOptions: {
          hideLabel: true,
          addonLeftIcon: "user",
          addonLeft: {
            class: 'user',
          },
          addonRight: {
            text: '$',
          },
          label: 'Username',
          placeholder: 'Enter Username',
          required: true,
        }
      },
      {
        key: 'password',
        type: 'input',
        className: "form-group",
        templateOptions: {
          hideLabel: true,
          addonLeftIcon: "lock",
          label: 'Password',
          type: 'password',
          placeholder: 'Enter Password',
          required: true,
        }
      }
    ]
  }
  formConfig: TaFormConfig = {

    url: 'employees/employees/',
    title: 'User',
    pkId: "employee_id",
    exParams: [
    ],
    fields: [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'first_name',
            type: 'input',
            className: 'ta-cell pr-md col-12 mat-input',
            templateOptions: {
              label: 'First Name',
              placeholder: 'User id / Email',
              required: true,
              hideLabel: true,
            }
          },
          {
            key: 'last_name',
            type: 'input',
            className: 'ta-cell pr-md col-12 mat-input',
            templateOptions: {
              label: 'Last Name',
              placeholder: 'Password',
              hideLabel: true,
              required: true,
            }
          },
        ]
      }
    ],
    submit: {
      submittedFn: (res) => {

      }
    }
  }
  constructor(private router: Router) { }
  formSubmiiterd(res: any) {
    // console.log('res', res);
    localStorage.setItem('accessToken', res.data[0].access_token);
    TaLocalStorage.setItem('user', res.data[0]);

    this.router.navigateByUrl('/admin');


  }

}
