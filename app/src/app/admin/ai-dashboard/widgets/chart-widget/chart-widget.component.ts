import {
  Component, Input, ViewChild, ElementRef,
  OnChanges, OnDestroy, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ChartType, ChartConfig } from '../../models/widget.models';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-widget-container" [style.height.px]="config?.height || 260">
      <canvas #chartCanvas></canvas>
      <div class="chart-empty" *ngIf="isEmpty">
        <span class="empty-icon">📭</span>
        <p>{{ emptyText }}</p>
      </div>
    </div>
  `,
  styles: [`
    .chart-widget-container {
      position: relative;
      width: 100%;
      canvas { width: 100% !important; height: 100% !important; }
    }
    .chart-empty {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      .empty-icon { font-size: 32px; opacity: 0.4; }
      p { color: #aab3c5; font-size: 13px; margin: 8px 0 0; }
    }
  `]
})
export class ChartWidgetComponent implements OnChanges, OnDestroy {
  @Input() config!: ChartConfig;
  @Input() emptyText: string = 'No data available';
  @ViewChild('chartCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;
  isEmpty: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && this.config) {
      setTimeout(() => this.renderChart(), 50);
    }
  }

  ngOnDestroy() {
    this.destroyChart();
  }

  private renderChart() {
    this.destroyChart();

    if (!this.canvasRef?.nativeElement) return;
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const hasData = this.config.datasets.some(ds => ds.data.some(v => Number.isFinite(v) && v !== 0));
    this.isEmpty = !hasData;
    if (this.isEmpty) return;

    const isPie = this.config.chartType === 'pie' || this.config.chartType === 'doughnut';

    this.chart = new Chart(ctx, {
      type: this.getChartJsType(),
      data: {
        labels: this.config.labels,
        datasets: this.config.datasets.map(ds => ({
          ...ds,
          borderRadius: ds.borderRadius ?? (isPie ? 0 : 4),
          borderWidth: ds.borderWidth ?? (isPie ? 2 : 1),
          borderColor: ds.borderColor ?? (isPie ? '#fff' : ds.backgroundColor),
          barPercentage: 0.6,
        }))
      },
      options: this.getOptions()
    });
  }

  private getChartJsType(): any {
    if (this.config.chartType === 'combo') return 'bar';
    return this.config.chartType;
  }

  private getOptions(): any {
    const isPie = this.config.chartType === 'pie' || this.config.chartType === 'doughnut';

    const base: any = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500, easing: 'easeOutQuart' },
      plugins: {
        legend: {
          display: this.config.showLegend !== false,
          position: 'bottom',
          labels: {
            font: { size: 11, family: "'Inter', sans-serif" },
            padding: 12,
            usePointStyle: true,
            pointStyleWidth: 8,
            color: '#6b7a99'
          }
        }
      }
    };

    if (isPie) {
      base.cutout = this.config.chartType === 'doughnut' ? '65%' : 0;
    } else {
      base.indexAxis = this.config.horizontal ? 'y' : 'x';
      base.scales = {
        x: {
          stacked: this.config.stacked ?? false,
          grid: { display: false },
          ticks: { font: { size: 11 }, color: '#8c97b4' }
        },
        y: {
          stacked: this.config.stacked ?? false,
          beginAtZero: true,
          grid: { color: '#f2f4f8', drawBorder: false },
          ticks: { font: { size: 11 }, color: '#8c97b4' }
        }
      };
    }

    return base;
  }

  private destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
