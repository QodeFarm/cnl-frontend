import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaFormConfig } from '@ta/ta-form';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  showProductsList: boolean = false;
  showForm: boolean = false;
  ProductEditID: any;
  formConfig: TaFormConfig = {};
  // router: any;
  // deleteProductID: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showProductsList = false;
    this.showForm = true;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

    // set sale_order default value
    // this.formConfig.model['sale_order']['order_type'] = 'sale_order';
  
    // to get SaleOrder number for save
    // this.getOrderNo();
  }

  hide(){
      document.getElementById('modalClose').click();
  }

  editProducts(event) {
    console.log('event', event);
    this.ProductEditID = event;
    this.http.get('products/products/' + event).subscribe((res: any) => {
      console.log('--------> res ', res);
      console.log("Result ended here")
      if (res) {
        console.log('Edit started')
        this.formConfig.model = res;
        // Set labels for update
        this.formConfig.submit.label = 'Update';
        // Show form after setting form values
        this.formConfig.pkId = 'product_id';
        console.log("Edit runnnig")
        this.formConfig.model['product_id'] = this.ProductEditID;
        console.log("showfarm runnnig")
        this.showForm = true;
      }
    });
    this.hide();
  }

  // onDelete(productId: string) {
  //   // Perform deletion logic here (assuming synchronous operation)
  //   console.log(`Deleting product with ID ${productId}`);

  //   // After deletion, navigate back to product list
  //   this.router.navigate(['/products-list']);
  // }

  onDelete(productId: string) {
    if (confirm(`Are you sure you want to delete product with ID ${productId}?`)) {
      
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
        // label:'Submit',
        submittedFn : ()=>this.ngOnInit()        
      },
      reset: {

      },
      fields: [
        {
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'name',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Name',
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'product_group',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Product Group',
                dataKey: 'product_group_id',
                dataLabel: "group_name",
                options: [],
                lazy: {
                  url: 'products/product_groups/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'category',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Category',
                dataKey: 'category_id',
                dataLabel: "category_name",
                options: [],
                lazy: {
                  url: 'products/product_categories/',
                  lazyOneTime: true
                },
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'type',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Type',
                dataKey: 'type_id',
                dataLabel: "type_name",
                options: [],
                lazy: {
                  url: 'masters/product_types/',
                  lazyOneTime: true
                },
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Code',
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
              key: 'print_name',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Print Name',
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'hsn_code',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'HSN',
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'barcode',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Barcode',
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'unit_options',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Unit Options',
                dataKey: 'unit_options_id',
                dataLabel: "unit_name",
                options: [],
                required: true,
                lazy: {
                  url: 'masters/unit_options/',
                  lazyOneTime: true,
                },
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'gst_input',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'GST Input',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'stock_unit',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Stock Unit',
                dataKey: 'stock_unit_id',
                dataLabel: "stock_unit_name",
                options: [],
                lazy: {
                  url: 'products/product_stock_units/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'print_barcode',
              type: 'checkbox',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Print Barcode',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'gst_classification',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'GST Classification',
                dataKey: 'gst_classification_id',
                dataLabel: "type",
                options: [],
                lazy: {
                  url: 'products/product_gst_classifications/',
                  lazyOneTime: true
                },
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'sales_description',
              type: 'text',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Sales Description',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'sales_gl',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Sales GL',
                required: true,
                dataKey: 'sales_gl_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'products/product_sales_gl/',
                  lazyOneTime: true
                },
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'mrp',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'MRP',
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'minimum_price',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Min Price',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'sales_rate',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Sales Rate',
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'wholesale_rate',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Wholesale Rate',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'dealer_rate',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Dealer Rate',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'rate_factor',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Rate Factor',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'discount',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Discount',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'dis_amount',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Dis Amount',
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'purchase_description',
              type: 'text',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Purchase Description',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'purchase_gl',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Purchase GL',
                required: true,
                dataKey: 'purchase_gl_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'products/product_purchase_gl/',
                  lazyOneTime: true
                },
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'purchase_rate',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Purchase Rate',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'purchase_rate_factor',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Purchase Rate Factor',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'purchase_discount',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Purchase Discount',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'brand',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Brand',
                dataKey: 'brand_id',
                dataLabel: "brand_name",
                options: [],
                lazy: {
                  url: 'masters/product_brands/',
                  lazyOneTime: true
                },
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'status',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Status',
                options: [
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' }
                ],
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
          ]
        }
      ]
    }
  }
}