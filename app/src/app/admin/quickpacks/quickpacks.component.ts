import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { QuickpacksListComponent } from './quickpacks-list/quickpacks-list.component';

@Component({
  selector: 'app-quickpacks',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, QuickpacksListComponent],
  templateUrl: './quickpacks.component.html',
  styleUrls: ['./quickpacks.component.scss']
})
export class QuickpacksComponent implements OnInit {
  quickPackID: any;
  showQuickPackList: boolean = false;
  showForm: boolean = false;
  productOptions: any;
  @ViewChild(QuickpacksListComponent) QuickpacksListComponent!: QuickpacksListComponent;
  unitOptionOfProduct: any[] | string = []; // Initialize as an array by default

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
    this.QuickpacksListComponent?.refreshTable();
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
        },
        {
          key: 'quick_pack_data_items',
          type: 'script',
          value: 'data.quick_pack_data_items.map(m=> {m.size_id = m.size?.size_id || null;  return m ;})'
        },
        {
          key: 'quick_pack_data_items',
          type: 'script',
          value: 'data.quick_pack_data_items.map(m=> {m.color_id = m.color?.color_id || null;  return m ;})'
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
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          key: 'quick_pack_data',
          fieldGroup: [
            {
              key: 'name',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Quick Pack Name',
                placeholder: 'Enter Quick Pack Name',
                required: true
              }
            },
            {
              key: 'lot_qty',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Lot Quantity',
                placeholder: 'Enter Lot Quantity',
                required: true
              }
            },
            {
              key: 'active',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
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
              className: 'col-md-4 col-sm-6 col-12',
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
          type: 'repeat',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Products',
            addText: 'Add Product',
            tableCols: [
              { name: 'product', label: 'Product' },
              { name: 'size', label: 'Size' },
              { name: 'color', label: 'Color' },
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
                    // ***Product Details Auto Fill Code***
                    // field.formControl.valueChanges.subscribe(data => {
                    //   this.productOptions = data;
                    // });
                    const parentArray = field.parent;
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
                      
                      // Subscribe to value changes of the field
                      // ***Size dropdown will populate with available sizes when product in selected***
                      field.formControl.valueChanges.subscribe(selectedProductId => {
                        const product = this.formConfig.model.quick_pack_data_items[currentRowIndex]?.product;
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
                              this.formConfig.model.quick_pack_data_items[currentRowIndex]['size_id'] = null;
                              this.formConfig.model.quick_pack_data_items[currentRowIndex]['color_id'] = null;
                            }
                          });
                        } else {
                          console.error('Product not selected or invalid.');
                        }
                      });
                    } else {
                      console.error('Parent array is undefined or not accessible');
                    };
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
                  required: false,
                  lazy: {
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key;

                      // Subscribe to value changes when the form field changes
                      //**End of Size selection part */
                      // Subscribe to value changes of the size field
                      field.formControl.valueChanges.subscribe(selectedSizeId => {
                        const product = this.formConfig.model.quick_pack_data_items[currentRowIndex]?.product;
                        const size = this.formConfig.model.quick_pack_data_items[currentRowIndex]?.size;
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
                      });
                    } else {
                      console.error('Parent array is undefined or not accessible');
                    };
                  },
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (this.formConfig && this.formConfig.model) {
                        this.formConfig.model['quick_pack_data_items'][index]['size_id'] = data?.size_id;
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
                  label: 'Select Color',
                  dataKey: 'color_id',
                  hideLabel: true,
                  dataLabel: 'color_name',
                  options: [],
                  required: false,
                  lazy: {
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key;
                      
                      // Subscribe to value changes when the form field changes
                      field.formControl.valueChanges.subscribe(selectedColorId => {
                        const product = this.formConfig.model.quick_pack_data_items[currentRowIndex]?.product;
                        const size = this.formConfig.model.quick_pack_data_items[currentRowIndex]?.size;
                        const color = this.formConfig.model.quick_pack_data_items[currentRowIndex]?.color;
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
                          this.formConfig.model.quick_pack_data_items[currentRowIndex].color_id = color.color_id;
                        } else {
                          console.log(`No valid Color selected for :${product.name } at Row ${currentRowIndex}.`);
                          console.log({
                            product: product?.name,
                            size: size?.size_name,
                            color: color?.color_name,
                            selectedColorId: selectedColorId
                          })
                          if (color?.color_id === undefined) {
                            this.formConfig.model.quick_pack_data_items[currentRowIndex]['color'] = null
                          }
                        }
                      });
                    }
                  },
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (this.formConfig && this.formConfig.model) {
                        this.formConfig.model['quick_pack_data_items'][index]['color_id'] = data?.color_id;
                      } else {
                        console.error('Form config or color model is not defined.');
                      }
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
