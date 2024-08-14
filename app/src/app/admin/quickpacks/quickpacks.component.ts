import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';

@Component({
  selector: 'app-quickpacks',
  templateUrl: './quickpacks.component.html',
  styleUrls: ['./quickpacks.component.scss']
})
export class QuickpacksComponent implements OnInit {
  quickPackID: any;
  showQuickPackList: boolean = false;
  showForm: boolean = false;
  productOptions: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.showQuickPackList = false;
    this.showForm = true;
    this.quickPackID = null;
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose')?.click();
  }

  editQuickPack(event: any) {
    console.log('event', event);
    this.quickPackID = event;
    this.http.get('sales/quick_pack/' + event).subscribe((res: any) => {
      console.log('--------> res ', res);
      if (res && res.data) {
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.submit.label = 'Update';
        this.formConfig.pkId = 'quick_pack_id';
        this.formConfig.model['quick_pack_id'] = this.quickPackID;
        this.showForm = true;
      }
    });
    this.hide();
  }

  showQuickPackListFn() {
    this.showQuickPackList = true;
  }

  setFormConfig() {
    this.quickPackID = null;
    this.formConfig = {
      url: "sales/quick_pack/",
      title: '',
      formState: {
        viewMode: false
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'quick_pack_data_items',
          type: 'script',
          value: 'data.quick_pack_data_items.map(m => {m.product_id = m.product.product_id; return m;})'
        }
      ],
      submit: {
        label:'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model: {
        quick_pack_data: {},
        quick_pack_data_items: [{}]
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'quick_pack_data',
          fieldGroup: [
            {
              key: 'name',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                label: 'Quick Pack Name',
                placeholder: 'Enter Quick Pack Name',
                required: true
              }
            },
            {
              key: 'lot_qty',
              type: 'input',
              className: 'col-3',
              templateOptions: {
                label: 'Lot Quantity',
                placeholder: 'Enter Lot Quantity',
                required: true
              }
            },
            {
              key: 'active',
              type: 'select',
              className: 'col-3',
              defaultValue: 'Y',
              templateOptions: {
                label: 'Active',
                options: [
                  { label: 'Yes', value: 'Y' },
                  { label: 'No', value: 'N' }
                ],
                required: false
              }
            },
            {
              key: 'description',
              type: 'textarea',
              className: 'col-3',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter Description',
                required: false
              }
            },
          ]
        },
        {
          key: 'quick_pack_data_items',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Products',
            addText: 'Add Product',
            tableCols: [
              { name: 'product', label: 'Product' },
              { name: 'quantity', label: 'Quantity' }
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'product',
                type: 'select',
                templateOptions: {
                  label: 'Select Product',
                  dataKey: 'product_id',
                  dataLabel: 'name',
                  options: [],
                  hideLabel: true,
                  required: true,
                  lazy: {
                    url: 'products/products/?summary=true',
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      console.log("products data", data);
                      this.productOptions = data;
                    });
                  },
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      console.log("products data", data);
                      this.productOptions = data;
                    });
                  }
                }
              },
              {
                type: 'input',
                key: 'quantity',
                // className: 'col-md-8 pr-md m-10', // Adjusted class to reduce size
                templateOptions: {
                  label: 'Quantity',
                  placeholder: 'Enter Quantity',
                  hideLabel: true,
                  required: true
                },
              }
            ]
          }
        }
      ]
    };
  }
}
