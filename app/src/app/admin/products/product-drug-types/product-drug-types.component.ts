import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaTableConfig } from '@ta/ta-table';

@Component({
  selector: 'app-product-drug-types',
  templateUrl: './product-drug-types.component.html',
  styleUrls: ['./product-drug-types.component.scss']
})
export class ProductDrugTypesComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/product_drug_types/',
      title: 'Product Drug Types',
      
      pkId: "drug_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['drug_type_id', 'drug_type_name']
      },
      cols: [
        {
          fieldKey: 'drug_type_name',
          name: 'Name'
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
              apiUrl: 'masters/product_drug_types'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/product_drug_types/',
      title: 'Product Drug Types',
      pkId: "drug_type_id",
      exParams: [
      ],
      fields: 
      [ 
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: 
        [
	       {
          key: 'drug_type_name',
          type: 'text',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Drug Type Name',
            placeholder: 'Enter Drug Type Name',
            required: true,
          }
        },
      ]
    }
      ]
    }

  }


  tableConfig: TaTableConfig = {
    apiUrl: 'masters/product_drug_types/',
    title: 'Product Drug Types',
    pkId: "drug_type_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['drug_type_id', 'drug_type_name']
    },
    cols: [
      {
        fieldKey: 'drug_type_name',
        name: 'Name'
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
            apiUrl: 'api/masters'
          },
          {
            type: 'callBackFn',
            label: 'Edit',
            // callBackFn: (row, action) => {
            //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            // }
          }
        ]
      }
    ]
  };
}
