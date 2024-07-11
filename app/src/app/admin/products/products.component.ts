import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent  {
  initLoading = true; // bug
  loadingMore = false;
  data: any[] = [];
  list: Array<{ loading: boolean; name: any }> = [];
  viewMode = 0;

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'products/products/?summary=true&summary=true&page=1&limit=10&sort[0]=name,DESC', //THIS SHOULD REMOVED IN FUTURE AND FIXED ACCORDNING TO THE COMMAN PATTERN
      title: 'Products',
      pkId: "product_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['product_id', 'name']
      },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'code',
          name: 'Code',
          sort: false
        },
        {
          fieldKey: 'unit_options.unit_name',
          name: 'Unit Name',
          sort: false,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return row.unit_options.unit_name;
          },
        },
        {
          fieldKey: 'sales_rate',
          name: 'Sales Rate',
          sort: false
        },
        {
          fieldKey: 'mrp', 
          name: 'MRP',
          sort: false
        },
        {
          fieldKey: 'dis_amount', 
          name: 'Dis Amount',
          sort: false
        },
        {
          fieldKey: 'product_balance',
          name: 'Product Balance',
          sort: false
        }, 
        {
          fieldKey: 'print_name',
          name: 'Print Name',
          sort: true
        },
        {
          fieldKey: 'hsn_code',
          name: 'HSN Code',
          sort: false
        },
        {
          fieldKey: 'barcode',
          name: 'Barcode',
          sort: false
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "are you Sure to delete?",
              apiUrl: 'products/products'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
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
      fields: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [

            {
              key: 'name',
              type: 'input',
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Code',
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'print_name',
              type: 'input',
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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
              className: 'ta-cell pr-md col-md-6 col-12',
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