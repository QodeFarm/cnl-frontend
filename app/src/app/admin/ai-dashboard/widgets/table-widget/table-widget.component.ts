import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableConfig, TableColumn } from '../../models/widget.models';

@Component({
  selector: 'app-table-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.scss']
})
export class TableWidgetComponent {
  @Input() config!: TableConfig;

  sortKey: string = '';
  sortDir: 'asc' | 'desc' = 'asc';

  get sortedData(): any[] {
    if (!this.config?.data) return [];
    if (!this.sortKey) return this.config.data;

    return [...this.config.data].sort((a, b) => {
      const va = a[this.sortKey];
      const vb = b[this.sortKey];
      if (va == null) return 1;
      if (vb == null) return -1;
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return this.sortDir === 'asc' ? cmp : -cmp;
    });
  }

  toggleSort(col: TableColumn) {
    if (this.sortKey === col.key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = col.key;
      this.sortDir = 'asc';
    }
  }

  getCellValue(row: any, col: TableColumn): string {
    const val = row[col.key];
    if (val == null) return '—';

    switch (col.type) {
      case 'currency':
        return this.formatCurrency(val);
      case 'number':
        return typeof val === 'number' ? val.toLocaleString() : String(val);
      default:
        return String(val);
    }
  }

  getBadgeClass(row: any, col: TableColumn): string {
    if (col.type !== 'badge' || !col.badgeMap) return '';
    return col.badgeMap[row[col.key]] || 'badge-default';
  }

  formatCurrency(value: number): string {
    if (value == null || isNaN(value)) return '₹0';
    if (value >= 10000000) return '₹' + (value / 10000000).toFixed(2) + ' Cr';
    if (value >= 100000) return '₹' + (value / 100000).toFixed(2) + ' L';
    if (value >= 1000) return '₹' + (value / 1000).toFixed(1) + ' K';
    return '₹' + value.toFixed(0);
  }

  private escapeCsvValue(val: any): string {
    if (val == null) return '';
    let str = String(val);
    // Prevent formula injection
    if (/^[=+\-@\t\r]/.test(str)) str = "'" + str;
    // Escape quotes and wrap if contains comma, quote, or newline
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  exportCsv() {
    if (!this.config?.data?.length) return;
    const cols = this.config.columns;
    const header = cols.map(c => this.escapeCsvValue(c.label)).join(',');
    const rows = this.config.data.map(row =>
      cols.map(c => this.escapeCsvValue(row[c.key])).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.config.exportFilename || 'export') + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
