import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartType } from '../../models/widget.models';

@Component({
  selector: 'app-widget-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-shell.component.html',
  styleUrls: ['./widget-shell.component.scss']
})
export class WidgetShellComponent {
  @Input() title: string = '';
  @Input() loading: boolean = false;
  @Input() error: boolean = false;
  @Input() chartType: ChartType = 'bar';
  @Input() showChartToggle: boolean = false;
  @Input() lastUpdated: Date | null = null;
  @Input() removable: boolean = true;

  @Output() refresh = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
  @Output() chartTypeChange = new EventEmitter<ChartType>();

  showControls: boolean = false;

  chartTypes: { type: ChartType; icon: string; label: string }[] = [
    { type: 'bar', icon: '📊', label: 'Bar' },
    { type: 'line', icon: '📈', label: 'Line' },
    { type: 'pie', icon: '🥧', label: 'Pie' },
    { type: 'doughnut', icon: '🍩', label: 'Doughnut' },
  ];

  onRefresh() {
    this.refresh.emit();
  }

  onRemove() {
    this.remove.emit();
  }

  switchChartType(type: ChartType) {
    this.chartType = type;
    this.chartTypeChange.emit(type);
  }

  getTimeAgo(): string {
    if (!this.lastUpdated) return '';
    const diff = Math.floor((Date.now() - this.lastUpdated.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }
}
