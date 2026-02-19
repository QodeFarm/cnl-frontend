import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, forwardRef, HostListener, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormlyModule } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { TaTableModule } from '@ta/ta-table';
import { TaCurdComponent } from '@ta/ta-curd';
import { TaCurdModalComponent } from 'projects/ta-curd/src/lib/ta-curd-modal/ta-curd-modal.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { TaFormComponent, TaFormModule } from '@ta/ta-form';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { OverlayModule } from '@angular/cdk/overlay';
import { NzButtonModule } from 'ng-zorro-antd/button';
@Component({
  selector: 'ta-field-adv-select',
  templateUrl: './field-adv-select.component.html',
  styleUrls: ['./field-adv-select.component.css'],
  standalone: true,
  imports: [CommonModule, FormlyModule,
    OverlayModule,
    ReactiveFormsModule,
    NzSelectModule,
    FormlySelectModule,
    NzTableModule,
    NzDropDownModule,
    NzDrawerModule,
    TaTableModule,
    TaCurdModalComponent,
    NzButtonModule,
    NzPopoverModule,
    forwardRef(() => TaFormComponent),
    NzIconModule]
})
export class FieldAdvSelectComponent extends FieldType implements OnInit, AfterContentChecked {
  dropdownOpen = false;
  lazySelectedItem: any;
  visible = false;
  formTitle = "Create";
  showCurdDiv = false;
  Math = Math;
  window = window;
  overlayMaxHeight: string = '70vh';
  overlayWidth: number | string = 'auto';
  private lastValue: any = undefined;
  positions: any[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
  ];
  constructor(private cdr: ChangeDetectorRef, private elRef: ElementRef) {
    super();
  }

  /**
   * Click-outside-to-close: listens on the document for any mousedown.
   * Closes the dropdown if the click is outside BOTH the component host
   * element AND the CDK overlay panel.
   */
  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.showCurdDiv) return; // dropdown is already closed

    const target = event.target as HTMLElement;

    // 1. Click inside this component's own element (trigger button, etc.)
    if (this.elRef.nativeElement.contains(target)) return;

    // 2. Click inside ANY adv-select overlay panel (handles nested dropdowns too)
    //    Using target.closest() instead of document.querySelector() so that
    //    clicks inside a *nested* adv-select overlay (e.g. Under Group inside
    //    the Create Ledger Accounts modal) are correctly detected.
    if (target.closest('.adv-select-custom-overlay-panel')) return;
    if (target.closest('.adv-select-curd-container')) return;

    // 3. Click inside a modal dialog (Add form opened from within dropdown)
    if (target.closest('.ant-modal-wrap') ||
      target.closest('.ant-modal-mask') ||
      target.closest('.ant-modal') ||
      target.closest('.curd-modal-form') ||
      target.closest('.ant-drawer')) return;

    // 4. Click inside ANY CDK overlay pane (catches nested overlays, select
    //    dropdowns, date pickers, etc. that live in the global overlay container)
    if (target.closest('.cdk-overlay-pane')) return;

    // 5. Click inside a popover confirmation (delete action etc.)
    if (target.closest('.ant-popover') || target.closest('.table-action-conformation')) return;

    // 6. Click inside an ant-select dropdown (e.g. Type dropdown inside the form)
    if (target.closest('.ant-select-dropdown')) return;

    // Everything else = outside → close the dropdown
    this.dropdownOpen = false;
    this.showCurdDiv = false;
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    // Initialize any additional properties or methods if needed
    this.to.placeholder = this.to.placeholder || 'Please Select';
    if (this.props.curdConfig && this.props.curdConfig.tableConfig) {
      this.props.curdConfig.tableConfig.rowSelectionEnabled = true;
      this.props.curdConfig.tableConfig.rowSelection = (row) => {
        this.formControl.setValue(row);
        this.dropdownOpen = false;
        this.showCurdDiv = false;
      }
    }

    // Auto-select newly created record from the Add form inside dropdown
    if (this.props.curdConfig && this.props.curdConfig.formConfig) {
      if (!this.props.curdConfig.formConfig.submit) {
        this.props.curdConfig.formConfig.submit = {};
      }
      // Preserve any existing user callback
      const existingSubmitFn = this.props.curdConfig.formConfig.submit.submittedFn;
      this.props.curdConfig.formConfig.submit.submittedFn = (res: any) => {
        // Call existing callback first
        if (existingSubmitFn) {
          existingSubmitFn(res);
        }
        // Auto-select the newly created record
        const newRecord = res?.data || res;
        if (newRecord && typeof newRecord === 'object') {
          this.formControl.setValue(newRecord);
          // Close the dropdown after selection
          setTimeout(() => {
            this.dropdownOpen = false;
            this.showCurdDiv = false;
            this.cdr.detectChanges();
          }, 300);
        }
      };
    }

    // Set initial value if form control already has a value
    if (this.formControl.value) {
      const data = this.itemMapping(this.formControl.value);
      if (data) {
        this.lazySelectedItem = data;
      }
    }

    this.formControl.valueChanges.subscribe(res => {
      if (this.formControl.value) {
        const data = this.itemMapping(this.formControl.value);
        if (data) {
          this.lazySelectedItem = data;
        }
      } else {
        this.lazySelectedItem = null;
      }
    })
  }

  // Check for value changes that might have been missed
  ngAfterContentChecked(): void {
    if (this.formControl && this.formControl.value) {
      // Only update if value has changed
      const currentValueKey = this.props.dataKey ? this.formControl.value[this.props.dataKey] : this.formControl.value;
      const lastValueKey = this.lastValue && this.props.dataKey ? this.lastValue[this.props.dataKey] : this.lastValue;

      if (currentValueKey !== lastValueKey) {
        this.lastValue = this.formControl.value;
        const data = this.itemMapping(this.formControl.value);
        if (data && data.label) {
          this.lazySelectedItem = data;
          this.cdr.detectChanges();
        }
      }
    } else if (this.lastValue !== null && this.lastValue !== undefined && !this.formControl.value) {
      // Value was cleared
      this.lastValue = null;
      this.lazySelectedItem = null;
    }
  }

  /**
   * ERP nesting-depth guard.
   * Reads the depth written by the parent ta-curd-modal into formState.
   * field-adv-select passes this value (not +1) to ta-curd-modal so the
   * modal itself decides whether to show its own Add button.
   */
  get currentNestLevel(): number {
    return this.field?.options?.formState?.nestLevel ?? this.props?.nestLevel ?? 0;
  }

  get maxNestLevel(): number {
    return this.field?.options?.formState?.maxNestLevel ?? this.props?.maxNestLevel ?? 3;
  }

  compareFn = (o1: any, o2: any) => {
    if (this.props.dataKey && o1 && o2 && !this.props.bindId) {
      return o1[this.props.dataKey] === o2[this.props.dataKey];
    } else {
      return o1 === o2;
    }
  };
  itemMapping(item: any) {
    let labelKey = this.props.dataLabel || 'label';
    let label = item[labelKey as string];
    if (this.props.labelMapFn) {
      label = this.props.labelMapFn(item);
    }
    let dataKey = 'id';
    if (this.props.dataKey) {
      dataKey = item[this.props.dataKey];
    }
    if (this.props.bindId) {
      return { label: label, value: dataKey }
    } else {
      return { label: label, value: item }
    }

  }
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
  clearValue(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.formControl.setValue(null);
    this.lazySelectedItem = null;
    this.cdr.detectChanges();
  }

  /** Toggle dropdown and compute max-height + width based on available viewport space */
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.showCurdDiv = !this.showCurdDiv;

    if (this.showCurdDiv) {
      const triggerEl = this.elRef.nativeElement.querySelector('.dropdown-toggle');
      if (triggerEl) {
        const rect = triggerEl.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const margin = 16; // breathing room from edges

        // --- Vertical: pick the bigger gap (above vs below) ---
        const spaceBelow = vh - rect.bottom - margin;
        const spaceAbove = rect.top - margin;
        const maxH = Math.max(spaceBelow, spaceAbove, 250);
        this.overlayMaxHeight = Math.min(maxH, vh * 0.7) + 'px';

        // --- Horizontal: clamp desired width so panel stays in viewport ---
        const desiredW = this.props?.curdConfig?.drawerSize || 500;
        const spaceRight = vw - rect.left - margin;
        const spaceLeft = rect.right - margin;
        const maxW = Math.max(spaceRight, spaceLeft, 300);
        this.overlayWidth = Math.min(desiredW, maxW);
      }
    }
  }

  /** Close dropdown without changing the selected value */
  cancelDropdown(): void {
    this.dropdownOpen = false;
    this.showCurdDiv = false;
  }

  /** Clear the selected value and close dropdown */
  clearAndClose(): void {
    this.formControl.setValue(null);
    this.lazySelectedItem = null;
    this.dropdownOpen = false;
    this.showCurdDiv = false;
    this.cdr.detectChanges();
  }
  openDrawer(row?: any) {
    debugger;
    this.formTitle = 'Create ' + this.props.curdConfig.formConfig.title;
    this.props.curdConfig.formConfig.model = {};
    if (row) {
      this.formTitle = 'Update ' + this.props.curdConfig.formConfig.title;
      this.props.curdConfig.formConfig.model = row;
    }
    this.visible = true;
  }
}
