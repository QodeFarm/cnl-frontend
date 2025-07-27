import { Component, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { TaActionService, TaCoreModule, TaLocalStorage } from '@ta/ta-core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TaFormConfig } from './ta-form-config';
import { TaFormService } from './ta-form.service';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { TaFormlyUiZeroModule } from '../ta-formly-ui-zero/ta-formly-ui-zero.module';
import { TaFormSharedModule } from './ta-form-shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'ta-form',
  standalone: true,
  templateUrl: './ta-form.component.html',
  imports: [
    CommonModule,
    TaCoreModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzLayoutModule,
    NzFormModule,
    TaFormSharedModule,
    TaFormlyUiZeroModule
  ],
  styles: [
  ]
})
export class TaFormComponent implements OnInit {
  @ViewChild("formlyForm", { static: false })
  formlyForm: FormlyForm | any;

  @Input() options: TaFormConfig | any;
  showForm = true;
  form = new UntypedFormGroup({});
  fields: FormlyFieldConfig[] = [];
  isLoading = false;
  formlyOptions: FormlyFormOptions | any = {
    formState: { user: TaLocalStorage.getItem('user') }
  };
  constructor(private formS: TaFormService, private taAction: TaActionService, private notification: NzNotificationService, private router: Router) { }

  ngOnInit(): void {
    if (!this.options.model) {
      this.options.model = {};
    }
    if (this.options.showActionBtn == undefined) {
      this.options.showActionBtn = true;
    }
    if (!this.options.fields) {
      this.options.fields = [];
    } else {
      if (!this.options.isBuilder) {
        this.fields = this.formS.getFormlyFormate(this.options.fields, this.form);
      }
    }
    if (this.options.valueChangeFn) {
      this.form.valueChanges.subscribe(res => {
        this.options.valueChangeFn(this.options.model);
      })
    }

    if (this.options.formState) {
      this.formlyOptions.formState = { ...this.formlyOptions.formState, ...this.options.formState };
      this.options.showActionBtn = (this.formlyOptions.formState.viewMode) ? false : true;
    }
    this.showForm = true;
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.options.url) {
        this.isLoading = true;
        if (this.options.exParams && this.options.exParams.length > 0) {
          this.options.model = {
            ...this.options.model,
            ...this.taAction.getParams(this.options.exParams, this.options.model)
          };
        }

        this.formS.saveForm(this.options.url, this.options.model, this.options).subscribe(
          (res: any) => {
            this.isLoading = false;
            if (res.success || res) {
              let msg = res.message || 'Save Successful';

              // Only handle login-specific behavior if this is actually a login form
              const isLoginForm = this.options.url?.includes('users/login');
              if (isLoginForm && res.data && res.data.length > 0) {
                const token = res.data[0];  // Assuming token is in res.data[0]
                localStorage.setItem('authToken', token);
                msg = 'Login Successful';

                //Redirect to dashboard after successful login
                setTimeout(() => {
                  this.router.navigate(['/dashboard']);
                }, 1000);
              }

              if (this.options.submit) {
                if (this.options.submit.submittedFn) {
                  this.options.submit.submittedFn(res);
                }

                if (this.options.submit.actions) {
                  this.taAction.doActions(this.options.submit.actions, { res: res, result: res.data });
                }

                if (this.options.submit.successMsg) {
                  msg = this.options.submit.successMsg;
                }
              }

              this.notification.success(msg, '');
              this.formlyOptions.resetModel();
            } else {
              this.notification.error('Login Failed', res.message || 'Invalid credentials');
            }

          },
          (error) => {
            this.isLoading = false;
            console.log('API Error:', error);

            // Special handling for login errors
            const isLoginForm = this.options.url?.includes('users/login');

            // Handle field-level validation errors
            if (error.status === 400) {
              // Field validation errors (status name already exists, etc.)
              // These are already handled by DefaultInterceptor with a modal dialog
              // No need to show additional notification
              return;
            }
            // Handle login-specific errors with a clean message
            else if (isLoginForm && error.status === 401) {
              this.notification.error('Login Failed', 'Username or Password is not valid');
            }
            else if (error.status === 404) {
              this.notification.error('Server Error', 'Login API not found! Check the backend URL.');
            }
            // Only show errors for non-400 status codes that aren't already handled
            else if (!isLoginForm && error.status !== 400) {
              this.notification.error('Error', error.error?.message || 'An unexpected error occurred. Please try again.');
            }
          }
        );
      } else {
        if (this.options.submit && this.options.submit.submittedFn) {
          this.options.submit.submittedFn(this.options.model);
        }
      }
    }
  }

  onReset() {
    this.formlyOptions.resetModel();
    if (this.options.reset) {
      if (this.options.reset.resetFn) {
        this.options.reset.resetFn();
      }
    }
  }
}
