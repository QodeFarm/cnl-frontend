import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent{

  showAssetsList: boolean = false;
  showForm: boolean = false;
  AssetsEditID: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.showAssetsList = false;
    this.showForm = true;
    // Set form config
    // this.setFormConfig();
    // console.log('this.formConfig', this.formConfig);
  }

    hide() {
    document.getElementById('modalClose').click();
  }

  editAssets(event) {
    console.log('event', event);
    this.AssetsEditID = event;
    this.http.get('http://195.35.20.172:8000/api/v1/assets/assets/' + event).subscribe((res: any) => {
      console.log('--------> res ', res);
      if (res) {
        this.formConfig.model = res;
        console.log('data',res)
        // Set labels for update
        this.formConfig.submit.label = 'Update';
        // Show form after setting form values
        this.formConfig.pkId = 'asset_id';
        this.formConfig.model['asset_id'] = this.AssetsEditID;
        this.showForm = true;
      }
    });
    this.hide();
  }

  showAssetsListFn() {
        this.showAssetsList = true;
    }

  formConfig : TaFormConfig = {
    url: 'http://195.35.20.172:8000/api/v1/assets/assets/',
    title: 'Assets',
    pkId: "asset_id",
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
            type: 'date',
            className: 'col-3',
            templateOptions: {
              label: 'Purchase Date',
              required: false,
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
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
                url: 'http://195.35.20.172:8000/api/v1/assets/asset_categories/',
                lazyOneTime: true
              },
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
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
                url: 'http://195.35.20.172:8000/api/v1/assets/asset_statuses/',
                lazyOneTime: true
              },
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
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
                url: 'http://195.35.20.172:8000/api/v1/masters/unit_options/',
                lazyOneTime: true
              },
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
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
                url: 'http://195.35.20.172:8000/api/v1/assets/locations/',
                lazyOneTime: true
              },
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          },
        ]
      }
    ]
  }
}
