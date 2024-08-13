import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaTableConfig } from '@ta/ta-table';

declare var bootstrap: any;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
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
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'users/role'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            {
              type: 'callBackFn',
              callBackFn: (row, action) => {
                console.log(row);
                this.selectedRow = row;
                this.showConfig();
              },
              // label: 'Config',
              icon: 'fas fa-cog fa-fw'
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
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'role_name',
              type: 'input',
              className: 'col-md-6 col-12',
              templateOptions: {
                label: 'Role Nmae',
                placeholder: 'Enter Role Name',
                required: true,
              }
            },
            {
              key: 'description',
              type: 'textarea',
              className: 'col-md-6 col-12',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter description',
                required: true,
              }
            }
          ]
        }

      ]
    }

  }


  tableConfig: TaTableConfig = {
    apiUrl: 'users/role/',
    title: 'Roles',
    pkId: "role_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['id', 'first_name', 'last_name']
    },
    cols: [
      {
        fieldKey: '',
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
            apiUrl: 'api/users'
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
  selectedRow: any;
  moduleList: any = [];
  actionList: any;


  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {

    // action list
    this.http.get('users/actions/').subscribe((res: any) => {
      this.actionList = res.data;

      // module list 
      // mapping action list to each module
      this.http.get('users/modules/?sections=true').subscribe((res: any) => {
        this.moduleList = res.data.map((m: any) => {
          m.module_sections = m.module_sections.map((ms: any) => { ms.actions = JSON.parse(JSON.stringify(this.actionList)); return ms; })
          return m;
        })

        console.log('this.moduleList', this.moduleList);
      });
    });
  }

  showConfig() {

    this.http.get('users/role_permissions/' + this.selectedRow?.role_id).subscribe((res: any) => {
      console.log('get config', res.data);
      this.setConfig(res.data);
    });

    // modal open
    var myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {});
    myModal.show();

  }

  setConfig(resData) {
    this.moduleList.forEach(moduleStep => {
      resData.forEach(res => {
        if (moduleStep.module_id == res.module_id) {

          moduleStep.module_sections.forEach(moduleSectionStep => {
            if (moduleSectionStep.section_id == res.section_id) {

              moduleSectionStep.actions.forEach(actionStep => {
                if (actionStep.action_id == res.action_id) {
                  actionStep['selected'] = true;
                }

                if (moduleSectionStep.actions.every(a => a.selected == true)) {
                  moduleSectionStep['selected'] = true;
                }
                if (moduleStep.module_sections.every(b => b.selected == true)) {
                  moduleStep['selected'] = true;
                }
              })
            }
          })
        }
      });
    });
  }

  toggleAll(actions: any[], checked: boolean) {
    actions.forEach(action => action.selected = checked);
  }

  toggleSection(module: any, section: any, checked: boolean) {
    section.selected = checked;
    this.toggleAll(section.actions, checked);
    module.selected = module.module_sections.every((sec: any) => sec.selected);
  }

  toggleModule(module: any, checked: boolean) {
    module.selected = checked;
    module.module_sections.forEach((section: any) => {
      section.selected = checked;
      this.toggleAll(section.actions, checked);
    });
  }

  toggleAction(module: any, section: any, action: any, checked: boolean) {
    action.selected = checked;
    section.selected = section.actions.every((act: any) => act.selected);
    module.selected = module.module_sections.every((sec: any) => sec.selected);
  }

  saveActions() {
    let selectedList = [];
    this.moduleList.forEach(module => {
      module.module_sections.forEach(section => {
        section.actions.forEach(action => {
          if (action.selected) {
            selectedList.push({
              module_id: module.module_id,
              section_id: section.section_id,
              action_id: action.action_id,
              role_id: this.selectedRow.role_id
            });
          }
        });
      });
    });

    console.log('this.selectedList', selectedList);

    this.http.post('users/role_permissions/', selectedList).subscribe((res: any) => {
      console.log(res);
      // close modal
      document.getElementById('modalClose').click();
    })



  }

}
