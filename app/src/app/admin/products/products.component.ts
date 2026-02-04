import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ProductsListComponent } from './products-list/products-list.component';
import { TaFormComponent } from '@ta/ta-form';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzAlertModule } from 'ng-zorro-antd/alert';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  imports: [CommonModule, AdminCommmonModule, ProductsListComponent, NzSpinModule, NzProgressModule, NzResultModule, NzAlertModule],
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
  isDownloading: boolean;
  form: any;
  fields: any;
  // Default to "Inventory" so the Attributes Info tab is visible on first load
  selectedProductMode: string = "Inventory";

  // Import state tracking
  isImporting: boolean = false;
  importProgress: number = 0;
  importStatusMessage: string = '';
  importCompleted: boolean = false;
  importResults: {
    success: boolean;
    totalRecords: number;
    successCount: number;
    errorCount: number;
    errors: Array<{ row: number; error: string }>;
  } | null = null;


  constructor(private http: HttpClient, private notification: NzNotificationService) { }

  ngOnInit() {
    this.showProductsList = false;
    this.showForm = true;
    this.ProductEditID = null;
    // Reset selectedProductMode to default "Inventory" to ensure Attributes tab is visible by default
    this.selectedProductMode = "Inventory";
    this.setFormConfig();
    // console.log('Check field : ',this.formConfig.fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[7])
    // this.formConfig.fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[9].hide = true;
    // this.formConfig.fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[10].hide = true;
  }

  hide() {
    const modalCloseButton = document.getElementById('modalClose');
    if (modalCloseButton) {
      modalCloseButton.click();
    }
  }

  // editProducts(event: any) {
  //   console.log('event', event);
  //   this.ProductEditID = event;
  //   this.http.get('products/products/' + event).subscribe((res: any) => {
  //     if (res) {
  //       this.formConfig.model = res.data;

  //       this.formConfig.formState.viewMode = true;

  //       //  Ensure product_variations always has at least one row
  //       if (!this.formConfig.model.product_variations || this.formConfig.model.product_variations.length === 0) {
  //         this.formConfig.model.product_variations = [{}];
  //       }

  //       //  Always ensure balance array exists with at least one row
  //       if (!this.formConfig.model.product_item_balance || this.formConfig.model.product_item_balance.length === 0) {
  //         this.formConfig.model.product_item_balance = [{}];
  //       }

  //       this.formConfig.showActionBtn = true;
  //       // Set labels for update
  //       this.formConfig.pkId = 'product_id';
  //       this.formConfig.submit.label = 'Update';
  //       // Show form after setting form values
  //       this.formConfig.model['product_id'] = this.ProductEditID;
  //       this.showForm = true;
  //       // this.formConfig.fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[7].hide = false;
  //       this.formConfig.fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[9].hide = false;
  //       this.formConfig.fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[10].hide = false;

  //       // If we're editing a product, get the product mode name from the API to set selectedProductMode
  //       // if (this.formConfig.model.products?.product_mode_id) {
  //       //   this.http.get('products/item-master/').subscribe((response: any) => {
  //       //     if (response && response.data) {
  //       //       const modeId = this.formConfig.model.products.product_mode_id;
  //       //       const modeOption = response.data.find((item: any) => item.item_master_id === modeId);
  //       //       if (modeOption) {
  //       //         this.selectedProductMode = modeOption.mode_name;
  //       //         console.log('Set selectedProductMode to:', this.selectedProductMode);
  //       //       }
  //       //     }
  //       //   });
  //       // }
  //     }
  //   });
  //   this.hide();
  // }

editProducts(event: any) {
  console.log('event', event);
  this.ProductEditID = event;

  this.http.get('products/products/' + event).subscribe((res: any) => {
    if (res) {
      this.formConfig.model = res.data;

      // 🔥 VERY IMPORTANT
      this.formConfig.formState.viewMode = true;

      // UI-only placeholder rows
      if (!this.formConfig.model.product_variations || this.formConfig.model.product_variations.length === 0) {
        this.formConfig.model.product_variations = [{}];
      }

      if (!this.formConfig.model.product_item_balance || this.formConfig.model.product_item_balance.length === 0) {
        this.formConfig.model.product_item_balance = [{}];
      }

      this.formConfig.showActionBtn = true;
      this.formConfig.pkId = 'product_id';
      this.formConfig.submit.label = 'Update';

      this.formConfig.model['product_id'] = this.ProductEditID;
      this.showForm = true;

      this.formConfig.fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[9].hide = false;
      this.formConfig.fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[10].hide = false;
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
    // Ensure filters are reset and table is refreshed when showing the products list
    if (this.ProductsListComponent) {
      if (this.ProductsListComponent.taTableComponent) {
        this.ProductsListComponent.taTableComponent.resetFilterValues();
      }
      this.ProductsListComponent.refreshTable();
    }
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

  // updateProducts() {
  //   const ProductEditID = this.formConfig.model.products.product_id;
  //   const updateData = {
  //     products: this.formConfig.model.products,
  //     product_variations: this.formConfig.model.product_variations,
  //     product_item_balance: this.formConfig.model.product_item_balance
  //   };

  //   // PUT request to update Sale Return Order
  //   this.http.put(`products/products/${ProductEditID}/`, updateData).subscribe(
  //     (response) => {
  //       this.notification.success('Record updated successfully', '');
  //       this.ngOnInit()
  //       this.taFormComponent.formlyOptions.resetModel([]);
  //     },
  //     (error) => {
  //       console.error('Error updating Products:', error);
  //     }
  //   );
  // }
updateProducts() {
  const ProductEditID = this.formConfig.model.products.product_id;

  // 🔥 REMOVE EMPTY OBJECTS BEFORE API CALL
  const cleanedVariations = (this.formConfig.model.product_variations || [])
    .filter(v => v && Object.keys(v).length > 0);

  const cleanedBalances = (this.formConfig.model.product_item_balance || [])
    .filter(b => b && Object.keys(b).length > 0);

  const updateData = {
    products: this.formConfig.model.products,
    product_variations: cleanedVariations,
    product_item_balance: cleanedBalances
  };

  console.log('FINAL UPDATE PAYLOAD:', updateData);

  this.http.put(`products/products/${ProductEditID}/`, updateData).subscribe(
    () => {
      this.notification.success('Record updated successfully', '');
      this.ngOnInit();
      this.taFormComponent.formlyOptions.resetModel([]);
    },
    (error) => {
      console.error('Error updating Products:', error);
    }
  );
}



// verifyBalance(): any {
//   const isEditMode = this.formConfig.formState.viewMode; // true = edit, false = create
//   console.log('isEditMode:', isEditMode);

//   // Helper to sum quantities
//   const calculateTotalQuantity = (items) =>
//     items?.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0) || 0;

//   const productVariations = (this.formConfig.model.product_variations ?? []).filter(
//     (obj) => obj && Object.keys(obj).length
//   );
//   this.formConfig.model.product_variations = productVariations;

//   const totalVariationQuantity = calculateTotalQuantity(productVariations);
//   const totalWarehouseQuantity = calculateTotalQuantity(this.formConfig.model.product_item_balance);

//   // // --- CASE 1: Both empty → balance = 0
//   if (totalVariationQuantity === 0 && totalWarehouseQuantity === 0) {
//     if (!isEditMode) {
//       console.log("we entered in the method -1 ; ")
//       this.formConfig.model.products.balance = 0;
//     }
//     return true;
//   }


//   // --- CASE 2: Only variations entered
//   if (totalVariationQuantity > 0 && totalWarehouseQuantity === 0) {
//     console.log("we entered in the method -2 ; ")
//     this.formConfig.model.products.balance = totalVariationQuantity;
//     return true;
//   }

//   // --- CASE 3: Only warehouses entered
//   if (totalWarehouseQuantity > 0 && totalVariationQuantity === 0) {
//     console.log("we entered in the method -3; ")
//     this.formConfig.model.products.balance = totalWarehouseQuantity;
//     return true;
//   }

//   // --- CASE 4: Both entered → must match
//   if (totalVariationQuantity !== totalWarehouseQuantity) {
//     return this.showDialog(
//       `<b>Mismatch!</b><br>
//        Variations = <b>${totalVariationQuantity}</b>, 
//        Warehouse = <b>${totalWarehouseQuantity}</b>. They must match.`
//     );
//   }

//   //  If both match → set balance
//   this.formConfig.model.products.balance = totalVariationQuantity;

//   return true;
// }

// verifyBalance(): any {
//   const sumQty = (items) =>
//     items?.reduce((s, i) => s + (Number(i.quantity) || 0), 0) || 0;

//   const variations = (this.formConfig.model.product_variations || [])
//     .filter(v => v && Object.keys(v).length);

//   const warehouses = (this.formConfig.model.product_item_balance || [])
//     .filter(w => w && Object.keys(w).length);

//   const variationQty = sumQty(variations);
//   const warehouseQty = sumQty(warehouses);
//   const enteredBalance = Number(this.formConfig.model.products.balance) || 0;

//   // ✅ CASE 1: nothing entered → free balance
//   if (variationQty === 0 && warehouseQty === 0) {
//     return true;
//   }

//   // ✅ CASE 2: variations entered, balance empty → auto set
//   if (variationQty > 0 && enteredBalance === 0) {
//     this.formConfig.model.products.balance = variationQty;
//     return true;
//   }

//   // ✅ CASE 3: warehouses entered, balance empty → auto set
//   if (warehouseQty > 0 && enteredBalance === 0) {
//     this.formConfig.model.products.balance = warehouseQty;
//     return true;
//   }

//   // ✅ CASE 4: validate consistency
//   if (
//     (variationQty > 0 && enteredBalance !== variationQty) ||
//     (warehouseQty > 0 && enteredBalance !== warehouseQty) ||
//     (variationQty > 0 && warehouseQty > 0 && variationQty !== warehouseQty)
//   ) {
//     return this.showDialog(
//       `Mismatch detected:
//        Variations = ${variationQty},
//        Warehouses = ${warehouseQty},
//        Balance = ${enteredBalance}`
//     );
//   }

//   return true;
// }

verifyBalance(): boolean {
  const sumQty = (items) =>
    items?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) || 0;

  const variations = (this.formConfig.model.product_variations || [])
    .filter(v => v && Object.keys(v).length);

  const warehouses = (this.formConfig.model.product_item_balance || [])
    .filter(w => w && Object.keys(w).length);

  const variationQty = sumQty(variations);
  const warehouseQty = sumQty(warehouses);

  // 🔥 ERP RULE 1: Balance always comes from variations
  this.formConfig.model.products.balance = variationQty;

  // 🔥 ERP RULE 2: Warehouse is allocation only
  if (warehouseQty > variationQty) {
    this.showDialog(
      `Warehouse quantity (${warehouseQty})
       cannot exceed variation quantity (${variationQty}).`
    );
    return false; // ✅ explicit boolean
  }

  return true;
}




// preprocessFormData() {
//   // Ensure product_mode_id is just the UUID
//   const products = this.formConfig.model.products;
//   if (products && typeof products.product_mode_id === 'object') {
//     products.product_mode_id = products.product_mode_id.item_master_id;
//   }
  
//   // Process product variations to ensure size_id and color_id are just UUIDs
//   const variations = this.formConfig.model.product_variations || [];
//   variations.forEach(variation => {
//     if (variation) {
//       if (typeof variation.size_id === 'object') {
//         variation.size_id = variation.size_id.size_id;
//       }
//       if (typeof variation.color_id === 'object') {
//         variation.color_id = variation.color_id.color_id;
//       }
//     }
//   });
// }

preprocessFormData() {
  const products = this.formConfig.model.products;
  if (products && typeof products.product_mode_id === 'object') {
    products.product_mode_id = products.product_mode_id.item_master_id;
  }

  const variations = this.formConfig.model.product_variations || [];
  variations.forEach(variation => {
    if (!variation) return;

    if (variation.size_id && typeof variation.size_id === 'object') {
      variation.size_id = variation.size_id.size_id;
    }

    if (variation.color_id && typeof variation.color_id === 'object') {
      variation.color_id = variation.color_id.color_id;
    }
  });
}



  // On every change in product_variations update balance
  updateBalanceFromVariations() {
    const productVariations = this.formConfig.model.product_variations ?? [];
    const balance = productVariations.reduce(
      (sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0
    );
    this.formConfig.model.products.balance = balance;
  }


  showDialog(message: string): void {
    this.dialogMessage = message;  // Set the dynamic message
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'flex';  // Explicitly set display to flex
    }
    ;
  }


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
       this.preprocessFormData();
      if (this.formConfig.submit.label === 'Update') {
        this.updateProducts();
      } else if (this.formConfig.submit.label === 'Submit') {
        this.createRecord();
      }
    }
  };

  setFormConfig() {
    this.ProductEditID = null
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
        product_variations: [{}],
        product_item_balance: [{}]
      },
      fields: [
        {
          fieldGroup: [
            {
              className: 'col-12 custom-form-card-block p-0',
              key: 'products',
              fieldGroupClassName: 'row m-0 pr-0 responsive-row',
              fieldGroup: [
                {
                  className: 'col-sm-9 col-12 p-0',
                  fieldGroupClassName: 'row m-0 p-0',
                  fieldGroup: [
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'product_mode',
                      type: 'productModes-dropdown',
                      templateOptions: {
                        label: 'Product Mode',
                        placeholder: 'Select Product Mode',
                        dataKey: 'product_mode_id',
                        dataLabel: 'mode_name',
                        required: true,
                        options: []
                      },
                      
                      hooks: {
                        onInit: (field: any) => {
                          // Load the dropdown data from the API
                          this.http.get('products/item-master/').subscribe((response: any) => {
                            if (response && response.data) {
                              const options = response.data.map((item: any) => ({
                                value: item.item_master_id,
                                label: item.mode_name
                              }));

                              // Update the field's options
                              field.templateOptions.options = options;

                              // If in edit mode, select the current value
                              if (this.ProductEditID && this.formConfig.model.products?.product_mode_id) {
                                const currentId = this.formConfig.model.products.product_mode_id;
                                const matchedOption = options.find((opt: any) => opt.value === currentId);
                                if (matchedOption) {
                                  field.formControl.setValue(matchedOption.value);
                                }
                              }
                            }
                          });
                        },
                        onChanges: (field: any) => {
                          if (field._subscription) {
                            field._subscription.unsubscribe();
                          }

                          field._subscription = field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                              // Store the selected product mode ID
                              this.formConfig.model['products']['product_mode_id'] = data;
                              console.log("Product Mode changed to:", data); // Added logging

                               // Get the selected mode name for use in visibility conditions
                                 // Extract just the UUID from the selected value
                               this.formConfig.model['products']['product_mode_id'] = typeof data === 'object' ? data.item_master_id : data;
        
        
                                // Store the mode name for visibility conditions
                                const selectedOption = field.templateOptions.options.find((option: any) => option.value === data);
                                if (selectedOption) {
                                  this.selectedProductMode = selectedOption.label;
                                  console.log("Product Mode changed to:", selectedOption.label);
                                }
                            

                              // Find the type field using a recursive search through all form fields
                              const findFieldByKey = (fieldGroups: any[], key: string): any => {
                                for (const fieldGroup of fieldGroups) {
                                  if (fieldGroup.key === key) return fieldGroup;

                                  if (fieldGroup.fieldGroup) {
                                    const found = findFieldByKey(fieldGroup.fieldGroup, key);
                                    if (found) return found;
                                  }

                                  if (fieldGroup.fieldArray && fieldGroup.fieldArray.fieldGroup) {
                                    const found = findFieldByKey(fieldGroup.fieldArray.fieldGroup, key);
                                    if (found) return found;
                                  }
                                }
                                return null;
                              };

                              // Find the type field in the form structure
                              const typeField = findFieldByKey(this.formConfig.fields[0].fieldGroup, 'type_id');

                              if (typeField && data) {
                                console.log("Found Type field:", typeField);

                                // Reset the Type field value
                                typeField.formControl.setValue(null);

                                // Enable the field if it was disabled
                                typeField.templateOptions.disabled = false;

                                // Find the selected Product Mode to get its name
                                const selectedOption = field.templateOptions.options.find((option: any) => option.value === data);
                                if (selectedOption) {
                                  console.log("Selected option:", selectedOption);

                                  const filterUrl = `masters/product_types/?mode_type=${encodeURIComponent(selectedOption.label)}`;
                                  console.log('Fetching type data from:', filterUrl);

                                  // Update the placeholder while loading
                                  typeField.templateOptions.placeholder = 'Loading types...';
                                  typeField.templateOptions = { ...typeField.templateOptions };

                                  // Directly fetch the filtered data
                                  this.http.get(filterUrl).subscribe(
                                    (response: any) => {
                                      console.log('API response for types:', response);

                                      let typeOptions = null;

                                      if (response && response.data && Array.isArray(response.data)) {
                                        typeOptions = response.data;
                                      } else if (response && Array.isArray(response)) {
                                        typeOptions = response;
                                      } else if (response && response.results && Array.isArray(response.results)) {
                                        typeOptions = response.results;
                                      }

                                      if (typeOptions && typeOptions.length > 0) {
                                        console.log(`Received ${typeOptions.length} type options`);

                                        // Format options with simple value/label pairs like GST dropdown
                                        const formattedOptions = typeOptions.map(item => ({
                                          value: item.type_id, // Use just the ID as the value
                                          label: item.type_name // Use the name as the label
                                        }));

                                        // Update the options
                                        typeField.templateOptions.options = formattedOptions;
                                        typeField.templateOptions.disabled = false;
                                        typeField.templateOptions.placeholder = 'Select Type';
                                        typeField.templateOptions = { ...typeField.templateOptions };
                                        
                                        // Find the "Finished Product" option
                                        const finishedProductOption = formattedOptions.find(
                                          (option: any) => option.label.toLowerCase() === 'finished product'
                                        );
                                        
                                        if (finishedProductOption) {
                                          // Set it as the default value
                                          typeField.formControl.setValue(finishedProductOption.value);
                                          
                                          // Update the model
                                          if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                            this.formConfig.model['products']['type_id'] = finishedProductOption.value;
                                            console.log("Default Type set to Finished Product:", finishedProductOption.value);
                                          }
                                        }
                                      } else {
                                        typeField.templateOptions.options = [];
                                        typeField.templateOptions.disabled = false;
                                        typeField.templateOptions.placeholder = 'No types available';
                                        typeField.templateOptions = { ...typeField.templateOptions };
                                      }
                                    },
                                    error => {
                                      console.error('Error fetching type options:', error);
                                      typeField.templateOptions.disabled = false;
                                      typeField.templateOptions.options = [];
                                      typeField.templateOptions.placeholder = 'Error loading types';
                                      typeField.templateOptions = { ...typeField.templateOptions };
                                    }
                                  );
                                }
                              }
                            } else {
                              console.error('Form config or product mode data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      key: 'name',
                      type: 'input',
                      className: 'col-md-4 col-sm-6 col-12',
                      templateOptions: {
                        label: 'Name',
                        placeholder: 'Enter Name',
                        required: true,
                        // disabled: true
                      },
                      hooks: {
                        onInit: (field: any) => {
                          // Auto-fill Print Name when Name is entered
                          field.formControl.valueChanges.subscribe((value: string) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                              this.formConfig.model['products']['print_name'] = value;
                              // Find the print_name field and update its form control
                              const printNameField = field.parent.fieldGroup.find((f: any) => f.key === 'print_name');
                              if (printNameField && printNameField.formControl) {
                                printNameField.formControl.setValue(value);
                              }
                            }
                          });
                        }
                      },
                    },
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'print_name',
                      type: 'input',
                      templateOptions: {
                        label: 'Print Name',
                        placeholder: 'Enter Print Name',
                        required: true,
                      }
                    },
                    {
                      className: 'col-md-4 col-sm-6 col-12',
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
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'product_group',
                      type: 'productGroups-dropdown',
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
                      type: 'productCategories-dropdown',
                      className: 'col-md-4 col-sm-6 col-12',
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
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'gst_input',
                      type: 'select',
                      templateOptions: {
                        label: 'GST Percentage',
                        placeholder: 'Select GST Percentage',
                        required: false,
                        options: [
                          { value: 3, label: '3%' },
                          { value: 5, label: '5%' },
                          { value: 9, label: '9%' },
                          { value: 12, label: '12%' },
                          { value: 18, label: '18%' }
                        ]
                      }
                    },   
                    {
                      key: 'stock_unit',
                      type: 'productStockUnits-dropdown',
                      className: 'col-md-4 col-sm-6 col-12',
                      templateOptions: {
                        label: 'Stock Unit',
                        dataKey: 'stock_unit_id',
                        dataLabel: "stock_unit_name",
                        options: [],
                        required: false,
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
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'hsn_code',
                      type: 'select',
                      templateOptions: {
                        label: 'HSN',
                        placeholder: 'Enter or Select HSN Code',
                        required: false,
                        options: [
                          { value: '0101', label: '0101' },
                          { value: '0201', label: '0201' },
                          { value: '0301', label: '0301' },
                          { value: '0401', label: '0401' },
                          { value: '0501', label: '0501' }
                        ],
                        // allowCustomValue: true // Allow users to enter their own value
                      }
                    }, 
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'balance',
                      type: 'input',
                      defaultValue: 0.00,
                      templateOptions: {
                        label: 'Balance',
                        readonly: true,
                        required: false, 
                      }
                  },
                  {
                    className: 'col-md-4 col-sm-6 col-12',
                    key: 'physical_balance',
                    type: 'input',
                    defaultValue: 0,
                    templateOptions: {
                      label: 'Physical Balance',
                      required: false,
                      type: 'number'
                    },
                    hooks: {
                      onInit: (field) => {
                        field.formControl.valueChanges.subscribe(() => {
                          const balance = field.model?.balance || 0;
                          const physical = field.model?.physical_balance || 0;

                          field.model.balance_diff = physical - balance;
                        });
                      }
                    }
                  },
                  {
                    className: 'col-md-4 col-sm-6 col-12',
                    key: 'balance_diff',
                    type: 'input',
                    templateOptions: {
                      label: 'Balance Diff.',
                      readonly: true,
                      type: 'number'
                    },
                    expressionProperties: {
                      'model.balance_diff': (model) => {
                        const balance = Number(model?.balance) || 0;
                        const physical = Number(model?.physical_balance) || 0;

                        // 🔥 ERP RULE: no physical count → no difference
                        if (!physical) {
                          return 0;
                        }

                        return physical - balance;
                      }
                    }
                  },

                  ]
                },
                {
                  className: 'col-sm-3 col-12 p-0',
                  // key: 'products',
                  fieldGroupClassName: "ant-row row mx-0 mt-2",
                  fieldGroup: [
                    {
                      key: 'picture',
                      type: 'file',
                      className: 'ta-cell pr-md col d-flex justify-content-md-center pr-0',
                      templateOptions: {
                        label: 'Picture',
                        required: false,
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
                    label: 'Advanced info'
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
                            // {
                            //   className: 'col-md-4 col-sm-6 col-12',
                            //   key: 'gst_input',
                            //   type: 'select',
                            //   templateOptions: {
                            //     label: 'GST Percentage',
                            //     placeholder: 'Select GST Percentage',
                            //     required: false,
                            //     options: [
                            //       { value: 3, label: '3%' },
                            //       { value: 5, label: '5%' },
                            //       { value: 9, label: '9%' },
                            //       { value: 12, label: '12%' },
                            //       { value: 18, label: '18%' }
                            //     ]
                            //   }
                            // },    
                            {
                              key: 'brand',
                              type: 'productBrands-dropdown',
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
                            // {
                            //   key: 'item_type',
                            //   type: 'select',
                            //   className: 'col-3',
                            //   templateOptions: {
                            //     label: 'Item Type',
                            //     dataKey: 'item_type_id',
                            //     dataLabel: "item_name",
                            //     options: [],
                            //     required: false,
                            //     lazy: {
                            //       url: 'masters/product_item_type/',
                            //       lazyOneTime: true
                            //     }
                            //   },
                            //   hooks: {
                            //     onChanges: (field: any) => {
                            //       field.formControl.valueChanges.subscribe((data: any) => {
                            //         if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                            //           this.formConfig.model['products']['item_type_id'] = data?.item_type_id;
                            //         } else {
                            //           console.error('Form config or lead_status data model is not defined.');
                            //         }
                            //       });
                            //     }
                            //   }
                            // },
                            {
                              key: 'type',
                              type: 'productType-dropdown',
                              className: 'col-3',
                              templateOptions: {
                                label: 'Type',
                                dataKey: 'type_id',
                                dataLabel: "type_name",
                                placeholder: 'Select Product Mode first',
                                options: [],
                                required: false,
                                disabled: true
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe((data: any) => {
                                    if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                      // Store just the ID value
                                      this.formConfig.model['products']['type_id'] = data.type_id;
                                      console.log("Type changed to:", data);
                                    } else {
                                      console.error('Form config or type_id data model is not defined.');
                                    }
                                  });
                                },
                                onInit: (field: any) => {
                                  // We need to wait for the Product Mode to load type options first
                                  const checkForOptions = setInterval(() => {
                                    if (field.templateOptions.options && field.templateOptions.options.length > 0) {
                                      clearInterval(checkForOptions);
                                      
                                      // Find the "Finished Product" option
                                      const finishedProductOption = field.templateOptions.options.find(
                                        (option: any) => option.label.toLowerCase() === 'finished product'
                                      );
                                      
                                      if (finishedProductOption) {
                                        // Set the default value
                                        field.formControl.setValue(finishedProductOption.value);
                                        
                                        // Update the model
                                        if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                          this.formConfig.model['products']['type_id'] = finishedProductOption.value;
                                          console.log("Default Type set to Finished Product:", finishedProductOption.value);
                                        }
                                      }
                                    }
                                  }, 500); // Check every 500ms
                                  
                                  // Clear the interval after 10 seconds to prevent infinite checking
                                  setTimeout(() => clearInterval(checkForOptions), 10000);
                                }
                              }
                            },
                            {
                              key: 'unit_options',
                              type: 'productUnitOptions-dropdown',
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
                                          unit_options_id: option.unit_options_id,
                                          unit_name: option.unit_name,
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
                              key: 'pack_unit',
                              type: 'packUnits-dropdown',
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
                              type: 'GpackUnits-dropdown',
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
                                required: false
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
                                required: false,
                              },
                              hideExpression: (model) => {
                                // Check if `unit_options` exists, and check the value of `unit_name`
                                const unitName = model.unit_options ? model.unit_options.unit_name : undefined;
                                return unitName !== 'Stock Pack GPack Unit';  // Hide if it's not 'Stock Pack Unit'
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
                              className: 'col-3 d-flex align-items-center',
                              key: 'print_barcode',
                              type: 'checkbox',
                              templateOptions: {
                                label: 'Print Barcode'
                              }
                            }
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
                    label: 'Variations'
                  },
                  fieldGroup: [
                    {
                      fieldGroupClassName: "",
                      fieldGroup: [
                        {
                          key: 'product_variations',
                          type: 'table',
                          className: 'custom-form-list product-table',
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
                                key: 'size',
                                type: 'productSizes-dropdown',
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
                                hooks: {
        onChanges: (field: any) => {
          field.formControl.valueChanges.subscribe((data: any) => {
            const rowIndex = +field.parent.key;
            if (!this.formConfig.model['product_variations'][rowIndex]) {
              this.formConfig.model['product_variations'][rowIndex] = {};
            }
            // Extract just the UUID
            this.formConfig.model['product_variations'][rowIndex]['size_id'] = 
              data?.size_id || null;
          });
        }
      }
                              },
                              {
                                key: 'color',
                                type: 'productColors-dropdown',
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
                                },
                                hooks: {
        onChanges: (field: any) => {
          field.formControl.valueChanges.subscribe((data: any) => {
            const rowIndex = +field.parent.key;
            if (!this.formConfig.model['product_variations'][rowIndex]) {
              this.formConfig.model['product_variations'][rowIndex] = {};
            }
            // Extract just the UUID
            this.formConfig.model['product_variations'][rowIndex]['color_id'] = 
              data?.color_id || null;
          });
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
                                  required: false
                                }
                              },
                              {
                                key: 'quantity',
                                type: 'input',
                                templateOptions: {
                                  label: 'Quantity',
                                  hideLabel: true,
                                  placeholder: 'Enter Quantity',
                                  required: false,
                                  type: 'number'
                                },
                                hooks: {
                                  onChanges: (field: any) => {
                                    field.formControl.valueChanges.subscribe(() => {
                                      this.updateBalanceFromVariations();
                                    });
                                  }
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
                          className: 'custom-form-list product-table',
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
                                type: 'warehouseLocations-dropdown',
                                templateOptions: {
                                  label: 'Location',
                                  dataKey: 'location_id',
                                  dataLabel: 'location_name',
                                  options: [], // This will be populated dynamically based on the warehouse selected
                                  hideLabel: true,
                                  required: false,
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
                                  required: false
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
                    label: 'Sale Info'
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
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'sales_description',
                              type: 'input',
                              templateOptions: {
                                label: 'Sales Description',
                                placeholder: 'Enter Sales Description'
                              }
                            },
                            {
                              key: 'sales_gl',
                              type: 'productSalesGL-dropdown',
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              templateOptions: {
                                label: 'Sales GL',
                                dataKey: 'sales_gl_id',
                                dataLabel: "name",
                                options: [],
                                required: false,
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
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'mrp',
                              type: 'input',
                              templateOptions: {
                                label: 'MRP',
                                placeholder: 'Enter MRP',
                                required: false
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'minimum_price',
                              type: 'input',
                              templateOptions: {
                                label: 'Min Price',
                                placeholder: 'Enter Minimum Price'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'sales_rate',
                              type: 'input',
                              templateOptions: {
                                label: 'Sales Rate',
                                placeholder: 'Enter Sales Rate',
                                required: false
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'wholesale_rate',
                              type: 'input',
                              templateOptions: {
                                label: 'Wholesale Rate',
                                placeholder: 'Enter Wholesale Rate'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'dealer_rate',
                              type: 'input',
                              templateOptions: {
                                label: 'Dealer Rate',
                                placeholder: 'Enter Dealer Rate'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'rate_factor',
                              type: 'input',
                              templateOptions: {
                                label: 'Rate Factor',
                                placeholder: 'Enter Rate Factor'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'discount',
                              type: 'input',
                              defaultValue: 0.00,
                              templateOptions: {
                                label: 'Discount',
                                placeholder: 'Enter Discount'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'dis_amount',
                              type: 'input',
                              defaultValue: 0.00,
                              templateOptions: {
                                label: 'Disc Amt',
                                placeholder: 'Enter Disc Amt',
                                required: false
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
                    label: 'Purchase Info'
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
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'purchase_description',
                              type: 'input',
                              templateOptions: {
                                label: 'Purchase Description',
                                placeholder: 'Enter Purchase Description'
                              }
                            },
                            {
                              key: 'purchase_gl',
                              type: 'productPurchaseGL-dropdown',
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              templateOptions: {
                                label: 'Purchase GL',
                                dataKey: 'purchase_gl_id',
                                dataLabel: "name",
                                options: [],
                                required: false,
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
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'minimum_purchase_price',
                              type: 'input',
                              templateOptions: {
                                label: 'Min Purchase Price',
                                placeholder: 'Enter Minimum Purchase Price'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'purchase_rate',
                              type: 'input',
                              templateOptions: {
                                label: 'Purchase Rate',
                                placeholder: 'Enter Purchase Rate'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'purchase_rate_factor',
                              type: 'input',
                              templateOptions: {
                                label: 'Purchase Rate Factor',
                                placeholder: 'Enter Purchase Rate Factor'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
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
                  fieldGroupClassName: 'row m-0 pr-0',
                  props: {
                    label: 'Attributes Info'
                  },
                  hideExpression: () => {
                // Only hide if selectedProductMode is explicitly set to a non-Inventory value
                return this.selectedProductMode && this.selectedProductMode !== 'Inventory';
              },

                  fieldGroup: [
                    {
                      className: 'col-12 p-0',
                      key: 'products',
                      fieldGroupClassName: "ant-row mx-0 row align-items-end mt-2",
                      fieldGroup: [
                        {
                          className: 'col-md-4 col-sm-6 col-12',
                          key: 'minimum_level',
                          type: 'input',
                          templateOptions: {
                            label: 'Minimum Level',
                            placeholder: 'Enter Minimum Level'
                          }
                        },
                        {
                          className: 'col-md-4 col-sm-6 col-12',
                          key: 'maximum_level',
                          type: 'input',
                          templateOptions: {
                            label: 'Maximum Level',
                            placeholder: 'Enter Maximum Level'
                          }
                        },
                        {
                          className: 'col-md-4 col-sm-6 col-12',
                          key: 'weighscale_mapping_code',
                          type: 'text',
                          templateOptions: {
                            label: 'Weighscale Mapping Code',
                            placeholder: 'Enter Weighscale Mapping Code'
                          }
                        },
                        {
                          key: 'drug_type',
                          type: 'select',
                          className: 'col-md-4 col-sm-6 col-12',
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
                          className: 'col-md-4 col-sm-6 col-12',
                          key: 'salt_composition',
                          type: 'text',
                          templateOptions: {
                            label: 'Salt Composition',
                            placeholder: 'Enter Salt Composition'
                          }
                        }
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
  downloadExcelTemplate() {
    this.isDownloading = true;
    this.http.get('products/download-template/', {
      responseType: 'blob'
    }).subscribe({
      next: (res: Blob) => {
        this.isDownloading = false;
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(res);
        a.href = url;
        a.download = 'Product_Import_Template.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.notification.success('Success', 'Template downloaded successfully');
      },
      error: (error) => {
        this.isDownloading = false;
        console.error('Download error', error);
        this.notification.error('Error', 'Failed to download template. Please try again.');
      }
    });
  }

  // Close modal using Bootstrap instance
  closeModal() {
    const modal = document.getElementById('importModal');
    if (modal) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  showImportModal() {
    // Reset the import state for a fresh start
    this.resetImportState();
    
    // Reset the import form model to ensure fresh start
    this.importFormConfig.model = {};

    // Force reset the fields to clear any cached file
    this.importFormConfig.fields = [
      {
        key: 'file',
        type: 'file',
        label: 'Select Excel File',
        props: {
          displayStyle: 'files',
          multiple: false,
          acceptedTypes: '.xlsx,.xls'
        },
        required: true
      }
    ];

    // Show the modal after resetting
    const modal = document.getElementById('importModal');
    if (modal) {
      // Bootstrap 5 modal show
      const modalInstance = new (window as any).bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  // Define the initial import form configuration 
  importFormConfig: any = {
    fields: [
      {
        key: 'file',
        type: 'file',
        label: 'Select Excel File',
        props: {
          displayStyle: 'files',
          multiple: false,
          acceptedTypes: '.xlsx,.xls'
        },
        required: true
      }
    ],
    submit: {
      label: 'Import',
      submittedFn: (formData: any) => {
        this.handleImport(formData);
      }
    },
    model: {}
  };

  // Reset import state for new import
  resetImportState() {
    this.isImporting = false;
    this.importProgress = 0;
    this.importStatusMessage = '';
    this.importCompleted = false;
    this.importResults = null;
  }

  // Simulate progress for better UX (since we don't have real progress from server)
  simulateProgress() {
    this.importProgress = 0;
    const progressInterval = setInterval(() => {
      if (this.importProgress < 90 && this.isImporting) {
        // Slow down as we approach 90%
        const increment = Math.max(1, Math.floor((90 - this.importProgress) / 10));
        this.importProgress = Math.min(90, this.importProgress + increment);
        
        // Update status messages based on progress
        if (this.importProgress < 30) {
          this.importStatusMessage = 'Reading Excel file...';
        } else if (this.importProgress < 60) {
          this.importStatusMessage = 'Validating data...';
        } else if (this.importProgress < 90) {
          this.importStatusMessage = 'Importing records to database...';
        }
      } else {
        clearInterval(progressInterval);
      }
    }, 500);

    return progressInterval;
  }

  // Handle the import process with loading states
  handleImport(formData: any) {
    const rawFile = formData.file[0]?.rawFile;
    if (!rawFile || !(rawFile instanceof File)) {
      this.notification.error('Error', 'No valid file selected!');
      return;
    }

    // Reset and start import
    this.resetImportState();
    this.isImporting = true;
    this.importStatusMessage = 'Preparing import...';

    const uploadData = new FormData();
    uploadData.append('file', rawFile);

    // Add headers to skip the default error interceptor
    const headers = { 'X-Skip-Error-Interceptor': 'true' };

    // Start progress simulation
    const progressInterval = this.simulateProgress();

    this.http.post('products/upload-excel/', uploadData, { headers }).subscribe({
      next: (res: any) => {
        clearInterval(progressInterval);
        this.importProgress = 100;
        this.importStatusMessage = 'Import completed!';
        this.isImporting = false;
        this.importCompleted = true;

        console.log('Upload success', res);

        // Parse results
        const successMatch = res.message?.match(/(\d+)/);
        const successCount = successMatch ? parseInt(successMatch[1], 10) : 0;
        const errorCount = res.errors?.length || 0;
        const totalRecords = successCount + errorCount;

        // Store results for display
        this.importResults = {
          success: errorCount === 0,
          totalRecords: totalRecords,
          successCount: successCount,
          errorCount: errorCount,
          errors: res.errors?.slice(0, 10) || [] // Show first 10 errors
        };

        // Notifications commented out - results shown in modal instead
        // if (errorCount === 0) {
        //   this.notification.success(
        //     'Success',
        //     res.message || 'Products imported successfully',
        //     { nzDuration: 3000 }
        //   );
        // } else if (successCount > 0) {
        //   this.notification.warning(
        //     'Partial Import',
        //     `${successCount} products imported, ${errorCount} failed.`,
        //     { nzDuration: 5000 }
        //   );
        // } else {
        //   const missingFieldErrors = res.errors?.filter((e: any) =>
        //     e.error && e.error.includes('Missing required field:')
        //   ) || [];
        //   if (missingFieldErrors.length > 0) {
        //     const missingFields = missingFieldErrors.map((e: any) => {
        //       const match = e.error.match(/Missing required field: (.+)/);
        //       return match ? match[1] : '';
        //     }).filter(Boolean);
        //     this.notification.error(
        //       'Import Failed',
        //       `Required fields missing: ${missingFields.join(', ')}`,
        //       { nzDuration: 6000 }
        //     );
        //   }
        // }
      },
      error: (error) => {
        clearInterval(progressInterval);
        this.isImporting = false;
        this.importCompleted = true;
        this.importProgress = 100;

        console.error('Upload error', error);

        const errorResponse = error.error || {};
        const errorMessage = errorResponse.message || 'Import failed';

        // Store error results
        this.importResults = {
          success: false,
          totalRecords: 0,
          successCount: 0,
          errorCount: 1,
          errors: [{ row: 0, error: errorMessage }]
        };

        // Notifications commented out - results shown in modal instead
        // if (errorMessage.includes('Excel template format mismatch')) {
        //   this.notification.error(
        //     'Excel Template Error',
        //     'Excel template format mismatch. Please download the correct template.',
        //     { nzDuration: 5000 }
        //   );
        // } else if (errorMessage.includes('missing required data')) {
        //   this.notification.error(
        //     'Import Failed',
        //     'Some rows are missing required data. Please check your Excel file.',
        //     { nzDuration: 5000 }
        //   );
        // } else {
        //   this.notification.error(
        //     'Import Failed',
        //     errorMessage,
        //     { nzDuration: 5000 }
        //   );
        // }
      }
    });
  }

  // Close modal and refresh list after viewing results
  closeImportAndRefresh() {
    this.resetImportState();
    this.closeModal();
    this.showProductsListFn();
  }

  // Start a new import (reset state but keep modal open)
  startNewImport() {
    this.resetImportState();
    this.showImportModal();
  }
}



