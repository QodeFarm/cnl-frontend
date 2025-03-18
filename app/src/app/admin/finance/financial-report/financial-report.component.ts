import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { FinancialReportListComponent } from './financial-report-list/financial-report-list.component';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-financial-report',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, FinancialReportListComponent],
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.scss']
})
export class FinancialReportComponent {
  showFinancialReportList: boolean = false;
  showForm: boolean = false;
  FinancialReportEditID: any;
  @ViewChild(FinancialReportListComponent) FinancialReportListComponent!: FinancialReportListComponent;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.showFinancialReportList = false;
    this.showForm = true;
    this.FinancialReportEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editFinancialReport(event) {
    console.log('event', event);
    this.FinancialReportEditID = event;
    this.http.get('finance/financial_reports/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'report_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };


  showFinancialReportListFn() {
    this.showFinancialReportList = true;
    this.FinancialReportListComponent?.refreshTable();
  };

  setFormConfig() {
    this.FinancialReportEditID = null;
    this.formConfig = {
      url: "finance/financial_reports/",
      // title: 'warehouses',
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
      exParams: [],	  
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model:{},	  
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          fieldGroup: [	  
            {
              key: 'report_name',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Report Name',
                placeholder: 'Enter Report Name',
                required: true,
              }
            },
            {
              key: 'report_type',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Report Type',
                placeholder: 'Select Report Type',
                required: false,
                options: [
                  { value: 'Balance Sheet', label: 'Balance Sheet' },
                  { value: 'Profit & Loss', label: 'Profit & Loss' },
                  { value: 'Cash Flow', label: 'Cash Flow' },
                  { value: 'Trial Balance', label: 'Trial Balance' }
                ]
              }
            },
            // {
            //   className: 'col-3 custom-form-card-block w-100',
            //   fieldGroup: [
            //     {
            //       template: '<div class="custom-form-card-title">File Path</div>',
            //       fieldGroupClassName: "ant-row",
            //     },
            //     {
            //       key: 'file_path',
            //       type: 'file',
            //       className: 'ta-cell col-12 custom-file-attachement',
            //       props: {
            //         "displayStyle": "files",
            //         "multiple": false
            //       }
            //     }
            //   ]
            // }
            {
              className: 'col-12 custom-form-card-block w-100 p-0',
              fieldGroup: [
                {
                  key: 'file_path',
                  type: 'file',
                  className: 'ta-cell col-12 col-md-6 custom-file-attachement',
                  props: {
                    label: 'File Path',
                    "displayStyle": "files",
                    "multiple": false,
                    
                  },
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
