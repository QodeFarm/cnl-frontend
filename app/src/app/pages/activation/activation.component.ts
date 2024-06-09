import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [CommonModule, TaFormComponent, RouterModule],
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent {
  formOptions: TaFormConfig = {
    url: "users/login/",
    // submitted:(res:any)=>{
    //  this.formSubmiiterd(res);
    // },
    submit: {
      label: "Login",
      icon: 'user',
      successMsg: "Login Successfully",
      submittedFn: (res: any) => {

      },
    },
    fields: [
      {
        key: 'email',
        type: 'input',
        templateOptions: {
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
      }
    ]
  }
  constructor(private http: HttpClient, private router: ActivatedRoute) { }
  ngOnInit(): void {
    const params = this.router.snapshot.params;
    const payload = {
      uid: params.uid,
      token: params.token
    }
    this.http.post('users/activation/' + params.uid + '/' + params.token + '/', payload).subscribe(res => {
      console.log('activation', res);
    });
    // this.http.post('users/activation/', { uid: params.uid, token: params.token }).subscribe(res => {
    //   console.log('activation', res);
    // })

  }

}
