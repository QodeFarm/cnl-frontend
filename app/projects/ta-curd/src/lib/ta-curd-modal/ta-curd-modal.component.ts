import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TaActionService } from '@ta/ta-core';
import { TaFormComponent } from '@ta/ta-form';
import { TaTableComponent } from '@ta/ta-table';
import { TaCurdConfig } from '../ta-curd-config';

@Component({
  selector: 'ta-curd-modal',
  templateUrl: './ta-curd-modal.component.html',
  styleUrls: ['./ta-curd-modal.component.css']
})
export class TaCurdModalComponent implements OnInit {
  @Input() options: TaCurdConfig | any;
  @ViewChild('table', { static: true }) table: TaTableComponent | undefined;
  @ViewChild('form', { static: false }) form: TaFormComponent | undefined;
  visible = false;
  formTitle = "Create";
  constructor(private taAction: TaActionService) { }

  ngOnInit(): void {
    //// console.log('tacurdConfig', this.options);
    if (!this.options.formConfig.submit) this.options.formConfig.submit = {};
    if (!this.options.formConfig.formState) this.options.formConfig.formState = {};
    if (this.options.formConfig.submit) {
      this.options.formConfig.submit.submittedFn = (res: any) => {
        this.table?.reload();
        this.close();
      };
    }
  }
  tableAction(action: any) {
    console.log('event', action);

    if (action) {
      if (action.action && action.action.type === 'edit') {
        this.options.formConfig.formState.viewMode = false;
        this.open();
        setTimeout(() => {
          this.formTitle = 'Update ' + this.options.formConfig.title;
          this.form?.form.patchValue(action.data);
          this.form?.formlyForm.options.resetModel(action.data);
        }, 200);

      } else if (action.action && action.action.type === 'view') {
        this.options.formConfig.formState.viewMode = true;
        this.open();
        setTimeout(() => {
          this.formTitle = 'View ' + this.options.formConfig.title;
          this.form?.form.patchValue(action.data);
          this.form?.formlyForm.options.resetModel(action.data);

        }, 200);
      } else {
        // this.taAction.doAction(action.action, action.data)
      }
    }
  }
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
  openDrawer() {
    this.formTitle = 'Create ' + this.options.formConfig.title;
    this.options.formConfig.model = {};
    this.visible = true;
  }


}
