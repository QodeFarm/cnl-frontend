import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-product-gst-classifications',
  templateUrl: './product-gst-classifications.component.html',
  styleUrls: ['./product-gst-classifications.component.scss']
})
export class ProductGstClassificationsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'products/product_gst_classifications/',
      title: 'Product GST Classifications',
      
      pkId: "gst_classification_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['id','type','code', 'hsn_or_sac_code','hsn_description']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'type',
          name: 'Type',
          sort: true
        },
        {
          fieldKey: 'code',
          name: 'Code',
          sort: true,
        },
        {
          fieldKey: 'hsn_or_sac_code', 
          name: 'hsn or sac Code',
          sort: true
        },
        {
          fieldKey: 'hsn_description', 
          name: 'hsn Description',
          sort: true
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
              confirmMsg: "Sure to delete?",
              apiUrl: 'products/product_gst_classifications'
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
      url: 'products/product_gst_classifications/',
      title: 'Product GST Classifications',
      pkId: "gst_classification_id",
      exParams: [],
      fields: 
      [ 
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: 
        [
	       {
              key: 'type',
              type: 'select',
              className: 'col-md-6 col-12 px-1 pb-3',
              templateOptions: {
                label: 'Type',
                required: true,
                options: [
                  {value: 'HSN', label: 'HSN'},
                  {value: 'SAC', label: 'SAC'},
                  {value: 'Both', label: 'Both'}
                ]
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
              className: 'col-md-6 col-12 px-1 pb-3',
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
              key: 'hsn_or_sac_code',
              type: 'input',
              className: 'col-md-6 col-12 px-1 pb-md-0 pb-3',
              templateOptions: {
                label: 'Hsn Or Sac Code',
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'hsn_description',
              type: 'textarea',
              className: 'col-md-6 col-12 px-1',
              templateOptions: {
                label: 'Hsn Description',
                required: true
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