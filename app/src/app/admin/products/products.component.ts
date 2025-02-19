import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ProductsListComponent } from './products-list/products-list.component';
import { TaFormComponent } from '@ta/ta-form';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  imports: [CommonModule, AdminCommmonModule, ProductsListComponent],
  standalone: true,
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  showProductsList: boolean = false;
  showForm: boolean = false;
  ProductEditID: any;
  formConfig: TaFormConfig = {};
  dialogMessage: string = '';
  @ViewChild(ProductsListComponent) ProductsListComponent!: ProductsListComponent;
  @ViewChild(TaFormComponent) taFormComponent!: TaFormComponent;

  constructor(private http: HttpClient, private notification: NzNotificationService) {}

  ngOnInit() {
    this.showProductsList = false;
    this.showForm = true;
    this.ProductEditID = null;
    this.setFormConfig();
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
    this.ProductsListComponent?.refreshTable();
  }

  // Method to create the record
  createRecord() {
    const createData = {
      products: this.formConfig.model.products,
      product_variations: this.formConfig.model.product_variations,
      product_item_balance: this.formConfig.model.product_item_balance
    }
    
    // Example of using Angular's HttpClient to post data
    this.http.post('products/products/', createData)
      .subscribe({
        next: (response) => {
          this.notification.success('Record created successfully', '');
          this.ngOnInit()
          this.taFormComponent.formlyOptions.resetModel([]);
        },
        error: (error) => {
          console.error('Error creating record:', error);
        }
      });
  };

  updateProducts() {
    const ProductEditID = this.formConfig.model.products.product_id;
    const updateData = {
      products: this.formConfig.model.products,
      product_variations: this.formConfig.model.product_variations,
      product_item_balance: this.formConfig.model.product_item_balance
    };

    // PUT request to update Sale Return Order
    this.http.put(`products/products/${ProductEditID}/`, updateData).subscribe(
      (response) => {
        this.notification.success('Record updated successfully', '');
        this.ngOnInit()
        this.taFormComponent.formlyOptions.resetModel([]);
      },
      (error) => {
        console.error('Error updating Products:', error);
      }
    );
  } 

  // Method to calculate and verify the balance
  verifyBalance(): any {
    const balance = parseInt(this.formConfig.model.products.balance, 10);
  
    // Helper function to calculate total quantity
    const calculateTotalQuantity = (items) => 
      items?.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0) || 0;
  
    // Filter out empty/null variations
    const productVariations = (this.formConfig.model.product_variations ?? []).filter(
      (obj) => obj && Object.keys(obj).length
    );
  
    // Update model with cleaned variations
    this.formConfig.model.product_variations = productVariations;
  
    const totalItemBalanceQuantity = calculateTotalQuantity(this.formConfig.model.product_item_balance);
    const totalVariationQuantity = calculateTotalQuantity(productVariations);
  
    // Validate variations match balance
    if (productVariations.length && totalVariationQuantity !== balance) {
      return this.showDialog(
        `<b>Variations !</b><br>
         Your sum of quantities are <b>${totalVariationQuantity}</b> not matching with overall balance <b>${balance}.</b>`
      );
    }
  
    // Validate item balance matches
    if (totalItemBalanceQuantity !== balance) {
      return this.showDialog(
        `<b>Warehouse Locations!</b><br>
         Your sum of quantities are <b>${totalItemBalanceQuantity}</b> not matching with overall balance <b>${balance}.</b>`
      );
    }
  
    return true; // Everything matches
  }
  
  showDialog(message: string): void {
    this.dialogMessage = message;  // Set the dynamic message
    const dialog = document.getElementById('customDialog');
    if (dialog) {
        dialog.style.display = 'flex';  // Explicitly set display to flex
    }
  ;}


  // Function to close the custom dialog
  closeDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'none'; // Hide the dialog
    }
  };

  onSubmit() {
    // Proceed only if verifyBalance() returns true
    if (this.verifyBalance()) {
      if (this.formConfig.submit.label === 'Update') {
        this.updateProducts();
      } else if (this.formConfig.submit.label === 'Submit') {
        this.createRecord();
      }
    }
  };

  setFormConfig() {
    this.ProductEditID =null
    this.formConfig = {
      // url: "products/products/",
      formState: {
        viewMode: false,
        // isEdit: false,
      },
      showActionBtn: true,
      exParams: [
        // {
        //   key: 'products',
        //   type: 'script',
        //   value: 'data.products.map(m=> {m.pack_unit_id = m.pack_unit.stock_unit_id;  return m ;})'
        // },
      ],
      submit: {
        label: 'Submit',
        submittedFn: () => this.onSubmit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model: {
        products: {},
		    product_variations:[{}],
        product_item_balance: [{}]
      },
      fields: 	[
        {
          fieldGroup: [
            {
              className: 'col-12 custom-form-card-block p-0',
              key: 'products',
              fieldGroupClassName:'row m-0 pr-0',
              fieldGroup: [
                {
                  className: 'col-9',
                  fieldGroupClassName:'row m-0 p-0',
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
                    if (res && res.data && res.data?.order_number) {
                      field.formControl.setValue(res.data?.order_number);
                    }
                    });
                  }
                  }
                },
                {
                  className: 'col-3',
                  key: 'print_name',
                  type: 'input',
                  templateOptions: {
                    label: 'Print Name',
                    placeholder: 'Enter Print Name',
                    required: true,
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
                          this.formConfig.model['products']['product_group_id'] = data?.product_group_id;
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
                      this.formConfig.model['products']['stock_unit_id'] = data?.stock_unit_id;
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
                      this.formConfig.model['products']['sales_gl_id'] = data?.sales_gl_id;
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
                      this.formConfig.model['products']['purchase_gl_id'] = data?.purchase_gl_id;
                    } else {
                      console.error('Form config or lead_status data model is not defined.');
                    }
                    });
                  }
                  }
                },
                {
                  className: 'col-3',
                  key: 'hsn_code',
                  type: 'input',
                  templateOptions: {
                  label: 'HSN',
                  placeholder: 'Enter HSN Code',
                  required: false
                  }
                },
                
                {
                  className: 'col-3',
                  key: 'balance',
                  type: 'input',
                  templateOptions: {
                  label: 'Balance',
                  required : true
                  }
                },
                {
                  className: 'col-3 d-flex align-items-center',
                  key: 'print_barcode',
                  type: 'checkbox',
                  templateOptions: {
                  label: 'Print Barcode'
                  }
                },
                
              ]
            },
            {
              className: 'col-3 p-0',
              // key: 'products',
              fieldGroupClassName: "ant-row row mx-0 mt-2",
              fieldGroup: [
                {
                  key: 'picture',
                  type: 'file',
                  className: 'ta-cell pr-md col d-flex justify-content-center pr-0',
                  templateOptions: {
                    label: 'Picture',
                    required: true
                  }
                }                                
              ]
            },
          ]
        },
        {
          className: "tab-form-list",
          type: 'tabs',
          fieldGroup: [
            {
              className: 'col-12 pb-0',
              fieldGroupClassName: "field-no-bottom-space",
              props: {
                label: 'Variations'
              },
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      key: 'product_variations',
                      type: 'table',
                      className: 'custom-form-list',
                      templateOptions: {
                        // title: 'Product Variations',
                        addText: 'Add New Variations',
                        tableCols: [
                          { name: 'warehouse_location_id', label: 'Warehouse Location' },
                          { name: 'quantity', label: 'Quantity' },
                        ]
                      },
                      fieldArray: {
                        fieldGroup: [
                          {
                            key: 'size_id',
                            type: 'select',
                            templateOptions: {
                              label: 'Size',
                              placeholder: 'Select Size',
                              dataKey: 'size_id',
                              dataLabel: 'size_name',
                              bindId: true,
                              hideLabel: true,
                              lazy: {
                              url: 'products/sizes/',
                              lazyOneTime: true
                              }
                            },
                          },
                          {
                            key: 'color_id',
                            type: 'select',
                            templateOptions: {
                              label: 'Color',
                              placeholder: 'Select Color',
                              dataKey: 'color_id',
                              dataLabel: "color_name",
                              bindId: true,
                              hideLabel: true,
                              lazy: {
                              url: 'products/colors/',
                              lazyOneTime: true
                              }
                            }
                          },
                          {
                            key: 'sku',
                            type: 'input',
                            templateOptions: {
                              label: 'SKU',
                              hideLabel: true,
                              placeholder: 'Enter SKU'
                            },
                            expressionProperties: {
                              'templateOptions.required': (model) => !!model?.quantity  // SKU is required if quantity has a value
                            }
                          },
                          {
                            key: 'price',
                            type: 'input',
                            templateOptions: {
                              label: 'Price',
                              hideLabel: true,
                              placeholder: 'Enter Price',
                              required:false
                            }
                          },
                          {
                            key: 'quantity',
                            type: 'input',
                            templateOptions: {
                              label: 'Quantity',
                              hideLabel: true,
                              placeholder: 'Enter Quantity',
                              required:false,
                              type: 'number'
                            }
                          }                         
                          ]
                      }
                    },
                  ]
                }
              ]
            },
            {
              className: 'col-12 pb-0',
              fieldGroupClassName: "field-no-bottom-space",
              props: {
                label: 'Warehouse Locations'
              },
              fieldGroup: [
                  {
                    fieldGroupClassName: "",
                    fieldGroup: [
                      {
                        key: 'product_item_balance',
                        type: 'table',
                        className: 'custom-form-list',
                        templateOptions: {
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
                                dataKey: 'location_id',
                                dataLabel: 'location_name',
                                options: [], // This will be populated dynamically based on the warehouse selected
                                hideLabel: true,
                                required: true,
                                lazy: {
                                lazyOneTime: true,
                                url: 'inventory/warehouse_locations/'
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                field.formControl.valueChanges.subscribe((data: any) => {
                                  const index = field.parent.key;
                                  if (!this.formConfig.model['product_item_balance'][index]) {
                                  console.error(`Task comments at index ${index} is not defined. Initializing...`);
                                  this.formConfig.model['product_item_balance'][index] = {};
                                  }
                                  this.formConfig.model['product_item_balance'][index]['warehouse_location_id'] = data?.location_id;
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
              ]
            },
            {
              className: 'col-12 pb-0',
              fieldGroupClassName: "field-no-bottom-space",
              props: {
                label: 'Tax Details'
              },
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      className: 'col-12 p-0',
                      key: 'products',
                      fieldGroupClassName: "ant-row row align-items-end mt-3",
                          fieldGroup: [
                            {
                              key: 'gst_classification',
                              type: 'select',
                              className: 'col-3',
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
                                      this.formConfig.model['products']['gst_classification_id'] = data?.gst_classification_id;
                                    } else {
                                      console.error('Form config or gst_classification_id data model is not defined.');
                                    }
                                  });
                                }
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
                          ]
                        },
                      ]
                    }
                  ]
                },
              {
                className: 'col-12 pb-0',
                fieldGroupClassName: "field-no-bottom-space",
                props: {
                  label: 'Price Details'
                },
                fieldGroup: [
                  {
                    fieldGroupClassName: "",
                    fieldGroup: [
                      {
                        className: 'col-12 p-0',
                        key: 'products',
                        fieldGroupClassName: "ant-row row align-items-end mt-3",
                            fieldGroup: [
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
                            ]
                          },
                        ]
                      }
                    ]
                  },
                  {
                    className: 'col-12 custom-form-card-block p-0',
                    fieldGroupClassName:'row m-0 pr-0',
                    props: {
                      label: 'Stock Details'
                    },
                    fieldGroup: [
                      {
                        className: 'col-9 p-0',
                        key: 'products',
                        fieldGroupClassName: "ant-row mx-0 row align-items-end mt-2",
                        fieldGroup: [
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
                        ]
                      },
                    ]            
                  },       
                ]
              },
          ]
        }
      ]
    }
  }
}
