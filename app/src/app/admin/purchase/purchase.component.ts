import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { distinctUntilChanged } from 'rxjs/operators';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

import { CommonModule } from '@angular/common';
import { PurchaseListComponent } from './purchase-list/purchase-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-purchase',
  imports: [CommonModule, AdminCommmonModule, PurchaseListComponent],
  standalone: true,
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})

export class PurchaseComponent {
  @ViewChild('purchaseForm', { static: false }) purchaseForm: TaFormComponent | undefined;
  orderNumber: any;
  showPurchaseOrderList: boolean = false;
  showForm: boolean = false;
  PurchaseOrderEditID: any;
  productOptions: any;
  // nowDate = () => {
  //   return new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
  // }
  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  // constructor(private http: HttpClient) {
  // }
//=====================================================================
  tables: string[] = ['Sale Order', 'Sale Invoice', 'Sale Return', 'Purchase Order', 'Purchase Invoice', 'Purchase Return'];

  // This will store available tables excluding the current one
  availableTables: string[] = [];

  // Selected table from dropdown
  selectedTable: string;

  // Variable to store current table name
  currentTable: string = 'Purchase Order';

  fieldMapping = {
    'Sale Invoice': {
      sourceModel: 'purchase_order_data',  // Specify the source model
      targetModel: 'sale_invoice_order', // Specify the target model
      // Indicate nested fields with model mappings
      nestedModels: {
        purchase_order_items: 'sale_invoice_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Sale Return': {
      sourceModel: 'purchase_order_data',  // Specify the source model
      targetModel: 'sale_return_order',  // Specify the target model
      // Nested mappings
      nestedModels: {
        purchase_order_items: 'sale_return_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Sale Order': {
      sourceModel: 'purchase_order_data',
      targetModel: 'sale_order',
      nestedModels: {
        purchase_order_items: 'sale_order_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Purchase Invoice': {
      sourceModel: 'purchase_order_data',
      targetModel: 'purchase_invoice_orders',
      nestedModels: {
        purchase_order_items: 'purchase_invoice_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Purchase Return': {
      sourceModel: 'purchase_order_data',
      targetModel: 'purchase_return_orders',
      nestedModels: {
        purchase_order_items: 'purchase_return_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    }
  };

  copyToTable() {
    const selectedMapping = this.fieldMapping[this.selectedTable];
    
    if (!selectedMapping) {
      console.error('Mapping not found for selected table:', this.selectedTable);
      return;
    }
  
    const dataToCopy = this.formConfig.model[selectedMapping.sourceModel] || {};
    const populatedData = { [selectedMapping.targetModel]: {} };
  
    // Copy main fields
    Object.keys(dataToCopy).forEach(field => {
      populatedData[selectedMapping.targetModel][field] = dataToCopy[field];
    });
  
    // Copy nested models if they exist
    if (selectedMapping.nestedModels) {
      Object.keys(selectedMapping.nestedModels).forEach(sourceNestedModel => {
        const targetNestedModel = selectedMapping.nestedModels[sourceNestedModel];
        const nestedData = this.formConfig.model[sourceNestedModel] || [];
        
        populatedData[targetNestedModel] = Array.isArray(nestedData)
          ? nestedData.map(item => ({ ...item }))
          : { ...nestedData };
      });
    }
  
    // Log and navigate to the target module with populated data
    console.log('Populated Data:', populatedData);
    
    // Determine the target route based on the selected table
    const targetRoute = 
      this.selectedTable === 'Sale Invoice' ? 'sales/salesinvoice' :
      this.selectedTable === 'Sale Return' ? 'sales/sale-returns' :
      this.selectedTable === 'Sale Order' ? 'sales' :
      this.selectedTable === 'Purchase Invoice' ? 'purchase/purchase-invoice' :
      this.selectedTable === 'Purchase Return' ? 'purchase/purchasereturns' :
      null;

    if (!targetRoute) {
      console.error('No valid route for selected table:', this.selectedTable);
      return;
    }

    this.router.navigate([`admin/${targetRoute}`], { state: { data: populatedData } });
  }
  

  // Initialize the copy modal options dynamically
  openCopyModal() {
    this.availableTables = this.tables.filter(table => table !== this.currentTable);
  }

  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  dataToPopulate: any;
  hasDataPopulated: boolean = false;

  ngOnInit() {
    
    this.showPurchaseOrderList = false;
    this.showForm = true;
    this.PurchaseOrderEditID = null;
    // set form config
    this.setFormConfig();
    this.checkAndPopulateData();

    // set purchase_order default value
    this.formConfig.model['purchase_order_data']['order_type'] = 'purchase_order';

    // to get PurchaseOrder number for save
    this.getOrderNo();
    this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[7].hide =true;
    // console.log("---------",this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1])
  }

  checkAndPopulateData() {
    // Check if data has already been populated
    if (this.dataToPopulate === undefined) {
      console.log("Data status checking 1 : ", (this.dataToPopulate === undefined))
      // Subscribe to route params and history state data
      this.route.paramMap.subscribe(params => {
        // Retrieve data from history only if it's the first time populating
        this.dataToPopulate = history.state.data; 
        console.log('Data retrieved:', this.dataToPopulate);
        
        // Populate the form only if data exists
        if (this.dataToPopulate) {
          // Ensure we are handling purchase_order_items correctly
          const purchaseOrderItems = this.dataToPopulate.purchase_order_items || [];
  
          // Clear existing purchase_order_items to avoid duplicates
          this.formConfig.model.purchase_order_items = [];
  
          // Populate form with data, ensuring unique entries
          purchaseOrderItems.forEach(item => {
            const populatedItem = {
              product_id: item.product.product_id,
              size: item.size,
              color: item.color,
              code: item.code,
              unit: item.unit,
              total_boxes: item.total_boxes,
              quantity: item.quantity,
              amount: item.amount,
              rate: item.rate,
              print_name: item.print_name,
              discount: item.discount
            };
            this.formConfig.model.purchase_order_items.push(populatedItem);
          });
        }
      });
    } else {
    // Detect if the page was refreshed
      const wasPageRefreshed = window.performance?.navigation?.type === window.performance?.navigation?.TYPE_RELOAD;
    
      // Clear data if the page was refreshed
      if (wasPageRefreshed) {
        this.dataToPopulate = undefined;
        console.log("Page was refreshed, clearing data.");
        
        // Ensure the history state is cleared to prevent repopulation
        history.replaceState(null, '');
        return; // Stop further execution as we don't want to repopulate the form
      }
    }
  }  
//=====================================================================
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editPurchaseOrder(event) {
    console.log('event', event);
    this.PurchaseOrderEditID = event;
    this.http.get('purchase/purchase_order/' + event).subscribe((res: any) => {
      console.log('--------> res ', res);
      if (res && res.data) {

        this.formConfig.model = res.data;
        // set purchase_order default value
        this.formConfig.model['purchase_order_data']['order_type'] = 'purchase_order';
        this.formConfig.pkId = 'purchase_order_id';
        // set labels for update
        this.formConfig.submit.label = 'Update';
        // show form after setting form values

        // this.formConfig.url= "sales/purchase_order/" + this.PurchaseOrderEditID;
        

        this.formConfig.model['purchase_order_id'] = this.PurchaseOrderEditID;
        this.showForm = true;
        this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[7].hide = false;
      }
    });
    this.hide();
  }

  getOrderNo() {
    this.orderNumber = null;
    this.http.get('masters/generate_order_no/?type=SHIP').subscribe((res: any) => {
        if (res && res.data && res.data.order_number) {
            this.formConfig.model['order_shipments']['shipping_tracking_no'] = res.data.order_number;
    this.http.get('masters/generate_order_no/?type=PO').subscribe((res: any) => {
      console.log(res);
      if (res && res.data && res.data.order_number) {
        this.formConfig.model['purchase_order_data']['order_no'] = res.data.order_number;
        this.orderNumber = res.data.order_number;
      }
       
      });
    }
    });
  }

  showPurchaseOrderListFn() {
    this.showPurchaseOrderList = true;
  }

  setFormConfig() {
    this.PurchaseOrderEditID = null;
    this.formConfig = {
      url: "purchase/purchase_order/",
      title: '',
      formState: {
        viewMode: false
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'purchase_order_items',
          type: 'script',
          value: 'data.purchase_order_items.map(m=> {m.product_id = m.product.product_id; if(m.product.unit_options){m.unit_options_id = m.product.unit_options.unit_options_id};  if(m.unit_options){m.unit_options_id = m.unit_options.unit_options_id};  return m ;})'
        },
        {
          key: 'purchase_order_items',
          type: 'script',
          value: 'data.purchase_order_items.map(m=> {m.size_id = m.size.size_id; return m ;})'
        },
        {
          key: 'purchase_order_items',
          type: 'script',
          value: 'data.purchase_order_items.map(m=> {m.color_id = m.color.color_id; return m ;})'
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
      model: {
        purchase_order_data: {},
        purchase_order_items: [{}],
        order_attachments: [],
        order_shipments: {}
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'purchase_order_data',
          fieldGroup: [
            {
              key: 'purchase_type',
              type: 'select',
              className: 'col-2',
              // defaultValue: "d4d85a98-a703-4772-8b3c-736fc4cbf849",
              templateOptions: {
                label: 'Purchase type',
                dataKey: 'purchase_type_id',
                dataLabel: "name",
                options: [],
                // required: true,
                lazy: {
                  url: 'masters/purchase_types/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    console.log("purchase_type", data);
                    if (data && data.purchase_type_id) {
                      this.formConfig.model['purchase_order_data']['purchase_type_id'] = data.purchase_type_id;
                    }
                  });
                  if (this.dataToPopulate && this.dataToPopulate.purchase_order_data.purchase_type && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.purchase_order_data.purchase_type);
                  }
                }
              }
            },
            {
              key: 'vendor',
              type: 'select',
              className: 'col-2',
              props: {
                label: 'Vendor',
                dataKey: 'vendor_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'vendors/vendors/?summary=true',
                  lazyOneTime: true
                },
                required: true

              },
              hooks: {
                onInit: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    // console.log("vendors", data);
                    if (data && data.vendor_id) {
                      this.formConfig.model['purchase_order_data']['vendor_id'] = data.vendor_id;
                    }
                    if (data.vendor_addresses && data.vendor_addresses.billing_address) {
                        field.form.controls.billing_address.setValue(data.vendor_addresses.billing_address)
                    }
                    if (data.vendor_addresses && data.vendor_addresses.shipping_address) {
                      field.form.controls.shipping_address.setValue(data.vendor_addresses.shipping_address)
                    }
                    if (data.email) {
                      field.form.controls.email.setValue(data.email)
                    }
                  });
                  if (this.dataToPopulate && this.dataToPopulate.purchase_order_data.vendor && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.purchase_order_data.vendor);
                  }
                }
              }
            },
            {
              key: 'vendor_agent',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Vendor agent',
                dataKey: 'vendor_agent_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'vendors/vendor_agent',
                  lazyOneTime: true
                },
                // required: true,

              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    // console.log("vendors", data);
                    if (data && data.vendor_agent_id) {
                      this.formConfig.model['purchase_order_data']['vendor_agent_id'] = data.vendor_agent_id;
                    }
                  });
                }
              }
            },
            {
              key: 'order_no',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                label: 'Order no',
                placeholder: 'Enter Order No',
                required: true,
                readonly: true
              },
              hooks: {
                onInit: (field: any) => {}
              }
            },
            {
              key: 'email',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                type: 'input',
                label: 'Email',
                placeholder: 'Enter Email'
              },
              hooks: {
                onInit: (field: any) => { }
              }
            },
            {
              key: 'delivery_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Delivery date',
                required: true
              }
            },
            {
              key: 'order_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Order date',
                readonly: true,
                required: true
              }
            },
            {
              key: 'ref_no',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                type: 'input',
                label: 'Ref No',
                placeholder: 'Enter Ref No'
              },
              hooks: {
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.purchase_order_data.ref_no && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.purchase_order_data.ref_no);
                  }
                }
              }
            },
            {
              key: 'ref_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Ref date',
                placeholder: 'Select Ref date',
                required: true,
                // readonly: true
              }
            },
            {
              key: 'tax',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Tax',
                options: [
                  { 'label': "Inclusive", value: 'Inclusive' },
                  { 'label': "Exclusive", value: 'Exclusive' }
                ]
              },
              hooks: {
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.purchase_order_data.tax && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.purchase_order_data.tax);
                  }
                }
              }
            },
            {
              key: 'remarks',
              type: 'textarea',
              className: 'col-4',
              templateOptions: {
                type: 'input',
                label: 'Remarks',
                placeholder: 'Enter Remarks',
              },
              hooks: {
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.purchase_order_data.remarks && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.purchase_order_data.remarks);
                  }
                }
              }
            },
            {
              key: 'billing_address',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Billing address',
                placeholder: 'Enter Billing address',
              }
            },
            {
              key: 'shipping_address',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Shipping address',
                placeholder: 'Enter Shipping address',
              }
            }
          ]
        },
        // end of purchase_order

        {
          key: 'purchase_order_items',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            // title: 'Products',
            addText: 'Add Product',
            tableCols: [
              {
                name: 'product',
                label: 'Product'
              },
              {
                name: 'size',
                label: 'size'
              },
              {
                name: 'color',
                label: 'color'
              },
              {
                name: 'code',
                label: 'Code'
              },
              {
                name: 'unit',
                label: 'Unit'
              },
              {
                name: 'total_boxes',
                label: 'Total Boxes'
              },
              {
                name: 'quantity',
                label: 'Quantity'
              },
              {
                name: 'amount',
                label: 'Price'
              },
              {
                name: 'rate',
                label: 'Rate'
              },
              {
                name: 'discount',
                label: 'Discount'
              }
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
                  hideLabel: true,
                  dataLabel: 'name',
                  options: [],
                  required: true,
                  lazy: {
                    url: 'products/products/?summary=true',
                    lazyOneTime: true
                  }
                },
                hooks: {
                    onInit: (field: any) => {
                        const parentArray = field.parent;

                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion

                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.purchase_order_items.length > currentRowIndex) {
                        const existingProduct = this.dataToPopulate.purchase_order_items[currentRowIndex].product;
                        
                        // Set the full product object instead of just the product_id
                        if (existingProduct) {
                          field.formControl.setValue(existingProduct); // Set full product object (not just product_id)
                        }
                      }

                      // ***Size dropdown will populate with available sizes when product in selected***
                      field.formControl.valueChanges.subscribe(selectedSizeId => {
                        const product = this.formConfig.model.purchase_order_items[currentRowIndex]?.product;
                        
                        // Make sure product exists before making HTTP request
                        if (product?.product_id) {
                          this.http.get(`products/product_variations/?product_id=${product.product_id}`).subscribe((response: any) => {
                            const availableSizes = response.data.map((variation: any) => {
                              return {
                                label: variation.size.size_name,  // Use 'size_name' as the label
                                value: {
                                  size_id: variation.size.size_id,
                                  size_name: variation.size.size_name,
                                }
                              };
                            });
              
                            // Use a Set to track seen size_ids to ensure unique sizes
                            const uniqueArray = availableSizes.filter((item, index, self) =>
                              index === self.findIndex((t) => t.value.size_id === item.value.size_id)
                            );
              
                            // Now, update the size field for the current row, not globally
                            const sizeField = parentArray.fieldGroup.find((f: any) => f.key === 'size');
                            if (sizeField) {
                              sizeField.templateOptions.options = uniqueArray; // Update the options for the 'size' field of the current row
                            }
                          });
                        } else {
                          console.error('Product not selected or invalid.');
                        }
                      });
                      
                      // Subscribe to value changes of the field
                      field.formControl.valueChanges.subscribe(selectedProductId => {
                        const product = this.formConfig.model.purchase_order_items[currentRowIndex]?.product;

                        let unit_name = 'NA';
                        if (product.unit_options) {
                            unit_name = product.unit_options.unit_name;
                        }

                        // Check if a valid product is selected
                        if (product?.product_id) {
                          const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;

                          if (cardWrapper) {
                            // Remove existing product info if present
                            cardWrapper.querySelector('.center-message')?.remove();

                            // Create and insert new product info
                            const productInfoDiv = document.createElement('div');
                            productInfoDiv.classList.add('center-message');
                            productInfoDiv.innerHTML = `
                              <span style="color: red;">Product Info:</span> 
                              <span style="color: blue;">${product.name}</span> |                            
                              <span style="color: red;">Balance:</span> 
                              <span style="color: blue;">${product.balance}</span> |
                              <span style="color: red;">Unit:</span> 
                              <span style="color: blue;">${product.unit_options.unit_name}</span> | &nbsp;`;

                            cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);

                          }
                        } else {
                          console.log(`No valid product selected for Row ${currentRowIndex}.`);
                        }
                      });
                    } else {
                      console.error('Parent array is undefined or not accessible');
                    }
                      field.formControl.valueChanges.subscribe(data => {
                        console.log("products data", data);
                        // console.log("products data", data.code);
                        this.productOptions = data;
                        if (field.form && field.form.controls && field.form.controls.code && data && data.code) {
                          field.form.controls.code.setValue(data.code)
                          // console.log("code : ", data.code)
                        }
                        if (field.form && field.form.controls && field.form.controls.rate && data && data.mrp) {
                          field.form.controls.rate.setValue(field.form.controls.rate.value || data.sales_rate)
                        }
                        if (field.form && field.form.controls && field.form.controls.discount && data && data.dis_amount) {
                          field.form.controls.discount.setValue(parseFloat(data.dis_amount))
                        }
                        if (field.form && field.form.controls && field.form.controls.unit_options_id && data && data.unit_options && data.unit_options.unit_name) {
                          field.form.controls.unit_options_id.setValue(data.unit_options.unit_options_id)
                        }
                        if (field.form && field.form.controls && field.form.controls.print_name && data && data.print_name) {
                          field.form.controls.print_name.setValue(data.print_name)
                        }
                        if (field.form && field.form.controls && field.form.controls.discount && data && data.dis_amount) {
                          field.form.controls.discount.setValue(data.dis_amount)
                        }
                        if (field.form && field.form.controls && field.form.controls.mrp && data && data.mrp) {
                            field.form.controls.mrp.setValue(data.mrp)
                          }
                        this.totalAmountCal();
                      });
                    }
                  }
                },
                {
                  key: 'size',
                  type: 'select',
                  templateOptions: {
                    label: 'Select Size',
                    dataKey: 'size_id',
                    hideLabel: true,
                    dataLabel: 'size_name',
                    options: [],
                    required: true,
                    lazy: {
                      lazyOneTime: true
                    }
                  },
                  hooks: {
                    onInit: (field: any) => {
                      const parentArray = field.parent;
                
                      if (parentArray) {
                        const currentRowIndex = +parentArray.key;

                        // Check if there is a product already selected in this row (when data is copied)
                        if (this.dataToPopulate && this.dataToPopulate.purchase_order_items.length > currentRowIndex) {
                          const existingSize = this.dataToPopulate.purchase_order_items[currentRowIndex].size;
                          
                          // Set the full product object instead of just the product_id
                          if (existingSize && existingSize.size_id) {
                            field.formControl.setValue(existingSize); // Set full product object (not just product_id)
                          }
                        }

                        // Subscribe to value changes when the form field changes
                        //**When Size is selected its overall  quantity will be shown in product info text area*/
                        field.formControl.valueChanges.subscribe(selectedProductId => {
                          const product = this.formConfig.model.purchase_order_items[currentRowIndex]?.product;
                          const size = this.formConfig.model.purchase_order_items[currentRowIndex]?.size;
              
                          const product_id = product?.product_id;
                          const size_id = size?.size_id;
              
                          // Check if product_id, size_id, and color_id exist
                          if (product_id && size_id) {
                            const url = `products/product_variations/?product_id=${product_id}&size_id=${size_id}`;
              
                            // Call the API using HttpClient (this.http.get)
                            this.http.get(url).subscribe((data: any) => {

                              function sumQuantities(dataObject: any): number {
                                // First, check if the data object contains the array in the 'data' field
                                if (dataObject && Array.isArray(dataObject.data)) {
                                  // Now we can safely use reduce on dataObject.data
                                  return dataObject.data.reduce((sum, item) => sum + (item.quantity || 0), 0);
                                } else {
                                  console.error("Data is not an array:", dataObject);
                                  return 0;
                                }
                              }
                              
                              const totalBalance = sumQuantities(data);
              
                                const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
                                if (cardWrapper) {
                                  // Remove existing product info if present
                                  cardWrapper.querySelector('.center-message')?.remove();
              
                                  // Display fetched product variation info
                                  const productInfoDiv = document.createElement('div');
                                  productInfoDiv.classList.add('center-message');
                                  productInfoDiv.innerHTML = `
                                    <span style="color: red;">Product Info:</span>
                                    <span style="color: blue;">${data.data[0].product.name}</span> |
                                    <span style="color: red;">Balance:</span>
                                    <span style="color: blue;">${totalBalance}</span> |  
                                  `;
              
                                  cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
                                }
                              },
                              (error) => {
                                console.error("Error fetching data:", error);
                              }
                            );
                          } else {
                            console.log(`No valid product, size, or color selected for Row ${currentRowIndex}.`);
                          }
                        }); //**End of Size selection part */

                          // Subscribe to value changes of the size field
                          field.formControl.valueChanges.subscribe(selectedSizeId => {
                            const product = this.formConfig.model.purchase_order_items[currentRowIndex]?.product;
                            const size = this.formConfig.model.purchase_order_items[currentRowIndex]?.size;
                  
                            // Make sure size exists
                            if (size?.size_id) {
                              // Fetch available colors based on the selected size
                              this.http.get(`products/product_variations/?product_id=${product.product_id}&size_id=${size.size_id}`).subscribe((response: any) => {
                                const availableColors = response.data.map((variation: any) => {
                                  return {
                                    label: variation.color.color_name,  // Use 'color_name' as the label
                                    value: {
                                      color_id: variation.color.color_id,
                                      color_name: variation.color.color_name
                                    }
                                  };
                                });
                  
                                // Filter unique colors (optional, if there's a chance of duplicate colors)
                                const uniqueColors = availableColors.filter((item, index, self) =>
                                  index === self.findIndex((t) => t.value.color_id === item.value.color_id)
                                );
                  
                                // Now, update the color field for the current row
                                const colorField = parentArray.fieldGroup.find((f: any) => f.key === 'color');
                                if (colorField) {
                                  colorField.templateOptions.options = uniqueColors; // Update the options for the 'color' field
                                }
                              });
                            } else {
                              console.error('Size not selected or invalid.');
                            }
                          });
                        } else {
                          console.error('Parent array is undefined or not accessible');
                        }
                      }
                    }
                },
                {
                  key: 'color',
                  type: 'select',
                  templateOptions: {
                    label: 'Select Color',
                    dataKey: 'color_id',
                    hideLabel: true,
                    dataLabel: 'color_name',
                    options: [],
                    required: true,
                    lazy: {
                      lazyOneTime: true
                    }
                  },
                  hooks: {
                    onInit: (field: any) => {
                      const parentArray = field.parent;
                      if (parentArray) {
                        const currentRowIndex = +parentArray.key;

                        // Check if there is a product already selected in this row (when data is copied)
                        if (this.dataToPopulate && this.dataToPopulate.purchase_order_items.length > currentRowIndex) {
                          const existingColor = this.dataToPopulate.purchase_order_items[currentRowIndex].color;
                          
                          // Set the full product object instead of just the product_id
                          if (existingColor) {
                            field.formControl.setValue(existingColor);
                          }
                        }
              
                        // Subscribe to value changes when the form field changes
                        field.formControl.valueChanges.subscribe(selectedProductId => {
                          const product = this.formConfig.model.purchase_order_items[currentRowIndex]?.product;
                          const size = this.formConfig.model.purchase_order_items[currentRowIndex]?.size;
                          const color = this.formConfig.model.purchase_order_items[currentRowIndex]?.color;
              
                          const product_id = product?.product_id;
                          const size_id = size?.size_id;
                          const color_id = color?.color_id;
              
                          // Check if product_id, size_id, and color_id exist
                          if (product_id && size_id && color_id) {
                            const url = `products/product_variations/?product_id=${product_id}&size_id=${size_id}&color_id=${color_id}`;
              
                            // Call the API using HttpClient (this.http.get)
                            this.http.get(url).subscribe(
                              (data: any) => {
              
                                const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
                                if (cardWrapper) {
                                  // Remove existing product info if present
                                  cardWrapper.querySelector('.center-message')?.remove();
              
                                  // Display fetched product variation info
                                  const productInfoDiv = document.createElement('div');
                                  productInfoDiv.classList.add('center-message');
                                  productInfoDiv.innerHTML = `
                                    <span style="color: red;">Product Info:</span>
                                    <span style="color: blue;">${data.data[0].product.name}</span> |
                                    <span style="color: red;">Balance:</span>
                                    <span style="color: blue;">${data.data[0].quantity}</span> |  
                                  `;
              
                                  cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
                                }
                              },
                              (error) => {
                                console.error("Error fetching data:", error);
                              }
                            );
                          } else {
                            console.log(`No valid product, size, or color selected for Row ${currentRowIndex}.`);
                          }
                        });
                      }
                    }
                  }
                },
              {
                type: 'input',
                key: 'code',
                templateOptions: {
                  label: 'Code',
                  placeholder: 'Enter code',
                  hideLabel: true,
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.purchase_order_items.length > currentRowIndex) {
                        const existingCode = this.dataToPopulate.purchase_order_items[currentRowIndex].product?.code;
                        
                        // Set the full product object instead of just the product_id
                        if (existingCode) {
                          field.formControl.setValue(existingCode); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
                }
              },
              {
                type: 'input',
                key: 'total_boxes',
                templateOptions: {
                type: 'number',
                  label: 'Total Boxes',
                  placeholder: 'Enter Total Boxes',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.purchase_order_items.length > currentRowIndex) {
                        const existingBox = this.dataToPopulate.purchase_order_items[currentRowIndex].total_boxes;
                        
                        // Set the full product object instead of just the product_id
                        if (existingBox) {
                          field.formControl.setValue(existingBox); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
                }
              },
              {
                type: 'select',
                key: 'unit_options_id',
                templateOptions: {
                  label: 'Unit',
                  placeholder: 'Select Unit',
                  hideLabel: true,
                  dataLabel: 'unit_name',
                  dataKey: 'unit_options_id',
                  bindId: true,
                  required: true,
                  lazy: {
                    url: 'masters/unit_options',
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.purchase_order_items.length > currentRowIndex) {
                        const existingUnit = this.dataToPopulate.purchase_order_items[currentRowIndex].product.unit_options;
                        
                        // Set the full product object instead of just the product_id
                        if (existingUnit) {
                          field.formControl.setValue(existingUnit.unit_options_id); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
                }
              },
              {
                type: 'input',
                key: 'quantity',
                //defaultValue: 1,
                templateOptions: {
                  type: 'number',
                  label: 'Qty',
                  placeholder: 'Enter Qty',
                  min: 1,
                  hideLabel: true,
                  required: true
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.purchase_order_items.length > currentRowIndex) {
                        const existingQuan = this.dataToPopulate.purchase_order_items[currentRowIndex].quantity;
                        
                        // Set the full product object instead of just the product_id
                        if (existingQuan) {
                          field.formControl.setValue(existingQuan); // Set full product object (not just product_id)
                        }
                      }
                    }
              
                    // Subscribe to value changes
                    field.formControl.valueChanges.subscribe(data => {
                      if (field.form && field.form.controls && field.form.controls.rate && data) {
                        const rate = field.form.controls.rate.value;
                        const quantity = data;
                        if (rate && quantity) {
                          field.form.controls.amount.setValue(parseInt(rate) * parseInt(quantity));
                        }
                      }
                    });
                  },
                  onChanges: (field: any) => {
                    // You can handle any changes here if needed
                  }
                }
              },
              {
                type: 'input',
                key: 'rate',
                templateOptions: {
                  type: 'number',
                  label: 'Rate',
                  placeholder: 'Enter Rate',
                  hideLabel: true,
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.purchase_order_items.length > currentRowIndex) {
                        const existingPrice = this.dataToPopulate.purchase_order_items[currentRowIndex].rate;
                        
                        // Set the full product object instead of just the product_id
                        if (existingPrice) {
                          field.formControl.setValue(existingPrice); // Set full product object (not just product_id)
                        }
                      }
                    }
                    
                    // Subscribe to value changes to update amount
                    field.formControl.valueChanges.subscribe(data => {
                      if (field.form && field.form.controls && field.form.controls.quantity && data) {
                        const quantity = field.form.controls.quantity.value;
                        const rate = data;
                        if (rate && quantity) {
                          field.form.controls.amount.setValue(parseInt(rate) * parseInt(quantity));
                        }
                      }
                    });
                  }
                }
              },
              {
                type: 'input',
                key: 'discount',
                templateOptions: {
                  type: 'number',
                  placeholder: 'Enter Disc',
                  label: 'Disc',
                  hideLabel: true,
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.purchase_order_items.length > currentRowIndex) {
                        const existingDisc = this.dataToPopulate.purchase_order_items[currentRowIndex].discount;
                        
                        // Set the full product object instead of just the product_id
                        if (existingDisc) {
                          field.formControl.setValue(existingDisc); // Set full product object (not just product_id)
                        }
                      }
                    }
                    field.formControl.valueChanges.subscribe(data => {
                      // Add any logic needed for when discount changes
                    });
                  }
                },
                expressionProperties: {
                }
              },
              {
                type: 'input',
                key: 'print_name',
                templateOptions: {
                  label: 'Print name',
                  placeholder: 'Enter Product Print name',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.purchase_order_items.length > currentRowIndex) {
                        const existingName = this.dataToPopulate.purchase_order_items[currentRowIndex].print_name;
                        
                        // Set the full product object instead of just the product_id
                        if (existingName) {
                          field.formControl.setValue(existingName); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
                }
              },
              {
                type: 'input',
                key: 'mrp',
                templateOptions: {
                  label: 'Mrp',
                  placeholder: 'Mrp',
                  hideLabel: true,
                  disabled: true
                },
              },
              {
                type: 'input',
                key: 'amount',
                templateOptions: {
                  type: 'number',
                  label: 'Amount',
                  placeholder: 'Enter Amount',
                  hideLabel: true,
                  disabled: true
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.purchase_order_items.length > currentRowIndex) {
                        const existingAmount = this.dataToPopulate.purchase_order_items[currentRowIndex].amount;
                        
                        // Set the full product object instead of just the product_id
                        if (existingAmount) {
                          field.formControl.setValue(existingAmount); // Set full product object (not just product_id)
                        }
                      }
                    }
                    field.formControl.valueChanges.subscribe(data => {
                      this.totalAmountCal();
                    });
                  }
                }
                // hooks: {
                //   onInit: (field: any) => {
                //     field.formControl.valueChanges.subscribe(data => {
                //       this.totalAmountCal();
                //     })
                //   }
                // }
              },
              {
                type: 'input',
                key: 'tax',
                templateOptions: {
                  type: "number",
                  label: 'Tax',
                  placeholder: 'Tax',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.purchase_order_items.length > currentRowIndex) {
                        const existingtax = this.dataToPopulate.purchase_order_items[currentRowIndex].tax;
                        
                        // Set the full product object instead of just the product_id
                        if (existingtax) {
                          field.formControl.setValue(existingtax); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
                }
              },
              {
                type: 'input',
                key: 'remarks',
                templateOptions: {
                  label: 'Remarks',
                  placeholder: 'Enter Remarks',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.purchase_order_items.length > currentRowIndex) {
                        const existingRemarks = this.dataToPopulate.purchase_order_items[currentRowIndex].remarks;
                        
                        // Set the full product object instead of just the product_id
                        if (existingRemarks) {
                          field.formControl.setValue(existingRemarks); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
                }
              },
            ]
          },
        },
        // end of purchase_order keys

        // start of order_shipments keys
        
        {
          fieldGroupClassName: "row col-12 m-0 custom-form-card",
          fieldGroup: [
            {
              className: 'col-6 custom-form-card-block',
              fieldGroup: [
                {
                  template: '<div class="custom-form-card-title">  Shipping Details </div>',
                  fieldGroupClassName: "ant-row",
                },
                {
                  fieldGroupClassName: "ant-row",
                  key: 'order_shipments',
                  fieldGroup: [
                    {
                      key: 'destination',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Destination',
                        placeholder: 'Enter Destination',
                      },
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.order_shipments.destination && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.order_shipments.destination);
                          }
                        }
                      }
                    },
                    {
                      key: 'port_of_landing',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Port of Landing',
                        placeholder: 'Enter Port of Landing',
                      },
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.order_shipments.port_of_landing && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.order_shipments.port_of_landing);
                          }
                        }
                      }
                    },
                    {
                        key: 'shipping_mode_id',
                        type: 'select',
                        className: 'col-6',
                        templateOptions: {
                          label: 'Shipping Mode',
                          placeholder: 'Select Shipping Mode',
                          dataKey: 'shipping_mode_id',
                          dataLabel: "name",
                          bindId: true,
                          lazy: {
                            url: 'masters/shipping_modes',
                            lazyOneTime: true
                          }
                        },
                        hooks: {
                          onInit: (field: any) => {
                            if (this.dataToPopulate && this.dataToPopulate.order_shipments.shipping_mode_id && field.formControl) {
                              field.formControl.setValue(this.dataToPopulate.order_shipments.shipping_mode_id);
                            }
                          }
                        }
                      },
                    {
                      key: 'port_of_discharge',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Port of Discharge',
                        placeholder: 'Select Port of Discharge',
                      },
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.order_shipments.port_of_discharge && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.order_shipments.port_of_discharge);
                          }
                        }
                      }
                    },
                    {
                        key: 'shipping_company_id',
                        type: 'select',
                        className: 'col-6',
                        templateOptions: {
                          label: 'Shipping Company',
                          placeholder: 'Select Shipping Company',
                          dataKey: 'shipping_company_id',
                          dataLabel: "name",
                          bindId: true,
                          lazy: {
                            url: 'masters/shipping_companies',
                            lazyOneTime: true
                          }
                        },
                        hooks: {
                          onInit: (field: any) => {
                            if (this.dataToPopulate && this.dataToPopulate.order_shipments.shipping_company_id && field.formControl) {
                              field.formControl.setValue(this.dataToPopulate.order_shipments.shipping_company_id);
                            }
                          }
                        }
                      },
                    {
                      key: 'no_of_packets',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        type: "number",
                        label: 'No. of Packets',
                        placeholder: 'Select No. of Packets',
                      },
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.order_shipments.no_of_packets && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.order_shipments.no_of_packets);
                          }
                        }
                      }
                    },
                    {
                      key: 'weight',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        type: "number",
                        label: 'Weight',
                        placeholder: 'Enter Weight',
                      },
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.order_shipments.weight && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.order_shipments.weight);
                          }
                        }
                      }
                    },
                    {
                      key: 'shipping_tracking_no',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Shipping Tracking No',
                        placeholder: 'Enter Shipping Tracking No',
                        // readonly: true,
                        // disabled: true
                      }
                    },
                    {
                        key: 'shipping_date',
                        type: 'date',
                        // defaultValue: this.nowDate(),
                        className: 'col-6',
                        templateOptions: {
                          type: 'date',
                          label: 'Shipping Date',
                          // required: true
                        }
                      },
                      {
                        key: 'shipping_charges',
                        type: 'input',
                        className: 'col-6',
                        templateOptions: {
                          type: "number",
                          label: 'Shipping Charges.',
                          placeholder: 'Enter Shipping Charges',
                          // required: true
                        },
                        hooks: {
                          onInit: (field: any) => {
                            if (this.dataToPopulate && this.dataToPopulate.order_shipments.shipping_charges && field.formControl) {
                              field.formControl.setValue(this.dataToPopulate.order_shipments.shipping_charges);
                            }
                          }
                          // required: true
                        }
                      }
                  ]
                },
              ]
            },
            {
                className: 'col-6 pb-0',
                fieldGroupClassName: "field-no-bottom-space",
                fieldGroup: [
                  {
                    fieldGroupClassName: "",
                    fieldGroup: [
                      {
                        className: 'col-12 mb-3 custom-form-card-block w-100',
                        fieldGroup: [
                          {
                            template: '<div class="custom-form-card-title"> Billing Details </div>',
                            fieldGroupClassName: "ant-row",
                          },
                          {
                            fieldGroupClassName: "ant-row",
                            key: 'purchase_order_data',
                            fieldGroup: [
                              {
                                key: 'cess_amount',
                                type: 'input',
                                defaultValue: "0",
                                className: 'col-4',
                                templateOptions: {
                                  type: 'number',
                                  label: 'Cess amount',
                                  placeholder: 'Enter Cess amount'
                                },
                                hooks: {
                                  onInit: (field: any) => {
                                    if (this.dataToPopulate && this.dataToPopulate.purchase_order_data && this.dataToPopulate.purchase_order_data.cess_amount && field.formControl) {
                                      field.formControl.setValue(this.dataToPopulate.purchase_order_data.cess_amount);
                                    }
                                    field.formControl.valueChanges.subscribe(data => {
                                      this.totalAmountCal();
  
                                    })
                                  }
                                }
                              },
                              {
                                key: 'advance_amount',
                                type: 'input',
                                className: 'col-4',
                                templateOptions: {
                                  type: 'number',
                                  label: 'Advance amount',
                                  placeholder: 'Enter Advance amount'
                                },
                                hooks: {
                                  onInit: (field: any) => {
                                    if (this.dataToPopulate && this.dataToPopulate.purchase_order_data && this.dataToPopulate.purchase_order_data.advance_amount && field.formControl) {
                                      field.formControl.setValue(this.dataToPopulate.purchase_order_data.advance_amount);
                                    }
                                    field.formControl.valueChanges.subscribe(data => {
                                      this.totalAmountCal();
                                    })
                                  }
                                }
                              },
                              {
                                key: 'taxable',
                                type: 'input',
                                className: 'col-4',
                                templateOptions: {
                                  type: 'input',
                                  label: 'Taxable',
                                  placeholder: 'Enter Taxable'
                                },
                                hooks: {
                                  onInit: (field: any) => {
                                    if (this.dataToPopulate && this.dataToPopulate.purchase_order_data && this.dataToPopulate.purchase_order_data.taxable && field.formControl) {
                                      field.formControl.setValue(this.dataToPopulate.purchase_order_data.taxable);
                                    }
                                  }
                                }
                              },
                              {
                                key: 'tax_amount',
                                type: 'input',
                                defaultValue: "0",
                                className: 'col-4',
                                templateOptions: {
                                  type: 'number',
                                  label: 'Tax amount',
                                  placeholder: 'Enter Tax amount'
                                },
                                hooks: {
                                  onInit: (field: any) => {
                                    if (this.dataToPopulate && this.dataToPopulate.purchase_order_data && this.dataToPopulate.purchase_order_data.tax_amount && field.formControl) {
                                      field.formControl.setValue(this.dataToPopulate.purchase_order_data.tax_amount);
                                    }
                                    field.formControl.valueChanges.subscribe(data => {
                                      this.totalAmountCal();
                                    })
                                  }
                                }
                              },
                            // {
                            //   key: 'round_off',
                            //   type: 'input',
                            //   // defaultValue: "7777700",
                            //   className: 'col-4',
                            //   templateOptions: {
                            //     type: 'input',
                            //     label: 'Round off',
                            //     placeholder: 'Enter Round off',
                            //     // required: true
                            //   }
                            // },
                            {
                              key: 'gst_type',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Gst type',
                                placeholder: 'Select Gst type',
                                dataKey: 'name',
                                dataLabel: "name",
                                lazy: {
                                  url: 'masters/gst_types/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    console.log("gst_type", data);
                                    if (data && data.gst_type_id) {
                                      this.formConfig.model['purchase_order_data']['gst_type_id'] = data.gst_type_id;
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_order_data.gst_type && field.formControl) {
                                    const GstFiled = this.dataToPopulate.purchase_order_data.gst_type
                                    field.formControl.setValue(GstFiled);
                                  }
                                }
                              }
                            },
                            {
                              key: 'payment_term',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Payment term',
                                placeholder: 'Select Payment term',
                                dataKey: 'name',
                                dataLabel: "name",
                                lazy: {
                                  url: 'vendors/vendor_payment_terms/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    if (data && data.payment_term_id) {
                                      this.formConfig.model['purchase_order_data']['payment_term_id'] = data.payment_term_id;
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_order_data.payment_term_id && field.formControl) {
                                    const PaymentField = this.dataToPopulate.purchase_order_data.payment_term_id
                                    field.formControl.setValue(PaymentField);
                                  }
                                }
                              }
                            },
                            {
                              key: 'ledger_account',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                dataKey: 'name',
                                dataLabel: "name",
                                label: 'Ledger account',
                                placeholder: 'Select Ledger account',
                                lazy: {
                                  url: 'customers/ledger_accounts/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    console.log("ledger_account", data);
                                    if (data && data.ledger_account_id) {
                                      this.formConfig.model['purchase_order_data']['ledger_account_id'] = data.ledger_account_id;
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_order_data.ledger_account && field.formControl) {
                                    const LedgerField = this.dataToPopulate.purchase_order_data.ledger_account
                                    field.formControl.setValue(LedgerField);
                                  }
                                }
                              }
                            },
                            {
                              key: 'order_status',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Order status Type',
                                dataKey: 'order_status_id',
                                dataLabel: 'status_name',
                                placeholder: 'Select Order status type',
                                lazy: {
                                  url: 'masters/order_status/',
                                  lazyOneTime: true
                                },
                                expressions: {
                                  hide: '!model.purchase_order_id'
                                },
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    console.log("order_status", data);
                                    if (data && data.order_status_id) {
                                      this.formConfig.model['purchase_order_data']['order_status_id'] = data.order_status_id;
                                    }
                                  });
                                }
                              }
                            },
                            {
                              key: 'item_value',
                              type: 'input',
                              defaultValue: "0",
                              className: 'col-4',
                              templateOptions: {
                                type: 'input',
                                label: 'Items value',
                                placeholder: 'Enter Item value',
                                readonly: true
                                // required: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // Set the initial value from dataToPopulate if available
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_order_data && this.dataToPopulate.purchase_order_data.item_value && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.purchase_order_data.item_value);
                                  }
                                }
                              }
                            },
                            {
                              key: 'dis_amt',
                              type: 'input',
                              // defaultValue: "777770",
                              className: 'col-4',
                              templateOptions: {
                                type: 'input',
                                label: 'Discount Amt',
                                readonly: true,
                                placeholder: 'Enter Discount Amt',
                                // required: true
                              
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // Set the initial value from dataToPopulate if available
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_order_data && this.dataToPopulate.purchase_order_data.dis_amt && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.purchase_order_data.dis_amt);
                                  }
                                }
                              }
                            },
                            {
                              key: 'total_amount',
                              type: 'input',
                              defaultValue: "0",
                              className: 'col-4',
                              templateOptions: {
                                type: 'input',
                                label: 'Total amount',
                                placeholder: 'Enter Total amount',
                                readonly: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // Set the initial value from dataToPopulate if available
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_order_data && this.dataToPopulate.purchase_order_data.total_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.purchase_order_data.total_amount);
                                  }
                                }
                              }
                            },
                          ]
                        },
                      ]
                    },
                {
                    className: 'col-12 custom-form-card-block w-100',
                    fieldGroup: [
                      {
                        template: '<div class="custom-form-card-title"> Order Attachments </div>',
                        fieldGroupClassName: "ant-row",
                      },
                      {
                        key: 'order_attachments',
                        type: 'file',
                        className: 'ta-cell col-12 custom-file-attachement',
                        props: {
                          "displayStyle": "files",
                          "multiple": true
                        },
                        hooks: {
                          onInit: (field: any) => {
                            if (this.dataToPopulate && this.dataToPopulate.order_attachments && field.formControl) {
                              field.formControl.setValue(this.dataToPopulate.order_attachments);
                            }
                          }
                        }
                      }
                    ]
                  }
                ]
              },

            ]

          }
        ]
        }
        ]
        }
        }

totalAmountCal() {

const data = this.formConfig.model;
if (data) {
const products = data.purchase_order_items || [];
let totalAmount = 0;
let totalDiscount = 0;
let totalRate = 0;
let total_amount = 0;
if (products) {
products.forEach(product => {
if (product) {
  if (product.amount)
    totalAmount += parseFloat(product.amount || 0);
  if (product.discount)
    totalDiscount += parseFloat(product.discount || 0);
}
// totalRate += parseFloat(product.rate) * parseFloat(product.quantity || 0);
});
}


if (this.purchaseForm && this.purchaseForm.form && this.purchaseForm.form.controls) {
const controls: any = this.purchaseForm.form.controls;
controls.purchase_order_data.controls.item_value.setValue(totalAmount);
controls.purchase_order_data.controls.dis_amt.setValue(totalDiscount);
// const doc_amount = (totalAmount + parseFloat(data.purchase_order_data.cess_amount || 0) + parseFloat(data.purchase_order_data.tax_amount || 0)) - totalDiscount;
// controls.purchase_order_data.controls.doc_amount.setValue(doc_amount);
const cessAmount = parseFloat(data.purchase_order_data.cess_amount || 0);
const taxAmount = parseFloat(data.purchase_order_data.tax_amount || 0);
const advanceAmount = parseFloat(data.purchase_order_data.advance_amount || 0);
const total_amount = (totalAmount + cessAmount + taxAmount) - totalDiscount - advanceAmount;
controls.purchase_order_data.controls.total_amount.setValue(total_amount);


}
//const 

// const cess_amount = data;
// if (cess_amount && doc_amount) {
//   field.form.controls.doc_amount.setValue(parseInt(doc_amount) - parseInt(cess_amount));
// }
}
}

}
