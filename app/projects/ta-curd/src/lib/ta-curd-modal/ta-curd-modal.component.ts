import { Component, Input, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef } from '@angular/core';
import { TaActionService, TaCoreModule } from '@ta/ta-core';
import { TaFormComponent, TaFormModule } from '@ta/ta-form';
import { TaTableComponent, TaTableModule } from '@ta/ta-table';
import { TaCurdConfig } from '../ta-curd-config';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { FomrlyMasterAdvSelectFieldsModule } from 'src/app/admin-commmon/fomrly-master-adv-select-fields.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ta-curd-modal',
  templateUrl: './ta-curd-modal.component.html',
  styleUrls: ['./ta-curd-modal.component.css'],
  standalone: true,
  imports: [CommonModule,
    TaCoreModule,
    TaTableModule,
    NzGridModule,
    NzCardModule,
    NzIconModule,
    NzDrawerModule,
    forwardRef(() => TaFormComponent),
    FomrlyMasterAdvSelectFieldsModule,
    NzButtonModule,
    NzModalModule]
})
export class TaCurdModalComponent implements OnInit {
  @Input() options: TaCurdConfig | any;
  @ViewChild('table', { static: true }) table: TaTableComponent | undefined;
  @ViewChild('form', { static: false }) form: TaFormComponent | undefined;
  @Input() customProductTemplate!: TemplateRef<any>; //Added this customProductTemplate
  visible = false;
  formTitle = "Create";
  constructor(private taAction: TaActionService, private cdr: ChangeDetectorRef, private http: HttpClient) { }

  ngOnInit(): void {
    //// console.log('tacurdConfig', this.options);
    if (!this.options.formConfig.submit) this.options.formConfig.submit = {};
    if (!this.options.formConfig.formState) this.options.formConfig.formState = {};
    // Store initial model for reset on create
    if (this.options.formConfig.model && !this.options.formConfig.initialModel) {
      this.options.formConfig.initialModel = JSON.parse(JSON.stringify(this.options.formConfig.model));
    }
    if (this.options.formConfig.submit) {
      this.options.formConfig.submit.submittedFn = (res: any) => {
        this.table?.reload();
        this.close();
      };
    }
  }
  tableAction(action: any) {
    console.log('event', action);

    if (action) {
      if (action.action && action.action.type === 'edit') {
        this.options.formConfig.formState.viewMode = false;
        this.formTitle = 'Update ' + (this.options.formConfig.title || '');
        
        // Check if we need to fetch full data (for nested forms like Products)
        const pkId = this.options.tableConfig?.pkId || 'id';
        const recordId = action.data[pkId];
        const formUrl = this.options.formConfig?.url;
        
        // Set pkId on formConfig so ta-form knows which field to check for PUT vs POST
        this.options.formConfig.pkId = pkId;
        
        // If form has a URL and data structure seems nested (has initialModel with nested keys)
        if (formUrl && recordId && this.hasNestedModel()) {
          // Fetch full data from API
          this.http.get(`${formUrl}${recordId}/`).subscribe({
            next: (res: any) => {
              let fullData = res?.data || res;
              console.log('Full data from API (before cleanup):', JSON.parse(JSON.stringify(fullData)));
              
              // Clean up the data - sync _id fields with their object values
              fullData = this.cleanupModelData(fullData);
              
              // Ensure pkId is at root level for PUT request detection
              if (!fullData[pkId] && recordId) {
                fullData[pkId] = recordId;
              }
              
              console.log('Full data after cleanup:', JSON.parse(JSON.stringify(fullData)));
              
              // Ensure all arrays from initialModel have at least their default values
              const initialModel = this.options.formConfig?.initialModel;
              if (initialModel) {
                Object.keys(initialModel).forEach(key => {
                  const initialValue = initialModel[key];
                  // If initial model has an array, ensure the data has it too
                  if (Array.isArray(initialValue)) {
                    if (!fullData[key] || !Array.isArray(fullData[key]) || fullData[key].length === 0) {
                      // Use initial model's array as default
                      fullData[key] = JSON.parse(JSON.stringify(initialValue));
                    }
                  }
                });
              }
              
              // Set model BEFORE opening - ensure Angular detects the change
              this.options.formConfig.model = JSON.parse(JSON.stringify(fullData));
              this.cdr.detectChanges();
              
              // Delay opening to ensure model is set
              setTimeout(() => {
                this.open();
                this.cdr.detectChanges();
                
                // Additional patches after form is rendered
                setTimeout(() => {
                  if (this.form && this.form.formlyForm) {
                    this.form.formlyForm.options?.resetModel(fullData);
                    this.cdr.detectChanges();
                  }
                }, 100);
                
                setTimeout(() => {
                  if (this.form && this.form.form) {
                    this.form.form.patchValue(fullData);
                    this.cdr.detectChanges();
                  }
                }, 200);
              }, 50);
            },
            error: (err) => {
              console.error('Error fetching full data:', err);
              // Fallback to using table data
              this.setModelAndOpen(action.data);
            }
          });
        } else {
          // Use table data directly for flat forms
          this.setModelAndOpen(action.data);
        }

      } else if (action.action && action.action.type === 'view') {
        this.options.formConfig.formState.viewMode = true;
        this.formTitle = 'View ' + (this.options.formConfig.title || '');
        this.setModelAndOpen(action.data);
      } else {
        // this.taAction.doAction(action.action, action.data)
      }
    }
  }

  // Helper to check if model has nested structure
  private hasNestedModel(): boolean {
    const initialModel = this.options.formConfig?.initialModel;
    if (!initialModel) return false;
    // Check if any key in initial model is an object or array (nested)
    return Object.values(initialModel).some(val => 
      val !== null && (typeof val === 'object' || Array.isArray(val))
    );
  }

  // Helper to clean up model data - sync _id fields with their nested object values
  private cleanupModelData(data: any): any {
    if (!data || typeof data !== 'object') return data;
    
    const cleaned = Array.isArray(data) ? [...data] : { ...data };
    
    Object.keys(cleaned).forEach(key => {
      const value = cleaned[key];
      
      // If this key ends with _id, check if the value is an object (should be UUID string)
      if (key.endsWith('_id') && value && typeof value === 'object' && !Array.isArray(value)) {
        // The value is an object but should be a UUID - extract the ID from the object
        // Look for a key in the object that matches this key name (e.g., type_id field in type_id object)
        if (value[key]) {
          cleaned[key] = value[key];
          console.log(`Extracted UUID from object for ${key}: ${cleaned[key]}`);
        } else {
          // Try to find any key ending with _id in the object
          const idKey = Object.keys(value).find(k => k.endsWith('_id'));
          if (idKey && value[idKey]) {
            cleaned[key] = value[idKey];
            console.log(`Extracted UUID from ${idKey} for ${key}: ${cleaned[key]}`);
          }
        }
      }
      // If this is a non-_id object field, recursively clean it
      else if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Also check if there's a sibling _id field that needs syncing
        const idKey = key + '_id';
        if (cleaned.hasOwnProperty(idKey)) {
          // The nested object should have an ID field with the same name
          if (value[idKey]) {
            cleaned[idKey] = value[idKey];
            console.log(`Synced ${idKey}: ${cleaned[idKey]}`);
          }
        }
        // Recursively clean nested objects
        cleaned[key] = this.cleanupModelData(value);
      }
      // If this is an array, clean each item
      else if (Array.isArray(value)) {
        cleaned[key] = value.map(item => this.cleanupModelData(item));
      }
    });
    
    return cleaned;
  }

  // Helper to set model and open modal
  private setModelAndOpen(data: any): void {
    this.options.formConfig.model = JSON.parse(JSON.stringify(data));
    this.open();
    setTimeout(() => {
      if (this.form) {
        this.form.form.patchValue(data);
        this.form.formlyForm?.options?.resetModel(data);
      }
    }, 100);
  }
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
  openDrawer() {
    this.formTitle = 'Create ' + this.options.formConfig.title;
    // Clear pkId for create mode - ensures POST request is used
    delete this.options.formConfig.pkId;
    // Reset model to initial structure if defined, otherwise empty object
    if (this.options.formConfig.initialModel) {
      this.options.formConfig.model = JSON.parse(JSON.stringify(this.options.formConfig.initialModel));
    } else {
      this.options.formConfig.model = {};
    }
    this.visible = true;
  }


}
