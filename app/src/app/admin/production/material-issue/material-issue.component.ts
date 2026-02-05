import { Component, OnInit, ViewChild, ChangeDetectorRef, PlatformRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';
import { TaFormComponent } from '@ta/ta-form';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialIssueListComponent } from './material-issue-list/material-issue-list.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LocalStorageService } from '@ta/ta-core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, MaterialIssueListComponent, NzModalModule, NzButtonModule, NzIconModule],
  selector: 'app-material-issue',
  templateUrl: './material-issue.component.html',
  styleUrls: ['./material-issue.component.scss']
})
export class MaterialIssueComponent implements OnInit, OnDestroy {
  @ViewChild('materialIssueForm', { static: false }) materialIssueForm: TaFormComponent | undefined;
  @ViewChild(MaterialIssueListComponent) MaterialIssueListComponent!: MaterialIssueListComponent;
  @ViewChild(TaFormComponent) taFormComponent!: TaFormComponent;
  showForm: boolean = false;
  MaterialIssueEditID: any;
  issueNumber: any;
  showMaterialIssueList: boolean = false;
  formConfig: any = {};
  tables: string[] = ['Material Issue', 'Material Issue Return'];
  availableTables: string[] = [];
  selectedTable: string;
  currentTable: string = 'Material Issue';

  // ========== DRAFT AUTO-SAVE PROPERTIES ==========
  private draftSaveSubject = new Subject<void>();
  private draftSaveSubscription: Subscription | null = null;
  private readonly DRAFT_KEY_PREFIX = 'cnl_material_issue_draft_';
  private readonly DRAFT_EXPIRY_HOURS = 24;
  showDraftRestoreModal: boolean = false;
  // =================================================

  fieldMapping = {
    'Material Issue Return': {
      sourceModel: 'material_issue',
      targetModel: 'material_issue_return',
      nestedModels: {
        items: 'return_items',
        attachments: 'return_attachments'
      }
    }
  };

  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorage: LocalStorageService) { }

  ngOnInit() {
    this.showMaterialIssueList = false;
    this.showForm = true;
    this.MaterialIssueEditID = null;
    // this.formConfig.model = {
    //   material_issue: {},
    //   items: [{}],
    //   attachments: []
    // };
    // this.showForm = true;
    this.setFormConfig();
    this.getIssueNo();
    this.initDraftAutoSave();
    this.checkAndRestoreDraft();
  }

  ngOnDestroy(): void {
    if (this.draftSaveSubscription) {
      this.draftSaveSubscription.unsubscribe();
    }
  }

  getIssueNo() {
    this.issueNumber = null;

    // Call backend to get next Material Issue number
    this.http.get('masters/generate_order_no/?type=MI').subscribe((res: any) => {
      if (res?.data?.order_number) {
        console.log('Generated Issue Number:', res.data.order_number);
        this.issueNumber = res.data.order_number;
        this.formConfig.model.material_issue.issue_no = this.issueNumber;
        // Patch value into the form control if available
        if (this.materialIssueForm?.form) {
          this.materialIssueForm.form.get('material_issue.issue_no')?.setValue(this.issueNumber);
        }
        // Or trigger change detection
        this.cdRef.detectChanges();
      }
    });
  }


  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }


  cleanMaterialIssuePayload(model) {
    const payload = JSON.parse(JSON.stringify(model));

    // Fix production_floor_id
    if (payload.material_issue && payload.material_issue.production_floor_id && typeof payload.material_issue.production_floor_id === 'object') {
      payload.material_issue.production_floor_id = payload.material_issue.production_floor_id.production_floor_id;
    }

    // Fix items array - filter out empty items first
    if (Array.isArray(payload.items)) {
      payload.items = payload.items
        .filter(item => item.product_id) // Filter out empty rows
        .map(item => {
        const newItem = { ...item };
        // Fix product_id (send only UUID)
        if (newItem.product_id && typeof newItem.product_id === 'object' && newItem.product_id.product_id) {
          newItem.product_id = newItem.product_id.product_id;
        }
        // Fix unit_options_id (send only UUID)
        if (newItem.unit_options_id && typeof newItem.unit_options_id === 'object' && newItem.unit_options_id.unit_options_id) {
          newItem.unit_options_id = newItem.unit_options_id.unit_options_id;
        }
        return newItem;
      });
    }

    return payload;
  }
  createMaterialIssue() {
    // Construct the payload as needed by your backend
    const payload = this.cleanMaterialIssuePayload(this.formConfig.model);

    this.http.post('production/material-issues/', payload)
      .subscribe(response => {
        this.clearDraft(); // Clear draft on successful creation
        this.notification.success('Record updated successfully', '');
        this.ngOnInit();
        this.taFormComponent.formlyOptions.resetModel([]);

      }, error => {
        console.error('Error creating record:', error);
      });
  }

  updateMaterialIssue() {
    // Construct the payload as needed by your backend
    const payload = this.cleanMaterialIssuePayload(this.formConfig.model);

    console.log('Updating Material Issue with ID===========:', this.MaterialIssueEditID, 'Payload:', payload);

    this.http.put(`production/material-issues/${this.MaterialIssueEditID}/`, payload)
      .subscribe(response => {
        console.log('Update response============:', response);
        this.notification.success('Record updated successfully', '');
        this.ngOnInit();
        this.taFormComponent.formlyOptions.resetModel([]);

      }, error => {
        console.error('Error updating record:', error);
      });
  }

displayInformation(product: any) {
  const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
  if (!cardWrapper || !product) return;

  // Remove existing info
  cardWrapper.querySelector('.center-message')?.remove();

  // Prepare unit info
  const unitData = product.unit_options
    ? `<span style="color: red;">Stock Unit:</span> <span style="color: blue;">${product.unit_options.unit_name || 'NA'}</span> |`
    : '';

  // Prepare info HTML
  const infoHtml = `
    <span style="font-size: 12px;">
      <span style="color: red;">Product Info:</span> <span style="color: blue;">${product.name || 'N/A'}</span> |
      <span style="color: red;">Balance:</span> <span style="color: blue;">${product.balance || 0}</span> |
      ${unitData}
    </span>
  `;

  // Add info to card
  const productInfoDiv = document.createElement('div');
  productInfoDiv.classList.add('center-message');
  productInfoDiv.innerHTML = infoHtml;
  cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
}

  setFormConfig() {
    // this.MaterialIssueEditID = null;
    this.formConfig = {
      // url: 'production/material-issues/',
      title: '',
      // pkId: 'material_issue_id',
      formState: {
        viewMode: false
      },
      showActionBtn: true,
      exPrams: [],
      submit: {
        label: 'Submit',
        submittedFn: () => {
          if (this.MaterialIssueEditID) {
            this.updateMaterialIssue();
          } else {
            this.createMaterialIssue();
          }
        }
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model: {
        material_issue: {},
        items: [{}, {}, {}, {}, {}],
        attachments: []
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block row ms-0",
          key: 'material_issue',
          fieldGroup: [
            {
              key: 'production_floor',
              type: 'productionFloors-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Production Floor',
                dataKey: 'production_floor_id',
                dataLabel: 'name',
                required: true,
                lazy: {
                  url: 'masters/production_floors/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onInit: (field: any) => {
                  // Subscribe to value changes
                  field.formControl.valueChanges.subscribe(data => {
                    if (data && data.production_floor_id) {
                      this.formConfig.model['material_issue']['production_floor_id'] = data.production_floor_id; // Update the model with the selected ledger_account_id
                      this.triggerDraftSave(); // Auto-save draft on production floor change
                    }
                  });
                }
              }
            },
            {
              key: 'issue_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Issue Date',
                required: true
              }
            },
            {
              key: 'issue_no',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Issue No',
                required: true,
                disabled: true
              }
            },
            {
              key: 'reference_no',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Reference No'
              }
            },
            {
              key: 'reference_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Reference Date'
              }
            },
            {
              key: 'remarks',
              type: 'textarea',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Remarks'
              }
            }
          ]
        },
        {
          key: 'items',
          type: 'repeat',
          className: 'custom-form-list product-table',
          templateOptions: {
            addText: 'Add Item',
            tableCols: [
              { name: 'product', label: 'Select Item' },
              { name: 'description', label: 'Description' },
              // { name: 'attribute', label: 'Attribute' },
              // { name: 'widget', label: 'Widget' },
              { name: 'unit_options_id', label: 'Unit' },
              { name: 'no_of_boxes', label: 'No. of Boxes' },
              { name: 'quantity', label: 'Quantity' },
              { name: 'rate', label: 'Rate' },
              { name: 'remark', label: 'Remark' },
              { name: 'amount', label: 'Amount' },
              { name: 'mrp', label: 'MRP' }
            ]
          },
          // ...existing code...
          fieldArray: {
            fieldGroup: [
              {
                key: 'selectItem',
                type: 'checkbox',
                defaultValue: false,
                templateOptions: {
                  hideLabel: true,
                },
                expressionProperties: {
                  'templateOptions.hidden': () => !(this.MaterialIssueEditID),
                }
              },
              {
                key: 'product',
                type: 'select',
                templateOptions: {
                  label: 'Product',
                  dataKey: 'product_id',
                  dataLabel: 'name',
                  hideLabel: true,
                  placeholder: 'Select Product',
                  options: [],
                  required: false,
                  lazy: {
                    url: 'products/products/?summary=true',
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
                    if (!parentArray) return;
                    const currentRowIndex = +parentArray.key;

                    // Show info for edit mode
                    const existingProduct = this.formConfig.model?.items?.[currentRowIndex]?.product;
                    if (existingProduct) {
                      field.formControl.setValue(existingProduct);
                      this.displayInformation(existingProduct);
                    }

                    // Show info when product changes
                    field.formControl.valueChanges.subscribe((data: any) => {
                      if (!this.formConfig.model.items[currentRowIndex]) {
                        this.formConfig.model.items[currentRowIndex] = {};
                      }
                      this.formConfig.model.items[currentRowIndex].product_id = data?.product_id;
                      if (data) {
                        this.displayInformation(data);
                        this.triggerDraftSave(); // Auto-save draft on product change
                      }
                    });
                  }
                }
                },
              {
                key: 'description',
                type: 'input',
                templateOptions: { label: 'Description', hideLabel: true } // <-- Add hideLabel
              },
              // {
              //   key: 'attribute',
              //   type: 'input',
              //   templateOptions: { label: 'Attribute', hideLabel: true }
              // },
              // {
              //   key: 'widget',
              //   type: 'input',
              //   templateOptions: { label: 'Widget', hideLabel: true }
              // },
              // {
              //   key: 'unit_options',
              //   type: 'select',
              //   templateOptions: {
              //     label: 'Unit',
              //     dataKey: 'unit_options_id',
              //     dataLabel: 'unit_name',
              //     lazy: { url: 'masters/unit_options', lazyOneTime: true },
              //     hideLabel: true
              //   }
              // },
              // Use this inside your items fieldGroup in material-issue.component.ts

            {
              type: 'select',
              key: 'unit_options_id',
              templateOptions: {
                label: 'Unit',
                placeholder: 'Unit',
                hideLabel: true,
                dataLabel: 'unit_name',
                dataKey: 'unit_options_id',
                bindId: true,
                required: false,
                lazy: {
                  url: 'masters/unit_options',
                  lazyOneTime: true
                }
              },
              hooks: {
                onInit: (field: any) => {
                  const parentArray = field.parent;
                  if (parentArray) {
                    const currentRowIndex = +parentArray.key;
                    // For edit mode, populate existing unit if available
                    const existingUnit = this.formConfig.model?.items?.[currentRowIndex]?.unit_options;
                    if (existingUnit && existingUnit.unit_options_id) {
                      field.formControl.setValue(existingUnit.unit_options_id);
                    }
                  }
                }
              }
            },
              {
                key: 'no_of_boxes',
                type: 'input',
                templateOptions: { label: 'No. of Boxes', type: 'number', hideLabel: true }
              },
              {
                key: 'quantity',
                type: 'input',
                templateOptions: { label: 'Quantity', type: 'number', required: false, hideLabel: true }
              },
              {
                key: 'rate',
                type: 'input',
                templateOptions: { label: 'Rate', type: 'number', hideLabel: true }
              },
              {
                key: 'remark',
                type: 'input',
                templateOptions: { label: 'Remark', hideLabel: true }
              },
              {
                key: 'amount',
                type: 'input',
                templateOptions: { label: 'Amount', type: 'number', disabled: true, hideLabel: true }
              },
              {
                key: 'mrp',
                type: 'input',
                templateOptions: { label: 'MRP', type: 'number', disabled: true, hideLabel: true }
              }
            ]
          }
          // ...existing code...
        },
        {
          key: 'attachments',
          type: 'file',
          className: 'col-md-4 col-sm-6 col-12',
          props: {
            displayStyle: 'files',
            multiple: true
          }
        }
      ]
    };
  }

  openCopyModal() {
    this.availableTables = this.tables.filter(table => table !== this.currentTable);
  }


  showMaterialIssueListFn() {
    this.showMaterialIssueList = true;
    this.MaterialIssueListComponent?.refreshTable();
    // Add logic to refresh list if needed
  }
  hide() {
    document.getElementById('modalClose')?.click();
  }


    editMaterialIssue(event) {
    console.log('Edit Material Issue ID===================:', event);
    this.MaterialIssueEditID = event;
    this.http.get('production/material-issues/' + event).subscribe((res: any) => {
      console.log('Fetched Material Issue Data for Edit================:', res);
      if (res && res.data) {
        console.log('Material Issue Data to be edited:================', res.data);
        this.formConfig.model = {
          material_issue: res.data.material_issue || {},
          items: res.data.items || [],
          attachments: res.data.attachments || []
        };
        this.formConfig.pkId = 'material_issue_id';
        this.formConfig.submit.label = 'Update';
          this.formConfig.model['sale_invoice_id'] = this.MaterialIssueEditID;
        this.showForm = true;
      } else {
        this.showForm = false;
      }
    });

    // Hide the modal after edit is triggered
    this.hide();
    // this.showMaterialIssueList = false;
  }

  // ================== DRAFT AUTO-SAVE METHODS ==================

  private getDraftKey(): string {
    const userId = this.localStorage.getItem('user')?.userId || 'default';
    return `${this.DRAFT_KEY_PREFIX}${userId}`;
  }

  private initDraftAutoSave(): void {
    if (this.draftSaveSubscription) {
      this.draftSaveSubscription.unsubscribe();
    }

    this.draftSaveSubscription = this.draftSaveSubject
      .pipe(debounceTime(1500))
      .subscribe(() => {
        this.saveDraft();
      });
  }

  triggerDraftSave(): void {
    if (!this.MaterialIssueEditID) {
      this.draftSaveSubject.next();
    }
  }

  private saveDraft(): void {
    try {
      if (this.MaterialIssueEditID) {
        return;
      }

      const model = this.formConfig.model;
      if (!model) {
        return;
      }

      const hasItems = model.items?.some((item: any) => item && item.product_id);
      const hasProductionFloor = model.material_issue?.production_floor_id;

      if (!hasItems && !hasProductionFloor) {
        return;
      }

      const draftData = {
        material_issue: model.material_issue || {},
        items: model.items || [],
        attachments: model.attachments || [],
        timestamp: Date.now()
      };

      sessionStorage.setItem(this.getDraftKey(), JSON.stringify(draftData));
      console.log('Material Issue Draft saved successfully');
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }

  private checkAndRestoreDraft(): void {
    try {
      if (this.MaterialIssueEditID) {
        return;
      }

      const draftJson = sessionStorage.getItem(this.getDraftKey());
      if (!draftJson) {
        return;
      }

      const draftData = JSON.parse(draftJson);

      const draftAge = Date.now() - (draftData.timestamp || 0);
      const maxAgeMs = this.DRAFT_EXPIRY_HOURS * 60 * 60 * 1000;
      if (draftAge > maxAgeMs) {
        this.clearDraft();
        console.log('Draft expired and cleared');
        return;
      }

      const hasItems = draftData.items?.some((item: any) => item && item.product_id);
      const hasProductionFloor = draftData.material_issue?.production_floor_id;

      if (!hasItems && !hasProductionFloor) {
        this.clearDraft();
        return;
      }

      this.showDraftRestoreModal = true;

    } catch (error) {
      console.error('Error checking draft:', error);
      this.clearDraft();
    }
  }

  confirmRestoreDraft(): void {
    try {
      const draftJson = sessionStorage.getItem(this.getDraftKey());
      if (!draftJson) {
        this.showDraftRestoreModal = false;
        return;
      }

      const draftData = JSON.parse(draftJson);

      if (draftData.material_issue) {
        const currentIssueNo = this.formConfig.model['material_issue']['issue_no'];
        this.formConfig.model['material_issue'] = {
          ...draftData.material_issue,
          issue_no: currentIssueNo
        };
      }

      if (draftData.items && draftData.items.length > 0) {
        this.formConfig.model['items'] = [...draftData.items];
      }

      if (draftData.attachments) {
        this.formConfig.model['attachments'] = draftData.attachments;
      }

      this.formConfig.model = { ...this.formConfig.model };
      this.cdRef.detectChanges();

      this.showDraftRestoreModal = false;
      console.log('Material Issue Draft restored successfully');

    } catch (error) {
      console.error('Error restoring draft:', error);
      this.showDraftRestoreModal = false;
      this.clearDraft();
    }
  }

  declineRestoreDraft(): void {
    this.clearDraft();
    this.showDraftRestoreModal = false;
  }

  clearDraft(): void {
    try {
      sessionStorage.removeItem(this.getDraftKey());
      console.log('Material Issue Draft cleared');
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }

  // ================== END DRAFT AUTO-SAVE METHODS ==================

}
