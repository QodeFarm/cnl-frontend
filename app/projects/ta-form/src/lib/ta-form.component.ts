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
  //form = new FormGroup({});
  //model = {};
  //@Input() model = {};


  // fields: FormlyFieldConfig[] = [
  //   {
  //     key: 'input',
  //     type: 'input',
  //     templateOptions: {
  //       label: 'Input',
  //       placeholder: 'Input placeholder',
  //       required: true,
  //     }
  //   },
  //   {
  //     key: 'textarea',
  //     type: 'textarea',
  //     templateOptions: {
  //       label: 'Textarea',
  //       placeholder: 'Textarea placeholder',
  //       required: true,
  //     }
  //   },
  //   {
  //     key: 'checkbox',
  //     type: 'checkbox',
  //     templateOptions: {
  //       label: 'Checkbox',
  //     }
  //   },
  //   {
  //     key: 'select',
  //     type: 'select',
  //     templateOptions: {
  //       label: 'Select',
  //       placeholder: 'Select placeholder',
  //       required: true,
  //       options: [
  //         { label: 'Option 1', value: '1' },
  //         { label: 'Option 2', value: '2' },
  //         { label: 'Option 3', value: '3' },
  //       ]
  //     }
  //   },
  //   {
  //     key: 'radio',
  //     type: 'radio',
  //     templateOptions: {
  //       label: 'Radio',
  //       required: true,
  //       options: [
  //         { label: 'Option 1', value: '1' },
  //         { label: 'Option 2', value: '2' },
  //       ]
  //     }
  //   }
  // ];
  fields: FormlyFieldConfig[] = [];
  isLoading = false;
  formlyOptions: FormlyFormOptions | any = {
    formState: { user: TaLocalStorage.getItem('user') }
  };
  constructor(private formS: TaFormService, private taAction: TaActionService, private notification: NzNotificationService) { }

  ngOnInit(): void {
    //this.options.model = {};
    if (!this.options.model) {
      this.options.model = {};
    }
    if (this.options.showActionBtn == undefined) {
      this.options.showActionBtn = true;
    }
    // console.log('form options', this.options);
    if (!this.options.fields) {
      this.options.fields = [];
    } else {
      // this.fields = this.options.fields;
      if (!this.options.isBuilder) {
        this.fields = this.formS.getFormlyFormate(this.options.fields, this.form);
        //this.fields = [{type:'field-builder',props:{fields:this.options.fields}}];
      }
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
          this.options.model = { ...this.options.model, ...this.taAction.getParams(this.options.exParams, this.options.model) };
        }
        this.formS.saveForm(this.options.url, this.options.model, this.options).subscribe((res: any) => {
          this.isLoading = false;
          if (res.success || res) {


            let msg = 'Save Successfull';
            if (this.options.submit) {
              if (this.options.submit.submittedFn) {
                this.options.submit.submittedFn(res);
              }

              if (this.options.submit.actions) {
                this.taAction.doActions(this.options.submit.actions, { res: res, result: res.data });
              }

              if (this.options.submit.successMsg)
                msg = this.options.submit.successMsg;
            }
            this.notification.success(msg, '');
            this.formlyOptions.resetModel();
          } else {
            if (res.error && res.error.message) {
              this.notification.error(res.error.message, '')
            } else if (res.message) {
              this.notification.error(res.message, '')
            } else {
              this.notification.error('Failure Error', '')
            }
          }

          // this.form.reset();
        }, error => {
          const e = Object.keys(error);
          if (e) {
            e.forEach(er => {
              this.notification.error(error[er][0], er);
            });
          }
          this.notification.error('Failure Error', '')
          this.isLoading = false;
        });
      } else {
        if (this.options.submit && this.options.submit.submittedFn) {
          this.options.submit.submittedFn(this.options.model);
        }
      }
    }
  }
  onReset() {
    // this.formlyForm.options.resetModel({});
    this.formlyOptions.resetModel();
    if (this.options.reset) {
      if (this.options.reset.resetFn) {
        this.options.reset.resetFn();
      }
    }
  }

}
