import { Component, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-ledger-groups',
  templateUrl: './ledger-groups.component.html',
  styleUrls: ['./ledger-groups.component.scss']
})
export class LedgerGroupsComponent {
  
  constructor(private http: HttpClient, private injector: Injector) {}
  
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/ledger_groups/',
      title: 'Ledger Groups',
      pkId: "ledger_group_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['ledger_group_id', 'name','code','inactive','under_group','nature']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
      defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'code', 
          name: 'Code',
          sort: true
        },
        {
          fieldKey: 'inactive',
          name: 'Inactive',
          sort: true,
          type: 'boolean'
        },
        {
          fieldKey: 'under_group', 
          name: 'Under Group',
          sort: true
        },
        {
          fieldKey: 'nature',
          name: 'Nature',
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
              apiUrl: 'masters/ledger_groups'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/ledger_groups'
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
      url: 'masters/ledger_groups/',
      title: 'Ledger Groups',
      pkId: "ledger_group_id",
      exParams: [
        {
          key: 'under_group_id',
          type: 'script',
          value: 'data.under_group.ledger_group_id'
        }
      ],
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup:[
            {
              key: 'name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Code',
                placeholder: 'Auto-generated',
                readonly: true
              },
              hooks: {
                onInit: ((http) => {
                  return (field: any) => {
                    // Only auto-generate for new records (no ledger_group_id and no existing code)
                    if (!field.model?.ledger_group_id && !field.model?.code) {
                      const underGroupId = field.model?.under_group_id;
                      
                      const url = underGroupId 
                        ? `masters/generate_ledger_code/?type=group&parent_id=${underGroupId}`
                        : `masters/generate_ledger_code/?type=group`;
                      
                      http.get(url).subscribe((res: any) => {
                        if (res?.data?.code) {
                          field.formControl.setValue(res.data.code);
                          if (field.model) {
                            field.model['code'] = res.data.code;
                          }
                        }
                      }, (error) => {
                        console.error('Error generating code:', error);
                      });
                    } else if (!field.model?.ledger_group_id && field.model?.code) {
                      // Clear old code if it's a new form but has stale code
                      field.formControl.setValue('');
                      if (field.model) {
                        field.model['code'] = '';
                      }
                    }
                  };
                })(this.http)
              }
            },
            {
              key: 'under_group',
              type: 'ledger-group-dropdown',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Under Group',
                placeholder: 'Select Under Group',
                dataKey: 'ledger_group_id',
                dataLabel: 'name',
                options: [],
                lazy: {
                  url: 'masters/ledger_groups/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: ((http) => {
                  return (field: any) => {
                    field.formControl.valueChanges.subscribe((selectedGroup: any) => {
                      const codeField = field.form.get('code');
                      
                      if (selectedGroup && selectedGroup.ledger_group_id) {
                        // Update under_group_id in model
                        if (field.model) {
                          field.model['under_group_id'] = selectedGroup.ledger_group_id;
                        }
                        
                        // Regenerate code
                        if (codeField) {
                          const url = `masters/generate_ledger_code/?type=group&parent_id=${selectedGroup.ledger_group_id}`;
                          http.get(url).subscribe((res: any) => {
                            if (res?.data?.code) {
                              codeField.setValue(res.data.code);
                              if (field.model) {
                                field.model['code'] = res.data.code;
                              }
                            }
                          }, (error) => {
                            console.error('Error generating code:', error);
                          });
                        }
                      } else if (selectedGroup === null || selectedGroup === undefined) {
                        // Clear case - regenerate root level code
                        if (field.model) {
                          field.model['under_group_id'] = null;
                        }
                        
                        if (codeField) {
                          http.get('masters/generate_ledger_code/?type=group').subscribe((res: any) => {
                            if (res?.data?.code) {
                              codeField.setValue(res.data.code);
                              if (field.model) {
                                field.model['code'] = res.data.code;
                              }
                            }
                          }, (error) => {
                            console.error('Error generating code:', error);
                          });
                        }
                      }
                    });
                  };
                })(this.http)
              }
            },
            {
              key: 'nature',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 pb-md-0 px-1',
              templateOptions: {
                label: 'Nature',
                placeholder: 'Enter Nature'
              }
            },
            {
              key: 'inactive',
              type: 'checkbox',
              className: 'col-md-6 col-12 px-1',
              templateOptions: {
                label: 'Inactive'
              }
            },
          ]
        }
      ]
    }

  }
}