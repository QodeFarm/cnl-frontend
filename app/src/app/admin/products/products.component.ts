import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ProductsListComponent } from './products-list/products-list.component';


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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.showProductsList = false;
    this.showForm = true;
    this.ProductEditID = null;
    // Set form config
    this.setFormConfig();
    // this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[8].hide = true;
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
          console.log('Record created successfully:', response);
          this.ngOnInit();  // Optionally reset the form after successful submission
        },
        error: (error) => {
          console.error('Error creating record:', error);
          alert('An error occurred while creating the record.');
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
        console.log('Sale Credit Notes Order updated successfully', response);
        this.ngOnInit();
      },
      (error) => {
        console.error('Error updating Sale Return Order:', error);
      }
    );
  }

  // Method to calculate and verify the balance
  verifyBalance(): any {
    const balance = parseInt(this.formConfig.model.products.balance, 10);
    let totalItemBalanceQuantity = 0;
    let totalVariationQuantity = 0;
  
    // Helper function to calculate total quantity
    const calculateTotalQuantity = (items) => {
      return items ? items.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0) : 0;
    };
  
    // Calculate total quantities
    totalItemBalanceQuantity = calculateTotalQuantity(this.formConfig.model.product_item_balance);
    totalVariationQuantity = calculateTotalQuantity(this.formConfig.model.product_variations);
  
    // Check if the item balance matches
    if (totalItemBalanceQuantity !== balance) {
      return this.showDialog(`<b>Product Balance Mismatch !</b>
        <br>Sum of quantities are not equal to total balance: ${balance}.`);
    }
  
    // Check if variations exist and the total variations match the balance
    if (this.formConfig.model.product_variations?.length && totalVariationQuantity !== balance) {
      return this.showDialog(`<b>Product Variations Mismatch !</b>
        <br>Please ensure the total quantity of variations equals the balance: ${balance}.`);
    }
  
    return true;  // Everything matches, continue with your logic
  }
  ;

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

  // Example for how the form submission might trigger the update
  onSubmit() {
    // Proceed only if verifyBalance() returns true
    if (this.verifyBalance()) {
      if (this.formConfig.submit.label === 'Update') {
        this.updateProducts();
      }
      if (this.formConfig.submit.label === 'Submit') {
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
      fields: [
        //-----------------------------------------products -----------------------------------//
        {
              fieldGroupClassName: "ant-row custom-form-block",
              key: 'products',
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
                            if (res && res.data && res.data?.order_number) {
                              field.formControl.setValue(res.data?.order_number);
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
                              this.formConfig.model['products']['brand_id'] = data?.brand_id;
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
                              this.formConfig.model['products']['type_id'] = data?.type_id;
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
                              this.formConfig.model['products']['unit_options_id'] = data?.unit_options_id;
                            } else {
                              console.error('Form config or unit_options_id data model is not defined.');
                            }
                          });
                        },
                        onInit: (field: any) => {
                          const url = field.templateOptions.lazy.url;
                    
                          // Fetch the data using HttpClient
                          this.http.get(url).subscribe(
                            (data: any) => {
                              
                              // Map data to ensure each object has both label and value properties
                              field.templateOptions.options = data?.data?.map((option: any) => ({
                                label: option.unit_name,  // Display name in the UI
                                value: {
                                  unit_options_id:option.unit_options_id,
                                  unit_name:option.unit_name,
                                }
                              }));
                    
                              // Find the default option where unit_name is 'Stock Unit'
                              const regex = /^stock\s*unit$/i; // Matches "stock unit" with optional whitespace, case insensitive
                              const defaultOption = field.templateOptions.options.find(option => regex.test(option.label));

                              if (defaultOption) {
                                // Set the default value to the unit_options_id of 'Stock Unit'
                                field.formControl.setValue(defaultOption.value);
                    
                                // Update the model if necessary
                                if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                  this.formConfig.model['products']['unit_options_id'] = defaultOption.value.unit_options_id;
                                }
                              } else {
                                console.warn('Default "Unit Option" option not found in options.');
                              }
                            },
                            (error) => {
                              console.error('Error fetching unit options:', error);
                            }
                          );
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
                      key: 'pack_unit',
                      type: 'select',
                      className: 'col-3',
                      templateOptions: {
                      label: 'Pack Unit',
                          dataKey: 'stock_unit_id',
                          dataLabel: 'stock_unit_name',
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
                              this.formConfig.model['products']['pack_unit_id'] = data?.stock_unit_id;
                            } else {
                              console.error('Form config or lead_status data model is not defined.');
                            }
                          });
                        }
                      },
                      hideExpression: (model) => {
                          const unitName = model.unit_options ? model.unit_options.unit_name : undefined;
                          // Hide if the `unitName` is not 'Stock Pack Unit' AND not 'Stock Pack GPack Unit'
                          return unitName !== 'Stock Pack Unit' && unitName !== 'Stock Pack GPack Unit';
                      },
                    },
                    {
                      className: 'col-3',
                      key: 'pack_vs_stock',
                      type: 'input',
                      templateOptions: {
                        label: 'Pack vs Stock',
                        type: 'number', 
                        required: false
                      },
                      hideExpression: (model) => {
                        // Check if `unit_options` exists, and check the value of `unit_name`
                        const unitName = model.unit_options ? model.unit_options.unit_name : undefined;
                        return unitName !== 'Stock Pack Unit' && unitName !== 'Stock Pack GPack Unit';
                      }
                    },
                    {
                      key: 'g_pack_unit',
                      type: 'select',
                      className: 'col-3',
                      templateOptions: {
                      label: 'GPack Unit',
                      dataKey: 'stock_unit_id',
                      dataLabel: 'stock_unit_name',
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
                              this.formConfig.model['products']['g_pack_unit_id'] = data?.stock_unit_id;
                            } else {
                              console.error('Form config or g_pack_unit data model is not defined.');
                            }
                          });
                        }
                      },
                      hideExpression: (model) => {
                        // Check if `unit_options` exists, and check the value of `unit_name`
                        const unitName = model.unit_options ? model.unit_options.unit_name : undefined;
                        return unitName !== 'Stock Pack GPack Unit';  // Hide if it's not 'Stock Pack Unit'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'g_pack_vs_pack',
                      type: 'input',
                      templateOptions: {
                      label: 'GPack vs Stock',
                      type: 'number', 
                      required : false
                      },
                      hideExpression: (model) => {
                        // Check if `unit_options` exists, and check the value of `unit_name`
                        const unitName = model.unit_options ? model.unit_options.unit_name : undefined;
                        return unitName !== 'Stock Pack GPack Unit';  // Hide if it's not 'Stock Pack Unit'
                      }
                    },
                    {
                      className: 'col-3',
                      key: 'packet_barcode',
                      type: 'input',
                      templateOptions: {
                      label: 'Packet Barcode',
                      required : false,
                      },
                      hideExpression: (model) => {
                        // Check if `unit_options` exists, and check the value of `unit_name`
                        const unitName = model.unit_options ? model.unit_options.unit_name : undefined;
                        return unitName !== 'Stock Pack GPack Unit';  // Hide if it's not 'Stock Pack Unit'
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
                              this.formConfig.model['products']['category_id'] = data?.category_id;
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
                              this.formConfig.model['products']['item_type_id'] = data?.item_type_id;
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
                              this.formConfig.model['products']['drug_type_id'] = data?.drug_type_id;
                            } else {
                              console.error('Form config or lead_status data model is not defined.');
                            }
                          });
                        }
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
                              this.formConfig.model['products']['gst_classification_id'] = data?.gst_classification_id;
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
        //----------------------------------------- product_variations  -----------------------------------//
        {
          key: 'product_variations',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Product Variations',
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
                  placeholder: 'Enter SKU',
                  required: true
                }
              },
              {
                key: 'price',
                type: 'input',
                templateOptions: {
                  label: 'Price',
                  hideLabel: true,
                  placeholder: 'Enter Price',
                  required:true
                }
              },
              {
                key: 'quantity',
                type: 'input',
                templateOptions: {
                  label: 'Quantity',
                  hideLabel: true,
                  placeholder: 'Enter Quantity',
                  required:true
                }
              }
            ]
          }
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
  }
  
}
