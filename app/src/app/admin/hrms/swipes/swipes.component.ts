import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { SwipesListComponent } from './swipes-list/swipes-list.component';

@Component({
  selector: 'app-swipes',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule,SwipesListComponent],
  templateUrl: './swipes.component.html',
  styleUrls: ['./swipes.component.scss']
})
export class SwipesComponent {

  showSwipesList: boolean = false;
  showForm: boolean = false;
  SwipesEditID: any; 
  @ViewChild(SwipesListComponent) SwipesListComponent!: SwipesListComponent;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showSwipesList = false;
    this.showForm = true;
    this.SwipesEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editSwipes(event) {
    console.log('event', event);
    this.SwipesEditID = event;
    this.http.get('hrms/swipes/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'swipe_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };

  showSwipesListFn() {
    this.showSwipesList = true;
    this.SwipesListComponent?.refreshTable();
  };

  setFormConfig() {
    this.SwipesEditID = null;
    this.formConfig = {
      url: "hrms/swipes/",
      // title: 'leads',
      formState: {
        viewMode: false,
      },
      showActionBtn : true,
      exParams: [
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
        }
      ],
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model:{},

      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          fieldGroup: [
            {
              key: 'employee',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Employee',
                dataKey: 'employee_id',
                dataLabel: "first_name",
                options: [],
                lazy: {
                  url: 'hrms/employees/',
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
              key: 'swipe_time',
              type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Swipe Time',
                type: 'datetime-local',  // Use datetime-local for both date and time input
                placeholder: 'Select Swipe Date and Time',
                required: false,
              }
            },
          ]
        }
      ]
    }
  }
}

