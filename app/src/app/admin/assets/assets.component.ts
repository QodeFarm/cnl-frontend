import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { AssetsListComponent } from './assets-list/assets-list.component';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, AssetsListComponent],
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent{
  
  baseUrl: string = 'http://195.35.20.172:8000/api/v1/';

  showAssetsList: boolean = false;
  showForm: boolean = false;
  AssetsEditID: any;
  @ViewChild(AssetsListComponent) AssetsListComponent!: AssetsListComponent;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.showAssetsList = false;
    this.showForm = true;
    this.AssetsEditID= null;
    // Set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);
  };

  formConfig: TaFormConfig = {};

    hide() {
    document.getElementById('modalClose').click();
  }

  editAssets(event) {
    console.log('event', event);
    this.AssetsEditID = event;
    this.http.get(this.baseUrl + 'assets/assets/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'asset_id';
        // Set labels for update
        this.formConfig.submit.label = 'Update';
        // Show form after setting form values
        this.formConfig.model['asset_id'] = this.AssetsEditID;
        this.showForm = true;
      }
    });
    this.hide();
  }

  showAssetsListFn() {
    this.showAssetsList = true;
    this.AssetsListComponent?.refreshTable();
    }

    setFormConfig() {
      this.AssetsEditID = null;
      this.formConfig = {
        url: this.baseUrl + 'assets/assets/',
        // title: 'Assets',
        formState: {
          viewMode: false,
        },
        showActionBtn: true,
        exParams: [
          {
            key: 'asset_category_id',
            type: 'script',
            value: 'data.asset_category.asset_category_id'
          },
          {
            key: 'asset_status_id',
            type: 'script',
            value: 'data.asset_status.asset_status_id'
          },
          {
            key: 'location_id',
            type: 'script',
            value: 'data.location.location_id'
          },
          {
            key: 'unit_options_id',
            type: 'script',
            value: 'data.unit_options.unit_options_id'
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
                className: 'col-3',
                key: 'name',
                type: 'input',
                templateOptions: {
                  label: 'Name',
                  placeholder: 'Enter Name',
                  required: true,
                }
              },
              {
                key: 'purchase_date',
                type: 'input',
                className: 'col-3',
                templateOptions: {
                  type: 'date',
                  label: 'Purchase date',
                  placeholder: 'Select Purchase date',
                  required: false
                }
              },
              {
                key: 'price',
                type: 'input',
                className: 'col-3',
                templateOptions: {
                  label: 'Price',
                  required: false,
                  placeholder: 'Enter Price',
                },
                hooks: {
                  onInit: (field: any) => {
                    //field.templateOptions.options = this.cs.getRole();
                  }
                }
              },
              {
                key: 'asset_category',
                type: 'select',
                className: 'col-3',
                templateOptions: {
                  label: 'Asset Category',
                  dataKey: 'asset_category_id',
                  dataLabel: "category_name",
                  options: [],
                  lazy: {
                    url: this.baseUrl + 'assets/asset_categories/',
                    lazyOneTime: true
                  },
                  required: true
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      if (this.formConfig && this.formConfig.model && this.formConfig.model['asset_category_id']) {
                        this.formConfig.model['asset_category_id'] = data.asset_category_id
                      } else {
                        console.error('Form config or asset category data model is not defined.');
                      }
                    });
                  },
                }
              },
              {
                key: 'asset_status',
                type: 'select',
                className: 'col-3',
                templateOptions: {
                  label: 'Asset Status',
                  dataKey: 'asset_status_id',
                  dataLabel: "status_name",
                  options: [],
                  lazy: {
                    url: this.baseUrl + 'assets/asset_statuses/',
                    lazyOneTime: true
                  },
                  required: true
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      if (this.formConfig && this.formConfig.model && this.formConfig.model['asset_status_id']) {
                        this.formConfig.model['asset_status_id'] = data.asset_status_id
                      } else {
                        console.error('Form config or asset status data model is not defined.');
                      }
                    });
                  },
                }
              },
              {
                key: 'unit_options',
                type: 'select',
                className: 'col-3',
                templateOptions: {
                  label: 'Unit Options',
                  dataKey: 'unit_options_id',
                  dataLabel: "unit_name",
                  options: [],
                  lazy: {
                    url: 'masters/unit_options/',
                    lazyOneTime: true
                  },
                  required: true
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      if (this.formConfig && this.formConfig.model && this.formConfig.model['unit_options_id']) {
                        this.formConfig.model['unit_options_id'] = data.unit_options_id
                      } else {
                        console.error('Form config or unit options data model is not defined.');
                      }
                    });
                  },
                }
              },
              {
                key: 'location',
                type: 'select',
                className: 'col-3',
                templateOptions: {
                  label: 'Location',
                  dataKey: 'location_id',
                  dataLabel: "location_name",
                  options: [],
                  lazy: {
                    url: this.baseUrl + 'assets/locations/',
                    lazyOneTime: true
                  },
                  required: true
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      if (this.formConfig && this.formConfig.model && this.formConfig.model['location_id']) {
                        this.formConfig.model['location_id'] = data.location_id
                      } else {
                        console.error('Form config or location data model is not defined.');
                      }
                    });
                },
              }
            },
          ]
        }
      ]
    }
  }
}