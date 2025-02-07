import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent {
  

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'products/sizes/',
      title: 'Size',
      pkId: "size_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['size_id','size_name','size_category','size_system','length','height', 'width','size_unit','description']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'size_name',
          name: 'Size Name',
          sort: true
        },
        {
          fieldKey: 'size_category',
          name: 'Size Category',
          sort: true
        },
        {
          fieldKey: 'size_system',
          name: 'Size System',
          sort: true
        },
        {
          fieldKey: 'length',
          name: 'Length',
          sort: true
        },
        {
          fieldKey: 'height',
          name: 'Height',
          sort: true
        }, 
        {
          fieldKey: 'width',
          name: 'Width',
          sort: true
        },
        {
          fieldKey: 'size_unit',
          name: 'Size Unit',
          sort: true
        },
        {
          fieldKey: 'description',
          name: 'Description',
          sort: true
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
              apiUrl: 'products/sizes'
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
      url: 'products/sizes/',
      title: 'Sizes',
      pkId: "size_id",
      exParams: [],
      fields: [{
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: [
          {
          key: 'size_name',
          type: 'input',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Size Name',
            placeholder: 'Enter Size Name',
            required: true,
          }
        },
        {
          key: 'size_category',
          type: 'input',
          className: 'col-6 pb-3 pe-0',
          templateOptions: {
            label: 'Size Category',
            placeholder: 'Enter Size Category',
            required: true,
          }
        },
        {
          key: 'size_system',
          type: 'input',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Size System',
            placeholder: 'Enter Size System',
            required: true,
          }
        },
        {
          key: 'length',
          type: 'input',
          className: 'col-6 pb-3 pe-0',
          templateOptions: {
            label: 'Length',
            placeholder: 'Enter Length',
            required: true,
          }
        },
        {
          key: 'height',
          type: 'input',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Height',
            placeholder: 'Enter Height',
            required: true,
          }
        },
        {
          key: 'width',
          type: 'input',
          className: 'col-6 pb-3 pe-0',
          templateOptions: {
            label: 'Width',
            placeholder: 'Enter Width',
            required: true,
          }
        },
        {
          key: 'size_unit',
          type: 'input',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Designation Size Unit',
            placeholder: 'Enter Size Unit',
            required: true,
          }
        },
        {
          key: 'description',
          type: 'input',
          className: 'col-6 pb-3 pe-0',
          templateOptions: {
            label: 'Description',
            placeholder: 'Enter Description',
            required: true,
          }
        }
      ]
      }]
    }
  }

}