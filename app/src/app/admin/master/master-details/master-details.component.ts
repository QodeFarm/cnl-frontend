import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-master-details',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './master-details.component.html',
  styleUrls: ['./master-details.component.scss']
})
export class MasterDetailsComponent {
  masterCode: any;
  curdConfig: TaCurdConfig;
  constructor(private activRouter: ActivatedRoute) { }
  ngOnInit(): void {
    this.masterCode = this.activRouter.snapshot.params.code;
    this.getDetails();

  }

  getDetails() {
    switch (this.masterCode) {
      case 'role':
        this.curdConfig = {
          drawerSize: 500,
          drawerPlacement: 'right',
          tableConfig: {
            apiUrl: 'users/role/',
            title: 'User Roles',
            pkId: "role_id",
            pageSize: 10,
            "globalSearch": {
              keys: ['id', 'name']
            },
            cols: [
              {
                fieldKey: 'role_name',
                name: 'Name'
              },
              {
                fieldKey: 'description',
                name: 'Description',
                sort: true
              },
              {
                fieldKey: 'created_at',
                name: 'Created TS',
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
                    apiUrl: 'users/role/'
                  },
                  {
                    type: 'edit',
                    label: 'Edit'
                  },
                ]
              }
            ]
          },
          formConfig: {
            url: 'users/role/',
            title: 'User Role',
            pkId: "role_id",
            exParams: [
            ],
            fields: [
              {
                key: 'role_name',
                type: 'input',
                className: 'ta-cell pr-md',
                templateOptions: {
                  label: 'Role Nmae',
                  placeholder: 'Enter Role Name',
                  required: true,
                }
              },
              {
                key: 'description',
                type: 'textarea',
                className: 'ta-cell pr-md',
                templateOptions: {
                  label: 'Description',
                  placeholder: 'Enter description',
                  required: true,
                }
              }

            ]
          }
        }

        break;

      default:
        break;
    }
  }

}
