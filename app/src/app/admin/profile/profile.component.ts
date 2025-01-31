

// profile.component.ts
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaFormConfig } from 'projects/ta-form/src/lib/ta-form-config';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { LocalStorageService } from '@ta/ta-core';


@Component({
  selector: 'app-profile',
  // standalone: true,
  // imports: [CommonModule, AdminCommmonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userName: string | null = null;
  userId: number | null = null;
  menulList = <any>[];
  title = "Profile";
  showForm = false;
  options: TaFormConfig = {
    url: 'users/user/',
    title: 'User Profile',
    pkId: "user_id",
    exParams: [
      // {
      //   key: 'company_id',
      //   type: 'script',
      //   value: 'data.company.company_id'
      // },
      {
        key: 'role_id',
        type: 'script',
        value: 'data.role.role_id'
      },
      {
        key: 'status_id',
        type: 'script',
        value: 'data.status.status_id'
      }
    ],
    submit: {
      label: "Update Profile",
      icon: 'save',
      successMsg: "Profile updated successfully",
      submittedFn: (res: any) => {
        this.router.navigateByUrl('/profile');
      },
    },
    // model:{},
    fields: [
      {
        fieldGroupClassName: 'ant-row custom-form-block',
        fieldGroup: [
          {
            className: 'col-9 p-0',
            fieldGroupClassName: "ant-row",
            fieldGroup: [
              {
                key: 'first_name',
                type: 'text',
                className: 'ta-cell pr-md col-md-6 col-12',
                templateOptions: {
                  label: 'First Name',
                  required: true
                },
                hooks: {
                  onInit: (field: any) => {
                    //field.templateOptions.options = this.cs.getRole();
                  }
                }
              },
              {
                key: 'last_name',
                type: 'text',
                className: 'ta-cell pr-md col-md-6 col-12',
                templateOptions: {
                  label: 'Last Name',
                  required: true
                }
              },
              {
                key: 'email',
                type: 'text',
                className: 'ta-cell pr-md col-md-6 col-12',
                templateOptions: {
                  label: 'User Email',
                  dataKey: 'user',
                  dataLabel: "user",
                  required: true
                },
                hooks: {
                  onInit: (field: any) => {
                    //field.templateOptions.options = this.cs.getRole();
                  }
                }
              },
              {
                key: 'mobile',
                type: 'text',
                className: 'ta-cell pr-md col-md-6 col-12',
                templateOptions: {
                  label: 'Mobile',
                  required: true
                }
              },
              {
                key: 'status',
                type: 'select',
                className: 'ta-cell pr-md col-md-6 col-12',
                templateOptions: {
                  label: 'Status',
                  dataKey: 'status',
                  dataLabel: "status_name",
                  options: [],
                  lazy: {
                    url: 'masters/statuses/',
                    lazyOneTime: true
                  },
                  required: true
                },
                // hooks: {
                //   onInit: (field: any) => {
                //     field.formControl.valueChanges.subscribe((data: any) => {
                //       if (this.options && this.options.model && this.options.model['status_id']) {
                //         this.options.model['status_id'] = data.status_id
                //       } else {
                //         console.error('Form config or city_id data model is not defined.');
                //       }
                //     });
                //   }
                // }
              },
              {
                key: 'role',
                type: 'select',
                className: 'ta-cell pr-md col-md-6 col-12',
                templateOptions: {
                  label: 'User Role',
                  dataKey: 'role_name',
                  dataLabel: "role_name",
                  options: [],
                  // bindId: true,
                  lazy: {
                    url: 'users/role/',
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
              // {
              //   key: 'address',
              //   type: 'textarea',
              //   className: 'col-12',
              //   templateOptions: {
              //     label: 'Address',
              //     required: true
              //   }
              // },
              // {
              //   key: 'country',
              //   type: 'select',
              //   className: 'col-md-6 col-12',
              //   templateOptions: {
              //     label: 'Country',
              //     options: [],
              //     lazy: {
              //       url: 'masters/country/',
              //       lazyOneTime: true
              //     },
              //     required: true
              //   }
              // },
              // {
              //   key: 'state',
              //   type: 'select',
              //   className: 'col-md-6 col-12',
              //   templateOptions: {
              //     label: 'State',
              //     options: [],
              //     lazy: {
              //       url: 'masters/state/',
              //       lazyOneTime: true
              //     },
              //     required: true
              //   }
              // },
              // {
              //   key: 'city',
              //   type: 'select',
              //   className: 'col-md-6 col-12',
              //   templateOptions: {
              //     label: 'City',
              //     options: [],
              //     lazy: {
              //       url: 'masters/city/',
              //       lazyOneTime: true
              //     },
              //     required: true
              //   }
              // },
              // {
              //   key: 'pin_code',
              //   type: 'input',
              //   className: 'col-md-6 col-12',
              //   templateOptions: {
              //     label: 'Pin Code',
              //     required: true
              //   }
              // }
            ]
          },
          {
            className: 'col-3 p-0',
            fieldGroup: [
              {
                key: 'profile_picture_url',
                type: 'file',
                className: "ta-cell pr-md col-md-6 col-12",
                props: {
                  displayStyle: 'avatar',
                  storeFolder: "profile",
                  label: 'Profile Pic',
                  multiple: false,
                  placeholder: 'Enter Profile Pic',
                  required: true,
                }
              },
            ]
          }
        ]
      }
    ]
  };
//   userName: any;

//   constructor(private router: Router, private activeRouter: ActivatedRoute, private http: HttpClient ,private taLoacal: LocalStorageService) {}

//   ngOnInit(): void {
//     const user = this.taLoacal.getItem('user');
//     this.menulList = [];
//     if (user) {
//       this.userName = user.username;
//       const userId = user.user_id; // Extracting the user_id dynamically
//       const role_Id = user.role_id
//       console.log("This is User Id", userId)
//       console.log("This is userName",this.userName)
//       console.log(userId)
     
//     }

//     this.http.get<{ data: any[] }>('users/user/').pipe(
//       switchMap(res => {
//         if (res) {
//           console.log(res)
//           const userId = res[0].userId;
//           const url = `users/user/${userId}/`;
//           return this.http.get(url);
//         } else {
//           this.showForm = true
//           return of(null);
//         }
//       }),
//       catchError(err => {
//         return of(null); // Handle the error by returning an observable with null value
//       })
//     ).subscribe(res => {
//       if (res) {
//         this.options.model = res;
//       }
//       this.showForm = true;
//     });
//   }



  constructor(private router: Router,private activeRouter: ActivatedRoute, private http: HttpClient,private taLoacal: LocalStorageService) {}

  ngOnInit(): void {
    const user = this.taLoacal.getItem('user');
    if (user) {
      this.userName = user.username;
      const userId = user.user_id;
      this.http.get(`users/user/${userId}/`).pipe(
        catchError(err => {
          console.error('Error fetching user data:', err);
          return of(null);
        })
      ).subscribe((res: any) => {
        if (res && res.data) {
          this.options.model = res.data;
          this.showForm = true;
        } 
      });
    }
  }
}
