import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnInit } from '@angular/core';
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
import { ClickOutsideDirective } from './click-outside.directive';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { OverlayModule } from '@angular/cdk/overlay';
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
    ClickOutsideDirective,
    NzPopoverModule,
    forwardRef(() => TaFormComponent),
    NzIconModule]
})
export class FieldAdvSelectComponent extends FieldType implements OnInit, AfterViewInit {
  dropdownOpen = false;
  lazySelectedItem: any;
  visible = false;
  formTitle = "Create";
  showCurdDiv = false;
  Math = Math; // Make Math available in the template
  window = window; // Make window available in the template
  positions = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
    }
  ];
  constructor(private cdr: ChangeDetectorRef) {
    super();
  }
  ngAfterViewInit(): void {
    const overlayPane = document.querySelector('.cdk-overlay-pane.select-adv-field');
    const drawerContent = document.querySelector('.curd-modal-form');

    document.addEventListener('click', (event: MouseEvent) => {
      const clickTarget = event.target as HTMLElement;
      const isSelectClick = overlayPane?.contains(clickTarget);
      const isDrawerClick = drawerContent?.contains(clickTarget);

      // If clicked outside both select and drawer, close it
      if (isDrawerClick) {
        this.dropdownOpen = true;
      }
    });
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
    this.formControl.valueChanges.subscribe(res => {
      if (this.formControl.value) {
        const data = this.itemMapping(this.formControl.value);
        if (data) {
          this.lazySelectedItem = data;
        }
      }
    })
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
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
  onOpenChange(open: boolean) {
    // this.dropdownOpen = true;
    // this.showCurdDiv = true;

  }
  onClickOutside(event: MouseEvent): void {
    // Don't close dropdown
    // event.preventDefault();
    // event.stopPropagation();
    //this.dropdownOpen = true;
    //const overlayPane = document.querySelector('.cdk-overlay-pane.select-adv-field');
    const overlayPane = document.querySelector('.cdk-overlay-container');
    const drawerContent = document.querySelector('.curd-modal-form');
    const popoverContent = document.querySelector('.table-action-conformation');

    const target = event.target as Node;

    const isInsideOverlay = overlayPane?.contains(target);
    const isInsideDrawer = drawerContent?.contains(target);
    const isPoverContent = popoverContent?.contains(target);

    if (!isInsideOverlay && !isInsideDrawer && !isPoverContent) {
      // event.stopPropagation();
      // event.preventDefault();
      this.dropdownOpen = false;
      this.showCurdDiv = false;
    } else {

    }
  }
  clearValue(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.formControl.setValue(null);
    this.lazySelectedItem = null;
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
