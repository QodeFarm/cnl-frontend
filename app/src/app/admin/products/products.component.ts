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
        this.formConfig.model = res;
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
    this.formConfig = {
      url: 'products/products/',
      title: 'Products',
      pkId: "product_id",
      exParams: [
        {
          key: 'product_group_id',
          type: 'script',
          value: 'data.product_group.product_group_id'
        },
        {
          key: 'category_id',
          type: 'script',
          value: 'data.category.category_id'
        },
        {
          key: 'type_id',
          type: 'script',
          value: 'data.type.type_id'
        },
        {
          key: 'unit_options_id',
          type: 'script',
          value: 'data.unit_options.unit_options_id'
        },
        {
          key: 'stock_unit_id',
          type: 'script',
          value: 'data.stock_unit.stock_unit_id'
        },
        {
          key: 'gst_classification_id',
          type: 'script',
          value: 'data.gst_classification.gst_classification_id'
        },
        {
          key: 'sales_gl_id',
          type: 'script',
          value: 'data.sales_gl.sales_gl_id'
        },
        {
          key: 'purchase_gl_id',
          type: 'script',
          value: 'data.purchase_gl.purchase_gl_id'
        },
        {
          key: 'brand_id',
          type: 'script',
          value: 'data.brand.brand_id'
        },
      ],
      submit: {
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          fieldGroup: [
            // Left side fields
            {
              className: 'col-9 p-0',
              fieldGroupClassName: "ant-row",
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
                  key: 'product_group',
                  type: 'select',
                  templateOptions: {
                    label: 'Product Group',
                    dataKey: 'product_group_id',
                    dataLabel: 'group_name',
                    options: [],
                    lazy: {
                      url: 'products/product_groups/',
                      lazyOneTime: true
                    },
                    required: true
                  }
                },
                {
                  className: 'col-3',
                  key: 'category',
                  type: 'select',
                  templateOptions: {
                    label: 'Category',
                    dataKey: 'category_id',
                    dataLabel: 'category_name',
                    options: [],
                    lazy: {
                      url: 'products/product_categories/',
                      lazyOneTime: true
                    }
                  }
                },
                {
                  className: 'col-3',
                  key: 'type',
                  type: 'select',
                  templateOptions: {
                    label: 'Type',
                    dataKey: 'type_id',
                    dataLabel: 'type_name',
                    options: [],
                    lazy: {
                      url: 'masters/product_types/',
                      lazyOneTime: true
                    }
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
                        if (res && res.data && res.data.order_number) {
                          field.formControl.setValue(res.data.order_number);
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
                    required: true
                  }
                },
                {
                  className: 'col-3',
                  key: 'hsn_code',
                  type: 'input',
                  templateOptions: {
                    label: 'HSN',
                    placeholder: 'Enter HSN Code',
                    required: true
                  }
                },
                {
                  className: 'col-3',
                  key: 'barcode',
                  type: 'input',
                  templateOptions: {
                    label: 'Barcode',
                    placeholder: 'Enter Barcode',
                    required: true
                  }
                },
                {
                  className: 'col-3',
                  key: 'unit_options',
                  type: 'select',
                  templateOptions: {
                    label: 'Unit Options',
                    dataKey: 'unit_options_id',
                    dataLabel: 'unit_name',
                    options: [],
                    required: true,
                    lazy: {
                      url: 'masters/unit_options/',
                      lazyOneTime: true,
                    },
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
                  className: 'col-3',
                  key: 'stock_unit',
                  type: 'select',
                  templateOptions: {
                    label: 'Stock Unit',
                    dataKey: 'stock_unit_id',
                    dataLabel: 'stock_unit_name',
                    options: [],
                    lazy: {
                      url: 'products/product_stock_units/',
                      lazyOneTime: true
                    },
                    required: true
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
                  key: 'sales_gl',
                  type: 'select',
                  templateOptions: {
                    label: 'Sales GL',
                    dataKey: 'sales_gl_id',
                    dataLabel: 'name',
                    options: [],
                    lazy: {
                      url: 'products/product_sales_gl/',
                      lazyOneTime: true
                    },
                    required: true
                  }
                },
                {
                  className: 'col-3',
                  key: 'mrp',
                  type: 'input',
                  templateOptions: {
                    label: 'MRP',
                    placeholder: 'Enter MRP',
                    required: true
                  }
                },
                {
                  className: 'col-3',
                  key: 'sales_rate',
                  type: 'input',
                  templateOptions: {
                    label: 'Sales Rate',
                    placeholder: 'Enter Sales Rate',
                    required: true
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
                    required: true
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
                  className: 'col-3',
                  key: 'purchase_gl',
                  type: 'select',
                  templateOptions: {
                    label: 'Purchase GL',
                    dataKey: 'purchase_gl_id',
                    dataLabel: 'name',
                    options: [],
                    lazy: {
                      url: 'products/product_purchase_gl/',
                      lazyOneTime: true
                    },
                    required: true
                  }
                },
                {
                  className: 'col-3',
                  key: 'brand',
                  type: 'select',
                  templateOptions: {
                    label: 'Brand',
                    dataKey: 'brand_id',
                    dataLabel: 'brand_name',
                    options: [],
                    lazy: {
                      url: 'masters/product_brands/',
                      lazyOneTime: true
                    }
                  }
                },
              ]
            },
            // Right side for the picture and additional fields
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
                    // required: true
                  }
                },
                // Additional fields below picture
                {
                  className: 'col-12 mt-4',
                  key: 'gst_classification',
                  type: 'select',
                  templateOptions: {
                    label: 'GST Classification',
                    dataKey: 'gst_classification_id',
                    dataLabel: 'type',
                    options: [],
                    lazy: {
                      url: 'products/product_gst_classifications/',
                      lazyOneTime: true
                    },
                  }
                },
                {
                  className: 'col-12',
                  key: 'minimum_price',
                  type: 'input',
                  templateOptions: {
                    label: 'Min Price',
                    placeholder: 'Enter Minimum Price'
                  }
                },
                {
                  className: 'col-12',
                  key: 'rate_factor',
                  type: 'input',
                  templateOptions: {
                    label: 'Rate Factor',
                    placeholder: 'Enter Rate Factor'
                  }
                },
                // {
                //   className: 'col-12 mt-4',
                //   key: 'wholesale_rate',
                //   type: 'input',
                //   templateOptions: {
                //     label: 'Wholesale Rate',
                //     placeholder: 'Enter Wholesale Rate'
                //   }
                // },
                // {
                //   className: 'col-12',
                //   key: 'discount',
                //   type: 'input',
                //   templateOptions: {
                //     label: 'Discount',
                //     placeholder: 'Enter Discount'
                //   }
                // },
                // {
                //   className: 'col-12',
                //   key: 'dealer_rate',
                //   type: 'input',
                //   templateOptions: {
                //     label: 'Dealer Rate',
                //     placeholder: 'Enter Dealer Rate'
                //   }
                // }
              ]
            }
          ]
        }
      ]
    };
  }
}
