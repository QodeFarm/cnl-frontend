import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';
import { TaFormComponent } from '@ta/ta-form';
import { Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MaterialReceivedListComponent } from './material-received-list/material-received-list.component';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { LocalStorageService } from '@ta/ta-core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, MaterialReceivedListComponent, NzModalModule, NzButtonModule, NzIconModule],
  selector: 'app-material-received',
  templateUrl: './material-received.component.html',
  styleUrls: ['./material-received.component.scss']
})
export class MaterialReceivedComponent implements OnInit, OnDestroy {
  @ViewChild('materialReceivedForm', { static: false }) materialReceivedForm: TaFormComponent | undefined;
  @ViewChild(TaFormComponent) taFormComponent!: TaFormComponent;
  @ViewChild(MaterialReceivedListComponent)  MaterialReceivedListComponent!:  MaterialReceivedListComponent;
  
  showForm: boolean = false;
  MaterialReceivedEditID: any;
  receiptNumber: any;
  formConfig: any = {};
  showMaterialReceivedList: boolean = false;

  // --- Draft auto-save properties ---
  private draftSaveSubject = new Subject<void>();
  private draftSaveSubscription: Subscription | null = null;
  private readonly DRAFT_KEY_PREFIX = 'cnl_material_received_draft_';
  private readonly DRAFT_EXPIRY_HOURS = 24;
  showDraftRestoreModal = false;
  private pendingDraftData: any = null;

  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.showMaterialReceivedList = false;
    this.showForm = true;
    this.MaterialReceivedEditID = null;
    this.setFormConfig();
    this.getReceiptNo();
    this.initDraftAutoSave();
    this.checkAndRestoreDraft();
  }

  ngOnDestroy() {
    if (this.draftSaveSubscription) {
      this.draftSaveSubscription.unsubscribe();
    }
  }

  getReceiptNo() {
    this.receiptNumber = null;
    // Call backend to get next Material Received number
    this.http.get('masters/generate_order_no/?type=MR').subscribe((res: any) => {
      if (res?.data?.order_number) {
        this.receiptNumber = res.data.order_number;
        this.formConfig.model.material_received.receipt_no = this.receiptNumber;
        if (this.materialReceivedForm?.form) {
          this.materialReceivedForm.form.get('material_received.receipt_no')?.setValue(this.receiptNumber);
        }
        this.cdRef.detectChanges();
      }
    });
  }

  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  cleanMaterialReceivedPayload(model) {
    const payload = JSON.parse(JSON.stringify(model));
    // Fix production_floor_id
    if (payload.material_received && payload.material_received.production_floor_id && typeof payload.material_received.production_floor_id === 'object') {
      payload.material_received.production_floor_id = payload.material_received.production_floor_id.production_floor_id;
    }
    // Fix items array - filter out empty items first
    if (Array.isArray(payload.items)) {
      payload.items = payload.items
        .filter(item => item.product_id) // Filter out empty rows
        .map(item => {
        const newItem = { ...item };
        if (newItem.product_id && typeof newItem.product_id === 'object' && newItem.product_id.product_id) {
          newItem.product_id = newItem.product_id.product_id;
        }
        if (newItem.unit_options_id && typeof newItem.unit_options_id === 'object' && newItem.unit_options_id.unit_options_id) {
          newItem.unit_options_id = newItem.unit_options_id.unit_options_id;
        }
        return newItem;
      });
    }
    return payload;
  }

  createMaterialReceived() {
    const payload = this.cleanMaterialReceivedPayload(this.formConfig.model);
    this.http.post('production/material-received/', payload)
      .subscribe(response => {
        this.notification.success('Record created successfully', '');
        this.clearDraft();
        this.ngOnInit();
        this.taFormComponent.formlyOptions.resetModel([]);
      }, error => {
        console.error('Error creating record:', error);
      });
  }

  updateMaterialReceived() {
    const payload = this.cleanMaterialReceivedPayload(this.formConfig.model);
    this.http.put(`production/material-received/${this.MaterialReceivedEditID}/`, payload)
      .subscribe(response => {
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
    this.formConfig = {
      title: '',
      formState: { viewMode: false },
      showActionBtn: true,
      exPrams: [],
      submit: {
        label: 'Submit',
        submittedFn: () => {
          if (this.MaterialReceivedEditID) {
            this.updateMaterialReceived();
          } else {
            this.createMaterialReceived();
          }
        }
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model: {
        material_received: {},
        items: [{}, {}, {}, {}, {}],
        attachments: []
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block row ms-0",
          key: 'material_received',
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
                  field.formControl.valueChanges.subscribe(data => {
                    if (data && data.production_floor_id) {
                      this.formConfig.model['material_received']['production_floor_id'] = data.production_floor_id;
                      this.triggerDraftSave();
                    }
                  });
                }
              }
            },
            {
              key: 'receipt_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Receipt Date',
                required: true
              }
            },
            {
              key: 'receipt_no',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Receipt No',
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
              { name: 'unit_options_id', label: 'Unit' },
              { name: 'no_of_boxes', label: 'No. of Boxes' },
              { name: 'quantity', label: 'Quantity' },
              { name: 'rate', label: 'Rate' },
              { name: 'remark', label: 'Remark' },
              { name: 'amount', label: 'Amount' },
              { name: 'mrp', label: 'MRP' }
            ]
          },
          fieldArray: {
            fieldGroup: [
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
          this.triggerDraftSave();
        }
      });
    }
  }
},
              {
                key: 'description',
                type: 'input',
                templateOptions: { label: 'Description', hideLabel: true }
              },
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

  
  showMaterialReceivedListFn() {
    this.showMaterialReceivedList = true;
    this.MaterialReceivedListComponent?.refreshTable();
    
    // Add logic to refresh list if needed
  }

   hide() {
    document.getElementById('modalClose')?.click();
  }

  editMaterialReceived(event) {
    this.MaterialReceivedEditID = event;
    this.http.get('production/material-received/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = {
          material_received: res.data.material_received || {},
          items: res.data.items || [],
          attachments: res.data.attachments || []
        };
        this.formConfig.pkId = 'material_received_id';
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['material_received_id'] = this.MaterialReceivedEditID;
        this.showForm = true;
      } else {
        this.showForm = false;
      }
    });
    this.hide()
  }

  // --- Draft auto-save methods ---
  private getDraftKey(): string {
    const userId = this.localStorageService.getItem('user')?.user_id || 'default';
    return `${this.DRAFT_KEY_PREFIX}${userId}`;
  }

  private initDraftAutoSave() {
    if (this.draftSaveSubscription) {
      this.draftSaveSubscription.unsubscribe();
    }
    this.draftSaveSubscription = this.draftSaveSubject
      .pipe(debounceTime(1500))
      .subscribe(() => this.saveDraft());
  }

  private triggerDraftSave() {
    if (!this.MaterialReceivedEditID) {
      this.draftSaveSubject.next();
    }
  }

  private saveDraft() {
    if (this.MaterialReceivedEditID) return;
    const model = this.formConfig.model;
    const hasProductionFloor = model?.material_received?.production_floor_id;
    const hasItems = model?.items?.some((item: any) => item?.product_id);
    if (!hasProductionFloor && !hasItems) return;
    const draftData = {
      model: JSON.parse(JSON.stringify(model)),
      savedAt: new Date().toISOString()
    };
    sessionStorage.setItem(this.getDraftKey(), JSON.stringify(draftData));
  }

  private checkAndRestoreDraft() {
    if (this.MaterialReceivedEditID) return;
    const draftKey = this.getDraftKey();
    const draftJson = sessionStorage.getItem(draftKey);
    if (!draftJson) return;
    try {
      const draftData = JSON.parse(draftJson);
      const savedAt = new Date(draftData.savedAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - savedAt.getTime()) / (1000 * 60 * 60);
      if (hoursDiff > this.DRAFT_EXPIRY_HOURS) {
        sessionStorage.removeItem(draftKey);
        return;
      }
      this.pendingDraftData = draftData;
      this.showDraftRestoreModal = true;
    } catch (e) {
      sessionStorage.removeItem(draftKey);
    }
  }

  confirmRestoreDraft() {
    if (this.pendingDraftData?.model) {
      const restored = this.pendingDraftData.model;
      this.formConfig.model = {
        material_received: restored.material_received || {},
        items: restored.items || [{}, {}, {}, {}, {}],
        attachments: restored.attachments || []
      };
      this.cdRef.detectChanges();
    }
    this.showDraftRestoreModal = false;
    this.pendingDraftData = null;
  }

  declineRestoreDraft() {
    this.clearDraft();
    this.showDraftRestoreModal = false;
    this.pendingDraftData = null;
  }

  private clearDraft() {
    sessionStorage.removeItem(this.getDraftKey());
  }
}