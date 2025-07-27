import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnInit } from '@angular/core';
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

@Component({
  selector: 'ta-field-adv-select',
  templateUrl: './field-adv-select.component.html',
  styleUrls: ['./field-adv-select.component.css'],
  standalone: true,
  imports: [CommonModule, FormlyModule,
    ReactiveFormsModule,
    NzSelectModule,
    FormlySelectModule,
    NzTableModule,
    NzDropDownModule,
    NzDrawerModule,
    TaTableModule,
    forwardRef(() => TaFormComponent),
    NzIconModule]
})
export class FieldAdvSelectComponent extends FieldType implements OnInit {
  dropdownOpen = false;
  lazySelectedItem: any;
  visible = false;
  formTitle = "Create";
  constructor(private cdr: ChangeDetectorRef) {
    super();
  }
  ngOnInit(): void {
    // Initialize any additional properties or methods if needed
    this.to.placeholder = this.to.placeholder || 'Please Select';
    if (this.props.curdConfig && this.props.curdConfig.tableConfig) {
      this.props.curdConfig.tableConfig.rowSelectionEnabled = true;
      this.props.curdConfig.tableConfig.rowSelection = (row) => {
        this.formControl.setValue(row);
        this.dropdownOpen = false;
      }
    }
    this.formControl.valueChanges.subscribe(res => {
      if (this.formControl.value) {
        this.lazySelectedItem = this.itemMapping(this.formControl.value);
      }
    })
  }
  ngDoCheck(): void {
    console.log('FieldAdvSelectComponent initialized with field:', this.field);
  }
  selectedItem: any = null;

  pickItem(item: any) {
    this.selectedItem = item;
  }


  // You can add more methods or properties specific to this component if needed
  onSelectionChange(value: any): void {
    // Handle selection change if necessary
    console.log('Selected value:', value);
  }
  newItem: string = '';

  items = [
    { name: 'Item A' },
    { name: 'Item B' },
    { name: 'Item C' },
  ];

  selectItem(item: any) {
    this.selectedItem = item.name;
  }

  addItem() {
    if (this.newItem.trim()) {
      this.items.push({ name: this.newItem.trim() });
      this.selectedItem = this.newItem.trim();
      this.newItem = '';
    }
  }
  // Store dropdown reference for closing
  isDropdownOpen = false;

  onDropdownVisibleChange(visible: boolean) {
    this.isDropdownOpen = visible;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  onCurrentPageDataChange(data: any[]) {
    // Optional: Handle page data if using pagination
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onOptionSelect(value: string): void {
    // this.selectedValue = value;
    // Don't auto-close — user will close manually
    console.log('Selected:', value);
  }

  onDropdownChange(open: boolean): void {
    // prevent nz-select from auto-closing
    if (!open && this.dropdownOpen) {
      // block close
      this.dropdownOpen = true;
    }
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
  openDrawer(row?: any) {
    this.formTitle = 'Create ' + this.props.curdConfig.formConfig.title;
    this.props.curdConfig.formConfig.model = {};
    if (row) {
      this.props.curdConfig.formConfig.model = row;
      console.log('row', row);
    }
    this.visible = true;
  }
}
