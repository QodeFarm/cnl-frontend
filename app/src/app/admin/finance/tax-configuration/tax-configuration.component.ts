import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { TaxConfigurationListComponent } from './tax-configuration-list/tax-configuration-list.component';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-tax-configuration',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, TaxConfigurationListComponent],
  templateUrl: './tax-configuration.component.html',
  styleUrls: ['./tax-configuration.component.scss']
})
export class TaxConfigurationComponent {
  showTaxConfigurationList: boolean = false;
  showForm: boolean = false;
  TaxConfigurationEditID: any;
  @ViewChild(TaxConfigurationListComponent) TaxConfigurationListComponent!: TaxConfigurationListComponent;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showTaxConfigurationList = false;
    this.showForm = true;
    this.TaxConfigurationEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editTaxConfiguration(event) {
    console.log('event', event);
    this.TaxConfigurationEditID = event;
    this.http.get('finance/tax_configurations/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'tax_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };


  showTaxConfigurationListFn() {
    this.showTaxConfigurationList = true;
    this.TaxConfigurationListComponent?.refreshTable();
  };

  setFormConfig() {
    this.TaxConfigurationEditID = null;
    this.formConfig = {
      url: "finance/tax_configurations/",
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
          fieldGroupClassName: "ant-row custom-form-block",
          fieldGroup: [
            {
              key: 'tax_name',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'tax_rate',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Rate',
                placeholder: 'Enter Rate',
                required: true,
              }
            },
            {
              key: 'tax_type',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Tax Type',
                placeholder: 'Select Tax Type',
                required: true,
                options: [
                  { value: 'Percentage', label: 'Percentage' },
                  { value: 'Fixed', label: 'Fixed' },
                ]
              }
            },
            {
              key: 'is_active',
              type: 'checkbox',
              className: 'col-3 d-flex align-items-center',
              templateOptions: {
                label: 'Is Active',
                required: false,
              }
            }
          ]
        }
      ]
    }
  }
}
 