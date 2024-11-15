import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TaFormComponent } from '@ta/ta-form';
import { TaTableComponent } from '@ta/ta-table';
import { TaCurdConfig } from './ta-curd-config';

@Component({
  selector: 'ta-curd',
  template: `

<div nz-row nzGutter="16" class="mb-md">
    <div nz-col nzXs="24" nzMd="16">
        <nz-card [nzBordered]="false">
        <ta-table #table [options]="options.tableConfig" (doAction)="tableAction($event)"></ta-table>
        </nz-card>
    </div>
    <div nz-col nzXs="24" nzMd="8">
        <ng-content select="[top]"></ng-content>
        <nz-card [nzBordered]="false" [nzTitle]="formTitle" >
         <ta-form #form [options]="options.formConfig"></ta-form>
        </nz-card>
        <ng-content select="[bottom]"></ng-content>
    </div>
</div>
  `,
  styles: [
  ]
})
export class TaCurdComponent implements OnInit, OnDestroy {
  @Input() options: TaCurdConfig | any;
  @ViewChild('table', { static: true }) table: TaTableComponent | undefined;
  @ViewChild('form', { static: true }) form: TaFormComponent | undefined;
  formTitle = "Create"
  constructor() {

  }

  ngOnInit(): void {
    this.resetForm();
    if (this.options.formConfig.submit) {
      this.options.formConfig.submit.submittedFn = (res: any) => {
        this.table?.refresh();
        this.resetForm();
        this.form.onReset();
      };
    }
    if (this.options.formConfig.reset) {
      this.options.formConfig.reset.resetFn = (res: any) => {
        this.formTitle = 'Create ' + this.options.formConfig.title || 'Form';
        this.resetForm();
      };
    }
  }
  tableAction(action: any) {
    if (action) {
      if (action.action && action.action.type === 'edit') {
        this.formTitle = 'Update ' + this.options.formConfig.title || 'Form';
        this.form?.form.patchValue(action.data);
        this.form?.formlyForm.options.resetModel(action.data);
      }
    }
  }
  resetForm() {
    this.formTitle = 'Create ' + this.options.formConfig.title;
    if (!this.options.formConfig.submit) this.options.formConfig.submit = {};
    if (!this.options.formConfig.reset) this.options.formConfig.reset = {};
    if (this.options.formConfig.model) this.options.formConfig.model = {};


  }
  ngOnDestroy(): void {

  }


}
