import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaLocalStorage } from '@ta/ta-core';
import { TaFormConfig } from '@ta/ta-form';
import { UserService } from 'src/app/services/user.service'; // Corrected import path

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
          attributes: {
            style: 'padding-left: 10px;' // Add your padding here
          }
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
//   constructor(private router: Router) { }
//   formSubmiiterd(res: any) {
//     // console.log('res', res);
//     localStorage.setItem('accessToken', res.data[0].access_token);
//     TaLocalStorage.setItem('user', res.data[0]);

//     this.router.navigateByUrl('/admin');


//   }

// }


constructor(private router: Router, private userService: UserService) { }

  formSubmiiterd(res: any) {
    // Log the complete response to check its structure
    console.log('LoginComponent: formSubmiiterd called, response:', res);

    // Extract the user details from the response
    const user = res.data[0];
    const userId = user.user_id;
    const username = user.username;
    const firstName = user.first_name;  
    const lastName = user.last_name;

    // Log extracted user details
    console.log('LoginComponent: Extracted userId:', userId);
    console.log('LoginComponent: Extracted username:', username);
    console.log('LoginComponent: Extracted firstName:', firstName);  
    console.log('LoginComponent: Extracted lastName:', lastName); 

    // Store user data in the UserService and localStorage
    this.userService.setUserDetails(userId, username, firstName, lastName);

    // Also store tokens in localStorage
    localStorage.setItem('accessToken', user.access_token);
    localStorage.setItem('refreshToken', user.refresh_token);
    localStorage.setItem('accessToken', res.data[0].access_token);
    TaLocalStorage.setItem('user', res.data[0]);

    // Log stored tokens
    console.log('LoginComponent: Access token stored:', user.access_token);
    console.log('LoginComponent: Refresh token stored:', user.refresh_token);
    console.log('response: Access token stored:', res.data[0].access_token);
    console.log('response: user', res.data[0]);
    // Navigate to the admin page after login
    this.router.navigateByUrl('/admin');
  }
}
