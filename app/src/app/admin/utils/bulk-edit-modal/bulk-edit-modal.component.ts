import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BulkField, BulkOperationsService } from '../bulk-operations.service';

@Component({
  selector: 'app-bulk-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-edit-modal.component.html',
  styleUrls: ['./bulk-edit-modal.component.scss']
})
export class BulkEditModalComponent implements OnChanges {

  /** Display the modal */
  @Input() visible = false;

  /** Selected entity IDs */
  @Input() entityIds: string[] = [];

  /** Entity display name, e.g. "Customer", "Product", "Vendor" */
  @Input() entityName = 'Record';

  /** Bulk update API endpoint */
  @Input() bulkUpdateUrl = '';

  /** Field definitions */
  @Input() fields: BulkField[] = [];

  /** Emits when modal is closed (cancel or after success) */
  @Output() closed = new EventEmitter<void>();

  /** Emits after a successful bulk update */
  @Output() updated = new EventEmitter<{ message: string; count: number }>();

  // ─── Internal State ──────────────────────────────────────────
  bulkEditForm: Record<string, any> = {};
  dropdownOptions: Record<string, any[]> = {};
  optionsLoaded = false;
  confirmVisible = false;
  loading = false;
  errorMessage = '';

  constructor(private bulkOps: BulkOperationsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible) {
      this.open();
    }
  }

  /** Initialize the modal */
  private open() {
    this.bulkEditForm = this.bulkOps.getEmptyForm(this.fields);
    this.confirmVisible = false;
    this.loading = false;
    this.errorMessage = '';
    this.loadOptions();
  }

  /** Load dropdown options (cached after first load) */
  private loadOptions() {
    if (this.optionsLoaded) return;
    this.bulkOps.loadDropdownOptions(this.fields).subscribe({
      next: (opts) => {
        this.dropdownOptions = opts;
        this.optionsLoaded = true;
      },
      error: (err) => {
        console.error('Failed to load bulk edit dropdown options:', err);
        this.dropdownOptions = {};
        this.optionsLoaded = true; // prevent infinite retry
      }
    });
  }

  /** Labels of fields that have been changed */
  get changedFieldLabels(): string[] {
    return this.bulkOps.getChangedLabels(this.fields, this.bulkEditForm);
  }

  /** Show confirmation step */
  showConfirm() {
    if (this.changedFieldLabels.length === 0) {
      this.errorMessage = 'Please fill at least one field to update.';
      setTimeout(() => { this.errorMessage = ''; }, 3000);
      return;
    }
    this.confirmVisible = true;
  }

  /** Cancel confirmation */
  cancelConfirm() {
    this.confirmVisible = false;
  }

  /** Execute the bulk update */
  executeBulkUpdate() {
    this.loading = true;
    this.errorMessage = '';
    const updateData = this.bulkOps.buildUpdateData(this.fields, this.bulkEditForm);

    this.bulkOps.bulkUpdate(this.bulkUpdateUrl, this.entityIds, updateData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.visible = false;
        this.updated.emit({
          message: res?.message || `${this.entityIds.length} ${this.entityName.toLowerCase()}(s) updated successfully`,
          count: this.entityIds.length
        });
        this.closed.emit();
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Bulk update failed. Please try again.';
      }
    });
  }

  /** Close modal */
  close() {
    if (this.loading) return;
    this.visible = false;
    this.confirmVisible = false;
    this.closed.emit();
  }
}
