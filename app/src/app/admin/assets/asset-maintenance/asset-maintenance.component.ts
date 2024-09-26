import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { AssetMaintenanceListComponent } from './asset-maintenance-list/asset-maintenance-list.component';

@Component({
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, AssetMaintenanceListComponent],
  selector: 'app-asset-maintenance',
  templateUrl: './asset-maintenance.component.html',
  styleUrls: ['./asset-maintenance.component.scss']
})
export class AssetMaintenanceComponent {

  baseUrl: string = 'http://195.35.20.172:8000/api/v1/';
  
  showAssetMaintenanceList: boolean = false;
  showForm: boolean = false;
  AssetMaintenanceEditID: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showAssetMaintenanceList = false;
    this.showForm = true;
    this.AssetMaintenanceEditID =null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editAssetMaintenance(event) {
    console.log('event', event);
    this.AssetMaintenanceEditID = event;
    this.http.get(this.baseUrl + 'assets/asset_maintenance/'  + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'asset_maintenance_id';
        // Set labels for update
        this.formConfig.submit.label = 'Update';
        // Show form after setting form values
        this.formConfig.model['asset_maintenance_id'] = this.AssetMaintenanceEditID;
        this.showForm = true;
      }
    });
    this.hide();
  }

  showAssetMaintenanceListFn() {
    this.showAssetMaintenanceList = true;
  };

    setFormConfig() {
      this.AssetMaintenanceEditID = null;
      this.formConfig = {
        url: this.baseUrl + 'assets/asset_maintenance/',
        // title: 'Asset Maintenance',
        formState: {
          viewMode: false,
        },
        showActionBtn: true,
        exParams: [
          {
            key: 'asset_id',
            type: 'script',
            value: 'data.asset.asset_id'
          },
        ],
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
            fieldGroupClassName: 'ant-row custom-form-block',
            fieldGroup: [
              {
                key: 'asset',
                type: 'select',
                className: 'col-3',
                templateOptions: {
                  label: 'Asset',
                  dataKey: 'asset_id',
                  dataLabel: "name",
                  options: [],
                  lazy: {
                    url: this.baseUrl + 'assets/assets/',
                    lazyOneTime: true
                  },
                  required: true
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      if (this.formConfig && this.formConfig.model && this.formConfig.model['asset_id']) {
                        this.formConfig.model['asset_id'] = data.asset_id
                      } else {
                        console.error('Form config or asset data model is not defined.');
                      }
                    });
                  },
                }
              },
              {
                key: 'cost',
                type: 'input',
                className: 'col-3',
                templateOptions: {
                  label: 'Cost',
                  required: false,
                  placeholder: 'Enter cost',
                },
                hooks: {
                  onInit: (field: any) => {
                    //field.templateOptions.options = this.cs.getRole();
                  }
                }
              },
              {
                key: 'maintenance_date',
                type: 'input',
                className: 'col-3',
                templateOptions: {
                  type: 'date',
                  label: 'Maintenance date',
                  placeholder: 'Select Maintenance date',
                  required: false
                }
              },
              {
                key: 'maintenance_description',
                type: 'textarea',
                className: 'col-3',
                templateOptions: {
                  label: 'Maintenance Description',
                  required: false,
                },
                hooks: {
                  onInit: (field: any) => {
                    //field.templateOptions.options = this.cs.getRole();
                  }
                }
              },
          ]
        },
      ]
    }
  }
}