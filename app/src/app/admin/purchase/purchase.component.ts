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
  @ViewChild(PurchaseListComponent) PurchaseListComponent!: PurchaseListComponent;
  unitOptionOfProduct: any[] | string = []; // Initialize as an array by default
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
    this.loadQuickpackOptions();
    // set purchase_order default value
    this.formConfig.model['purchase_order_data']['order_type'] = 'purchase_order';

    // to get PurchaseOrder number for save
    this.getOrderNo();
    this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[7].hide =true;
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
        this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[7].hide = false;
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
    this.PurchaseListComponent?.refreshTable();
  }

//=====================================================
quickpackOptions: any[] = []; // To store available Quickpack options
selectedQuickpack: string = ''; // Selected Quickpack value

loadQuickpackOptions() {
  console.log("We are in method...")
  this.http.get('sales/quick_pack/') // Replace with your API endpoint
    .subscribe((response: any) => {
      this.quickpackOptions = response.data || []; // Adjust based on API response
      console.log("quickpackOptions : ", this.quickpackOptions);
    });
}


loadQuickpackProducts() {
  console.log("quick pack id : ", this.selectedQuickpack)
  if (!this.selectedQuickpack) {
    console.log('Please select a Quickpack!');
    return;
  }

  this.http.get(`sales/quick_pack/${this.selectedQuickpack}`)
    .subscribe((response: any) => {
      console.log("response : ", response.data.quick_pack_data_items);
      const quickPackDataItems = response.data.quick_pack_data_items || [];

      if (quickPackDataItems.length === 0) {
        console.log('No items found in the selected Quickpack!');
        return;
      }
      // Populate `sale_order_items` with Quickpack data
      this.formConfig.model.purchase_order_items = quickPackDataItems.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        print_name: item.product.print_name,
        rate: item.product.mrp,
        discount: item.product.dis_amount,
        unit_options_id: item.product.unit_options

      }));

      // Trigger form change detection (if needed)
      if (this.purchaseForm) {
        console.log("we are inside : ", this.purchaseForm.form);
        this.purchaseForm.form.controls.purchase_order_items.patchValue(this.formConfig.model.purchase_order_items);
        console.log("After method ...")
      }

      console.log('Sale Order Items populated:', this.formConfig.model.purchase_order_items);
    });
}
//=====================================================

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
              className: 'col-md-9 col-sm-8 col-12 p-0',
              fieldGroupClassName: "ant-row mx-0 row align-items-end mt-2",
              fieldGroup: [
                {
                  key: 'purchase_type',
                  type: 'select',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Purchase type',
                    dataKey: 'purchase_type_id',
                    dataLabel: "name",
                    options: [],
                    lazy: {
                      url: 'masters/purchase_types/',
                      lazyOneTime: true
                    }
                  },
                  hooks: {
                    onInit: (field: any) => {
                      // Fetch data from the API
                      const lazyUrl = field.templateOptions.lazy.url;
                      this.http.get(lazyUrl).subscribe((response: any) => {
                        const purchaseTypes = response.data;
                
                        // Populate the options dynamically
                        field.templateOptions.options = purchaseTypes;
                
                        // Find the option with name "Standard Purchase"
                        const defaultOption = purchaseTypes.find(
                          (option: any) => option.name === 'Standard Purchase'
                        );
                
                        // Set the default value if "Standard Purchase" exists
                        if (defaultOption) {
                          field.formControl.setValue(defaultOption);
                        }
                      });
                
                      // Handle value changes
                      field.formControl.valueChanges.subscribe((data: any) => {
                        console.log("purchase_type", data);
                        if (data && data.purchase_type_id) {
                          this.formConfig.model['purchase_order_data']['purchase_type_id'] = data.purchase_type_id;
                        }
                      });
                    },
                    onChanges: (field: any) => {
                      if (this.dataToPopulate && this.dataToPopulate.purchase_order_data.purchase_type && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.purchase_order_data.purchase_type);
                      }
                    }
                  }
                },
                {
                  key: 'vendor',
                  type: 'select',
                  className: 'col-md-4 col-sm-6 col-12',
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
                  key: 'order_no',
                  type: 'input',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Order no',
                    placeholder: 'Enter Order No',
                    required: true,
                    // readonly: true
                    disabled: true
                  },
                  hooks: {
                    onInit: (field: any) => {}
                  }
                },
                {
                  key: 'delivery_date',
                  type: 'date',
                  defaultValue: this.nowDate(),
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    type: 'date',
                    label: 'Delivery date',
                    readonly: true,
                    required: true
                  }
                },
                {
                  key: 'order_date',
                  type: 'date',
                  defaultValue: this.nowDate(),
                  className: 'col-4',
                  templateOptions: {
                    type: 'date',
                    label: 'Order date',
                    readonly: true,
                    required: true
                  }
                },
                {
                  key: 'ref_date',
                  type: 'date',
                  defaultValue: this.nowDate(),
                  className: 'col-4',
                  templateOptions: {
                    type: 'date',
                    label: 'Ref date',
                    placeholder: 'Select Ref date',
                    required: true,
                    readonly: true
                  }
                },
                {
                  key: 'ref_no',
                  type: 'input',
                  className: 'col-4',
                  templateOptions: {
                    type: 'input',
                    label: 'Ref No',
                    placeholder: 'Enter Ref No',
                    required: true,
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
                  key: 'tax',
                  type: 'select',
                  className: 'col-4',
                  templateOptions: {
                    label: 'Tax',
                    required: true,
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
              ]
            },
            {
              className: 'col-md-3 col-sm-4 col-12 p-0 inline-form-fields',
              fieldGroupClassName: "ant-row row mx-0 mt-2",
              fieldGroup: [
                {
                  key: 'item_value',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Items Total',
                    disabled: true,
                  }, 
                  defaultValue: '0.00'                    
                },
                // {
                //   key: 'texable_amt',
                //   type: 'text',
                //   className: 'col-12',
                //   templateOptions: {
                //     label: 'Texable Amt',
                //     required: false,                    
                //   },
                //   defaultValue: '0.00'
                // },
                {
                  key: 'cess_amount',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Cess Amount',
                    required: false
                  },
                  defaultValue: '0.00',
                },
                {
                  key: 'tax_amount',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Tax Amount',
                    required: false
                  },
                  defaultValue: '0.00',
                },
                // {
                //   key: 'item_value',
                //   type: 'text',
                //   className: 'col-12',
                //   templateOptions: {
                //     label: 'Total Value',
                //      required: false
                //   },
                //      defaultValue: '0.00'
                // },
                {
                  key: 'dis_amt',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Discount Amount',
                     required: false
                  },
                  defaultValue: '0.00'

                },
                {
                  key: 'advance_amount',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Advance Amount',
                     required: false
                  },
                  defaultValue: '0.00'
                },
                {
                  key: 'total_amount',
                  type: 'text',
                  className: 'col-12 product-total',
                  templateOptions: {
                    label: ' ',
                    required: false,
                    placeholder: 'Total Amount',
                    disabled: true,
                  },
                  defaultValue: '0.00'
                },                                                      
              ]
            },
          ]
        },
        // end of purchase_order
        {
          key: 'purchase_order_items',
          type: 'repeat',
          className: 'custom-form-list product-table',
          templateOptions: {
            // title: 'Products',
            addText: 'Add Product',
            tableCols: [
              { 
                name: 'selectItem', 
                label: '', 
                type: 'checkbox'
              }, 
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
                key: 'selectItem',
                type: 'checkbox',
                defaultValue: false,
                templateOptions: {
                    hideLabel: true,
                },
                expressionProperties: {
                    'templateOptions.hidden': () => !(this.PurchaseOrderEditID),
                    'templateOptions.disabled': (model) => model.invoiced === 'YES' || !this.PurchaseOrderEditID
                  }
              }, 
              {
                key: 'product',
                type: 'select',
                templateOptions: {
                  label: 'Product',
                  dataKey: 'product_id',
                  hideLabel: true,
                  dataLabel: 'name',
                  options: [],
                  required: true,
                  placeholder: 'product',
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
                      
                      // Subscribe to value changes of the field
                      // ***Size dropdown will populate with available sizes when product in selected***
                      field.formControl.valueChanges.subscribe(selectedProductId => {
                        const product = this.formConfig.model.purchase_order_items[currentRowIndex]?.product;
                        console.log("Product id : ", product)
                        // Ensure the product exists before making an HTTP request
                        if (product?.product_id) {
                          this.http.get(`products/product_variations/?product_id=${product.product_id}`).subscribe((response: any) => {
                            if (response.data.length > 0) {
                              const sizeField = parentArray.fieldGroup.find((f: any) => f.key === 'size');
                              const colorField = parentArray.fieldGroup.find((f: any) => f.key === 'color');
                              // Clear previous options for both size and color fields before adding new ones
                              if (sizeField) sizeField.templateOptions.options = [];
                              if (colorField) colorField.templateOptions.options = [];
                              let availableSizes, availableColors;
                              // Check if response data is non-empty for size
                              if (response.data && response.data.length > 0) {
                                availableSizes = response.data.map((variation: any) => ({
                                  label: variation.size?.size_name || '----',
                                  value: {
                                    size_id: variation.size?.size_id || null,
                                    size_name: variation.size?.size_name || '----'
                                  }
                                }));
                                availableColors = response.data.map((variation: any) => ({
                                  label: variation.color?.color_name || '----',
                                  value: {
                                    color_id: variation.color?.color_id || null,
                                    color_name: variation.color?.color_name || '----'
                                  }
                                }));
                                // Enable and update the size field options if sizes are available
                                if (sizeField) {
                                  sizeField.formControl.enable(); // Ensure the field is enabled
                                  sizeField.templateOptions.options = availableSizes.filter((item, index, self) => index === self.findIndex((t) => t.value.size_id === item.value.size_id)); // Ensure unique size options
                                }
                              } else {
                                // Clear options and keep the fields enabled, without any selection if no options exist
                                if (sizeField) {
                                  sizeField.templateOptions.options = [];
                                }
                                if (colorField) {
                                  colorField.templateOptions.options = [];
                                }
                              }
                            } else {
                              console.log(`For Product: ${product.name}  - No Size and Colors are available setting those to Null**`)
                              this.formConfig.model.purchase_order_items[currentRowIndex]['size_id'] = null;
                              this.formConfig.model.purchase_order_items[currentRowIndex]['color_id'] = null;
                            }
                          });
                        } else {
                          console.error('Product not selected or invalid.');
                        }
                      });
                      // ***Product Info Text when product is selected code***
                      field.formControl.valueChanges.subscribe(async selectedProductId => {
                        const product = this.formConfig.model.purchase_order_items[currentRowIndex]?.product;
                        this.http.get(`products/products_get/?product_id=${product.product_id}`).subscribe({
                          next: (response: any) => {
                            // Handle the successful response here
                            const unitInfo = response.data[0] || {};
                            // Using optional chaining and nullish coalescing to assign values
                            const unitOption = unitInfo.unit_options?.unit_name ?? 'NA';
                            const stockUnit = unitInfo.stock_unit?.stock_unit_name ?? 'NA';
                            const packUnit = unitInfo.pack_unit?.unit_name ?? 'NA';
                            const gPackUnit = unitInfo.g_pack_unit?.unit_name ?? 'NA';
                            const packVsStock = unitInfo.pack_vs_stock ?? 0;
                            const gPackVsPack = unitInfo.g_pack_vs_pack ?? 0;
                            // Regular expression to match 'Stock Unit' 'Stock Pack Gpack Unit' & 'Stock Pack Unit'.
                            const stockUnitReg = /\b[sS][tT][oO][cC][kK][_ ]?[uU][nN][iI][tT]\b/g
                            const GpackReg = /\b(?:[sS]tock[_ ]?[pP]ack[_ ]?)?[gG][pP][aA][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;
                            const stockPackReg = /\b[sS][tT][oO][cC][kK][_ ]?[pP][aA][cC][kK][_ ]?[uU][nN][iI][tT]\b/g
                            // Check which pattern matches unit_name
                            let unitData = ''
                            if (stockUnitReg.test(unitOption)) {
                              unitData = `
                                      <span style="color: red;">Stock Unit:</span> 
                                      <span style="color: blue;">${stockUnit}</span> | &nbsp;`
                            } else if (GpackReg.test(unitOption)) {
                              unitData = `
                                      <span style="color: red;">Stock Unit:</span> 
                                      <span style="color: blue;">${stockUnit}</span> |
                                      <span style="color: red;">Pck Unit:</span> 
                                      <span style="color: blue;">${packUnit}</span> |
                                      <span style="color: red;">PackVsStock:</span> 
                                      <span style="color: blue;">${packVsStock}</span> |
                                      <span style="color: red;">GPackUnit:</span> 
                                      <span style="color: blue;">${gPackUnit}</span> |
                                      <span style="color: red;">GPackVsStock:</span> 
                                      <span style="color: blue;">${gPackVsPack}</span> | &nbsp;`
                            } else if (stockPackReg.test(unitOption)) {
                              unitData = `
                                      <span style="color: red;">Stock Unit:</span> 
                                      <span style="color: blue;">${stockUnit}</span> |
                                      <span style="color: red;">Pack Unit:</span> 
                                      <span style="color: blue;">${packUnit}</span> |
                                      <span style="color: red;">PackVsStock:</span> 
                                      <span style="color: blue;">${packVsStock}</span> | &nbsp;`
                            } else {
                              console.log('No Unit Option match found');
                            }
                            // Check if a valid product is selected
                            if (product?.product_id) {
                              this.formConfig.model.purchase_order_items[currentRowIndex].product_id = product.product_id;
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
                                        ${unitData}`;
                                cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
                                this.unitOptionOfProduct = unitData; // save this data to use in color and size
                                console.log(`Product :  Product Info Updated for ${product.name}**`)
                              }
                            } else {
                              console.log(`No valid product selected for Row ${currentRowIndex}.`);
                            }
                          },
                          error: (err) => {
                            // Handle errors here
                          }
                        });
                      });
                    } else {
                      console.error('Parent array is undefined or not accessible');
                    };
                    // ***Product Details Auto Fill Code***
                    field.formControl.valueChanges.subscribe(data => {
                      this.productOptions = data;
                      console.log("Data in products : ", data)
                      if (field.form && field.form.controls && field.form.controls.code && data && data.code) {
                        field.form.controls.code.setValue(data.code)
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
                  label: 'Size',
                  dataKey: 'size_id',
                  hideLabel: true,
                  dataLabel: 'size_name',
                  options: [],
                  required: false,
                  placeholder: 'size',
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
                      //**End of Size selection part */
                      // Subscribe to value changes of the size field
                      field.formControl.valueChanges.subscribe(selectedSizeId => {
                        const product = this.formConfig.model.purchase_order_items[currentRowIndex]?.product;
                        const size = this.formConfig.model.purchase_order_items[currentRowIndex]?.size;
                        const size_id = size?.size_id || null
                        // Make sure size exists, if exists then assign the drop down options for 'color' filed.
                        if (size) {
                          let url = `products/product_variations/?product_id=${product.product_id}&size_id=${size.size_id}`
                          if (size_id == null) {
                            url = `products/product_variations/?product_id=${product.product_id}&size_isnull=True`
                          }
                          // Fetch available colors based on the selected size
                          this.http.get(url).subscribe((response: any) => {
                            const availableColors = response.data.map((variation: any) => {
                              return {
                                label: variation.color?.color_name || '----', // Use 'color_name' as the label
                                value: {
                                  color_id: variation.color?.color_id || null,
                                  color_name: variation.color?.color_name || '----'
                                }
                              };
                            });
                            // Filter unique colors (optional, if there's a chance of duplicate colors)
                            const uniqueColors = availableColors.filter((item, index, self) => index === self.findIndex((t) => t.value.color_id === item.value.color_id));
                            // Now, update the color field for the current row
                            const colorField = parentArray.fieldGroup.find((f: any) => f.key === 'color');
                            if (colorField) {
                              // colorField.formControl.setValue(null); // Reset color field value
                              colorField.templateOptions.options = []
                              colorField.templateOptions.options = uniqueColors; // Update the options for the 'color' field
                            }
                          });
                        } else {
                          console.log('Size not selected or invalid.');
                        };
                        // -----------------Product Info------------------------
                        if (product.product_id && selectedSizeId != undefined) {
                          let url = `products/product_variations/?product_id=${product.product_id}&size_id=${size_id}`;
                          if (size_id === null) {
                            url = `products/product_variations/?product_id=${product.product_id}&size_isnull=True`
                          }
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
                              if (cardWrapper && data.data[0]) {
                                // Remove existing product info if present
                                cardWrapper.querySelector('.center-message')?.remove();
                                // Display fetched product variation info
                                const productInfoDiv = document.createElement('div');
                                productInfoDiv.classList.add('center-message');
                                productInfoDiv.innerHTML = `
                                        <span style="color: red;">Product Info:</span>
                                        <span style="color: blue;">${data.data[0]?.product.name|| 'NA'}</span> |
                                        <span style="color: red;">Balance:</span>
                                        <span style="color: blue;">${totalBalance}</span> |
                                        ${this.unitOptionOfProduct} `;
                                cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
                                console.log("Size :  Product Info Updated**")
                              }
                            },
                            (error) => {
                              console.error("Error fetching data:", error);
                            });
                        } else {
                          console.log(`No valid product or size selected for Row ${currentRowIndex}.`);
                        }
                        //----------------- End of product info-----------------
                      });
                    } else {
                      console.error('Parent array is undefined or not accessible');
                    };
                  },
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (this.formConfig && this.formConfig.model) {
                        this.formConfig.model['purchase_order_items'][index]['size_id'] = data?.size_id;
                      } else {
                        console.error('Form config or color model is not defined.');
                      }
                    });
                  }
                }
              }, 
              {
                key: 'color',
                type: 'select',
                templateOptions: {
                  label: 'Color',
                  dataKey: 'color_id',
                  hideLabel: true,
                  dataLabel: 'color_name',
                  options: [],
                  required: false,
                  placeholder: 'color',
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
                      field.formControl.valueChanges.subscribe(selectedColorId => {
                        const product = this.formConfig.model.purchase_order_items[currentRowIndex]?.product;
                        const size = this.formConfig.model.purchase_order_items[currentRowIndex]?.size;
                        const color = this.formConfig.model.purchase_order_items[currentRowIndex]?.color;
                        const product_id = product?.product_id;
                        // Check if product_id, size_id, and color_id exist
                        if (product_id && size && color) {
                          const color_id = color?.color_id || null;
                          let url = `products/product_variations/?product_id=${product.product_id}`;
                          if (color.color_id === null) {
                            url += '&color_isnull=True';
                          } else if (color.color_id) {
                            url += `&color_id=${color.color_id}`;
                          }
                          if (size.size_id === null) {
                            url += '&size_isnull=True';
                          } else if (size.size_id) {
                            url += `&size_id=${size.size_id}`;
                          }
                          this.formConfig.model.purchase_order_items[currentRowIndex].color_id = color.color_id;
                          // Call the API using HttpClient (this.http.get)
                          this.http.get(url).subscribe(
                            (data: any) => {
                              const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
                              if (cardWrapper && data.data[0]) {
                                cardWrapper.querySelector('.center-message')?.remove();
                                const productInfoDiv = document.createElement('div');
                                productInfoDiv.classList.add('center-message');
                                productInfoDiv.innerHTML = `
                                        <span style="color: red;">Product Info:</span>
                                        <span style="color: blue;">${data.data[0].product.name}</span> |
                                        <span style="color: red;">Size:</span>
                                        <span style="color: blue;">${data.data[0].size?.size_name || 'NA'}</span> |
                                        <span style="color: red;">Color:</span>
                                        <span style="color: blue;">${data.data[0].color?.color_name || 'NA'}</span> |
                                        <span style="color: red;">Balance:</span>
                                        <span style="color: blue;">${data.data[0].quantity}</span> |
                                        ${this.unitOptionOfProduct}`;
                                cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
                                console.log("Color :  Product Info Updated**")
                              } else {
                                console.log('Color : Data not available.')
                              }
                            },
                            (error) => {
                              console.error("Error fetching data:", error);
                            });
                        } else {
                          console.log(`No valid Color selected for :${product.name } at Row ${currentRowIndex}.`);
                          console.log({
                            product: product?.name,
                            size: size?.size_name,
                            color: color?.color_name,
                            selectedColorId: selectedColorId
                          })
                          if (color?.color_id === undefined) {
                            this.formConfig.model.purchase_order_items[currentRowIndex]['color'] = null
                          }
                        }
                      });
                    }
                  },
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (this.formConfig && this.formConfig.model) {
                        this.formConfig.model['purchase_order_items'][index]['color_id'] = data?.color_id;
                      } else {
                        console.error('Form config or color model is not defined.');
                      }
                    });
                  }
                }
              }, 
              {
                type: 'input',
                key: 'code',
                templateOptions: {
                  label: 'Code',
                  placeholder: 'code',
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
                key: 'quantity',
                //defaultValue: 1,
                templateOptions: {
                  type: 'number',
                  label: 'Qty',
                  placeholder: 'Qty',
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
                      this.totalAmountCal();
                      // Add any logic needed for when discount changes
                    });
                  }
                },
                expressionProperties: {
                }
              },
              {
                type: 'input',
                key: 'amount',
                templateOptions: {
                  type: 'number',
                  label: 'Amount',
                  placeholder: 'Amount',
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
                key: 'print_name',
                templateOptions: {
                  label: 'Print name',
                  placeholder: 'name',
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
                type: 'select',
                key: 'unit_options_id',
                templateOptions: {
                  label: 'Unit',
                  placeholder: 'Unit',
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
                key: 'total_boxes',
                templateOptions: {
                type: 'number',
                  label: 'Total Boxes',
                  placeholder: 'Boxes',
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
          className: 'tab-form-list px-3',
          type: 'tabs',
          fieldGroup: [
            {
              className: 'col-12 px-0 pt-3',
              props: {
                label: 'Billing Details'
              },
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      className: 'col-12 mb-3 custom-form-card-block w-100',
                      fieldGroup: [
                        // {
                        //   template: '<div class="custom-form-card-title">  </div>',
                        //   fieldGroupClassName: "ant-row",
                        // },
                        {
                          fieldGroupClassName: "ant-row",
                          key: 'purchase_order_data',
                          fieldGroup: [
                            {
                              key: 'tax_amount',
                              type: 'input',
                              defaultValue: "0",
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                            {
                              key: 'cess_amount',
                              type: 'input',
                              defaultValue: "0",
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                              templateOptions: {
                                label: 'Gst type',
                                placeholder: 'Select Gst type',
                                dataKey: 'gst_type_id', // Assuming gst_type_id is the key you want to use
                                dataLabel: "name",
                                lazy: {
                                  url: 'masters/gst_types/',
                                  lazyOneTime: true
                                },
                                // required: true // Uncomment if required
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                              templateOptions: {
                                label: 'Payment term',
                                placeholder: 'Select Payment term',
                                dataKey: 'payment_term_id', // Assuming payment_term_id is the key for the selected value
                                dataLabel: 'name',
                                lazy: {
                                  url: 'vendors/vendor_payment_terms/',
                                  lazyOneTime: true
                                },
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                              templateOptions: {
                                label: 'Ledger account',
                                placeholder: 'Select Ledger account',
                                dataKey: 'ledger_account_id', // Assuming ledger_account_id is the key for the selected value
                                dataLabel: 'name',
                                lazy: {
                                  url: 'customers/ledger_accounts/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onInit: (field: any) => {                           
                                  // Subscribe to value changes
                                  field.formControl.valueChanges.subscribe(data => {
                                    if (data && data.ledger_account_id) {
                                      this.formConfig.model['purchase_order_data']['ledger_account_id'] = data.ledger_account_id; // Update the model with the selected ledger_account_id
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                              templateOptions: {
                                label: 'Order status',
                                dataKey: 'order_status_id',
                                dataLabel: 'status_name',
                                placeholder: 'Select Order status type',
                                lazy: {
                                  url: 'masters/order_status/',
                                  lazyOneTime: true
                                },
                                expressions: {
                                  hide: '!model.purchase_order_data_id',
                                },
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    //console.log("ledger_account", data);
                                    if (data && data.order_status_id) {
                                      this.formConfig.model['purchase_order_data']['order_status_id'] = data.order_status_id;
                                    }
                                  });
                                }
                              }
                            },
                            // {
                            //   key: 'item_value',
                            //   type: 'input',
                            //   defaultValue: "0",
                            //   className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                            //   templateOptions: {
                            //     type: 'input',
                            //     label: 'Items value',
                            //     placeholder: 'Enter Item value',
                            //     readonly: true
                            //     // required: true
                            //   },
                            //   hooks: {
                            //     onInit: (field: any) => {
                            //       // Set the initial value from dataToPopulate if available
                            //       if (this.dataToPopulate && this.dataToPopulate.purchase_order_data && this.dataToPopulate.purchase_order_data.item_value && field.formControl) {
                            //         field.formControl.setValue(this.dataToPopulate.purchase_order_data.item_value);
                            //       }
                            //     }
                            //   }
                            // },
                            {
                              key: 'dis_amt',
                              type: 'input',
                              // defaultValue: "777770",
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                              templateOptions: {
                                type: 'input',
                                label: 'Overall Discount',
                                placeholder: 'Enter Discount amount',
                                readonly: true
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                            }   
                          ]
                        },
                      ]
                    }                 
                  ]
                }
              ]
            },
            {
              className: 'col-12 custom-form-card-block px-0 pt-3',
              props: {
                label: 'Shipping Details'
              },
              fieldGroup: [
                // {
                //   template: '<div class="custom-form-card-title">   </div>',
                //   fieldGroupClassName: "ant-row",
                // },
                {
                  fieldGroupClassName: "ant-row",
                  key: 'order_shipments',
                  fieldGroup: [
                    {
                      key: 'destination',
                      type: 'input',
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: {
                        label: 'Shipping Tracking No.',
                        placeholder: 'Enter Shipping Tracking No.',
                        readonly: true
                      }
                    },
                    {
                      key: 'shipping_date',
                      type: 'date',
                      // defaultValue: this.nowDate(),
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: {
                        type: 'date',
                        label: 'Shipping Date',
                        // required: true
                      }
                    },
                    {
                      key: 'shipping_charges',
                      type: 'input',
                      className: 'col-lg-3 col-md-4 col-sm-6 col-12',
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
                      }
                    }
                  ]
                },
              ]
            },
            {
              className: 'col-12 px-0 pt-3',
              props: {
                label: 'Order Attachments'
              },
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      className: 'col-12 custom-form-card-block w-100 p-0',
                      fieldGroup: [
                        // {
                        //   template: '<div class="custom-form-card-title"> Order Attachments </div>',
                        //   fieldGroupClassName: "ant-row",
                        // },
                        {
                          key: 'order_attachments',
                          type: 'file',
                          className: 'ta-cell col-12 col-md-6 custom-file-attachement',
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
                }
              ]
            },
            {
              className: 'col-12 custom-form-card-block px-0 pt-3',
              props: {
                label: 'Vendor Details'
              },
              fieldGroup: [
                // {
                //   template: '<div class="custom-form-card-title">   </div>',
                //   fieldGroupClassName: "ant-row",
                // },
                {
                  fieldGroupClassName: "ant-row",
                  key: 'purchase_order_data',
                  fieldGroup: [
                    {
                      key: 'vendor_agent',
                      type: 'select',
                      className: 'col-md-4 col-sm-6 col-12',
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
                      key: 'email',
                      type: 'input',
                      className: 'col-md-4 col-sm-6 col-12',
                      templateOptions: {
                        type: 'input',
                        label: 'Email',
                        placeholder: 'Enter Email'
                      },
                    },
                    {
                      key: 'billing_address',
                      type: 'textarea',
                      className: 'col-4',
                      templateOptions: {
                        label: 'Billing address',
                        placeholder: 'Enter Billing address'
                      },
                    },
                    {
                      key: 'shipping_address',
                      type: 'textarea',
                      className: 'col-4',
                      templateOptions: {
                        label: 'Shipping address',
                        placeholder: 'Enter Shipping address'
                      },
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
