import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-asset-categories',
  templateUrl: './asset-categories.component.html',
  styleUrls: ['./asset-categories.component.scss']
})
export class AssetCategoriesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'http://195.35.20.172:8000/api/v1/assets/asset_categories/',
      title: 'Asset Categories',
      pkId: "asset_category_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['asset_category_id', 'category_name']
      },
      cols: [
        {
          fieldKey: 'category_name',
          name: 'Category Name',
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
              apiUrl: 'http://195.35.20.172:8000/api/v1/assets/asset_categories'
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
      url: 'http://195.35.20.172:8000/api/v1/assets/asset_categories/',
      title: 'Asset Categories',
      pkId: "asset_category_id",
      fields: [
        {
          key: 'category_name',
          type: 'input',
          className: 'ta-cell pr-md col-md-6',
          templateOptions: {
            label: 'Category Name',
            placeholder: 'Enter Category Name',
            required: true,
          }
        },
      ]
    }
  }
}
