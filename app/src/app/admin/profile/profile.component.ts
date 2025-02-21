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
  showErrorToast: boolean;
  showSuccessToast: boolean;
  toastMessage: string;
  title = "Profile";
  showForm = false;
  showToast(message: string, isError = false) {
    this.toastMessage = message;
    this.showErrorToast = isError;
    this.showSuccessToast = !isError;
    setTimeout(() => { this.showErrorToast = false; this.showSuccessToast = false; }, 3000);
  }
  options: TaFormConfig = {
    url: 'users/create_user/',
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
      icon: 'user',
      successMsg: "Profile updated successfully",
      submittedFn: (res: any) => {
        this.router.navigateByUrl('/profile');
      },
    },
    fields: [

      {
        fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
        className: "p-0",
        fieldGroup: [
          {
            className: 'col-md-9 col-12 col-sm-8 p-0',
            fieldGroupClassName: "ant-row",

            fieldGroup: [
              {
                key: 'profile_picture_url',
                type: 'file',
                className: 'ta-cell col-12 d-sm-none d-block',
                props: {
                  displayStyle: 'avatar',
                  storeFolder: "profile",
                  label: 'Profile Pic',
                  multiple: false,
                  placeholder: 'Enter Profile Pic',
                  required: true,
                }
              },
              {
                key: 'first_name',
                type: 'text',
                className: 'col-md-4 col-sm-6 col-12',
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
                className: 'col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Last Name',
                  required: true
                }
              },
              {
                key: 'email',
                type: 'text',
                className: 'col-md-4 col-sm-6 col-12',
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
                className: 'col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Mobile',
                  required: true
                }
              },
              {
                key: 'role',
                type: 'select',
                className: 'col-md-4 col-sm-6 col-12',
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
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    // If the logged-in user is not admin, disable the role field
                    if (user?.role_name !== 'Admin') {
                      field.templateOptions.disabled = true;
                    }
                  }
                }
              },
              {
                key: 'gender',
                type: 'select',
                className: 'col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Gender',
                  required: true,
                  options: [
                    { 'label': "Male", value: 'Male' },
                    { 'label': "Female", value: 'Female' }
                  ]
                },
                hooks: {
                  onInit: (field: any) => {
                    //field.templateOptions.options = this.cs.getRole();
                  }
                }
              },
              {
                key: 'date_of_birth',
                type: 'date',
                className: 'col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Date Of Birth',
                  placeholder: 'Enter Birth Date',
                  required: false,
                }
              },
              {
                key: 'status',
                type: 'select',
                className: 'col-md-4 col-sm-6 col-12',
                templateOptions: {
                  label: 'Status',
                  // bindId: true,
                  dataKey: 'status_name',
                  dataLabel: "status_name",
                  options: [],
                  // required: true,
                  lazy: {
                    url: 'masters/statuses/',
                    lazyOneTime: true
                  }
                }
              },
            ]
          },

          // Right side for the picture and additional fields
          {
            className: 'col-md-3 col-sm-4 col-12 p-0',
            fieldGroup: [
              {
                key: 'profile_picture_url',
                type: 'file',
                className: 'ta-cell col-12 d-sm-block d-none',
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
      },
    ]

  };


  constructor(private router: Router, private activeRouter: ActivatedRoute, private http: HttpClient, private taLoacal: LocalStorageService) { }

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