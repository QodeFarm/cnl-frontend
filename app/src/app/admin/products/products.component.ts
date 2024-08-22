import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit {
  showProductsList: boolean = false;
  showForm: boolean = false;
  ProductEditID: any;
  formConfig: TaFormConfig = {};

  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.showProductsList = false;
    this.showForm = true;
    this.ProductEditID = null;
    // Set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);
  }

  hide() {
    const modalCloseButton = document.getElementById('modalClose');
    if (modalCloseButton) {
      modalCloseButton.click();
    }
  }

  editProducts(event: any) {
    console.log('event', event);
    this.ProductEditID = event;
    this.http.get('products/products/' + event).subscribe((res: any) => {
      console.log('--------> res ', res);
      if (res) {
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        // Set labels for update
        this.formConfig.pkId = 'product_id';
        this.formConfig.submit.label = 'Update';
        // Show form after setting form values
        this.formConfig.model['product_id'] = this.ProductEditID;
        this.showForm = true;
      }
    });
    this.hide();
  }

  onDelete(productId: string) {
    if (confirm(`Are you sure you want to delete product with ID ${productId}?`)) {
      // Perform deletion logic here
    }
  }

  showProductsListFn() {
    this.showProductsList = true;
  }

  setFormConfig() {
    this.ProductEditID =null
    this.formConfig = {
      url: "products/products/",
      // title: 'leads',
      formState: {
        viewMode: false,
        // isEdit: false,
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
      model: {
        products: {},
		    product_variations:{},
        product_item_balance: [],
      },
      fields: [
        //-----------------------------------------products -----------------------------------//
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'products',
          fieldGroup: [
            {
              fieldGroupClassName: "ant-row custom-form-block",
              fieldGroup: [
                // Left side fields
                {
                  className: 'col-9 p-0',
                  fieldGroupClassName: "ant-row",
                  fieldGroup: [
                    {
                      key: 'name',
                      type: 'input',
                      className: 'col-3',
                      templateOptions: {
                        label: 'Name',
                        placeholder: 'Enter Name',
                        required: true,
                        // disabled: true
                      },
                      hooks: {
                        onInit: (field: any) => {}
                      },
                    },
                    {
                      className: 'col-3',
                      key: 'code',
                      type: 'input',
                      templateOptions: {
                        label: 'Code',
                        placeholder: 'Enter Code',
                        required: true
                      },
                      hooks: {
                        onInit: (field: any) => {
                          this.http.get('masters/generate_order_no/?type=prd').subscribe((res: any) => {
                            if (res && res.data && res.data.order_number) {
                              field.formControl.setValue(res.data.order_number);
                            }
                          });
                        }
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'barcode',
                      type: 'input',
                      templateOptions: {
                        label: 'Barcode',
                        placeholder: 'Enter Barcode',
                        required: false
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'gst_input',
                      type: 'input',
                      templateOptions: {
                        label: 'GST Input',
                        placeholder: 'Enter GST Input'
                      }
                    },
                    {
                      key: 'brand',
                      type: 'select',
                      className: 'col-3',
                      templateOptions: {
                        label: 'Brand',
                        dataKey: 'brand_id',
                        dataLabel: "brand_name",
                        options: [],
                        required: false,
                        lazy: {
                          url: 'masters/product_brands/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                              this.formConfig.model['products']['brand_id'] = data.brand_id;
                            } else {
                              console.error('Form config or brand_id data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'sales_description',
                      type: 'input',
                      templateOptions: {
                        label: 'Sales Description',
                        placeholder: 'Enter Sales Description'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'mrp',
                      type: 'input',
                      templateOptions: {
                        label: 'MRP',
                        placeholder: 'Enter MRP',
                        required: false
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'minimum_price',
                      type: 'input',
                      templateOptions: {
                        label: 'Min Price',
                        placeholder: 'Enter Minimum Price'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'sales_rate',
                      type: 'input',
                      templateOptions: {
                        label: 'Sales Rate',
                        placeholder: 'Enter Sales Rate',
                        required: false
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'wholesale_rate',
                      type: 'input',
                      templateOptions: {
                        label: 'Wholesale Rate',
                        placeholder: 'Enter Wholesale Rate'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'dealer_rate',
                      type: 'input',
                      templateOptions: {
                        label: 'Dealer Rate',
                        placeholder: 'Enter Dealer Rate'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'rate_factor',
                      type: 'input',
                      templateOptions: {
                        label: 'Rate Factor',
                        placeholder: 'Enter Rate Factor'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'discount',
                      type: 'input',
                      templateOptions: {
                        label: 'Discount',
                        placeholder: 'Enter Discount'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'dis_amount',
                      type: 'input',
                      templateOptions: {
                        label: 'Disc Amt',
                        placeholder: 'Enter Disc Amt',
                        required: false
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'purchase_description',
                      type: 'input',
                      templateOptions: {
                        label: 'Purchase Description',
                        placeholder: 'Enter Purchase Description'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'purchase_rate',
                      type: 'input',
                      templateOptions: {
                        label: 'Purchase Rate',
                        placeholder: 'Enter Purchase Rate'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'purchase_rate_factor',
                      type: 'input',
                      templateOptions: {
                        label: 'Purchase Rate Factor',
                        placeholder: 'Enter Purchase Rate Factor'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'purchase_discount',
                      type: 'input',
                      templateOptions: {
                        label: 'Purchase Discount',
                        placeholder: 'Enter Purchase Discount'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'minimum_level',
                      type: 'input',
                      templateOptions: {
                        label: 'Minimum Level',
                        placeholder: 'Enter Minimum Level'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'maximum_level',
                      type: 'input',
                      templateOptions: {
                        label: 'Maximum Level',
                        placeholder: 'Enter Maximum Level'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'weighscale_mapping_code',
                      type: 'text',
                      templateOptions: {
                        label: 'Weighscale Mapping Code',
                        placeholder: 'Enter Weighscale Mapping Code'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'purchase_warranty_months',
                      type: 'text',
                      templateOptions: {
                        label: 'Purchase Warranty Months',
                        placeholder: 'Enter Purchase Warranty Months'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'sales_warranty_months',
                      type: 'text',
                      templateOptions: {
                        label: 'Sales Warranty Months',
                        placeholder: 'Enter Sales Warranty Months'
                      }
                    },
                    {
                      key: 'type',
                      type: 'select',
                      className: 'col-3',
                      templateOptions: {
                        label: 'Type',
                        dataKey: 'type_id',
                        dataLabel: "type_name",
                        options: [],
                        required: false,
                        lazy: {
                          url: 'masters/product_types/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                              this.formConfig.model['products']['type_id'] = data.type_id;
                            } else {
                              console.error('Form config or type_id data model is not defined.');
                            }
                          });
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
                        required: false,
                        lazy: {
                          url: 'masters/unit_options/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                              this.formConfig.model['products']['unit_options_id'] = data.unit_options_id;
                            } else {
                              console.error('Form config or unit_options_id data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      key: 'product_group',
                      type: 'select',
                      className: 'col-3',
                      templateOptions: {
                        label: 'Product Group',
                        dataKey: 'product_group_id',
                        dataLabel: "group_name",
                        options: [],
                        required: true,
                        lazy: {
                          url: 'products/product_groups/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                              this.formConfig.model['products']['product_group_id'] = data.product_group_id;
                            } else {
                              console.error('Form config or lead_status data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      key: 'category',
                      type: 'select',
                      className: 'col-3',
                      templateOptions: {
                        label: 'Category',
                        dataKey: 'category_id',
                        dataLabel: "category_name",
                        options: [],
                        required: false,
                        lazy: {
                          url: 'products/product_categories/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                              this.formConfig.model['products']['category_id'] = data.category_id;
                            } else {
                              console.error('Form config or lead_status data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      key: 'stock_unit',
                      type: 'select',
                      className: 'col-3',
                      templateOptions: {
                        label: 'Stock Unit',
                        dataKey: 'stock_unit_id',
                        dataLabel: "stock_unit_name",
                        options: [],
                        required: true,
                        lazy: {
                          url: 'products/product_stock_units/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                              this.formConfig.model['products']['stock_unit_id'] = data.stock_unit_id;
                            } else {
                              console.error('Form config or lead_status data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      key: 'sales_gl',
                      type: 'select',
                      className: 'col-3',
                      templateOptions: {
                        label: 'Sales GL',
                        dataKey: 'sales_gl_id',
                        dataLabel: "name",
                        options: [],
                        required: true,
                        lazy: {
                          url: 'products/product_sales_gl/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                              this.formConfig.model['products']['sales_gl_id'] = data.sales_gl_id;
                            } else {
                              console.error('Form config or lead_status data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      key: 'purchase_gl',
                      type: 'select',
                      className: 'col-3',
                      templateOptions: {
                        label: 'Purchase GL',
                        dataKey: 'purchase_gl_id',
                        dataLabel: "name",
                        options: [],
                        required: true,
                        lazy: {
                          url: 'products/product_purchase_gl/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                              this.formConfig.model['products']['purchase_gl_id'] = data.purchase_gl_id;
                            } else {
                              console.error('Form config or lead_status data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      key: 'item_type',
                      type: 'select',
                      className: 'col-3',
                      templateOptions: {
                        label: 'Item Type',
                        dataKey: 'item_type_id',
                        dataLabel: "item_name",
                        options: [],
                        required: false,
                        lazy: {
                          url: 'masters/product_item_type/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                              this.formConfig.model['products']['item_type_id'] = data.item_type_id;
                            } else {
                              console.error('Form config or lead_status data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      key: 'drug_type',
                      type: 'select',
                      className: 'col-3',
                      templateOptions: {
                        label: 'Drug Type',
                        dataKey: 'drug_type_id',
                        dataLabel: "drug_type_name",
                        options: [],
                        required: false,
                        lazy: {
                          url: 'masters/product_drug_types/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                              this.formConfig.model['products']['drug_type_id'] = data.drug_type_id;
                            } else {
                              console.error('Form config or lead_status data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      className: 'col-3 d-flex align-items-center',
                      key: 'print_barcode',
                      type: 'checkbox',
                      templateOptions: {
                        label: 'Print Barcode'
                      }
                    }
                   ]
                },
                {
                  className: 'col-3 p-0',
                  fieldGroup: [
                    {
                      key: 'picture',
                      type: 'file',
                      className: 'ta-cell col-12',
                      templateOptions: {
                        label: 'Picture',
                        placeholder: 'Upload Picture',
                        required: false
                      }
                    },
                    {
                      key: 'gst_classification',
                      type: 'select',
                      className: 'col-12 mt-',
                      templateOptions: {
                        label: 'GST Classification',
                        dataKey: 'gst_classification_id',
                        dataLabel: "type",
                        options: [],
                        required: false,
                        lazy: {
                          url: 'products/product_gst_classifications/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                              this.formConfig.model['products']['gst_classification_id'] = data.gst_classification_id;
                            } else {
                              console.error('Form config or gst_classification_id data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      className: 'col-12',
                      key: 'status',
                      type: 'select',
                      templateOptions: {
                        label: 'Status',
                        options: [
                          { value: 'Active', label: 'Active' },
                          { value: 'Inactive', label: 'Inactive' }
                        ]
                      }
                    },
                    {
                      className: 'col-12',
                      key: 'print_name',
                      type: 'input',
                      templateOptions: {
                        label: 'Print Name',
                        placeholder: 'Enter Print Name',
                        required: true
                      }
                    },
                    {
                      className: 'col-12',
                      key: 'hsn_code',
                      type: 'input',
                      templateOptions: {
                        label: 'HSN',
                        placeholder: 'Enter HSN Code',
                        required: false
                      }
                    },
                    {
                      className: 'col-12',
                      key: 'salt_composition',
                      type: 'text',
                      templateOptions: {
                        label: 'Salt Composition',
                        placeholder: 'Enter Salt Composition'
                      }
                    },
                  ]
                }
              ]
            },
            
          ]
        },
        //----------------------------------------- product_variations  -----------------------------------//
        {
          fieldGroupClassName: "row col-12 m-0 custom-form-card",
          key: 'product_variations',
          fieldGroup: [
        {
          className: 'row col-12 ant-row custom-form-block',
          fieldGroup: [
            {
              template: '<div class="custom-form-card-title"> Variations </div>',
              fieldGroupClassName: "ant-row",
            },
            {
              fieldGroupClassName: "ant-row",
              fieldGroup: [
                {
                  key: 'size_id',
                  type: 'select',
                  className: 'col-2',
                  templateOptions: {
                    label: 'Size',
                    placeholder: 'Select Size',
                    dataKey: 'size_id',
                    dataLabel: 'size_name',
                    bindId: true,
                    lazy: {
                      url: 'products/sizes/',
                      lazyOneTime: true
                    }
                  },
                },
                {
                  key: 'color_id',
                  type: 'select',
                  className: 'col-2',
                  templateOptions: {
                    label: 'Color',
                    placeholder: 'Select Color',
                    dataKey: 'color_id',
                    dataLabel: "color_name",
                    bindId: true,
                    lazy: {
                      url: 'products/colors/',
                      lazyOneTime: true
                    }
                  }
                },
                {
                  key: 'sku',
                  type: 'input',
                  className: 'col-2',
                  templateOptions: {
                    label: 'SKU',
                    placeholder: 'Enter SKU',
                  }
                },
                {
                  key: 'price',
                  type: 'input',
                  className: 'col-2',
                  templateOptions: {
                    label: 'Price',
                    placeholder: 'Enter Price',
                  }
                },
                {
                  key: 'quantity',
                  type: 'input',
                  className: 'col-3',
                  templateOptions: {
                    label: 'Quantity',
                    placeholder: 'Enter Quantity',
                  }
                }
              ]
            },
          ]
        }
          ]
        },
		    //-----------------------------------product_item_balance-------------------------------------
		    {
          key: 'product_item_balance',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Product Balance',
            addText: 'Add Warehouse Locations',
            tableCols: [
              { name: 'warehouse_location_id', label: 'Warehouse Location' },
              { name: 'quantity', label: 'Quantity' },
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'warehouse_location',
                type: 'select',
                templateOptions: {
                  label: 'Location',
                  dataKey: 'warehouse_location_id',
                  dataLabel: 'location_name',
                  options: [],
                  hideLabel: true,
                  required: false,
                  lazy: {
                    url: 'inventory/warehouse_locations/',
                    lazyOneTime: true
                  },
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (!this.formConfig.model['product_item_balance'][index]) {
                        console.error(`Task comments at index ${index} is not defined. Initializing...`);
                        this.formConfig.model['product_item_balance'][index] = {};
                      }
                      this.formConfig.model['product_item_balance'][index]['warehouse_location_id'] = data.location_id;
                    });
                  }
                }
              },
              {
                key: 'quantity',
                type: 'input',
                templateOptions: {
                  label: 'Quantity',
                  placeholder: 'Enter Quantity',
                  hideLabel: true,
                  required: true
                }
              }
            ]
          }
        }
     ]
    }
  }

}
