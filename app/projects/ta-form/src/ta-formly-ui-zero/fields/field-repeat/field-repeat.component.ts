import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'ta-field-repeat',
  templateUrl: './field-repeat.component.html',
  styleUrls: ['./field-repeat.component.css']
})
export class FieldRepeatComponent extends FieldArrayType implements OnInit {
  // router: any;
  isRestrictedPage = false; // For both customers and vendors pages
  hasStickyColumns = false; // Only true when first column is a checkbox (selectItem)

  constructor(private router: Router, private elementRef: ElementRef) {
    super();
  }

  ngOnInit(): void {
    const currentUrl = this.router.url || '';
    console.log(this.field, this.field.fieldGroup);

    // Enable sticky columns only when the table starts with a selectItem (checkbox) column.
    // Tables like Sales/Purchase have: selectItem → product → print_name (sticky layout).
    // Tables like Work Order BOM start with product directly — no sticky needed.
    const firstFieldKey = (this.field?.fieldArray as any)?.fieldGroup?.[0]?.key;
    this.hasStickyColumns = firstFieldKey === 'selectItem';

    // List of restricted URLs
    const restrictedUrls = ['/admin/customers', '/admin/vendors'];

    // Check if the current URL matches any restricted URL
    this.isRestrictedPage = restrictedUrls.some(url => currentUrl.includes(url));

    // console.log('Is Restricted Page:', this.isRestrictedPage);

    // Additional logic for specific pages
    // if (this.isRestrictedPage) {
    //   console.log(`Restricted page detected: ${currentUrl}`);
    // }
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

}
