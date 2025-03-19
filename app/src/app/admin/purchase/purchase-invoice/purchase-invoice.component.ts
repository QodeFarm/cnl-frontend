import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { distinctUntilChanged } from 'rxjs/operators';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { PurchaseInvoiceListComponent } from './purchase-invoice-list/purchase-invoice-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CustomFieldHelper } from '../../utils/custom_field_fetch';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { calculateTotalAmount, displayInformation, getUnitData, sumQuantities } from 'src/app/utils/display.utils';

@Component({
  selector: 'app-purchase-invoice',
  standalone: true,
  imports: [AdminCommmonModule, PurchaseInvoiceListComponent],
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss']
})

export class PurchaseInvoiceComponent {
  @ViewChild('purchaseinvoiceForm', { static: false }) purchaseinvoiceForm: TaFormComponent | undefined;
  invoiceNumber: any;
  showPurchaseInvoiceList: boolean = false;
  showForm: boolean = false;
  PurchaseInvoiceEditID: any;
  productOptions: any;
  @ViewChild(PurchaseInvoiceListComponent) PurchaseInvoiceListComponent!: PurchaseInvoiceListComponent;

  unitOptionOfProduct: any[] | string = []; // Initialize as an array by default
  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

//=====================================================================
  tables: string[] = ['Sale Order', 'Sale Invoice', 'Sale Return', 'Purchase Order', 'Purchase Invoice', 'Purchase Return'];

  // This will store available tables excluding the current one
  availableTables: string[] = [];

  // Selected table from dropdown
  selectedTable: string;

  // Variable to store current table name
  currentTable: string = 'Purchase Invoice';

  fieldMapping = {
    'Sale Invoice': {
      sourceModel: 'purchase_invoice_orders',  // Specify the source model
      targetModel: 'sale_invoice_order', // Specify the target model
      // Indicate nested fields with model mappings
      nestedModels: {
        purchase_invoice_items: 'sale_invoice_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Sale Return': {
      sourceModel: 'purchase_invoice_orders',  // Specify the source model
      targetModel: 'sale_return_order',  // Specify the target model
      // Nested mappings
      nestedModels: {
        purchase_invoice_items: 'sale_return_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Sale Order': {
      sourceModel: 'purchase_invoice_orders',
      targetModel: 'sale_order',
      nestedModels: {
        purchase_invoice_items: 'sale_order_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Purchase Order': {
      sourceModel: 'purchase_invoice_orders',
      targetModel: 'purchase_order',
      nestedModels: {
        purchase_invoice_items: 'purchase_order_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Purchase Return': {
      sourceModel: 'purchase_invoice_orders',
      targetModel: 'purchase_return_orders',
      nestedModels: {
        purchase_invoice_items: 'purchase_return_items',
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
    
    // Determine the target route based on the selected table
    const targetRoute = 
      this.selectedTable === 'Sale Invoice' ? 'sales/salesinvoice' :
      this.selectedTable === 'Sale Return' ? 'sales/sale-returns' :
      this.selectedTable === 'Sale Order' ? 'sales' :
      this.selectedTable === 'Purchase Order' ? 'purchase' :
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

    this.showPurchaseInvoiceList = false;
    this.showForm = false;
    this.PurchaseInvoiceEditID = null;
    // set form config
    this.setFormConfig();
    this.checkAndPopulateData();
    this.loadQuickpackOptions();

    //custom fields logic...
    CustomFieldHelper.fetchCustomFields(this.http, 'purchase_invoice', (customFields: any, customFieldMetadata: any) => {
      CustomFieldHelper.addCustomFieldsToFormConfig_2(customFields, customFieldMetadata, this.formConfig);
    });
    // set purchase_order default value
    this.formConfig.model['purchase_invoice_orders']['order_type'] = 'purchase_invoice';

    // to get PurchaseOrder number for save
    this.getInvoiceNo();
    this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[7].hide =true;  //Hiding order status in create field
  }

  checkAndPopulateData() {
    // Check if data has already been populated
    if (this.dataToPopulate === undefined) {
      // Subscribe to route params and history state data
      this.route.paramMap.subscribe(params => {
        // Retrieve data from history only if it's the first time populating
        this.dataToPopulate = history.state.data; 
        console.log('Data retrieved:', this.dataToPopulate);
        
        // Populate the form only if data exists
        if (this.dataToPopulate) {
          // Ensure we are handling purchase_invoice_items correctly
          const purchaseInvoiceItems = this.dataToPopulate.purchase_invoice_items || [];
  
          // Clear existing purchase_invoice_items to avoid duplicates
          this.formConfig.model.purchase_invoice_items = [];
  
          // Populate form with data, ensuring unique entries
          purchaseInvoiceItems.forEach(item => {
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
            this.formConfig.model.purchase_invoice_items.push(populatedItem);
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
  
  loadProductVariations(field: FormlyFieldConfig, productValuechange: boolean = false) {
    const parentArray = field.parent;

    const product = field.formControl.value; //this.formConfig.model.sale_order_items[currentRowIndex]?.product;
    // Ensure the product exists before making an HTTP request

    if (product?.product_id) {
      const sizeField: any = parentArray.fieldGroup.find((f: any) => f.key === 'size');
      const colorField: any = parentArray.fieldGroup.find((f: any) => f.key === 'color');
      if (productValuechange) {
        sizeField.formControl.setValue(null);
        colorField.formControl.setValue(null);
      }
      // Clear previous options for both size and color fields before adding new ones
      if (sizeField) sizeField.templateOptions.options = [];
      if (colorField) colorField.templateOptions.options = [];
      this.http.get(`products/product_variations/?product_id=${product.product_id}`).subscribe((response: any) => {
        if (response.data.length > 0) {

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
        }
      });
    } else {
      console.error('Product not selected or invalid.');
    }
  };

  async autoFillProductDetails(field, data) {
    this.productOptions = data;
    if (!field.form?.controls || !data) return;
    const fieldMappings = {
      code: data.code,
      rate: data.sales_rate || field.form.controls.rate.value,
      discount: parseFloat(data.dis_amount) || 0,
      unit_options_id: data.unit_options?.unit_options_id,
      print_name: data.print_name,
      mrp: data.mrp
    };
  
    Object.entries(fieldMappings).forEach(([key, value]) => {
      if (value !== undefined) field.form.controls[key]?.setValue(value);
    });
    this.totalAmountCal();
  }

//=====================================================================
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editPurchaseInvoice(event) {
    this.PurchaseInvoiceEditID = event;
    this.http.get('purchase/purchase_invoice_order/' + event).subscribe((res: any) => {
      if (res && res.data) {

        this.formConfig.model = res.data;
        // set purchase_order default value
        this.formConfig.model['purchase_invoice_orders']['order_type'] = 'purchase_invoice';
        this.formConfig.pkId = 'purchase_invoice_id';
        // set labels for update
        this.formConfig.submit.label = 'Update';
        // show form after setting form values
        this.formConfig.model['purchase_invoice_id'] = this.PurchaseInvoiceEditID;
        this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[7].hide = false;
        this.totalAmountCal();
        this.showForm = true;

        // Ensure custom_field_values are correctly populated in the model
        if (res.data.custom_field_values) {
          this.formConfig.model['custom_field_values'] = res.data.custom_field_values.reduce((acc: any, fieldValue: any) => {
            acc[fieldValue.custom_field_id] = fieldValue.field_value; // Map custom_field_id to the corresponding value
            return acc;
          }, {});
        }        
      }
    });
    this.hide();
  }


  getInvoiceNo() {
    this.invoiceNumber = null;
    this.http.get('masters/generate_order_no/?type=SHIP').subscribe((res: any) => {
      if (res && res.data && res.data.order_number) {
        this.formConfig.model['order_shipments']['shipping_tracking_no'] = res.data.order_number;
        this.http.get('masters/generate_order_no/?type=SO').subscribe((res: any) => {
          if (res && res.data && res.data.order_number) {
            this.formConfig.model['purchase_invoice_orders']['invoice_no'] = res.data.order_number;
            this.invoiceNumber = res.data.order_number;
          }
        });;
      }
    });
  }

  showPurchaseInvoiceListFn() {
    this.showPurchaseInvoiceList = true;
    this.PurchaseInvoiceListComponent?.refreshTable();
  }

//=====================================================
quickpackOptions: any[] = []; // To store available Quickpack options
selectedQuickpack: string = ''; // Selected Quickpack value

loadQuickpackOptions() {
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
      this.formConfig.model.purchase_invoice_items = quickPackDataItems.map((item: any) => ({
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
      if (this.purchaseinvoiceForm) {
        console.log("we are inside : ", this.purchaseinvoiceForm.form);
        this.purchaseinvoiceForm.form.controls.purchase_invoice_items.patchValue(this.formConfig.model.purchase_invoice_items);
        console.log("After method ...")
      }

      console.log('Sale Order Items populated:', this.formConfig.model.purchase_invoice_items);
    });
}
//=====================================================

  showSuccessToast = false;
  toastMessage = '';
  showDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'flex'; // Show the dialog
    }
  }

  closeToast() {
    this.showSuccessToast = false;
  }

  createPurchaseInvoice(){
    const customFieldValues = this.formConfig.model['custom_field_values']

    // Determine the entity type and ID dynamically
    const entityId = '69145134-f2df-4d17-9f0b-730807a646be'; // Since we're in the Sale Invoice form
    const customId = this.formConfig.model.purchase_invoice_orders?.purchase_invoice_id || null; // Ensure correct purchase_order_id
  
    // Construct payload for custom fields
    const customFieldsPayload = CustomFieldHelper.constructCustomFieldsPayload(customFieldValues, entityId, customId);
  
    if (!customFieldsPayload) {
      this.showDialog(); // Stop execution if required fields are missing
    }

    // Construct the final payload
    const payload = {
      ...this.formConfig.model,
      // custom_field: customFieldsPayload.custom_field, // Dictionary of custom fields
      custom_field_values: customFieldsPayload.custom_field_values // Array of custom field values
    };

    this.http.post('purchase/purchase_invoice_order/', payload)
      .subscribe(response => {
        this.showSuccessToast = true;
        this.toastMessage = 'Record created successfully';
        this.ngOnInit();
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 3000); // Hide toast after 3 seconds
      }, error => {
        console.error('Error creating record:', error);
      });
  }

  updatePurchaseInvoice(){
    const customFieldValues = this.formConfig.model['custom_field_values']; // User-entered custom fields

    // Determine the entity type and ID dynamically
    const entityId = '69145134-f2df-4d17-9f0b-730807a646be'; // Since we're in the Sale Order form
    const customId = this.formConfig.model.purchase_invoice_orders?.purchase_invoice_id || null; // Ensure correct purchase_order_id

    // Construct payload for custom fields based on updated values
    const customFieldsPayload = CustomFieldHelper.constructCustomFieldsPayload(customFieldValues, entityId, customId);
    console.log("Testing the data in customFieldsPayload: ", customFieldsPayload);
    
    // Construct the final payload for update
    const payload = {
      ...this.formConfig.model,
      custom_field_values: customFieldsPayload.custom_field_values // Array of dictionaries
    };

    // Define logic here for updating the sale order without modal pop-up
    // console.log("Updating sale order:", this.formConfig.model);
    this.http.put(`purchase/purchase_invoice_order/${this.PurchaseInvoiceEditID}/`, payload)
      .subscribe(response => {
        this.showSuccessToast = true;
        this.toastMessage = "Record updated successfully"; // Set the toast message for update
        this.ngOnInit();
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 3000);

      }, error => {
        console.error('Error updating record:', error);
      });
  }
//=====================================================
  setFormConfig() {
    this.PurchaseInvoiceEditID = null;
    this.formConfig = {
      // url: "purchase/purchase_invoice_order/",
      title: '',
      formState: {
        viewMode: false
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'purchase_invoice_items',
          type: 'script',
          value: 'data.purchase_invoice_items.map(m=> {m.product_id = m.product.product_id; if(m.product.unit_options){m.unit_options_id = m.product.unit_options.unit_options_id};  if(m.unit_options){m.unit_options_id = m.unit_options.unit_options_id};  return m ;})'
        },
        {
          key: 'purchase_invoice_items',
          type: 'script',
          value: 'data.purchase_invoice_items.map(m=> {m.size_id = m.size?.size_id || null;  return m ;})'
        },
        {
          key: 'purchase_invoice_items',
          type: 'script',
          value: 'data.purchase_invoice_items.map(m=> {m.color_id = m.color?.color_id || null;  return m ;})'
        },

      ],
      submit: {
        label: 'Submit',
        // submittedFn: () => this.ngOnInit()
        submittedFn: () => {
          if (!this.PurchaseInvoiceEditID) {
            this.createPurchaseInvoice();
          } else {
            this.updatePurchaseInvoice();
             // Otherwise, create a new record
          }
        }
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model: {
        purchase_invoice_orders: {},
        purchase_invoice_items: [{}],
        order_attachments: [],
        order_shipments: {},
        custom_field_values: []
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block row ms-0",
          key: 'purchase_invoice_orders',
          fieldGroup: [
            {
              className: 'col-lg-9 col-md-8 col-12 p-0',
              fieldGroupClassName: "ant-row mx-0 row align-items-end mt-2",
              fieldGroup: [
                {
                  key: 'purchase_type',
                  type: 'select',
                  className: 'col-md-4 col-sm-6 col-12',
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

                      field.formControl.valueChanges.subscribe(data => {
                        console.log("purchase_type", data);
                        if (data && data.purchase_type_id) {
                          this.formConfig.model['purchase_invoice_orders']['purchase_type_id'] = data.purchase_type_id;
                        }
                      });
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders.purchase_type && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.purchase_invoice_orders.purchase_type);
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
                    onChanges: (field: any) => {
                      field.formControl.valueChanges.subscribe(data => {
                        // console.log("vendors", data);
                        if (data && data.vendor_id) {
                          this.formConfig.model['purchase_invoice_orders']['vendor_id'] = data.vendor_id;
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
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders.vendor && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.purchase_invoice_orders.vendor);
                      }
                    }
                  }
                },
                {
                  key: 'invoice_no',
                  type: 'input',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Invoice no',
                    placeholder: 'Enter Invoice No',
                    required: true,
                    // readonly: true
                    disabled: true
                  },
                  hooks: {
                    onInit: (field: any) => {
                      // field.form.controls.order_no.setValue(this.orderNumber)
                      // field.form.controls.order_no.value = this.orderNumber;
                    }
                  },
                  // expressionProperties: {
                  //   'templateOptions.disabled': this.PurchaseOrderEditID ? 'true' : 'fa'
                  // }
                },
                {
                  key: 'invoice_date',
                  type: 'date',
                  defaultValue: this.nowDate(),
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    type: 'date',
                    label: 'Invoice date',
                    readonly: true,
                    required: true
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
                  key: 'due_date',
                  type: 'date',
                  defaultValue: this.nowDate(),
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Due Date',
                    readonly: true,
                    required: true
                  }
                },
                {
                  key: 'supplier_invoice_no',
                  type: 'input',
                  // defaultValue: "testing@example.com",
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    type: 'input',
                    label: 'Supiler invoice no',
                    placeholder: 'Enter Supiler invoice no',
                    required: true
                  },
                  hooks: {
                    onInit: (field: any) => { }
                  }
                },
                {
                  key: 'tax',
                  type: 'select',
                  // defaultValue: 'Exclusive',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Tax',
                    options: [
                      { 'label': "Inclusive", value: 'Inclusive' },
                      { 'label': "Exclusive", value: 'Exclusive' }
                    ],
                    required: true
                  },
                  hooks: {
                    onInit: (field: any) => {
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders.tax && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.purchase_invoice_orders.tax);
                      }
                    }
                  }
                },
                {
                  key: 'remarks',
                  type: 'textarea',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    type: 'input',
                    label: 'Remarks',
                    placeholder: 'Enter Remarks',
                  },
                  hooks: {
                    onInit: (field: any) => {
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders.remarks && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.purchase_invoice_orders.remarks);
                      }
                    }
                  }
                },
              ]
            },
            {
              className: 'col-lg-3 col-md-4 col-12 p-md-0 inline-form-fields',
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
                  key: 'discount',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Product Disocunt',
                     required: false
                  },
                  defaultValue: '0.00'

                },
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
                  key: 'cgst',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Output CGST',
                    required: false
                  },
                  defaultValue: '0.00',
                  expressionProperties: {
                    'model.cgst': (model, field) => {
                      if (!field._lastValue || field._lastValue !== model.tax_amount) {
                        const isTamilnadu = model.billing_address?.includes('Andhra Pradesh');
                        field._lastValue = model.tax_amount; // Store last value to avoid infinite logs
                      }
                      return model.billing_address?.includes('Andhra Pradesh') 
                        ? (parseFloat(model.tax_amount) / 2).toFixed(2) 
                        : '0.00';
                    },
                    'templateOptions.disabled': 'true' // Make it read-only
                  },
                  hideExpression: (model) => !model.billing_address || !model.billing_address?.includes('Andhra Pradesh') // Hide CGST for inter-state
                },
                {
                  key: 'sgst',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Output SGST',
                    required: false
                  },
                  defaultValue: '0.00',
                  expressionProperties: {
                    'model.sgst': (model, field) => {
                      if (!field._lastValue || field._lastValue !== model.tax_amount) {
                        const isTamilnadu = model.billing_address?.includes('Andhra Pradesh');
                        field._lastValue = model.tax_amount;
                      }
                      return model.billing_address?.includes('Andhra Pradesh') 
                        ? (parseFloat(model.tax_amount) / 2).toFixed(2) 
                        : '0.00';
                    },
                    'templateOptions.disabled': 'true' // Make it read-only
                  },
                  hideExpression: (model) => !model.billing_address || !model.billing_address?.includes('Andhra Pradesh') // Hide CGST for inter-state
                },
                {
                  key: 'igst',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Output IGST',
                    required: false
                  },
                  defaultValue: '0.00',
                  expressionProperties: {
                    'model.igst': (model, field) => {
                      if (!field._lastValue || field._lastValue !== model.tax_amount) {
                        const isTamilnadu = model.billing_address?.includes('Andhra Pradesh');
                        field._lastValue = model.tax_amount;
                      }
                      return !model.billing_address?.includes('Andhra Pradesh') 
                        ? parseFloat(model.tax_amount).toFixed(2) 
                        : '0.00';
                    },
                    'templateOptions.disabled': 'true' // Make it read-only
                  },
                  hideExpression: (model) => !model.billing_address || model.billing_address?.includes('Andhra Pradesh') // Hide if intra-state
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
          key: 'purchase_invoice_items',
          type: 'repeat',
          className: 'custom-form-list product-table',
          // defaultValue: [],
          // fieldGroupClassName: 'table-field pr-md',
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
                name: 'code',
                label: 'Code'
              },
              {
                name: 'unit',
                label: 'Unit'
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
                    'templateOptions.hidden': () => !(this.PurchaseInvoiceEditID),
                    'templateOptions.disabled': (model) => model.invoiced === 'YES' || !this.PurchaseInvoiceEditID
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
                  placeholder: 'product',
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
                    if (!parentArray) {
                      console.error('Parent array is undefined or not accessible');
                      return;
                    }
              
                    const currentRowIndex = +parentArray.key;
              
                    // Populate product if data exists
                    const existingProduct = this.dataToPopulate?.purchase_invoice_items?.[currentRowIndex]?.product;
                    if (existingProduct) {
                      field.formControl.setValue(existingProduct);
                    }
              
                    this.loadProductVariations(field);
              
                    // Subscribe to value changes (to update sizes dynamically)
                    field.formControl.valueChanges.subscribe((data: any) => {
                      if (!this.formConfig.model['purchase_invoice_items'][currentRowIndex]) {
                        console.error(`Products at index ${currentRowIndex} is not defined. Initializing...`);
                        this.formConfig.model['purchase_invoice_items'][currentRowIndex] = {};
                      }
                      this.formConfig.model['purchase_invoice_items'][currentRowIndex]['product_id'] = data?.product_id;
                      this.loadProductVariations(field);
                      this.autoFillProductDetails(field, data); // to fill the remaining fields when product is selected.
                    });

                    // Product Info Text code
                    field.formControl.valueChanges.subscribe( async selectedProductId => {
                      const unit = getUnitData(selectedProductId);
                      const row = this.formConfig.model.purchase_invoice_items[currentRowIndex];
                      displayInformation(row.product, null , null, unit, '', '');
                    }); // end of product info text code
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
                  placeholder: 'size',
                  options: [],
                  required: false,
                  lazy: {
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
                    if (!parentArray) {
                      console.error('Parent array is undefined or not accessible');
                      return;
                    }
              
                    const currentRowIndex = +parentArray.key;
                    const saleOrderItems = this.dataToPopulate?.purchase_invoice_items?.[currentRowIndex];
                    
                    // Populate existing size if available
                    const existingSize = saleOrderItems?.size;
                    if (existingSize?.size_id) {
                      field.formControl.setValue(existingSize);
                    }

                    // Subscribe to value changes (Merged from onInit & onChanges)
                    field.formControl.valueChanges.subscribe((selectedSize: any) => {
                      const product = this.formConfig.model.purchase_invoice_items[currentRowIndex]?.product;
                      if (!product?.product_id) {
                        console.warn(`Product missing for row ${currentRowIndex}, skipping color fetch.`);
                        return;
                      }
                      this.formConfig.model['purchase_invoice_items'][currentRowIndex]['size_id'] = selectedSize?.size_id;
              
                      const size_id = selectedSize?.size_id || null;
                      const url = size_id
                        ? `products/product_variations/?product_id=${product.product_id}&size_id=${size_id}`
                        : `products/product_variations/?product_id=${product.product_id}&size_isnull=True`;
              
                      // Fetch available colors based on the selected size
                      this.http.get(url).subscribe((response: any) => {
                        if (response.data.length > 0) {
                          const sizeCount = sumQuantities(response);
                          const unit = getUnitData(product);
                          displayInformation(product, selectedSize, null, unit, sizeCount, '');
                        }
                        const uniqueColors = response.data.map((variation: any) => ({
                          label: variation.color?.color_name || '----',
                          value: {
                            color_id: variation.color?.color_id || null,
                            color_name: variation.color?.color_name || '----'
                          }
                        })).filter((item, index, self) =>
                          index === self.findIndex((t) => t.value.color_id === item.value.color_id)
                        );
              
                        // Update color field options
                        const colorField = parentArray.fieldGroup.find((f: any) => f.key === 'color');
                        if (colorField) {
                          colorField.templateOptions.options = uniqueColors;
                        }
                      });
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
                  placeholder: 'color',
                  options: [],
                  required: false,
                  lazy: { lazyOneTime: true }
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
                    if (!parentArray?.key) {
                      console.error('Parent array key is missing or inaccessible');
                      return;
                    }
              
                    const currentRowIndex = Number(parentArray.key);
                    const saleOrderItems = this.dataToPopulate?.purchase_invoice_items?.[currentRowIndex];
                    const row = this.formConfig.model.purchase_invoice_items[currentRowIndex];
              
                    if (!row) {
                      console.error(`Row not found for index ${currentRowIndex}`);
                      return;
                    }
              
                    // Populate existing color if available
                    if (saleOrderItems?.color) {
                      field.formControl.setValue(saleOrderItems.color);
                    }
              
                    // Subscribe to value changes & avoid unnecessary API calls
                    field.formControl.valueChanges.subscribe((selectedColor: any) => {
                      if (!row.product?.product_id) {
                        console.warn(`Product missing for row ${currentRowIndex}, skipping color update.`);
                        return;
                      }

                      this.formConfig.model['purchase_invoice_items'][currentRowIndex]['color_id'] = selectedColor?.color_id;
              
                      const color_id = selectedColor?.color_id || null;
                      console.log('color_id :', color_id)
              
                      const url = `products/product_variations/?product_id=${row.product.product_id}`
                        + (color_id ? `&color_id=${color_id}` : `&color_isnull=True`);
              
                      // Update selected color
                      row.color_id = color_id;

                      console.log('url:', url)
              
                      this.http.get(url).subscribe(
                        (response: any) => {
                          if (response?.data) {
                            const colorCount = sumQuantities(response);
                            const unit = getUnitData(row.product);
                            displayInformation(row.product, row.size, selectedColor, unit, '', colorCount);
                          } else {
                            console.log(`No data found for product_id ${row.product.product_id} and color_id ${color_id}`);
                          }
                        },
                        (error) => console.error("API Error:", error)
                      );
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
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_items.length > currentRowIndex) {
                        const existingCode = this.dataToPopulate.purchase_invoice_items[currentRowIndex].product?.code;
                        
                        // Set the full product object instead of just the product_id
                        if (existingCode) {
                          field.formControl.setValue(existingCode); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
                }
              },
             
              // quantity amount rate dsc
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
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_items.length > currentRowIndex) {
                        const existingQuan = this.dataToPopulate.purchase_invoice_items[currentRowIndex].quantity;
                        
                        // Set the full product object instead of just the product_id
                        if (existingQuan) {
                          field.formControl.setValue(existingQuan); // Set full product object (not just product_id)
                        }
                      }
                    }
              
                    // Subscribe to value changes
                    field.formControl.valueChanges.subscribe(data => {
                      // this.totalAmountCal();
                      if (field.form && field.form.controls && field.form.controls.rate && data) {
                        const rate = field.form.controls.rate.value;
                        const discount = field.form.controls.discount.value;
                        const quantity = data;
                        const productDiscount = parseInt(rate) * parseInt(quantity) * parseInt(discount)/ 100
                        if (rate && quantity) {
                          field.form.controls.amount.setValue(parseInt(rate) * parseInt(quantity) - productDiscount) ;
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
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_items.length > currentRowIndex) {
                        const existingPrice = this.dataToPopulate.purchase_invoice_items[currentRowIndex].rate;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_items.length > currentRowIndex) {
                        const existingDisc = this.dataToPopulate.purchase_invoice_items[currentRowIndex].discount;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_items.length > currentRowIndex) {
                        const existingAmount = this.dataToPopulate.purchase_invoice_items[currentRowIndex].amount;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_items.length > currentRowIndex) {
                        const existingUnit = this.dataToPopulate.purchase_invoice_items[currentRowIndex].product.unit_options;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_items.length > currentRowIndex) {
                        const existingName = this.dataToPopulate.purchase_invoice_items[currentRowIndex].print_name;
                        
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
                key: 'cgst',
                templateOptions: {
                  type: "number",
                  label: 'CGST',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field) => {
                    // if (field.formControl && field.model) {
                    //   field.formControl.setValue(
                    //     field.model.billing_address?.includes('Andhra Pradesh') 
                    //       ? (parseFloat(field.model.tax_amount) / 2).toFixed(2) 
                    //       : '0.00'
                    //   );
                    // }
                  }
                },
                expressionProperties: {
                  'templateOptions.disabled': 'true' // Make it read-only
                }
              },              
              {
                type: 'input',
                key: 'sgst',
                templateOptions: {
                  type: "number",
                  label: 'SGST',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field) => {
                    // if (field.formControl && field.model) {
                    //   field.formControl.setValue(
                    //     field.model.billing_address?.includes('Andhra Pradesh') 
                    //       ? (parseFloat(field.model.tax_amount) / 2).toFixed(2) 
                    //       : '0.00'
                    //   );
                    // }
                  }
                },
                expressionProperties: {
                  'templateOptions.disabled': 'true' // Make it read-only
                }
              },              
              {
                type: 'input',
                key: 'igst',
                templateOptions: {
                  type: "number",
                  label: 'IGST',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field) => {
                    // if (field.formControl && field.model) {
                    //   field.formControl.setValue(
                    //     field.model.billing_address?.includes('Andhra Pradesh') 
                    //       ? (parseFloat(field.model.tax_amount) / 2).toFixed(2) 
                    //       : '0.00'
                    //   );
                    // }
                  }
                },
                expressionProperties: {
                  'templateOptions.disabled': 'true' // Make it read-only
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
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_items.length > currentRowIndex) {
                        const existingBox = this.dataToPopulate.purchase_invoice_items[currentRowIndex].total_boxes;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_items.length > currentRowIndex) {
                        const existingtax = this.dataToPopulate.purchase_invoice_items[currentRowIndex].tax;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_items.length > currentRowIndex) {
                        const existingRemarks = this.dataToPopulate.purchase_invoice_items[currentRowIndex].remarks;
                        
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
              className: 'col-12 p-0',
              props: {
                label: 'Billing Details'
              },
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      className: 'col-12 p-0 custom-form-card-block w-100',
                      fieldGroup: [
                        // {
                        //   template: '<div class="custom-form-card-title">  </div>',
                        //   fieldGroupClassName: "ant-row",
                        // },
                        {
                          fieldGroupClassName: "ant-row",
                          key: 'purchase_invoice_orders',
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
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders && this.dataToPopulate.purchase_invoice_orders.tax_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.purchase_invoice_orders.tax_amount);
                                    this.totalAmountCal();
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
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders && this.dataToPopulate.purchase_invoice_orders.cess_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.purchase_invoice_orders.cess_amount);
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
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders && this.dataToPopulate.purchase_invoice_orders.advance_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.purchase_invoice_orders.advance_amount);
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
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders && this.dataToPopulate.purchase_invoice_orders.taxable && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.purchase_invoice_orders.taxable);
                                  }
                                }
                              }
                            },							      
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
                                      this.formConfig.model['purchase_invoice_orders']['gst_type_id'] = data.gst_type_id;
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders.gst_type && field.formControl) {
                                    const GstFiled = this.dataToPopulate.purchase_invoice_orders.gst_type
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
                                      this.formConfig.model['purchase_invoice_orders']['payment_term_id'] = data.payment_term_id;
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders.payment_term && field.formControl) {
                                    const PaymentField = this.dataToPopulate.purchase_invoice_orders.payment_term
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
                                      this.formConfig.model['purchase_invoice_orders']['ledger_account_id'] = data.ledger_account_id; // Update the model with the selected ledger_account_id
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders.ledger_account && field.formControl) {
                                    const LedgerField = this.dataToPopulate.purchase_invoice_orders.ledger_account
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
                                  hide: '!model.purchase_invoice_orders_id',
                                },
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    //console.log("ledger_account", data);
                                    if (data && data.order_status_id) {
                                      this.formConfig.model['purchase_invoice_orders']['order_status_id'] = data.order_status_id;
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
                            //       if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders && this.dataToPopulate.purchase_invoice_orders.item_value && field.formControl) {
                            //         field.formControl.setValue(this.dataToPopulate.purchase_invoice_orders.item_value);
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
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders && this.dataToPopulate.purchase_invoice_orders.dis_amt && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.purchase_invoice_orders.dis_amt);
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
                                  if (this.dataToPopulate && this.dataToPopulate.purchase_invoice_orders && this.dataToPopulate.purchase_invoice_orders.total_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.purchase_invoice_orders.total_amount);
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
              className: 'col-12 custom-form-card-block p-0',
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
              className: 'col-12 p-0',
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
              className: 'col-12 custom-form-card-block p-0',
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
                  key: 'purchase_invoice_orders',
                  fieldGroup: [
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
                      className: 'col-md-4 col-sm-6 col-12',
                      templateOptions: {
                        label: 'Billing address',
                        placeholder: 'Enter Billing address'
                      },
                    },
                    {
                      key: 'shipping_address',
                      type: 'textarea',
                      className: 'col-md-4 col-sm-6 col-12',
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
    calculateTotalAmount(this.formConfig.model, 'purchase_invoice_items', this.purchaseinvoiceForm?.form);
  }

}
