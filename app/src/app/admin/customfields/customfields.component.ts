import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';

@Component({
  selector: 'app-customfields',
  templateUrl: './customfields.component.html',
  styleUrls: ['./customfields.component.scss']
})
export class CustomfieldsComponent {
  showCustomFieldList: boolean = false;
  showForm: boolean = false;
  customFieldEditID: any;
  showOptionsSection: boolean = false;  // Controls the visibility of custom field options

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.showCustomFieldList = false;
    this.showForm = false;
    this.customFieldEditID = null;
    this.setFormConfig();
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose')?.click();
  }

  editCustomField(event: any) {
    this.customFieldEditID = event;
    this.http.get('customfields/customfieldscreate/' + event).subscribe((res: any) => {
      if (res && res.data) {
        console.log("Res : ", res);
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'custom_field_id';
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['custom_field_id'] = this.customFieldEditID;
        this.showForm = true;
  
        // Show or hide the options section based on the field type in edit mode
        const fieldType = res.data.field_type?.toLowerCase();
        this.showOptionsSection = ['multi-select', 'select', 'radio'].includes(fieldType);
      }
    });
    this.hide();
  }

  showCustomFieldListFn() {
    this.showCustomFieldList = true;
  }

  setFormConfig() {
    this.customFieldEditID = null;
    this.formConfig = {
      url: "customfields/customfieldscreate/",
      formState: {
        viewMode: false,
      },
      showActionBtn: true,
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model: {
        custom_field: {},
        custom_field_options: [{}]
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          key: 'custom_field',
          fieldGroup: [
            {
              key: 'field_name',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Field Name',
                placeholder: 'Enter Custom Field Name',
                required: true,
              }
            },
            {
              key: 'entity',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                dataKey: 'entity_id',
                dataLabel: "entity_name",
                label: 'Entity Name',
                placeholder: 'Select Entity Name',
                lazy: {
                  url: 'masters/entities/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    console.log("data in entity", data);
                    if (data && data.entity_id) {
                      this.formConfig.model['custom_field']['entity_id'] = data.entity_id;
                    }
                  });
                }
              }
            },
            {
              key: 'field_type',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Field Type',
                placeholder: 'Select Field Type',
                required: true,
                dataKey: 'field_type_id',
                dataLabel: 'field_type_name',
                lazy: {
                  url: 'masters/fieldtypes/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    console.log("Field Type Changed:", data);  // Log to check data object
                    if (data && data.field_type_id) {
                      // Show options section if field type is Multi-Select, Select, or Radio
                      this.formConfig.model['custom_field']['field_type_id'] = data.field_type_id;
                      this.showOptionsSection = ['Multi-Select', 'Select', 'Radio'].includes(data.field_type_name);
                      console.log("showOptionsSection set to:", this.showOptionsSection);  // Debug log
                    }
                  });
                }
              }
            },
            {
              key: 'validation_rules',
              type: 'textarea',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Validation Rules',
                placeholder: 'Enter validation rules as JSON',
                rows: 4,
              }
            },
            {
              key: 'is_required',
              type: 'checkbox',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Is Required',
              }
            },
          ]
        },
        
        {
          key: 'custom_field_options',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Custom Field Options',
            addText: 'Add Option',
            tableCols: [
              {
                name: 'option_value',
                label: 'Option Value'
              },
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'option_value',
                type: 'input',
                templateOptions: {
                  label: 'Option Value',
                  placeholder: 'Enter Option',
                  hideLabel: true,
                }
              }
            ]
          },
          hideExpression: () => !this.showOptionsSection  // Dynamically hide/show the table
        }
      ]
    };
  }
}
