import { Component, Input, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef } from '@angular/core';
import { TaActionService, TaCoreModule } from '@ta/ta-core';
import { TaFormComponent, TaFormModule } from '@ta/ta-form';
import { TaTableComponent, TaTableModule } from '@ta/ta-table';
import { TaCurdConfig } from '../ta-curd-config';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'ta-curd-modal',
  templateUrl: './ta-curd-modal.component.html',
  styleUrls: ['./ta-curd-modal.component.css'],
  standalone: true,
  imports: [CommonModule,
    TaCoreModule,
    TaTableModule,
    NzGridModule,
    NzCardModule,
    NzIconModule,
    NzDrawerModule,
    forwardRef(() => TaFormComponent),
    NzButtonModule,
    NzModalModule]
})
export class TaCurdModalComponent implements OnInit {
  @Input() options: TaCurdConfig | any;
  @ViewChild('table', { static: true }) table: TaTableComponent | undefined;
  @ViewChild('form', { static: false }) form: TaFormComponent | undefined;
  @Input() customProductTemplate!: TemplateRef<any>; //Added this customProductTemplate
  visible = false;
  formTitle = "Create";
  constructor(private taAction: TaActionService, private cdr: ChangeDetectorRef) { }

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
