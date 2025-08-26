import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.scss']
})
export class ItemMasterComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'products/item-master/', // relative to base API
      title: 'Product Modes',
      pkId: "item_master_id",
      pageSize: 10,
      globalSearch: {
        keys: ['item_master_id', 'mode_name', 'description']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'mode_name',
          name: 'Mode Name',
          sort: true
        },
        {
          fieldKey: 'description',
          name: 'Description',
          sort: false
        },
        {
          fieldKey: 'created_at',
          name: 'Created At',
          type: 'date',
          sort: true
        },
        {
          fieldKey: "item_master_id",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete this Item Master?",
              apiUrl: 'products/item-master'
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
      url: 'products/item-master/',
      title: 'Item Master',
      pkId: "item_master_id",
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'mode_name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Mode Name',
                placeholder: 'Enter Mode Name',
                required: true,
              }
            },
            {
              key: 'description',
              type: 'textarea',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter Description'
              }
            },
            {
              key: 'is_deleted',
              type: 'checkbox',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Is Deleted'
              }
            }
          ]
        }
      ]
    }
  };
}
