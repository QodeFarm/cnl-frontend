import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { BomListComponent } from './bom-list/bom-list.component';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bom',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, BomListComponent],
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss']
})
export class BomComponent {
  showBomList: boolean = false;
  showForm: boolean = false;
  BomEditID: any;
  @ViewChild(BomListComponent) BomListComponent!: BomListComponent;
  dataToPopulate: any;

  constructor(private http: HttpClient, private route: ActivatedRoute, private cdRef: ChangeDetectorRef,) {};

  ngOnInit() {
    this.showBomList = false;
    this.showForm = false;
    this.BomEditID = null;
    // set form config
    this.setFormConfig();
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editBom(event) {
    this.BomEditID = event;
    this.http.get('production/bom/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'bom_id';
        // set labels for update
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['bom_id'] = this.BomEditID;
        this.showForm = true;
      }
    })
    this.hide();
  };


  showBomListFn() {
    this.showBomList = true;
    this.BomListComponent?.refreshTable();
  };

  loadProductVariations(field: FormlyFieldConfig, productValuechange: boolean = false) {
      const parentArray = field.parent;
  
      const product = field.formControl.value;
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

  setFormConfig() {
    this.BomEditID =null,
    this.dataToPopulate != undefined;
    this.formConfig = {
      url: "production/bom/",
      // title: 'bom',
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
        bom: {},
        bill_of_material: [{}],
      },
      fields: [
        //-----------------------------------------B O M -----------------------------------//
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          key: 'bom',
          fieldGroup: [
            {
              key: 'bom_name',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'BOM Name',
                placeholder: 'Enter BOM Name',
                required: true,
              },
              hooks: {
                onInit: (field: any) => {}
              },
            },
            {
              key: 'product',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Product',
                dataKey: 'product_id',
                dataLabel: "name",
                options: [],
                required: true,
                lazy: {
                  url: 'products/products/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['bom']) {
                      this.formConfig.model['bom']['product_id'] = data.product_id;
                    } else {
                      console.error('Form config or product data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'notes',
              type: 'textarea',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                type: 'input',
                label: 'Notes',
                placeholder: 'Enter Notes',
                required: false
              },
              hooks: {
                onInit: (field: any) => {}
              }
            }
          ]
        },
        // end of BOM
        //----------------------------------------- B I L L  O F  M A T E R I A L  -----------------------------------//
        {
          key: 'bill_of_material',
          type: 'table',
          className: 'custom-form-list no-ant-card',
          templateOptions: {
            title: 'Bill Of Material',
            addText: 'Add Materials',
            tableCols: [
              { name: 'product_id', label: 'Product' },
              { name: 'size_id', label: 'Size' },
              { name: 'color_id', label: 'Color' },
              { name: 'quantity', label: 'Quantity' },
              { name: 'unit_cost', label: 'Unit Cost' },
              { name: 'total_cost', label: 'Total Cost' },
              { name: 'notes', label: 'Notes' },
            ]
          },
          fieldArray: {
            fieldGroup: [
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
                    const existingProduct = this.dataToPopulate?.bill_of_material?.[currentRowIndex]?.product;
                    if (existingProduct) {
                      field.formControl.setValue(existingProduct);
                    }
              
                    this.loadProductVariations(field);
              
                    // Subscribe to value changes (to update sizes dynamically)
                    field.formControl.valueChanges.subscribe((data: any) => {
                      if (!this.formConfig.model['bill_of_material'][currentRowIndex]) {
                        console.error(`Products at index ${currentRowIndex} is not defined. Initializing...`);
                        this.formConfig.model['bill_of_material'][currentRowIndex] = {};
                      }
                      this.formConfig.model['bill_of_material'][currentRowIndex]['product_id'] = data?.product_id;
                      this.loadProductVariations(field);
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
                    const billOfMaterial = this.dataToPopulate?.bill_of_material?.[currentRowIndex];
                    
                    // Populate existing size if available
                    const existingSize = billOfMaterial?.size;
                    if (existingSize?.size_id) {
                      field.formControl.setValue(existingSize);
                    }
              
                    // Subscribe to value changes (Merged from onInit & onChanges)
                    field.formControl.valueChanges.subscribe((selectedSize: any) => {
                      const product = this.formConfig.model.bill_of_material[currentRowIndex]?.product;
                      if (!product?.product_id) {
                        console.warn(`Product missing for row ${currentRowIndex}, skipping color fetch.`);
                        return;
                      }
              
                      const size_id = selectedSize?.size_id || null;
                      const url = size_id
                        ? `products/product_variations/?product_id=${product.product_id}&size_id=${size_id}`
                        : `products/product_variations/?product_id=${product.product_id}&size_isnull=True`;
              
                      // Fetch available colors based on the selected size
                      this.http.get(url).subscribe((response: any) => {
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
              
                      // Update the model with selected size
                      if (this.formConfig?.model?.bill_of_material) {
                        this.formConfig.model.bill_of_material[currentRowIndex].size_id = selectedSize?.size_id;
                      } else {
                        console.error('Form config or model is not defined.');
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
                  placeholder: 'color',
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
                    const billOfMaterial = this.dataToPopulate?.bill_of_material?.[currentRowIndex];
              
                    // Populate existing color if available
                    const existingColor = billOfMaterial?.color;
                    if (existingColor) {
                      field.formControl.setValue(existingColor);
                    }
              
                    // Subscribe to value changes (Merged from onInit & onChanges)
                    field.formControl.valueChanges.subscribe((selectedColor: any) => {
                      const row = this.formConfig.model.bill_of_material[currentRowIndex];
                      if (!row?.product?.product_id) {
                        console.warn(`Product missing for row ${currentRowIndex}, skipping color update.`);
                        return;
                      }
              
                      const { product, size, color } = row;
                      const params = new URLSearchParams({ product_id: product.product_id });
              
                      if (color?.color_id) params.append("color_id", color.color_id);
                      else params.append("color_isnull", "True");
              
                      if (size?.size_id) params.append("size_id", size.size_id);
                      else params.append("size_isnull", "True");
              
                      // Update the model with selected color
                      row.color_id = color?.color_id || null;
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
                  required: true,
                  type: 'number'
                }
              },
              {
                key: 'unit_cost',
                type: 'input',
                templateOptions: {
                  label: 'Unit Cost',
                  placeholder: 'Enter Unit Cost',
                  hideLabel: true,
                  required: true,
                  type: 'number'
                },
                hooks:{
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      if (field.form && field.form.controls && field.form.controls.quantity && field.form.controls.unit_cost && data) {
                        const quantity = field.form.controls.quantity.value;
                        const unit_cost = field.form.controls.unit_cost.value;
                        if (quantity && unit_cost) {
                          field.form.controls.total_cost.setValue(parseInt(quantity) * parseInt(unit_cost));
                        }
                      } else {
                        field.form.controls.total_cost.setValue(0);
                      }
                    })
                  },
                }
              },
              {
                key: 'total_cost',
                type: 'input',
                templateOptions: {
                  label: 'Total Cost',
                  placeholder: 'Enter Total Cost',
                  hideLabel: true,
                  required: true,
                  disabled: true
                },
              },              
              {
                key: 'notes',
                type: 'text',
                templateOptions: {
                  label: 'Notes',
                  placeholder: 'Enter Notes',
                  hideLabel: true,
                  required: false
                }
              }
            ]
          }
        },
     ]
    }
  }
}