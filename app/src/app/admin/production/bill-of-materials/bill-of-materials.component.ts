import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-bill-of-materials',
  templateUrl: './bill-of-materials.component.html',
  styleUrls: ['./bill-of-materials.component.scss']
})

export class BillOfMaterialsComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'production/bill_of_materials/',
      title: 'Bill Of Materials',
      pkId: "bom_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['bom_id', 'component_name']
      },
      cols: [
        {
          fieldKey: 'component_name',
          name: 'Component Name'
        },
        {
          fieldKey: 'product_id',
          name: 'Product',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.name}`;
          },
        },
        {
          fieldKey: 'quantity_required',
          name: 'Quantity Required'
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [{
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'production/bill_of_materials'
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
      url: 'production/bill_of_materials/',
      title: 'Bill Of Materials',
      pkId: "bom_id",
      exParams: [
        {
          key: 'product_id',
          type: 'script',
          value: 'data.product.product_id'
        },
      ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'component_name',
              type: 'input',
              className: 'col-6',
              templateOptions: {
                label: 'Component Name',
                placeholder: 'Enter Component Name',
                required: false,
              }
            },
            {
              key: 'quantity_required',
              type: 'input',
              className: 'col-6',
              templateOptions: {
                label: 'Quantity Required',
                placeholder: 'Enter Quantity Required',
                required: false,
              }
            },
            {
              key: 'product',
              type: 'select',
              className: 'col-6 p-2',
              templateOptions: {
                label: 'Product',
                dataKey: 'product_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'products/products_get/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                }
              }
            }
          ]
        }
      ]
    }
  }
  formConfig: any;
}