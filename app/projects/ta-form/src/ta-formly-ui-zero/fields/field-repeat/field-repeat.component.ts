import { Component, OnInit, OnDestroy, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FieldArrayType } from '@ngx-formly/core';
import { ColumnConfig, ColumnConfigOptions } from './column-config/column-config.interfaces';
import { ColumnConfigService } from './column-config/column-config.service';

@Component({
  selector: 'ta-field-repeat',
  templateUrl: './field-repeat.component.html',
  styleUrls: ['./field-repeat.component.css']
})
export class FieldRepeatComponent extends FieldArrayType implements OnInit, OnDestroy {
  // router: any;
  isRestrictedPage = false; // For both customers and vendors pages
  hasStickyColumns = false; // Only true when first column is a checkbox (selectItem)

  // ========== Column Configuration ==========
  /** Full column config list (empty = feature disabled) */
  columnList: ColumnConfig[] = [];

  /** Set of field keys that should be hidden (for fast O(1) lookup in template) */
  hiddenColumns: Set<string> = new Set();

  /** Whether the column settings dropdown is open */
  columnSettingsOpen = false;

  // ========== Column Resize ==========
  /** Map of field key → width in pixels for fast template lookup */
  columnWidths: Map<string, number> = new Map();

  /** Whether a resize drag is currently in progress */
  isResizing = false;

  /** Default width for columns without explicit configuration */
  private readonly DEFAULT_COLUMN_WIDTH = 120;

  /** Transient state during a resize drag operation */
  private resizeDragState: {
    columnKey: string;
    colIndex: number;
    startX: number;
    startWidth: number;
    thElement: HTMLElement;
  } | null = null;

  /** Bound mousemove handler for resize (for cleanup) */
  private resizeMoveFn: ((e: MouseEvent) => void) | null = null;

  /** Bound mouseup handler for resize (for cleanup) */
  private resizeEndFn: ((e: MouseEvent) => void) | null = null;

  /** requestAnimationFrame ID for resize throttling */
  private resizeRAFId: number | null = null;
  // =====================================

  /** Whether column configuration is enabled for this instance */
  get hasColumnConfig(): boolean {
    return !!this.columnConfigOptions;
  }

  /** Whether column settings dropdown (Columns button) is shown */
  get showColumnSettings(): boolean {
    const opts = this.columnConfigOptions;
    return opts ? (opts.showColumnSettings !== false) : false;
  }

  /** Whether column resize is enabled (default: true when columnConfig exists) */
  get isResizeEnabled(): boolean {
    const opts = this.columnConfigOptions;
    return opts ? (opts.enableResize !== false) : false;
  }

  /** The column config options from templateOptions (null if not configured) */
  private get columnConfigOptions(): ColumnConfigOptions | null {
    const to = this.to || this.field?.templateOptions || {} as any;
    return to.columnConfig || null;
  }
  // ============================================

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private columnConfigService: ColumnConfigService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    super();
  }

  /** Whether the Actions column header + cells should render at all. */
  get showActionsColumn(): boolean {
    const to = this.to || this.field?.templateOptions || {} as any;
    // When minRows is set, only show Actions column when rows exceed minRows
    if (to.minRows != null) {
      return (this.field?.fieldGroup?.length || 0) > to.minRows;
    }
    // Default behaviour (unchanged)
    return !this.isRestrictedPage || !!to.showAddBtn;
  }

  /** Whether row at given index can be deleted. */
  canDeleteRow(index: number): boolean {
    const to = this.to || this.field?.templateOptions || {} as any;
    if (to.minRows != null) {
      return index >= to.minRows;
    }
    return true;
  }

  /**
   * Check if a column (by field key) should be hidden.
   * Used in the template for [hidden] binding on th/td elements.
   * Returns false (not hidden) when column config is not enabled.
   */
  isColumnHidden(key: string): boolean {
    return this.hiddenColumns.has(key);
  }

  /**
   * Toggle a column's visibility from the settings dropdown.
   */
  toggleColumnVisibility(key: string): void {
    const opts = this.columnConfigOptions;
    if (!opts) return;
    this.hiddenColumns = this.columnConfigService.toggleColumn(
      opts.moduleKey, this.columnList, key
    );
  }

  /**
   * Reset all columns to their default visibility.
   */
  resetColumnsToDefault(): void {
    const opts = this.columnConfigOptions;
    if (!opts) return;
    const fieldGroupDefs = (this.field?.fieldArray as any)?.fieldGroup || [];
    this.columnList = this.columnConfigService.resetToDefaults(fieldGroupDefs, opts);
    this.hiddenColumns = this.columnConfigService.getHiddenKeys(this.columnList);
    this.initColumnWidths();
  }

  /**
   * Toggle the column settings dropdown open/closed.
   */
  toggleColumnSettings(): void {
    this.columnSettingsOpen = !this.columnSettingsOpen;
  }

  /**
   * Close the column settings dropdown (e.g., on outside click).
   */
  closeColumnSettings(): void {
    this.columnSettingsOpen = false;
  }

  // ========== Column Resize Methods ==========

  /**
   * Get the width for a column. Used in template [style.width.px] binding on <th>.
   * Returns null when column config is not enabled (auto layout preserved).
   */
  getColumnWidth(key: string): number | null {
    if (!this.hasColumnConfig) return null;
    return this.columnWidths.get(key) || this.DEFAULT_COLUMN_WIDTH;
  }

  /**
   * Get the sticky left offset for a column by index.
   * Used in template [style.left.px] binding on <th> and <td>.
   * Returns null for non-sticky columns or when config is not enabled.
   */
  getStickyLeft(colIndex: number): number | null {
    if (!this.hasColumnConfig || !this.hasStickyColumns) return null;
    if (colIndex === 0) return 0;
    if (colIndex > 2) return null;

    const fieldGroup = (this.field?.fieldArray as any)?.fieldGroup || [];
    let offset = 0;
    for (let i = 0; i < colIndex; i++) {
      const key = fieldGroup[i]?.key;
      if (key && !this.hiddenColumns.has(key)) {
        offset += this.columnWidths.get(key) || this.DEFAULT_COLUMN_WIDTH;
      }
    }
    return offset;
  }

  /**
   * Start a column resize drag operation.
   * Runs the drag entirely outside Angular zone to avoid CD storms.
   */
  onResizeStart(event: MouseEvent, columnKey: string, colIndex: number): void {
    event.preventDefault();
    event.stopPropagation();

    const th = (event.target as HTMLElement).closest('th') as HTMLElement;
    if (!th) return;

    this.isResizing = true;
    this.resizeDragState = {
      columnKey,
      colIndex,
      startX: event.pageX,
      startWidth: th.offsetWidth,
      thElement: th
    };

    document.body.classList.add('col-resizing');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    this.ngZone.runOutsideAngular(() => {
      this.resizeMoveFn = this.onResizeMove.bind(this);
      this.resizeEndFn = this.onResizeEnd.bind(this);
      document.addEventListener('mousemove', this.resizeMoveFn!);
      document.addEventListener('mouseup', this.resizeEndFn!);
    });
  }

  // ==========================================

  /** TrackBy function for column list ngFor (settings dropdown) */
  trackByColumnKey(index: number, col: ColumnConfig): string {
    return col.key;
  }

  /** TrackBy function for table header/body ngFor */
  trackByFieldKey(index: number, field: any): string {
    return field?.key || index.toString();
  }

  /** TrackBy function for row ngFor */
  trackByRowIndex(index: number, row: any): number {
    return index;
  }

  ngOnInit(): void {
    const currentUrl = this.router.url || '';

    // Enable sticky columns only when the table starts with a selectItem (checkbox) column.
    const firstFieldKey = (this.field?.fieldArray as any)?.fieldGroup?.[0]?.key;
    this.hasStickyColumns = firstFieldKey === 'selectItem';

    // Per-field control: check templateOptions for hideActions flag
    // If set, respect it. Otherwise fall back to URL-based restriction.
    const to = this.to || this.field?.templateOptions || {} as any;
    if (to.hideActions !== undefined) {
      this.isRestrictedPage = !!to.hideActions;
    } else {
      const restrictedUrls = ['/admin/customers', '/admin/vendors'];
      this.isRestrictedPage = restrictedUrls.some(url => currentUrl.includes(url));
    }

    // Initialize column configuration if provided
    this.initColumnConfig();
  }

  /**
   * Handles Enter key press within the Product Items table.
   * Prevents form submission and navigates to the next input field
   *   - Same row → next input
   *   - End of row → first input of next row
   *   - Last row, last input → do nothing (no auto-create)
   */
  onTableKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;

    // Always block Enter from bubbling up to the <form> (prevents ngSubmit)
    event.preventDefault();
    event.stopPropagation();

    const currentElement = event.target as HTMLElement;

    // If user is inside an open nz-select dropdown, let NG-ZORRO handle the
    // selection — we only navigate AFTER the dropdown closes.
    if (currentElement.closest('.ant-select-open')) return;

    const tableElement = this.elementRef.nativeElement.querySelector('.product-item-table');
    if (!tableElement) return;

    // Collect all body rows (skip thead)
    const rows = Array.from(
      tableElement.querySelectorAll('tbody tr.ant-table-row')
    ) as HTMLElement[];
    if (!rows.length) return;

    // Find which row the current element belongs to
    const currentRow = currentElement.closest('tr.ant-table-row') as HTMLElement;
    if (!currentRow) return;

    const rowIndex = rows.indexOf(currentRow);
    if (rowIndex === -1) return;

    // Get focusable inputs within a given row
    const getRowInputs = (row: HTMLElement): HTMLElement[] => {
      const selectors = [
        'input:not([disabled]):not([readonly]):not([type="hidden"])',
        'textarea:not([disabled]):not([readonly])',
        'select:not([disabled])',
        'nz-select:not(.ant-select-disabled) .ant-select-selector',
        'nz-input-number:not(.ant-input-number-disabled) input',
        'nz-autocomplete-trigger input'
      ].join(', ');

      return (Array.from(row.querySelectorAll(selectors)) as HTMLElement[]).filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               el.offsetParent !== null;
      });
    };

    const currentRowInputs = getRowInputs(currentRow);

    // Find the current input's position within its row
    let colIndex = currentRowInputs.findIndex(el =>
      el === currentElement ||
      el.contains(currentElement) ||
      currentElement.contains(el)
    );

    // Fallback: walk up to the closest known input wrapper
    if (colIndex === -1) {
      const wrapper = currentElement.closest(
        'input, textarea, select, nz-input-number, nz-select, nz-autocomplete'
      );
      if (wrapper) {
        colIndex = currentRowInputs.findIndex(el =>
          el === wrapper ||
          el.contains(wrapper as Node) ||
          (wrapper as HTMLElement).contains(el)
        );
      }
    }
    if (colIndex === -1) return;

    let targetElement: HTMLElement | null = null;

    if (colIndex < currentRowInputs.length - 1) {
      // Move to next input in the SAME row
      targetElement = currentRowInputs[colIndex + 1];
    } else if (rowIndex < rows.length - 1) {
      // Wrap to the FIRST input of the NEXT row
      const nextRowInputs = getRowInputs(rows[rowIndex + 1]);
      if (nextRowInputs.length) {
        targetElement = nextRowInputs[0];
      }
    }
    // else: last input of last row → do nothing

    if (targetElement) {
      this.focusElement(targetElement);
    }
  }

  /**
   * Focus helper that handles different NG-ZORRO input component types.
   * Uses a small delay to let Angular change-detection settle.
   */
  private focusElement(element: HTMLElement): void {
    setTimeout(() => {
      // NG-ZORRO Select — open the dropdown
      if (element.classList.contains('ant-select-selector')) {
        const nzSelect = element.closest('nz-select') as HTMLElement;
        if (nzSelect) {
          nzSelect.click();
          return;
        }
      }

      // NG-ZORRO InputNumber — focus the inner <input>
      const nzInputNumber = element.closest('nz-input-number');
      if (nzInputNumber) {
        const inner = nzInputNumber.querySelector('input') as HTMLInputElement;
        if (inner) {
          inner.focus();
          inner.select();
          return;
        }
      }

      // Standard input / textarea / select
      element.focus();
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.select();
      }
    }, 10);
  }

  /**
   * Initialize the column configuration feature.
   * Only activates if templateOptions.columnConfig is provided by the consumer.
   * Backward compatible — modules without columnConfig are completely unaffected.
   */
  private initColumnConfig(): void {
    const opts = this.columnConfigOptions;
    if (!opts) return;

    const fieldGroupDefs = (this.field?.fieldArray as any)?.fieldGroup || [];
    if (!fieldGroupDefs.length) return;

    this.columnList = this.columnConfigService.buildColumnList(fieldGroupDefs, opts);
    this.hiddenColumns = this.columnConfigService.getHiddenKeys(this.columnList);

    // Initialize column widths for resize support
    this.initColumnWidths();

    // Listen for clicks outside the dropdown to close it
    this.onDocumentClickBound = this.onDocumentClick.bind(this);
    document.addEventListener('click', this.onDocumentClickBound, true);
  }

  /** Bound reference for cleanup */
  private onDocumentClickBound: ((e: Event) => void) | null = null;

  /**
   * Close the column settings dropdown when clicking outside of it.
   */
  private onDocumentClick(event: Event): void {
    if (!this.columnSettingsOpen) return;

    const target = event.target as HTMLElement;
    const dropdown = this.elementRef.nativeElement.querySelector('.col-cfg-dropdown-wrapper');
    if (dropdown && !dropdown.contains(target)) {
      this.columnSettingsOpen = false;
      // Trigger change detection since this runs outside Angular zone
      this.cdRef.detectChanges();
    }
  }

  /**
   * Handle mousemove during resize drag (runs outside Angular zone).
   * Uses requestAnimationFrame for 60fps-capped updates.
   */
  private onResizeMove(event: MouseEvent): void {
    if (!this.resizeDragState) return;

    if (this.resizeRAFId !== null) {
      cancelAnimationFrame(this.resizeRAFId);
    }

    const pageX = event.pageX;
    this.resizeRAFId = requestAnimationFrame(() => {
      if (!this.resizeDragState) return;

      const diff = pageX - this.resizeDragState.startX;
      const minWidth = this.columnConfigOptions?.minColumnWidth || 60;
      const newWidth = Math.max(minWidth, this.resizeDragState.startWidth + diff);

      // Direct DOM: update <th> width (no Angular CD)
      this.resizeDragState.thElement.style.width = newWidth + 'px';

      // Keep model in sync (in case CD runs from external trigger)
      this.columnWidths.set(this.resizeDragState.columnKey, newWidth);

      // Update sticky left offsets if a sticky column is being resized
      if (this.hasStickyColumns && this.resizeDragState.colIndex < 2) {
        this.updateStickyOffsetsDOM();
      }

      this.resizeRAFId = null;
    });
  }

  /**
   * Handle mouseup to end resize drag.
   * Re-enters Angular zone to persist and trigger CD.
   */
  private onResizeEnd(event: MouseEvent): void {
    if (!this.resizeDragState) return;

    const diff = event.pageX - this.resizeDragState.startX;
    const minWidth = this.columnConfigOptions?.minColumnWidth || 60;
    const newWidth = Math.max(minWidth, this.resizeDragState.startWidth + diff);
    const columnKey = this.resizeDragState.columnKey;

    // Cleanup listeners and state
    document.body.classList.remove('col-resizing');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    if (this.resizeMoveFn) document.removeEventListener('mousemove', this.resizeMoveFn);
    if (this.resizeEndFn) document.removeEventListener('mouseup', this.resizeEndFn);
    this.resizeMoveFn = null;
    this.resizeEndFn = null;
    this.resizeDragState = null;
    if (this.resizeRAFId !== null) {
      cancelAnimationFrame(this.resizeRAFId);
      this.resizeRAFId = null;
    }

    // Re-enter Angular zone for state update + persistence
    this.ngZone.run(() => {
      this.isResizing = false;

      const col = this.columnList.find(c => c.key === columnKey);
      if (col) col.width = newWidth;
      this.columnWidths.set(columnKey, newWidth);

      const opts = this.columnConfigOptions;
      if (opts) {
        this.columnConfigService.updateColumnWidth(
          opts.moduleKey, this.columnList, columnKey, newWidth
        );
      }

      this.cdRef.detectChanges();
    });
  }

  /**
   * Update sticky column left offsets via direct DOM manipulation during drag.
   * Avoids Angular CD — queries all sticky elements and sets inline left.
   */
  private updateStickyOffsetsDOM(): void {
    const table = this.elementRef.nativeElement.querySelector('.product-item-table');
    if (!table) return;

    const fieldGroup = (this.field?.fieldArray as any)?.fieldGroup || [];
    const col0Width = this.columnWidths.get(fieldGroup[0]?.key) || 50;
    const col1Width = this.columnWidths.get(fieldGroup[1]?.key) || 220;

    // Update col-1 left offset (depends on col-0 width)
    const col1Els = table.querySelectorAll('.sticky-col-1') as NodeListOf<HTMLElement>;
    col1Els.forEach((el: HTMLElement) => { el.style.left = col0Width + 'px'; });

    // Update col-2 left offset (depends on col-0 + col-1 widths)
    const col2Els = table.querySelectorAll('.sticky-col-2') as NodeListOf<HTMLElement>;
    col2Els.forEach((el: HTMLElement) => { el.style.left = (col0Width + col1Width) + 'px'; });
  }

  /**
   * Initialize column widths from the column config list.
   * Uses saved width > configured default > component default.
   */
  private initColumnWidths(): void {
    const opts = this.columnConfigOptions;
    this.columnWidths.clear();
    for (const col of this.columnList) {
      const width = col.width
        || (opts?.defaultWidths && opts.defaultWidths[col.key])
        || this.DEFAULT_COLUMN_WIDTH;
      this.columnWidths.set(col.key, width);
      if (!col.width) col.width = width;
    }
  }

  /**
   * Cleanup event listener to prevent memory leaks.
   */
  ngOnDestroy(): void {
    if (this.onDocumentClickBound) {
      document.removeEventListener('click', this.onDocumentClickBound, true);
      this.onDocumentClickBound = null;
    }
    // Cleanup resize listeners and state
    if (this.resizeMoveFn) document.removeEventListener('mousemove', this.resizeMoveFn);
    if (this.resizeEndFn) document.removeEventListener('mouseup', this.resizeEndFn);
    if (this.resizeRAFId !== null) cancelAnimationFrame(this.resizeRAFId);
    document.body.classList.remove('col-resizing');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

}
